package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.RecognitionView;
import com.congreats.application.usecase.CreateRecognitionUseCase;
import com.congreats.application.usecase.GetRecognitionsByProfessionalUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/recognitions")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class RecognitionController {

    @Inject CreateRecognitionUseCase createRecognition;
    @Inject GetRecognitionsByProfessionalUseCase getRecognitions;
    @Inject RequestContext requestContext;

    public record CreateRecognitionRequest(
            @NotNull UUID recognizedId,
            @NotNull UUID categoryId,
            @NotEmpty List<String> skills,
            @NotBlank @Size(min = 20, max = 2000) String testimonial,
            UUID projectId,
            UUID teamId) {}

    @POST
    public Response create(@Valid CreateRecognitionRequest req) {
        RecognitionView view = createRecognition.execute(new CreateRecognitionUseCase.Command(
                requestContext.getUserId(), req.recognizedId(), req.categoryId(),
                req.skills(), req.testimonial(), req.projectId(), req.teamId()));
        return Response.status(Response.Status.CREATED).entity(view).build();
    }

    @GET
    public PageResult<RecognitionView> list(
            @QueryParam("professionalId") @NotNull UUID professionalId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        return getRecognitions.execute(professionalId, page, size);
    }
}
