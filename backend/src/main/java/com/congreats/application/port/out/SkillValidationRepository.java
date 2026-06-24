package com.congreats.application.port.out;

import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidationStatus;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface SkillValidationRepository {
    void save(SkillValidation v);
    Optional<SkillValidation> findById(UUID id);
    List<SkillValidation> findByUserId(UUID userId);
    List<SkillValidation> findByStatus(ValidationStatus status, int page, int size);
    long countByStatus(ValidationStatus status);
    boolean hasActive(UUID userId, String skill);
    void updateStatus(UUID id, ValidationStatus status, java.time.Instant resolvedAt);
}
