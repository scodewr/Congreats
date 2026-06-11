package com.congreats.infrastructure.entity;

import com.congreats.domain.model.ProfileProject;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profile_projects")
public class ProfileProjectEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    public ProfileEntity profile;

    @Column(nullable = false, length = 255)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    public ProfileProject.ProjectStatus status;

    @Column(name = "added_at", nullable = false, updatable = false)
    public Instant addedAt;

    public static ProfileProjectEntity from(ProfileProject p, ProfileEntity profile) {
        ProfileProjectEntity e = new ProfileProjectEntity();
        e.id = p.id();
        e.profile = profile;
        e.name = p.name();
        e.description = p.description();
        e.status = p.status();
        e.addedAt = p.addedAt();
        return e;
    }

    public ProfileProject toDomain() {
        return new ProfileProject(id, name, description, status, addedAt);
    }
}
