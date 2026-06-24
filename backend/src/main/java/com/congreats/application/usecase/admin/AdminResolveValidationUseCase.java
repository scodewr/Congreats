package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidationDecision;
import com.congreats.domain.model.ValidationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.UUID;

@ApplicationScoped
public class AdminResolveValidationUseCase {

    @Inject SkillValidationRepository skillValidationRepository;

    public record Command(UUID validationId, ValidationDecision decision) {}

    @Transactional
    public void execute(Command cmd) {
        SkillValidation validation = skillValidationRepository.findById(cmd.validationId())
                .orElseThrow(() -> new NotFoundException("Solicitação de validação não encontrada"));

        if (validation.status() == ValidationStatus.APPROVED || validation.status() == ValidationStatus.REJECTED)
            throw new DomainException("Esta validação já foi encerrada");

        ValidationStatus newStatus = cmd.decision() == ValidationDecision.APPROVED
                ? ValidationStatus.APPROVED : ValidationStatus.REJECTED;

        skillValidationRepository.updateStatus(cmd.validationId(), newStatus, Instant.now());
    }
}
