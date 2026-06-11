package com.congreats.application.usecase;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.RecognitionView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.ProfileRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Profile;
import com.congreats.domain.model.Recognition;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetRecognitionsByProfessionalUseCase {

    @Inject RecognitionRepository recognitionRepository;
    @Inject UserRepository userRepository;
    @Inject ProfileRepository profileRepository;
    @Inject CategoryRepository categoryRepository;

    public PageResult<RecognitionView> execute(UUID professionalId, int page, int size) {
        List<Recognition> recognitions = recognitionRepository.findByRecognizedId(professionalId, page, size);
        long total = recognitionRepository.countByRecognizedId(professionalId);

        Map<UUID, User> userCache = userRepository.findAll(0, 1000).stream()
                .collect(Collectors.toMap(User::id, u -> u));
        Map<UUID, Profile> profileCache = profileRepository.findByUserId(professionalId)
                .map(p -> Map.of(p.userId(), p)).orElse(Map.of());
        Map<UUID, Category> categoryCache = categoryRepository.findAllActive().stream()
                .collect(Collectors.toMap(Category::id, c -> c));

        List<RecognitionView> views = recognitions.stream()
                .map(r -> toView(r, userCache, profileCache, categoryCache))
                .toList();

        return new PageResult<>(views, total, page, size);
    }

    private RecognitionView toView(Recognition r, Map<UUID, User> users,
                                   Map<UUID, Profile> profiles, Map<UUID, Category> categories) {
        User recognizer = users.get(r.recognizerId());
        User recognized = users.get(r.recognizedId());
        Category category = categories.get(r.categoryId());

        String recognizerPhoto = Optional.ofNullable(profiles.get(r.recognizerId()))
                .map(Profile::photoUrl).orElse(null);

        return new RecognitionView(
                r.id(),
                new RecognitionView.PersonRef(recognizer != null ? recognizer.id() : r.recognizerId(),
                        recognizer != null ? recognizer.name() : "Usuário", recognizerPhoto),
                new RecognitionView.PersonRef(recognized != null ? recognized.id() : r.recognizedId(),
                        recognized != null ? recognized.name() : "Usuário", null),
                category != null ? new RecognitionView.CategoryRef(category.id(), category.name())
                        : new RecognitionView.CategoryRef(r.categoryId(), ""),
                r.skills(), r.testimonial(), r.projectId(), r.teamId(), r.createdAt()
        );
    }
}
