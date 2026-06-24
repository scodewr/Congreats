package com.congreats.application.port.out;

import com.congreats.domain.model.ValidatorAssignment;

import java.util.List;
import java.util.UUID;

public interface ValidatorAssignmentRepository {
    void save(ValidatorAssignment a);
    List<ValidatorAssignment> findByValidationId(UUID validationId);
    List<ValidatorAssignment> findByValidatorId(UUID validatorId);
    boolean exists(UUID validationId, UUID validatorId);
}
