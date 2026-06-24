package com.congreats.infrastructure.entity;

import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidationStatus;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "skill_validations")
public class SkillValidationEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "user_id", nullable = false, columnDefinition = "uuid")
    public UUID userId;

    @Column(nullable = false, length = 100)
    public String skill;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public ValidationStatus status;

    @Column(name = "requested_at", nullable = false)
    public Instant requestedAt;

    @Column(name = "resolved_at")
    public Instant resolvedAt;

    public static SkillValidationEntity from(SkillValidation v) {
        SkillValidationEntity e = new SkillValidationEntity();
        e.id = v.id();
        e.userId = v.userId();
        e.skill = v.skill();
        e.status = v.status();
        e.requestedAt = v.requestedAt();
        e.resolvedAt = v.resolvedAt();
        return e;
    }

    public SkillValidation toDomain() {
        return new SkillValidation(id, userId, skill, status, requestedAt, resolvedAt);
    }
}
