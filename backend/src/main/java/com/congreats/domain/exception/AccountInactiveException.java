package com.congreats.domain.exception;

public class AccountInactiveException extends DomainException {
    public AccountInactiveException() {
        super("Conta desativada");
    }
}
