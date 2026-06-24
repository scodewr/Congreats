package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Medal(
        UUID id,
        UUID userId,
        MedalMilestone milestone,
        Instant awardedAt
) {
    public static Medal award(UUID userId, MedalMilestone milestone) {
        return new Medal(UUID.randomUUID(), userId, milestone, Instant.now());
    }
}
