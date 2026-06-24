package com.congreats.application.usecase.admin;

import com.congreats.application.dto.EventView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.EventRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Event;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CreateEventUseCase {

    @Inject EventRepository eventRepository;
    @Inject CategoryRepository categoryRepository;

    public record Command(String name, String description, UUID categoryId,
                          Instant startsAt, Instant endsAt) {}

    @Transactional
    public EventView execute(Command cmd) {
        Category category = categoryRepository.findById(cmd.categoryId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
        if (!category.active()) throw new DomainException("Categoria inativa");

        Event event = Event.create(cmd.name(), cmd.description(), cmd.categoryId(),
                cmd.startsAt(), cmd.endsAt());
        eventRepository.save(event);

        return new EventView(event.id(), event.name(), event.description(),
                category.id(), category.name(),
                event.startsAt(), event.endsAt(), event.isActive(), event.createdAt(), List.of());
    }
}
