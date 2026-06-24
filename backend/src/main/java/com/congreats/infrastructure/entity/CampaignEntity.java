package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Campaign;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "campaigns")
public class CampaignEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(nullable = false, length = 200)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "category_id", nullable = false, columnDefinition = "uuid")
    public UUID categoryId;

    @Column(name = "starts_at", nullable = false)
    public Instant startsAt;

    @Column(name = "ends_at", nullable = false)
    public Instant endsAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    public static CampaignEntity from(Campaign c) {
        CampaignEntity e = new CampaignEntity();
        e.id = c.id();
        e.name = c.name();
        e.description = c.description();
        e.categoryId = c.categoryId();
        e.startsAt = c.startsAt();
        e.endsAt = c.endsAt();
        e.createdAt = c.createdAt();
        return e;
    }

    public Campaign toDomain() {
        return new Campaign(id, name, description, categoryId, startsAt, endsAt, createdAt);
    }
}
