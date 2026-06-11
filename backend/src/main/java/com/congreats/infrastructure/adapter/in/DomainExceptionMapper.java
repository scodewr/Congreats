package com.congreats.infrastructure.adapter.in;

import com.congreats.domain.exception.*;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.ext.ExceptionMapper;
import jakarta.ws.rs.ext.Provider;

import java.util.Map;

@Provider
public class DomainExceptionMapper implements ExceptionMapper<DomainException> {

    @Override
    public Response toResponse(DomainException e) {
        Response.Status status = switch (e) {
            case EmailAlreadyExistsException ex -> Response.Status.CONFLICT;
            case InvalidCredentialsException ex -> Response.Status.UNAUTHORIZED;
            case InvalidTokenException ex -> Response.Status.UNAUTHORIZED;
            case AccountInactiveException ex -> Response.Status.UNAUTHORIZED;
            case ForbiddenException ex -> Response.Status.FORBIDDEN;
            case NotFoundException ex -> Response.Status.NOT_FOUND;
            default -> Response.Status.BAD_REQUEST;
        };
        return Response.status(status)
                .entity(Map.of("error", e.getMessage()))
                .build();
    }
}
