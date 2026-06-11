package com.congreats.domain.model;

import com.congreats.domain.exception.DomainException;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class UserTest {

    private static final Email EMAIL = new Email("test@example.com");

    @Test
    void create_returnsActiveUser() {
        User user = User.create("Alice Silva", EMAIL, "hash", UserRole.USER);
        assertNotNull(user.id());
        assertEquals("Alice Silva", user.name());
        assertEquals(EMAIL, user.email());
        assertTrue(user.active());
        assertNotNull(user.createdAt());
    }

    @Test
    void create_blankName_throwsException() {
        assertThrows(DomainException.class,
                () -> User.create("  ", EMAIL, "hash", UserRole.USER));
    }

    @Test
    void changePassword_updatesHash() {
        User user = User.create("Bob", EMAIL, "old-hash", UserRole.USER);
        user.changePassword("new-hash");
        assertEquals("new-hash", user.passwordHash());
    }

    @Test
    void deactivate_setsActiveFalse() {
        User user = User.create("Carol", EMAIL, "hash", UserRole.USER);
        user.deactivate();
        assertFalse(user.active());
    }

    @Test
    void role_isPreserved() {
        User admin = User.create("Admin", EMAIL, "hash", UserRole.ADMIN);
        assertEquals(UserRole.ADMIN, admin.role());
        User regular = User.create("Regular", EMAIL, "hash", UserRole.USER);
        assertEquals(UserRole.USER, regular.role());
    }
}
