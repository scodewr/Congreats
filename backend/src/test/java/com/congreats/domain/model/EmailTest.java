package com.congreats.domain.model;

import com.congreats.domain.exception.InvalidEmailException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class EmailTest {

    @Test
    void validEmail_createsEmail() {
        Email email = new Email("User@Example.COM");
        assertEquals("user@example.com", email.value());
    }

    @Test
    void validEmail_withSubdomain() {
        assertDoesNotThrow(() -> new Email("dev@api.example.com.br"));
    }

    @Test
    void invalidEmail_missingAt_throwsException() {
        assertThrows(InvalidEmailException.class, () -> new Email("notanemail.com"));
    }

    @Test
    void invalidEmail_missingDomain_throwsException() {
        assertThrows(InvalidEmailException.class, () -> new Email("user@"));
    }

    @Test
    void nullEmail_throwsException() {
        assertThrows(Exception.class, () -> new Email(null));
    }

    @Test
    void email_lowercasesAndTrims() {
        Email e1 = new Email("  TEST@EXAMPLE.COM  ");
        assertEquals("test@example.com", e1.value());
    }

    @Test
    void twoEmailsWithSameValue_areEqual() {
        assertEquals(new Email("a@b.com"), new Email("A@B.COM"));
    }
}
