package com.congreats.application.dto;

import com.congreats.domain.model.UserRole;

import java.time.Instant;
import java.util.UUID;

public record UserAdminView(
        UUID id,
        String name,
        String email,
        UserRole role,
        boolean active,
        Instant createdAt
) {}
