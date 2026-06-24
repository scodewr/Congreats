package com.congreats.application.dto;

import java.time.Instant;
import java.util.UUID;

public record IntegrationView(
        UUID id,
        String platform,
        String platformLabel,
        String name,
        String webhookSecret,
        UUID categoryId,
        String categoryName,
        UUID workspaceId,
        String workspaceName,
        UUID ownerId,
        String ownerName,
        boolean active,
        Instant createdAt
) {}
