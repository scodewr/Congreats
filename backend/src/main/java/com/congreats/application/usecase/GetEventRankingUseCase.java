package com.congreats.application.usecase;

import com.congreats.application.dto.EventView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.EventRepository;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Event;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@ApplicationScoped
public class GetEventRankingUseCase {

    @Inject EventRepository eventRepository;
    @Inject RecognitionRepository recognitionRepository;
    @Inject UserRepository userRepository;
    @Inject ProfileRepository profileRepository;
    @Inject CategoryRepository categoryRepository;

    public EventView execute(UUID eventId) {
        Event event = eventRepository.findById(eventId)
                .orElseThrow(() -> new NotFoundException("Evento não encontrado"));

        String categoryName = categoryRepository.findById(event.categoryId())
                .map(Category::name).orElse("");

        Map<UUID, Long> counts = recognitionRepository.countByRecognizedForEvent(
                event.categoryId(), event.startsAt(), event.endsAt());

        List<EventView.RankingEntry> ranking = new ArrayList<>();
        for (Map.Entry<UUID, Long> entry : counts.entrySet()) {
            UUID userId = entry.getKey();
            String name = userRepository.findById(userId).map(User::name).orElse("Usuário");
            String photo = profileRepository.findByUserId(userId).map(Profile::photoUrl).orElse(null);
            ranking.add(new EventView.RankingEntry(userId, name, photo, entry.getValue()));
        }

        return new EventView(event.id(), event.name(), event.description(),
                event.categoryId(), categoryName,
                event.startsAt(), event.endsAt(), event.isActive(), event.createdAt(), ranking);
    }
}
