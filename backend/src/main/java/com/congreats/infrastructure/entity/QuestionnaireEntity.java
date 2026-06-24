package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Questionnaire;
import com.congreats.domain.model.SkillLevel;
import com.congreats.domain.model.ValidationDecision;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "questionnaires",
        uniqueConstraints = @UniqueConstraint(columnNames = {"validation_id", "validator_id"}))
public class QuestionnaireEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "validation_id", nullable = false, columnDefinition = "uuid")
    public UUID validationId;

    @Column(name = "validator_id", nullable = false, columnDefinition = "uuid")
    public UUID validatorId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public ValidationDecision decision;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public SkillLevel level;

    @Column(columnDefinition = "text")
    public String reasoning;

    @Column(name = "submitted_at", nullable = false)
    public Instant submittedAt;

    public static QuestionnaireEntity from(Questionnaire q) {
        QuestionnaireEntity e = new QuestionnaireEntity();
        e.id = q.id();
        e.validationId = q.validationId();
        e.validatorId = q.validatorId();
        e.decision = q.decision();
        e.level = q.level();
        e.reasoning = q.reasoning();
        e.submittedAt = q.submittedAt();
        return e;
    }

    public Questionnaire toDomain() {
        return new Questionnaire(id, validationId, validatorId, decision, level, reasoning, submittedAt);
    }
}
