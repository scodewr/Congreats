package com.congreats.domain.model;

import java.util.UUID;

public record NotificationPreferences(
        UUID userId,
        boolean emailEnabled,
        String whatsappNumber,
        boolean whatsappEnabled,
        String smsNumber,
        boolean smsEnabled
) {
    public static NotificationPreferences defaultFor(UUID userId) {
        return new NotificationPreferences(userId, true, null, false, null, false);
    }
}
