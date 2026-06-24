package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.WorkspaceView;
import com.congreats.application.usecase.AssignUserToWorkspaceUseCase;
import com.congreats.application.usecase.admin.AdminArchiveWorkspaceUseCase;
import com.congreats.application.usecase.admin.AdminListWorkspacesUseCase;
import com.congreats.application.usecase.admin.AdminRemoveWorkspaceMemberUseCase;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/admin/workspaces")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminWorkspaceController {

    @Inject AdminListWorkspacesUseCase listWorkspaces;
    @Inject AdminArchiveWorkspaceUseCase archiveWorkspace;
    @Inject AdminRemoveWorkspaceMemberUseCase removeMember;
    @Inject AssignUserToWorkspaceUseCase assignUser;
    @Inject RequestContext requestContext;

    public record AddMemberRequest(UUID userId) {}

    @GET
    public Response list(@QueryParam("page") @DefaultValue("0") int page,
                         @QueryParam("size") @DefaultValue("20") int size) {
        if (!requestContext.isAdmin()) return forbidden();
        PageResult<WorkspaceView> result = listWorkspaces.execute(page, size);
        return Response.ok(result).build();
    }

    @DELETE
    @Path("/{id}")
    public Response archive(@PathParam("id") UUID workspaceId) {
        if (!requestContext.isAdmin()) return forbidden();
        archiveWorkspace.execute(workspaceId);
        return Response.noContent().build();
    }

    @POST
    @Path("/{id}/members")
    public Response addMember(@PathParam("id") UUID workspaceId, AddMemberRequest req) {
        if (!requestContext.isAdmin()) return forbidden();
        assignUser.execute(requestContext.getUserId(), workspaceId, req.userId());
        return Response.status(Response.Status.NO_CONTENT).build();
    }

    @DELETE
    @Path("/{id}/members/{userId}")
    public Response removeMember(@PathParam("id") UUID workspaceId,
                                  @PathParam("userId") UUID userId) {
        if (!requestContext.isAdmin()) return forbidden();
        removeMember.execute(workspaceId, userId);
        return Response.noContent().build();
    }

    private Response forbidden() {
        return Response.status(Response.Status.FORBIDDEN)
                .entity("{\"error\":\"Acesso restrito a administradores\"}").build();
    }
}
