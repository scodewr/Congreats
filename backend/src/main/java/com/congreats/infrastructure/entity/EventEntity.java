package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Event;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "events")
public class EventEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(nullable = false, length = 200)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "category_id", nullable = false, columnDefinition = "uuid")
    public UUID categoryId;

    @Column(name = "starts_at", nullable = false)
    public Instant startsAt;

    @Column(name = "ends_at", nullable = false)
    public Instant endsAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    public static EventEntity from(Event ev) {
        EventEntity e = new EventEntity();
        e.id = ev.id();
        e.name = ev.name();
        e.description = ev.description();
        e.categoryId = ev.categoryId();
        e.startsAt = ev.startsAt();
        e.endsAt = ev.endsAt();
        e.createdAt = ev.createdAt();
        return e;
    }

    public Event toDomain() {
        return new Event(id, name, description, categoryId, startsAt, endsAt, createdAt);
    }
}
