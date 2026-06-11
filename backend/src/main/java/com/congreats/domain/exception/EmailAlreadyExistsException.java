package com.congreats.domain.exception;

public class EmailAlreadyExistsException extends DomainException {
    public EmailAlreadyExistsException() {
        super("E-mail já cadastrado");
    }
}
