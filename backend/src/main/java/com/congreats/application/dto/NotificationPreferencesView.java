package com.congreats.application.dto;

import java.util.UUID;

public record NotificationPreferencesView(
        UUID userId,
        boolean emailEnabled,
        String whatsappNumber,
        boolean whatsappEnabled,
        String smsNumber,
        boolean smsEnabled
) {}
