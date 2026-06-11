package com.congreats.domain.model;

import com.congreats.domain.exception.DomainException;

import java.time.Instant;
import java.util.UUID;

public class User {

    private final UUID id;
    private String name;
    private final Email email;
    private String passwordHash;
    private boolean active;
    private final UserRole role;
    private final Instant createdAt;

    public User(UUID id, String name, Email email, String passwordHash, UserRole role, boolean active, Instant createdAt) {
        if (name == null || name.isBlank()) throw new DomainException("Nome é obrigatório");
        this.id = id;
        this.name = name.trim();
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.active = active;
        this.createdAt = createdAt;
    }

    public static User create(String name, Email email, String passwordHash, UserRole role) {
        return new User(UUID.randomUUID(), name, email, passwordHash, role, true, Instant.now());
    }

    public void changePassword(String newPasswordHash) {
        this.passwordHash = newPasswordHash;
    }

    public void deactivate() {
        this.active = false;
    }

    public UUID id() { return id; }
    public String name() { return name; }
    public Email email() { return email; }
    public String passwordHash() { return passwordHash; }
    public boolean active() { return active; }
    public UserRole role() { return role; }
    public Instant createdAt() { return createdAt; }
}
