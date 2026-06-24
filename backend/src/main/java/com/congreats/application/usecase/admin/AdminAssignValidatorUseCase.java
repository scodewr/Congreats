package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.ValidatorAssignmentRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidatorAssignment;
import com.congreats.domain.model.ValidationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AdminAssignValidatorUseCase {

    @Inject SkillValidationRepository skillValidationRepository;
    @Inject ValidatorAssignmentRepository validatorAssignmentRepository;
    @Inject UserRepository userRepository;

    public record Command(UUID validationId, UUID validatorId) {}

    @Transactional
    public void execute(Command cmd) {
        SkillValidation validation = skillValidationRepository.findById(cmd.validationId())
                .orElseThrow(() -> new NotFoundException("Solicitação de validação não encontrada"));

        if (validation.status() == ValidationStatus.APPROVED || validation.status() == ValidationStatus.REJECTED)
            throw new DomainException("Esta validação já foi encerrada");

        if (validation.userId().equals(cmd.validatorId()))
            throw new DomainException("O profissional não pode ser seu próprio validador");

        userRepository.findById(cmd.validatorId())
                .orElseThrow(() -> new NotFoundException("Validador não encontrado"));

        if (validatorAssignmentRepository.exists(cmd.validationId(), cmd.validatorId()))
            throw new DomainException("Este validador já está atribuído");

        validatorAssignmentRepository.save(ValidatorAssignment.assign(cmd.validationId(), cmd.validatorId()));

        if (validation.status() == ValidationStatus.PENDING)
            skillValidationRepository.updateStatus(cmd.validationId(), ValidationStatus.IN_PROGRESS, null);
    }
}
