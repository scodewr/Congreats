package com.congreats.infrastructure.adapter.in.filter;

import com.congreats.domain.model.UserRole;
import jakarta.enterprise.context.RequestScoped;

import java.util.UUID;

@RequestScoped
public class RequestContext {
    private UUID userId;
    private UserRole role;

    public void setUserId(UUID userId) { this.userId = userId; }
    public void setRole(UserRole role) { this.role = role; }
    public UUID getUserId() { return userId; }
    public UserRole getRole() { return role; }
    public boolean isAuthenticated() { return userId != null; }
    public boolean isAdmin() { return UserRole.ADMIN.equals(role); }
}
