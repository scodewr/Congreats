package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.NotificationPreferencesView;
import com.congreats.application.usecase.GetNotificationPreferencesUseCase;
import com.congreats.application.usecase.UpdateNotificationPreferencesUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;

import java.util.UUID;

@Path("/notifications")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NotificationController {

    @Inject GetNotificationPreferencesUseCase getPreferences;
    @Inject UpdateNotificationPreferencesUseCase updatePreferences;
    @Inject RequestContext requestContext;

    private UUID userId() {
        return requestContext.getUserId();
    }

    @GET
    @Path("/preferences")
    public NotificationPreferencesView getPreferences() {
        return getPreferences.execute(userId());
    }

    @PUT
    @Path("/preferences")
    public NotificationPreferencesView updatePreferences(@Valid @NotNull UpdateRequest body) {
        return updatePreferences.execute(new UpdateNotificationPreferencesUseCase.Command(
                userId(),
                body.emailEnabled(),
                body.whatsappNumber(),
                body.whatsappEnabled(),
                body.smsNumber(),
                body.smsEnabled()
        ));
    }

    public record UpdateRequest(
            boolean emailEnabled,
            String whatsappNumber,
            boolean whatsappEnabled,
            String smsNumber,
            boolean smsEnabled
    ) {}
}
