package com.congreats.application.usecase;

import com.congreats.application.port.out.QuestionnaireRepository;
import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.application.port.out.ValidatorAssignmentRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.ForbiddenException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Questionnaire;
import com.congreats.domain.model.SkillLevel;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidationDecision;
import com.congreats.domain.model.ValidationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class SubmitQuestionnaireUseCase {

    @Inject SkillValidationRepository skillValidationRepository;
    @Inject ValidatorAssignmentRepository validatorAssignmentRepository;
    @Inject QuestionnaireRepository questionnaireRepository;
    @Inject SendValidationNotificationUseCase sendNotification;

    public record Command(UUID validationId, UUID validatorId,
                          ValidationDecision decision, SkillLevel level, String reasoning) {}

    @Transactional
    public void execute(Command cmd) {
        SkillValidation validation = skillValidationRepository.findById(cmd.validationId())
                .orElseThrow(() -> new NotFoundException("Solicitação de validação não encontrada"));

        if (validation.status() == ValidationStatus.APPROVED || validation.status() == ValidationStatus.REJECTED)
            throw new DomainException("Esta validação já foi encerrada");

        if (!validatorAssignmentRepository.exists(cmd.validationId(), cmd.validatorId()))
            throw new ForbiddenException("Você não está atribuído como validador desta habilidade");

        if (questionnaireRepository.existsByValidationAndValidator(cmd.validationId(), cmd.validatorId()))
            throw new DomainException("Você já submeteu um questionário para esta validação");

        questionnaireRepository.save(
                Questionnaire.submit(cmd.validationId(), cmd.validatorId(),
                        cmd.decision(), cmd.level(), cmd.reasoning())
        );

        if (cmd.decision() == ValidationDecision.APPROVED) {
            skillValidationRepository.updateStatus(cmd.validationId(), ValidationStatus.APPROVED, java.time.Instant.now());
            sendNotification.execute(validation.userId(), validation.skill(), ValidationStatus.APPROVED);
        }
    }
}
