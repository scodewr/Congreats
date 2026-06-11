package com.congreats.infrastructure.adapter.in;

import com.congreats.application.dto.AuthTokens;
import com.congreats.application.usecase.*;
import com.congreats.infrastructure.adapter.in.filter.RequestContext;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class AuthController {

    @Inject RegisterUserUseCase registerUser;
    @Inject AuthenticateUserUseCase authenticateUser;
    @Inject RefreshTokenUseCase refreshToken;
    @Inject LogoutUseCase logout;
    @Inject ChangePasswordUseCase changePassword;
    @Inject RequestContext requestContext;

    public record RegisterRequest(@NotBlank String name, @NotBlank String email,
                                  @NotBlank @Size(min = 8) String password) {}
    public record LoginRequest(@NotBlank String email, @NotBlank String password) {}
    public record RefreshRequest(@NotBlank String refreshToken) {}
    public record ChangePasswordRequest(@NotBlank String currentPassword,
                                        @NotBlank @Size(min = 8) String newPassword) {}

    @POST
    @Path("/register")
    public Response register(@Valid RegisterRequest req) {
        AuthTokens tokens = registerUser.execute(
                new RegisterUserUseCase.Command(req.name(), req.email(), req.password()));
        return Response.status(Response.Status.CREATED).entity(tokens).build();
    }

    @POST
    @Path("/login")
    public AuthTokens login(@Valid LoginRequest req) {
        return authenticateUser.execute(
                new AuthenticateUserUseCase.Command(req.email(), req.password()));
    }

    @POST
    @Path("/refresh")
    public AuthTokens refresh(@Valid RefreshRequest req) {
        return refreshToken.execute(req.refreshToken());
    }

    @POST
    @Path("/logout")
    public Response doLogout(@Valid RefreshRequest req) {
        logout.execute(req.refreshToken());
        return Response.noContent().build();
    }

    @PUT
    @Path("/password")
    public Response changePass(@Valid ChangePasswordRequest req) {
        changePassword.execute(new ChangePasswordUseCase.Command(
                requestContext.getUserId(), req.currentPassword(), req.newPassword()));
        return Response.noContent().build();
    }
}
