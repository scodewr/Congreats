package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.EventView;
import com.congreats.application.usecase.GetEventRankingUseCase;
import com.congreats.application.usecase.admin.CreateEventUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Instant;
import java.util.UUID;

@Path("/events")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminEventController {

    @Inject CreateEventUseCase createEvent;
    @Inject GetEventRankingUseCase getEventRanking;
    @Inject RequestContext requestContext;

    public record CreateEventRequest(
            @NotBlank String name,
            String description,
            @NotNull UUID categoryId,
            @NotNull Instant startsAt,
            @NotNull Instant endsAt) {}

    @POST
    public Response create(@Valid CreateEventRequest req) {
        if (!requestContext.isAdmin()) {
            return Response.status(Response.Status.FORBIDDEN)
                    .entity("{\"error\":\"Acesso restrito a administradores\"}").build();
        }
        EventView view = createEvent.execute(new CreateEventUseCase.Command(
                req.name(), req.description(), req.categoryId(), req.startsAt(), req.endsAt()));
        return Response.status(Response.Status.CREATED).entity(view).build();
    }

    @GET
    @Path("/{id}/ranking")
    public EventView ranking(@PathParam("id") UUID eventId) {
        return getEventRanking.execute(eventId);
    }
}
