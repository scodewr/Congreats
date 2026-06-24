package com.congreats.application.port.out;

import com.congreats.domain.model.Event;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface EventRepository {
    void save(Event event);
    Optional<Event> findById(UUID id);
    List<Event> findActive();
    List<Event> findAll(int page, int size);
    long countAll();
}
