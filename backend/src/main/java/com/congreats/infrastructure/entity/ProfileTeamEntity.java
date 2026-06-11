package com.congreats.infrastructure.entity;

import com.congreats.domain.model.ProfileTeam;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "profile_teams")
public class ProfileTeamEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "profile_id", nullable = false)
    public ProfileEntity profile;

    @Column(nullable = false, length = 255)
    public String name;

    @Column(length = 255)
    public String role;

    @Column(name = "added_at", nullable = false, updatable = false)
    public Instant addedAt;

    public static ProfileTeamEntity from(ProfileTeam t, ProfileEntity profile) {
        ProfileTeamEntity e = new ProfileTeamEntity();
        e.id = t.id();
        e.profile = profile;
        e.name = t.name();
        e.role = t.role();
        e.addedAt = t.addedAt();
        return e;
    }

    public ProfileTeam toDomain() {
        return new ProfileTeam(id, name, role, addedAt);
    }
}
