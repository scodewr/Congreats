package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record ProfileProject(UUID id, String name, String description, ProjectStatus status, Instant addedAt) {

    public enum ProjectStatus { ACTIVE, PAST }

    public static ProfileProject create(String name, String description, ProjectStatus status) {
        return new ProfileProject(UUID.randomUUID(), name, description, status, Instant.now());
    }
}
