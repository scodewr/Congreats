package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record ProfileTeam(UUID id, String name, String role, Instant addedAt) {

    public static ProfileTeam create(String name, String role) {
        return new ProfileTeam(UUID.randomUUID(), name, role, Instant.now());
    }
}
