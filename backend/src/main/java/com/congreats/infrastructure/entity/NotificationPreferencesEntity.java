package com.congreats.infrastructure.entity;

import com.congreats.domain.model.NotificationPreferences;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.UUID;

@Entity
@Table(name = "notification_preferences")
public class NotificationPreferencesEntity extends PanacheEntityBase {

    @Id
    @Column(name = "user_id", columnDefinition = "uuid")
    public UUID userId;

    @Column(name = "email_enabled", nullable = false)
    public boolean emailEnabled;

    @Column(name = "whatsapp_number", length = 20)
    public String whatsappNumber;

    @Column(name = "whatsapp_enabled", nullable = false)
    public boolean whatsappEnabled;

    @Column(name = "sms_number", length = 20)
    public String smsNumber;

    @Column(name = "sms_enabled", nullable = false)
    public boolean smsEnabled;

    public static NotificationPreferencesEntity from(NotificationPreferences p) {
        NotificationPreferencesEntity e = new NotificationPreferencesEntity();
        e.userId = p.userId();
        e.emailEnabled = p.emailEnabled();
        e.whatsappNumber = p.whatsappNumber();
        e.whatsappEnabled = p.whatsappEnabled();
        e.smsNumber = p.smsNumber();
        e.smsEnabled = p.smsEnabled();
        return e;
    }

    public NotificationPreferences toDomain() {
        return new NotificationPreferences(userId, emailEnabled, whatsappNumber,
                whatsappEnabled, smsNumber, smsEnabled);
    }
}
