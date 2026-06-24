package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record SkillValidation(
        UUID id,
        UUID userId,
        String skill,
        ValidationStatus status,
        Instant requestedAt,
        Instant resolvedAt
) {
    public static SkillValidation request(UUID userId, String skill) {
        return new SkillValidation(UUID.randomUUID(), userId, skill, ValidationStatus.PENDING, Instant.now(), null);
    }

    public SkillValidation inProgress() {
        return new SkillValidation(id, userId, skill, ValidationStatus.IN_PROGRESS, requestedAt, null);
    }

    public SkillValidation approve() {
        return new SkillValidation(id, userId, skill, ValidationStatus.APPROVED, requestedAt, Instant.now());
    }

    public SkillValidation reject() {
        return new SkillValidation(id, userId, skill, ValidationStatus.REJECTED, requestedAt, Instant.now());
    }
}
