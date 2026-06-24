package com.congreats.application.dto;

import java.time.Instant;
import java.util.UUID;

public record WorkspaceView(
        UUID id,
        String name,
        String description,
        UUID ownerId,
        String ownerName,
        int memberCount,
        Instant createdAt
) {}
