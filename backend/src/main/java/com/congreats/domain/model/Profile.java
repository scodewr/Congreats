package com.congreats.domain.model;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Profile {

    private final UUID id;
    private final UUID userId;
    private String bio;
    private String jobTitle;
    private String company;
    private String photoUrl;
    private List<ProfileProject> projects;
    private List<ProfileTeam> teams;
    private final Instant createdAt;

    public Profile(UUID id, UUID userId, String bio, String jobTitle, String company,
                   String photoUrl, List<ProfileProject> projects, List<ProfileTeam> teams, Instant createdAt) {
        this.id = id;
        this.userId = userId;
        this.bio = bio;
        this.jobTitle = jobTitle;
        this.company = company;
        this.photoUrl = photoUrl;
        this.projects = projects != null ? new ArrayList<>(projects) : new ArrayList<>();
        this.teams = teams != null ? new ArrayList<>(teams) : new ArrayList<>();
        this.createdAt = createdAt;
    }

    public static Profile createFor(UUID userId) {
        return new Profile(UUID.randomUUID(), userId, null, null, null, null, List.of(), List.of(), Instant.now());
    }

    public void update(String bio, String jobTitle, String company,
                       List<ProfileProject> projects, List<ProfileTeam> teams) {
        this.bio = bio;
        this.jobTitle = jobTitle;
        this.company = company;
        this.projects = projects != null ? new ArrayList<>(projects) : new ArrayList<>();
        this.teams = teams != null ? new ArrayList<>(teams) : new ArrayList<>();
    }

    public void updatePhoto(String photoUrl) {
        this.photoUrl = photoUrl;
    }

    public UUID id() { return id; }
    public UUID userId() { return userId; }
    public String bio() { return bio; }
    public String jobTitle() { return jobTitle; }
    public String company() { return company; }
    public String photoUrl() { return photoUrl; }
    public List<ProfileProject> projects() { return List.copyOf(projects); }
    public List<ProfileTeam> teams() { return List.copyOf(teams); }
    public Instant createdAt() { return createdAt; }
}
