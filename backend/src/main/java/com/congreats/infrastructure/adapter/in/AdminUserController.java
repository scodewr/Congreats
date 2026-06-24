package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.UserAdminView;
import com.congreats.application.usecase.admin.AdminCreateUserUseCase;
import com.congreats.application.usecase.admin.AdminDeactivateUserUseCase;
import com.congreats.application.usecase.admin.AdminListUsersUseCase;
import com.congreats.application.usecase.admin.AdminUpdateUserUseCase;
import com.congreats.domain.model.UserRole;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.constraints.NotBlank;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.util.UUID;

@Path("/admin/users")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AdminUserController {

    @Inject AdminListUsersUseCase listUsers;
    @Inject AdminCreateUserUseCase createUser;
    @Inject AdminUpdateUserUseCase updateUser;
    @Inject AdminDeactivateUserUseCase deactivateUser;
    @Inject RequestContext requestContext;

    public record CreateUserRequest(@NotBlank String name, @NotBlank String email, UserRole role) {}
    public record UpdateUserRequest(String name, String email, UserRole role) {}

    @GET
    public Response list(@QueryParam("page") @DefaultValue("0") int page,
                         @QueryParam("size") @DefaultValue("20") int size) {
        if (!requestContext.isAdmin()) return forbidden();
        PageResult<UserAdminView> result = listUsers.execute(page, size);
        return Response.ok(result).build();
    }

    @POST
    public Response create(CreateUserRequest req) {
        if (!requestContext.isAdmin()) return forbidden();
        AdminCreateUserUseCase.Result result = createUser.execute(
                new AdminCreateUserUseCase.Command(req.name(), req.email(), req.role()));
        return Response.status(Response.Status.CREATED).entity(result).build();
    }

    @PUT
    @Path("/{id}")
    public Response update(@PathParam("id") UUID userId, UpdateUserRequest req) {
        if (!requestContext.isAdmin()) return forbidden();
        UserAdminView view = updateUser.execute(
                new AdminUpdateUserUseCase.Command(userId, req.name(), req.email(), req.role()));
        return Response.ok(view).build();
    }

    @DELETE
    @Path("/{id}")
    public Response deactivate(@PathParam("id") UUID userId) {
        if (!requestContext.isAdmin()) return forbidden();
        deactivateUser.execute(userId);
        return Response.noContent().build();
    }

    private Response forbidden() {
        return Response.status(Response.Status.FORBIDDEN)
                .entity("{\"error\":\"Acesso restrito a administradores\"}").build();
    }
}
