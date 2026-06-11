package com.congreats.domain.exception;

public class InvalidTokenException extends DomainException {
    public InvalidTokenException() {
        super("Token inválido ou expirado");
    }
}
