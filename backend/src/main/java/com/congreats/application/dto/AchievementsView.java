package com.congreats.application.dto;

import com.congreats.domain.model.MedalMilestone;
import com.congreats.domain.model.TrophyLevel;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record AchievementsView(
        List<MedalView> medals,
        List<TrophyView> trophies
) {
    public record MedalView(
            UUID id,
            MedalMilestone milestone,
            String label,
            Instant awardedAt,
            boolean recent
    ) {}

    public record TrophyView(
            UUID id,
            String skill,
            TrophyLevel level,
            String levelLabel,
            Instant awardedAt,
            boolean recent
    ) {}
}
