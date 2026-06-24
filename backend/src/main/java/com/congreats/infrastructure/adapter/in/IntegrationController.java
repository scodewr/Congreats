package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.IntegrationView;
import com.congreats.application.usecase.admin.CreateIntegrationUseCase;
import com.congreats.application.usecase.admin.DeactivateIntegrationUseCase;
import com.congreats.application.usecase.admin.ListIntegrationsUseCase;
import com.congreats.domain.model.IntegrationPlatform;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.List;
import java.util.UUID;

@Path("/admin/integrations")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class IntegrationController {

    @Inject CreateIntegrationUseCase createIntegration;
    @Inject ListIntegrationsUseCase listIntegrations;
    @Inject DeactivateIntegrationUseCase deactivateIntegration;
    @Inject RequestContext requestContext;

    private UUID userId() { return requestContext.getUserId(); }

    @GET
    public List<IntegrationView> list() {
        return listIntegrations.execute();
    }

    @POST
    public IntegrationView create(@Valid @NotNull CreateRequest body) {
        return createIntegration.execute(new CreateIntegrationUseCase.Command(
                body.platform(), body.name(),
                body.categoryId(), body.workspaceId(), userId()
        ));
    }

    @DELETE
    @Path("/{id}")
    public void deactivate(@PathParam("id") UUID id) {
        deactivateIntegration.execute(id);
    }

    public record CreateRequest(
            @NotNull IntegrationPlatform platform,
            @NotBlank String name,
            UUID categoryId,
            UUID workspaceId
    ) {}
}
