package com.congreats.domain.model;

import java.time.Instant;
import java.util.UUID;

public record Integration(
        UUID id,
        IntegrationPlatform platform,
        String name,
        String webhookSecret,
        UUID categoryId,
        UUID workspaceId,
        UUID ownerId,
        boolean active,
        Instant createdAt
) {
    public static Integration create(IntegrationPlatform platform, String name, String webhookSecret,
                                     UUID categoryId, UUID workspaceId, UUID ownerId) {
        return new Integration(UUID.randomUUID(), platform, name, webhookSecret,
                categoryId, workspaceId, ownerId, true, Instant.now());
    }

    public Integration deactivate() {
        return new Integration(id, platform, name, webhookSecret, categoryId, workspaceId, ownerId, false, createdAt);
    }
}
