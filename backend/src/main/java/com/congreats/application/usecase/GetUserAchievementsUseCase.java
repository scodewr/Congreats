package com.congreats.application.usecase;

import com.congreats.application.dto.AchievementsView;
import com.congreats.application.port.out.MedalRepository;
import com.congreats.application.port.out.TrophyRepository;
import com.congreats.domain.model.Medal;
import com.congreats.domain.model.Trophy;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class GetUserAchievementsUseCase {

    @Inject MedalRepository medalRepository;
    @Inject TrophyRepository trophyRepository;

    public AchievementsView execute(UUID userId) {
        Instant sevenDaysAgo = Instant.now().minus(7, ChronoUnit.DAYS);

        List<AchievementsView.MedalView> medals = medalRepository.findByUserId(userId).stream()
                .map(m -> toMedalView(m, sevenDaysAgo))
                .toList();

        List<AchievementsView.TrophyView> trophies = trophyRepository.findByUserId(userId).stream()
                .map(t -> toTrophyView(t, sevenDaysAgo))
                .toList();

        return new AchievementsView(medals, trophies);
    }

    private AchievementsView.MedalView toMedalView(Medal m, Instant sevenDaysAgo) {
        return new AchievementsView.MedalView(
                m.id(), m.milestone(), m.milestone().label(),
                m.awardedAt(), m.awardedAt().isAfter(sevenDaysAgo));
    }

    private AchievementsView.TrophyView toTrophyView(Trophy t, Instant sevenDaysAgo) {
        return new AchievementsView.TrophyView(
                t.id(), t.skill(), t.level(), t.level().label(),
                t.awardedAt(), t.awardedAt().isAfter(sevenDaysAgo));
    }
}
