package com.congreats.application.dto;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

public record ProfileView(
        UUID userId,
        String name,
        String email,
        String bio,
        String jobTitle,
        String company,
        String photoUrl,
        List<RecognizedSkillView> topSkills,
        List<ProjectView> projects,
        List<TeamView> teams,
        long totalRecognitions,
        Instant memberSince
) {
    public record ProjectView(UUID id, String name, String description, String status) {}
    public record TeamView(UUID id, String name, String role) {}
}
