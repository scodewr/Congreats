package com.congreats.application.port.out;

import com.congreats.domain.model.NotificationPreferences;

import java.util.Optional;
import java.util.UUID;

public interface NotificationPreferencesRepository {
    Optional<NotificationPreferences> findByUserId(UUID userId);
    void save(NotificationPreferences prefs);
    void update(NotificationPreferences prefs);
}
