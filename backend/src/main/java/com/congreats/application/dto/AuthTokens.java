package com.congreats.application.dto;

public record AuthTokens(String accessToken, String refreshToken, long expiresIn) {
    public AuthTokens(String accessToken, String refreshToken) {
        this(accessToken, refreshToken, 900L);
    }
}
