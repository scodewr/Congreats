package com.congreats.infrastructure.adapter.in.filter;

import jakarta.enterprise.context.RequestScoped;

import java.util.UUID;

@RequestScoped
public class RequestContext {
    private UUID userId;

    public void setUserId(UUID userId) { this.userId = userId; }
    public UUID getUserId() { return userId; }
    public boolean isAuthenticated() { return userId != null; }
}
