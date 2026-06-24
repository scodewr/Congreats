package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.NotificationPreferencesRepository;
import com.congreats.domain.model.NotificationPreferences;
import com.congreats.infrastructure.entity.NotificationPreferencesEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class NotificationPreferencesRepositoryJPA implements PanacheRepository<NotificationPreferencesEntity>,
        NotificationPreferencesRepository {

    @Override
    public Optional<NotificationPreferences> findByUserId(UUID userId) {
        return find("userId", userId).firstResultOptional().map(NotificationPreferencesEntity::toDomain);
    }

    @Override
    public void save(NotificationPreferences prefs) {
        persist(NotificationPreferencesEntity.from(prefs));
    }

    @Override
    public void update(NotificationPreferences prefs) {
        find("userId", prefs.userId()).firstResultOptional().ifPresent(e -> {
            e.emailEnabled = prefs.emailEnabled();
            e.whatsappNumber = prefs.whatsappNumber();
            e.whatsappEnabled = prefs.whatsappEnabled();
            e.smsNumber = prefs.smsNumber();
            e.smsEnabled = prefs.smsEnabled();
        });
    }
}
