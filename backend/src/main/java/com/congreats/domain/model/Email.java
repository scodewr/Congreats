package com.congreats.domain.model;

import com.congreats.domain.exception.InvalidEmailException;

public record Email(String value) {

    private static final String EMAIL_REGEX = "^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$";

    public Email {
        if (value == null || value.isBlank()) throw new InvalidEmailException("(vazio)");
        value = value.toLowerCase().trim();
        if (!value.matches(EMAIL_REGEX)) throw new InvalidEmailException(value);
    }

    @Override
    public String toString() {
        return value;
    }
}
