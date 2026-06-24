package com.congreats.application.usecase;

import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.model.SkillValidation;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class RequestSkillValidationUseCase {

    @Inject SkillValidationRepository skillValidationRepository;
    @Inject RecognitionRepository recognitionRepository;

    public record Command(UUID userId, String skill) {}

    @Transactional
    public void execute(Command cmd) {
        long count = recognitionRepository.countSkillsByRecognizedId(cmd.userId())
                .getOrDefault(cmd.skill(), 0L);
        if (count == 0)
            throw new DomainException("Você não possui reconhecimentos para a habilidade: " + cmd.skill());

        if (skillValidationRepository.hasActive(cmd.userId(), cmd.skill()))
            throw new DomainException("Já existe uma solicitação ativa para esta habilidade");

        skillValidationRepository.save(SkillValidation.request(cmd.userId(), cmd.skill()));
    }
}
