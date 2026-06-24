package com.congreats.application.usecase;

import com.congreats.application.port.out.MedalRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.domain.model.Medal;
import com.congreats.domain.model.MedalMilestone;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AwardMedalUseCase {

    @Inject RecognitionRepository recognitionRepository;
    @Inject MedalRepository medalRepository;

    @Transactional
    public void execute(UUID recognizedUserId) {
        long total = recognitionRepository.countByRecognizedId(recognizedUserId);

        for (MedalMilestone milestone : MedalMilestone.values()) {
            if (total >= milestone.threshold() && !medalRepository.exists(recognizedUserId, milestone)) {
                medalRepository.save(Medal.award(recognizedUserId, milestone));
            }
        }
    }
}
