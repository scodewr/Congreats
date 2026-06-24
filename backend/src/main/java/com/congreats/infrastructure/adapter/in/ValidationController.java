package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.SkillValidationView;
import com.congreats.application.usecase.GetMyAssignmentsUseCase;
import com.congreats.application.usecase.GetMyValidationsUseCase;
import com.congreats.application.usecase.RequestSkillValidationUseCase;
import com.congreats.application.usecase.SubmitQuestionnaireUseCase;
import com.congreats.application.usecase.admin.AdminAssignValidatorUseCase;
import com.congreats.application.usecase.admin.AdminListValidationsUseCase;
import com.congreats.application.usecase.admin.AdminResolveValidationUseCase;
import com.congreats.domain.exception.ForbiddenException;
import com.congreats.domain.model.SkillLevel;
import com.congreats.domain.model.ValidationDecision;
import com.congreats.domain.model.ValidationStatus;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/validations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class ValidationController {

    @Inject RequestContext requestContext;
    @Inject RequestSkillValidationUseCase requestValidation;
    @Inject GetMyValidationsUseCase getMyValidations;
    @Inject GetMyAssignmentsUseCase getMyAssignments;
    @Inject SubmitQuestionnaireUseCase submitQuestionnaire;
    @Inject AdminListValidationsUseCase adminListValidations;
    @Inject AdminAssignValidatorUseCase adminAssignValidator;
    @Inject AdminResolveValidationUseCase adminResolveValidation;

    // --- User endpoints ---

    @POST
    public Response request(RequestBody body) {
        requestValidation.execute(new RequestSkillValidationUseCase.Command(
                requestContext.getUserId(), body.skill()));
        return Response.status(Response.Status.CREATED).build();
    }

    @GET
    @Path("/mine")
    public List<SkillValidationView> getMine() {
        return getMyValidations.execute(requestContext.getUserId());
    }

    @GET
    @Path("/assignments")
    public List<SkillValidationView> getAssignments() {
        return getMyAssignments.execute(requestContext.getUserId());
    }

    @POST
    @Path("/{id}/questionnaire")
    public Response submitQuestionnaire(@PathParam("id") UUID id, QuestionnaireBody body) {
        submitQuestionnaire.execute(new SubmitQuestionnaireUseCase.Command(
                id, requestContext.getUserId(),
                body.decision(), body.level(), body.reasoning()));
        return Response.ok().build();
    }

    // --- Admin endpoints ---

    @GET
    public AdminListValidationsUseCase.Result list(
            @QueryParam("status") @DefaultValue("PENDING") String status,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        if (!requestContext.isAdmin()) return forbidden();
        return adminListValidations.execute(ValidationStatus.valueOf(status), page, size);
    }

    @POST
    @Path("/{id}/assign")
    public Response assign(@PathParam("id") UUID id, AssignBody body) {
        if (!requestContext.isAdmin()) return Response.status(Response.Status.FORBIDDEN).build();
        adminAssignValidator.execute(new AdminAssignValidatorUseCase.Command(id, body.validatorId()));
        return Response.ok().build();
    }

    @POST
    @Path("/{id}/resolve")
    public Response resolve(@PathParam("id") UUID id, ResolveBody body) {
        if (!requestContext.isAdmin()) return Response.status(Response.Status.FORBIDDEN).build();
        adminResolveValidation.execute(new AdminResolveValidationUseCase.Command(id, body.decision()));
        return Response.ok().build();
    }

    private AdminListValidationsUseCase.Result forbidden() {
        throw new ForbiddenException("Acesso restrito a administradores");
    }

    public record RequestBody(String skill) {}
    public record QuestionnaireBody(ValidationDecision decision, SkillLevel level, String reasoning) {}
    public record AssignBody(UUID validatorId) {}
    public record ResolveBody(ValidationDecision decision) {}
}
