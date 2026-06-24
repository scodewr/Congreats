package com.congreats.infrastructure.adapter.in.filter;

import com.congreats.application.port.out.TokenService;
import com.congreats.domain.exception.InvalidTokenException;
import jakarta.annotation.Priority;
import jakarta.inject.Inject;
import jakarta.ws.rs.Priorities;
import jakarta.ws.rs.container.ContainerRequestContext;
import jakarta.ws.rs.container.ContainerRequestFilter;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.Provider;

@Provider
@Priority(Priorities.AUTHENTICATION)
public class JwtAuthFilter implements ContainerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER_PREFIX = "Bearer ";

    @Inject TokenService tokenService;
    @Inject RequestContext requestContext;

    @Override
    public void filter(ContainerRequestContext ctx) {
        String path = ctx.getUriInfo().getPath();

        if (path.startsWith("auth/") || path.startsWith("/auth/")
                || path.equals("/files") || path.startsWith("/files/")
                || path.equals("/campaigns/active") || path.startsWith("/events/") && path.endsWith("/ranking")
                || path.startsWith("/webhooks/") || path.startsWith("webhooks/")) {
            return;
        }

        String header = ctx.getHeaderString(AUTH_HEADER);
        if (header == null || !header.startsWith(BEARER_PREFIX)) {
            ctx.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\":\"Token de autenticação obrigatório\"}").build());
            return;
        }

        try {
            String token = header.substring(BEARER_PREFIX.length());
            var claims = tokenService.validateAndGetClaims(token);
            requestContext.setUserId(claims.userId());
            requestContext.setRole(claims.role());
        } catch (InvalidTokenException e) {
            ctx.abortWith(Response.status(Response.Status.UNAUTHORIZED)
                    .entity("{\"error\":\"Token inválido ou expirado\"}").build());
        }
    }
}
