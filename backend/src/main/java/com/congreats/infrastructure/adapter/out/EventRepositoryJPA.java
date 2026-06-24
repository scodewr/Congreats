package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.EventRepository;
import com.congreats.domain.model.Event;
import com.congreats.infrastructure.entity.EventEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class EventRepositoryJPA implements PanacheRepository<EventEntity>, EventRepository {

    @Override
    public void save(Event event) {
        persist(EventEntity.from(event));
    }

    @Override
    public Optional<Event> findById(UUID id) {
        return find("id", id).firstResultOptional().map(EventEntity::toDomain);
    }

    @Override
    public List<Event> findActive() {
        Instant now = Instant.now();
        return find("startsAt <= ?1 and endsAt > ?1 order by startsAt asc", now)
                .list().stream().map(EventEntity::toDomain).toList();
    }

    @Override
    public List<Event> findAll(int page, int size) {
        return findAll().page(page, size).list().stream().map(EventEntity::toDomain).toList();
    }

    @Override
    public long countAll() {
        return count();
    }
}
