package com.congreats.application.usecase;

import com.congreats.application.dto.ProfileView;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.ForbiddenException;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.ProfileProject;
import com.congreats.domain.model.ProfileTeam;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UpdateProfileUseCase {

    @Inject ProfileRepository profileRepository;
    @Inject GetProfileUseCase getProfileUseCase;

    public record ProjectInput(String name, String description, String status) {}
    public record TeamInput(String name, String role) {}
    public record Command(UUID requestingUserId, UUID targetUserId, String bio,
                          String jobTitle, String company,
                          List<ProjectInput> projects, List<TeamInput> teams) {}

    @Transactional
    public ProfileView execute(Command cmd) {
        if (!cmd.requestingUserId().equals(cmd.targetUserId())) {
            throw new ForbiddenException("Você só pode editar o próprio perfil");
        }

        Optional<Profile> existing = profileRepository.findByUserId(cmd.targetUserId());
        Profile profile = existing.orElse(Profile.createFor(cmd.targetUserId()));

        List<ProfileProject> projects = cmd.projects() == null ? List.of() :
                cmd.projects().stream()
                        .filter(p -> p.name() != null && !p.name().isBlank())
                        .map(p -> ProfileProject.create(p.name(), p.description(),
                                ProfileProject.ProjectStatus.valueOf(p.status() != null ? p.status() : "ACTIVE")))
                        .toList();

        List<ProfileTeam> teams = cmd.teams() == null ? List.of() :
                cmd.teams().stream()
                        .filter(t -> t.name() != null && !t.name().isBlank())
                        .map(t -> ProfileTeam.create(t.name(), t.role()))
                        .toList();

        profile.update(cmd.bio(), cmd.jobTitle(), cmd.company(), projects, teams);

        if (existing.isPresent()) {
            profileRepository.update(profile);
        } else {
            profileRepository.save(profile);
        }

        return getProfileUseCase.execute(cmd.targetUserId());
    }
}
