package com.congreats.application.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record EventView(
        UUID id,
        String name,
        String description,
        UUID categoryId,
        String categoryName,
        Instant startsAt,
        Instant endsAt,
        boolean active,
        Instant createdAt,
        List<RankingEntry> ranking
) {
    public record RankingEntry(UUID userId, String name, String photoUrl, long recognitionCount) {}

    public EventView withoutRanking() {
        return new EventView(id, name, description, categoryId, categoryName,
                startsAt, endsAt, active, createdAt, List.of());
    }
}
