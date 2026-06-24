package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record ValidatorAssignment(
        UUID id,
        UUID validationId,
        UUID validatorId,
        Instant assignedAt
) {
    public static ValidatorAssignment assign(UUID validationId, UUID validatorId) {
        return new ValidatorAssignment(UUID.randomUUID(), validationId, validatorId, Instant.now());
    }
}
