package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Workspace;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "workspaces")
public class WorkspaceEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(nullable = false, length = 200)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "owner_id", nullable = false, columnDefinition = "uuid")
    public UUID ownerId;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(
            name = "workspace_members",
            joinColumns = @JoinColumn(name = "workspace_id"))
    @Column(name = "user_id", columnDefinition = "uuid")
    public List<UUID> memberIds = new ArrayList<>();

    public static WorkspaceEntity from(Workspace w) {
        WorkspaceEntity e = new WorkspaceEntity();
        e.id = w.id();
        e.name = w.name();
        e.description = w.description();
        e.ownerId = w.ownerId();
        e.createdAt = w.createdAt();
        return e;
    }

    public Workspace toDomain() {
        return new Workspace(id, name, description, ownerId, createdAt);
    }
}
