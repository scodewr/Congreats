package com.congreats.application.usecase;

import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.TrophyRepository;
import com.congreats.domain.model.Trophy;
import com.congreats.domain.model.TrophyLevel;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class UpdateTrophyProgressUseCase {

    @Inject RecognitionRepository recognitionRepository;
    @Inject TrophyRepository trophyRepository;

    @Transactional
    public void execute(UUID recognizedUserId, List<String> skills) {
        Map<String, Long> skillCounts = recognitionRepository.countSkillsByRecognizedId(recognizedUserId);

        for (String skill : skills) {
            long count = skillCounts.getOrDefault(skill, 0L);

            for (TrophyLevel level : TrophyLevel.values()) {
                if (count >= level.threshold() && !trophyRepository.exists(recognizedUserId, skill, level)) {
                    trophyRepository.save(Trophy.award(recognizedUserId, skill, level));
                }
            }
        }
    }
}
