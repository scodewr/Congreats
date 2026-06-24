package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Trophy;
import com.congreats.domain.model.TrophyLevel;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "trophies",
        uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "skill", "level"}))
public class TrophyEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "user_id", nullable = false, columnDefinition = "uuid")
    public UUID userId;

    @Column(nullable = false, length = 100)
    public String skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public TrophyLevel level;

    @Column(name = "awarded_at", nullable = false, updatable = false)
    public Instant awardedAt;

    public static TrophyEntity from(Trophy t) {
        TrophyEntity e = new TrophyEntity();
        e.id = t.id();
        e.userId = t.userId();
        e.skill = t.skill();
        e.level = t.level();
        e.awardedAt = t.awardedAt();
        return e;
    }

    public Trophy toDomain() {
        return new Trophy(id, userId, skill, level, awardedAt);
    }
}
