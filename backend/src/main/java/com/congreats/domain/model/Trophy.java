package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Trophy(
        UUID id,
        UUID userId,
        String skill,
        TrophyLevel level,
        Instant awardedAt
) {
    public static Trophy award(UUID userId, String skill, TrophyLevel level) {
        return new Trophy(UUID.randomUUID(), userId, skill, level, Instant.now());
    }
}
