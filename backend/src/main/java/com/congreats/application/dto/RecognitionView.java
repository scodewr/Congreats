package com.congreats.application.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record RecognitionView(
        UUID id,
        PersonRef recognizer,
        PersonRef recognized,
        CategoryRef category,
        List<String> skills,
        String testimonial,
        UUID projectId,
        UUID teamId,
        Instant createdAt
) {
    public record PersonRef(UUID userId, String name, String photoUrl) {}
    public record CategoryRef(UUID id, String name) {}
}
