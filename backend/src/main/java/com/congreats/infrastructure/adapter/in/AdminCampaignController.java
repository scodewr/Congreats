package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.CampaignView;
import com.congreats.application.usecase.GetActiveCampaignsUseCase;
import com.congreats.application.usecase.admin.CreateCampaignUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Path("/campaigns")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminCampaignController {

    @Inject CreateCampaignUseCase createCampaign;
    @Inject GetActiveCampaignsUseCase getActiveCampaigns;
    @Inject RequestContext requestContext;

    public record CreateCampaignRequest(
            @NotBlank String name,
            String description,
            @NotNull UUID categoryId,
            @NotNull Instant startsAt,
            @NotNull Instant endsAt) {}

    @GET
    @Path("/active")
    public List<CampaignView> getActive() {
        return getActiveCampaigns.execute();
    }

    @POST
    public Response create(@Valid CreateCampaignRequest req) {
        if (!requestContext.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"error\":\"Acesso restrito a administradores\"}").build();
        }
        CampaignView view = createCampaign.execute(new CreateCampaignUseCase.Command(
                req.name(), req.description(), req.categoryId(), req.startsAt(), req.endsAt()));
        return Response.status(Response.Status.CREATED).entity(view).build();
    }
}
