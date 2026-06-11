package com.congreats.application.usecase;

import com.congreats.application.dto.ProfileView;
import com.congreats.application.dto.RecognizedSkillView;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class GetProfileUseCase {

    @Inject UserRepository userRepository;
    @Inject ProfileRepository profileRepository;
    @Inject RecognitionRepository recognitionRepository;

    public ProfileView execute(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new NotFoundException("Profissional não encontrado"));

        Profile profile = profileRepository.findByUserId(userId)
                .orElse(Profile.createFor(userId));

        Map<String, Long> skillCounts = recognitionRepository.countSkillsByRecognizedId(userId);
        List<RecognizedSkillView> skills = skillCounts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(50)
                .map(e -> new RecognizedSkillView(e.getKey(), e.getValue()))
                .toList();

        long totalRecognitions = recognitionRepository.countByRecognizedId(userId);

        List<ProfileView.ProjectView> projects = profile.projects().stream()
                .map(p -> new ProfileView.ProjectView(p.id(), p.name(), p.description(), p.status().name()))
                .toList();

        List<ProfileView.TeamView> teams = profile.teams().stream()
                .map(t -> new ProfileView.TeamView(t.id(), t.name(), t.role()))
                .toList();

        return new ProfileView(
                user.id(), user.name(), user.email().value(),
                profile.bio(), profile.jobTitle(), profile.company(), profile.photoUrl(),
                skills, projects, teams, totalRecognitions, user.createdAt()
        );
    }
}
