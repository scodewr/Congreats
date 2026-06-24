package com.congreats.domain.model;

import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.SelfRecognitionException;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public class Recognition {

    private final UUID id;
    private final UUID recognizerId;
    private final UUID recognizedId;
    private final UUID categoryId;
    private final List<String> skills;
    private final String testimonial;
    private final UUID projectId;
    private final UUID teamId;
    private final UUID workspaceId;
    private final Instant createdAt;

    public Recognition(UUID id, UUID recognizerId, UUID recognizedId, UUID categoryId,
                       List<String> skills, String testimonial, UUID projectId, UUID teamId,
                       UUID workspaceId, Instant createdAt) {
        if (recognizerId.equals(recognizedId)) throw new SelfRecognitionException();
        if (skills == null || skills.isEmpty()) throw new DomainException("Pelo menos uma habilidade deve ser reconhecida");
        if (testimonial == null || testimonial.strip().length() < 20)
            throw new DomainException("Depoimento deve ter no mínimo 20 caracteres");

        this.id = id;
        this.recognizerId = recognizerId;
        this.recognizedId = recognizedId;
        this.categoryId = categoryId;
        this.skills = skills.stream().map(Recognition::toTitleCase).distinct().toList();
        this.testimonial = testimonial.strip();
        this.projectId = projectId;
        this.teamId = teamId;
        this.workspaceId = workspaceId;
        this.createdAt = createdAt;
    }

    public static Recognition create(UUID recognizerId, UUID recognizedId, UUID categoryId,
                                     List<String> skills, String testimonial,
                                     UUID projectId, UUID teamId, UUID workspaceId) {
        return new Recognition(UUID.randomUUID(), recognizerId, recognizedId, categoryId,
                skills, testimonial, projectId, teamId, workspaceId, Instant.now());
    }

    private static String toTitleCase(String s) {
        if (s == null || s.isBlank()) return s;
        String trimmed = s.trim();
        return Character.toUpperCase(trimmed.charAt(0)) + trimmed.substring(1).toLowerCase();
    }

    public UUID id() { return id; }
    public UUID recognizerId() { return recognizerId; }
    public UUID recognizedId() { return recognizedId; }
    public UUID categoryId() { return categoryId; }
    public List<String> skills() { return skills; }
    public String testimonial() { return testimonial; }
    public UUID projectId() { return projectId; }
    public UUID teamId() { return teamId; }
    public UUID workspaceId() { return workspaceId; }
    public Instant createdAt() { return createdAt; }
}
