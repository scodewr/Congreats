package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Integration;
import com.congreats.domain.model.IntegrationPlatform;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "integrations")
public class IntegrationEntity {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public IntegrationPlatform platform;

    @Column(nullable = false)
    public String name;

    @Column(name = "webhook_secret", nullable = false)
    public String webhookSecret;

    @Column(name = "category_id", columnDefinition = "uuid")
    public UUID categoryId;

    @Column(name = "workspace_id", columnDefinition = "uuid")
    public UUID workspaceId;

    @Column(name = "owner_id", nullable = false, columnDefinition = "uuid")
    public UUID ownerId;

    @Column(nullable = false)
    public boolean active;

    @Column(name = "created_at", nullable = false)
    public Instant createdAt;

    public static IntegrationEntity from(Integration i) {
        IntegrationEntity e = new IntegrationEntity();
        e.id = i.id();
        e.platform = i.platform();
        e.name = i.name();
        e.webhookSecret = i.webhookSecret();
        e.categoryId = i.categoryId();
        e.workspaceId = i.workspaceId();
        e.ownerId = i.ownerId();
        e.active = i.active();
        e.createdAt = i.createdAt();
        return e;
    }

    public Integration toDomain() {
        return new Integration(id, platform, name, webhookSecret, categoryId, workspaceId, ownerId, active, createdAt);
    }
}
