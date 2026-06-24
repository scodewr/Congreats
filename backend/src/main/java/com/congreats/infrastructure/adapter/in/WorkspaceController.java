package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.RecognitionView;
import com.congreats.application.dto.WorkspaceView;
import com.congreats.application.usecase.AssignUserToWorkspaceUseCase;
import com.congreats.application.usecase.CreateWorkspaceUseCase;
import com.congreats.application.usecase.GetUserWorkspacesUseCase;
import com.congreats.application.usecase.GetWorkspaceRecognitionsUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.List;
import java.util.UUID;

@Path("/workspaces")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class WorkspaceController {

    @Inject CreateWorkspaceUseCase createWorkspace;
    @Inject AssignUserToWorkspaceUseCase assignUser;
    @Inject GetUserWorkspacesUseCase getUserWorkspaces;
    @Inject GetWorkspaceRecognitionsUseCase getWorkspaceRecognitions;
    @Inject RequestContext requestContext;

    public record CreateWorkspaceRequest(@NotBlank String name, String description) {}
    public record AddMemberRequest(UUID userId) {}

    @POST
    public Response create(CreateWorkspaceRequest req) {
        WorkspaceView view = createWorkspace.execute(
                new CreateWorkspaceUseCase.Command(requestContext.getUserId(), req.name(), req.description()));
        return Response.status(Response.Status.CREATED).entity(view).build();
    }

    @GET
    public List<WorkspaceView> listMine() {
        return getUserWorkspaces.execute(requestContext.getUserId());
    }

    @POST
    @Path("/{id}/members")
    public Response addMember(@PathParam("id") UUID workspaceId, AddMemberRequest req) {
        assignUser.execute(requestContext.getUserId(), workspaceId, req.userId());
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @GET
    @Path("/{id}/feed")
    public PageResult<RecognitionView> feed(
            @PathParam("id") UUID workspaceId,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("20") int size) {
        return getWorkspaceRecognitions.execute(requestContext.getUserId(), workspaceId, page, size);
    }
}
