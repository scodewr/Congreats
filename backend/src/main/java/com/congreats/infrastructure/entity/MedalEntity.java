package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Medal;
import com.congreats.domain.model.MedalMilestone;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "medals",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "milestone"}))
public class MedalEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "user_id", nullable = false, columnDefinition = "uuid")
    public UUID userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 50)
    public MedalMilestone milestone;

    @Column(name = "awarded_at", nullable = false, updatable = false)
    public Instant awardedAt;

    public static MedalEntity from(Medal m) {
        MedalEntity e = new MedalEntity();
        e.id = m.id();
        e.userId = m.userId();
        e.milestone = m.milestone();
        e.awardedAt = m.awardedAt();
        return e;
    }

    public Medal toDomain() {
        return new Medal(id, userId, milestone, awardedAt);
    }
}
