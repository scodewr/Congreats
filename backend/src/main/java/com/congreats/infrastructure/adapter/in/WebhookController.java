package com.congreats.infrastructure.adapter.in;

import com.congreats.application.usecase.ProcessWebhookUseCase;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;

import java.util.Map;

@Path("/webhooks")
@Consumes(MediaType.APPLICATION_JSON)
@Produces(MediaType.APPLICATION_JSON)
public class WebhookController {

    private static final Logger LOG = Logger.getLogger(WebhookController.class);

    @Inject ProcessWebhookUseCase processWebhook;

    @POST
    @Path("/github/{secret}")
    public Response github(
            @PathParam("secret") String secret,
            @HeaderParam("X-Hub-Signature-256") String signature,
            String rawPayload,
            Map<String, Object> body
    ) {
        return handle("GITHUB", secret, signature, rawPayload, body);
    }

    @POST
    @Path("/jira/{secret}")
    public Response jira(
            @PathParam("secret") String secret,
            @HeaderParam("X-Hub-Signature") String signature,
            String rawPayload,
            Map<String, Object> body
    ) {
        return handle("JIRA", secret, signature, rawPayload, body);
    }

    @POST
    @Path("/linear/{secret}")
    public Response linear(
            @PathParam("secret") String secret,
            @HeaderParam("Linear-Signature") String signature,
            String rawPayload,
            Map<String, Object> body
    ) {
        return handle("LINEAR", secret, signature, rawPayload, body);
    }

    private Response handle(String platform, String secret, String signature, String rawPayload, Map<String, Object> body) {
        try {
            processWebhook.execute(new ProcessWebhookUseCase.WebhookEvent(
                    platform, secret, signature, rawPayload != null ? rawPayload : "", body));
            return Response.ok(Map.of("status", "ok")).build();
        } catch (NotFoundException e) {
            return Response.status(Response.Status.NOT_FOUND)
                    .entity(Map.of("error", e.getMessage())).build();
        } catch (DomainException e) {
            LOG.infof("Webhook rejeitado [%s]: %s", platform, e.getMessage());
            return Response.status(Response.Status.UNAUTHORIZED)
                    .entity(Map.of("error", e.getMessage())).build();
        } catch (Exception e) {
            LOG.warnf("Erro inesperado no webhook [%s]: %s", platform, e.getMessage());
            return Response.serverError().entity(Map.of("error", "Erro interno")).build();
        }
    }
}
