package com.congreats.application.port.out;

import com.congreats.application.dto.TokenClaims;
import com.congreats.domain.model.User;

import java.util.UUID;

public interface TokenService {
    String generateAccessToken(User user);
    String generateRefreshToken(UUID userId);
    UUID validateAccessToken(String token);
    TokenClaims validateAndGetClaims(String token);
    UUID validateAndRevokeRefreshToken(String token);
    void revokeAllRefreshTokens(UUID userId);
}
