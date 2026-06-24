package com.congreats.infrastructure.entity;

import com.congreats.domain.model.ValidatorAssignment;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "validator_assignments",
        uniqueConstraints = @UniqueConstraint(columnNames = {"validation_id", "validator_id"}))
public class ValidatorAssignmentEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "validation_id", nullable = false, columnDefinition = "uuid")
    public UUID validationId;

    @Column(name = "validator_id", nullable = false, columnDefinition = "uuid")
    public UUID validatorId;

    @Column(name = "assigned_at", nullable = false)
    public Instant assignedAt;

    public static ValidatorAssignmentEntity from(ValidatorAssignment a) {
        ValidatorAssignmentEntity e = new ValidatorAssignmentEntity();
        e.id = a.id();
        e.validationId = a.validationId();
        e.validatorId = a.validatorId();
        e.assignedAt = a.assignedAt();
        return e;
    }

    public ValidatorAssignment toDomain() {
        return new ValidatorAssignment(id, validationId, validatorId, assignedAt);
    }
}
