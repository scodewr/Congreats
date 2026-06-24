package com.congreats.application.dto;

import com.congreats.domain.model.UserRole;

import java.util.UUID;

public record TokenClaims(UUID userId, UserRole role) {}
