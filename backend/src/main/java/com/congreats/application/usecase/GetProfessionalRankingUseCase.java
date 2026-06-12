package com.congreats.application.usecase;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.ProfileView;
import com.congreats.application.dto.RecognizedSkillView;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class GetProfessionalRankingUseCase {

    @Inject RecognitionRepository recognitionRepository;
    @Inject UserRepository userRepository;
    @Inject ProfileRepository profileRepository;

    public PageResult<ProfileView> execute(int page, int size) {
        List<UUID> rankedIds = recognitionRepository.findTopRecognizedIds(page, size);
        long total = recognitionRepository.countDistinctRecognized();

        List<ProfileView> views = rankedIds.stream()
                .flatMap(userId -> userRepository.findById(userId).stream())
                .filter(User::active)
                .map(user -> buildView(user))
                .toList();

        return new PageResult<>(views, total, page, size);
    }

    private ProfileView buildView(User user) {
        Profile profile = profileRepository.findByUserId(user.id())
                .orElse(Profile.createFor(user.id()));

        Map<String, Long> skillCounts = recognitionRepository.countSkillsByRecognizedId(user.id());
        List<RecognizedSkillView> topSkills = skillCounts.entrySet().stream()
                .limit(5)
                .map(e -> new RecognizedSkillView(e.getKey(), e.getValue()))
                .toList();

        long total = recognitionRepository.countByRecognizedId(user.id());

        return new ProfileView(
                user.id(), user.name(), user.email().value(),
                profile.bio(), profile.jobTitle(), profile.company(), profile.photoUrl(),
                topSkills, List.of(), List.of(), total, user.createdAt()
        );
    }
}
