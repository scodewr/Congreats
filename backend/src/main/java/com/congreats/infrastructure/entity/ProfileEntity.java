package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Profile;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "profiles")
public class ProfileEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(name = "user_id", nullable = false, unique = true, columnDefinition = "uuid")
    public UUID userId;

    @Column(columnDefinition = "TEXT")
    public String bio;

    @Column(name = "job_title", length = 150)
    public String jobTitle;

    @Column(length = 150)
    public String company;

    @Column(name = "photo_url", length = 500)
    public String photoUrl;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    public List<ProfileProjectEntity> projects;

    @OneToMany(mappedBy = "profile", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    public List<ProfileTeamEntity> teams;

    public static ProfileEntity from(Profile p) {
        ProfileEntity e = new ProfileEntity();
        e.id = p.id();
        e.userId = p.userId();
        e.bio = p.bio();
        e.jobTitle = p.jobTitle();
        e.company = p.company();
        e.photoUrl = p.photoUrl();
        e.createdAt = p.createdAt();
        return e;
    }

    public Profile toDomain() {
        return new Profile(id, userId, bio, jobTitle, company, photoUrl,
                projects == null ? List.of() : projects.stream().map(ProfileProjectEntity::toDomain).toList(),
                teams == null ? List.of() : teams.stream().map(ProfileTeamEntity::toDomain).toList(),
                createdAt);
    }
}
