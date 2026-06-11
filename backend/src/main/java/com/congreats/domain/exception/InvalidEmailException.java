package com.congreats.domain.exception;

public class InvalidEmailException extends DomainException {
    public InvalidEmailException(String email) {
        super("E-mail inválido: " + email);
    }
}
