package com.congreats.application.usecase;

import com.congreats.application.dto.NotificationPreferencesView;
import com.congreats.application.port.out.NotificationPreferencesRepository;
import com.congreats.domain.model.NotificationPreferences;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class UpdateNotificationPreferencesUseCase {

    @Inject NotificationPreferencesRepository repository;

    public record Command(UUID userId, boolean emailEnabled,
                          String whatsappNumber, boolean whatsappEnabled,
                          String smsNumber, boolean smsEnabled) {}

    @Transactional
    public NotificationPreferencesView execute(Command cmd) {
        NotificationPreferences prefs = new NotificationPreferences(
                cmd.userId(), cmd.emailEnabled(),
                cmd.whatsappNumber(), cmd.whatsappEnabled(),
                cmd.smsNumber(), cmd.smsEnabled());

        boolean exists = repository.findByUserId(cmd.userId()).isPresent();
        if (exists) {
            repository.update(prefs);
        } else {
            repository.save(prefs);
        }

        return new NotificationPreferencesView(
                prefs.userId(), prefs.emailEnabled(),
                prefs.whatsappNumber(), prefs.whatsappEnabled(),
                prefs.smsNumber(), prefs.smsEnabled());
    }
}
