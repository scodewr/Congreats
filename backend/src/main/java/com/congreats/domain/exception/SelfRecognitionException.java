package com.congreats.domain.exception;

public class SelfRecognitionException extends DomainException {
    public SelfRecognitionException() {
        super("Você não pode reconhecer a si mesmo");
    }
}
