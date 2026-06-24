package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Workspace(
        UUID id,
        String name,
        String description,
        UUID ownerId,
        boolean archived,
        Instant createdAt
) {
    public static Workspace create(String name, String description, UUID ownerId) {
        return new Workspace(UUID.randomUUID(), name, description, ownerId, false, Instant.now());
    }
}
