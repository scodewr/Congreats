package com.congreats.application.usecase;

import com.congreats.application.dto.NotificationPreferencesView;
import com.congreats.application.port.out.NotificationPreferencesRepository;
import com.congreats.domain.model.NotificationPreferences;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.UUID;

@ApplicationScoped
public class GetNotificationPreferencesUseCase {

    @Inject NotificationPreferencesRepository repository;

    public NotificationPreferencesView execute(UUID userId) {
        NotificationPreferences prefs = repository.findByUserId(userId)
                .orElse(NotificationPreferences.defaultFor(userId));
        return new NotificationPreferencesView(
                prefs.userId(), prefs.emailEnabled(),
                prefs.whatsappNumber(), prefs.whatsappEnabled(),
                prefs.smsNumber(), prefs.smsEnabled());
    }
}
