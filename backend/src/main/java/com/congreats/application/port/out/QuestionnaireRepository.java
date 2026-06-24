package com.congreats.application.port.out;

import com.congreats.domain.model.Questionnaire;

import java.util.List;
import java.util.UUID;

public interface QuestionnaireRepository {
    void save(Questionnaire q);
    List<Questionnaire> findByValidationId(UUID validationId);
    boolean existsByValidationAndValidator(UUID validationId, UUID validatorId);
}
