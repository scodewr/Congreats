package com.congreats.application.usecase;

import com.congreats.application.dto.ProfileView;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Optional;

@ApplicationScoped
public class SearchUsersUseCase {

    @Inject UserRepository userRepository;
    @Inject ProfileRepository profileRepository;

    public List<ProfileView> execute(String q, int page, int size) {
        return userRepository.searchByName(q, page, size).stream()
                .map(u -> {
                    Optional<Profile> profile = profileRepository.findByUserId(u.id());
                    return new ProfileView(u.id(), u.name(), u.email().value(),
                            profile.map(Profile::bio).orElse(null),
                            profile.map(Profile::jobTitle).orElse(null),
                            profile.map(Profile::company).orElse(null),
                            profile.map(Profile::photoUrl).orElse(null),
                            List.of(), List.of(), List.of(), 0L, u.createdAt());
                })
                .toList();
    }
}
