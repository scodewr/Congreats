package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Questionnaire(
        UUID id,
        UUID validationId,
        UUID validatorId,
        ValidationDecision decision,
        SkillLevel level,
        String reasoning,
        Instant submittedAt
) {
    public static Questionnaire submit(UUID validationId, UUID validatorId,
                                       ValidationDecision decision, SkillLevel level, String reasoning) {
        return new Questionnaire(UUID.randomUUID(), validationId, validatorId,
                decision, level, reasoning, Instant.now());
    }
}
