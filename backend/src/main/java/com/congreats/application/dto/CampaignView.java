package com.congreats.application.dto;

import java.time.Instant;
import java.util.UUID;

public record CampaignView(
        UUID id,
        String name,
        String description,
        UUID categoryId,
        String categoryName,
        Instant startsAt,
        Instant endsAt,
        boolean active,
        Instant createdAt
) {}
