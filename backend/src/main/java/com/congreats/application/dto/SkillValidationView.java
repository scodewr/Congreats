package com.congreats.application.dto;

import com.congreats.domain.model.SkillLevel;
import com.congreats.domain.model.ValidationDecision;
import com.congreats.domain.model.ValidationStatus;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record SkillValidationView(
        UUID id,
        UUID userId,
        String userName,
        String skill,
        ValidationStatus status,
        Instant requestedAt,
        Instant resolvedAt,
        List<AssignmentView> assignments,
        List<QuestionnaireView> questionnaires
) {
    public record AssignmentView(UUID id, UUID validatorId, String validatorName, Instant assignedAt) {}

    public record QuestionnaireView(
            UUID id,
            UUID validatorId,
            String validatorName,
            ValidationDecision decision,
            SkillLevel level,
            String levelLabel,
            String reasoning,
            Instant submittedAt
    ) {}
}
