package com.congreats.application.port.out;

import com.congreats.domain.model.Profile;

import java.util.Optional;
import java.util.UUID;

public interface ProfileRepository {
    void save(Profile profile);
    void update(Profile profile);
    Optional<Profile> findByUserId(UUID userId);
}
