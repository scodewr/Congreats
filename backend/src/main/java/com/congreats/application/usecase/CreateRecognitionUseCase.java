package com.congreats.application.usecase;

import com.congreats.application.dto.RecognitionView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.RecognitionRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Recognition;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class CreateRecognitionUseCase {

    @Inject RecognitionRepository recognitionRepository;
    @Inject UserRepository userRepository;
    @Inject CategoryRepository categoryRepository;

    public record Command(UUID recognizerId, UUID recognizedId, UUID categoryId,
                          List<String> skills, String testimonial,
                          UUID projectId, UUID teamId) {}

    @Transactional
    public RecognitionView execute(Command cmd) {
        User recognized = userRepository.findById(cmd.recognizedId())
                .orElseThrow(() -> new NotFoundException("Profissional não encontrado"));
        if (!recognized.active()) throw new DomainException("Profissional inativo");

        User recognizer = userRepository.findById(cmd.recognizerId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Category category = categoryRepository.findById(cmd.categoryId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
        if (!category.active()) throw new DomainException("Categoria inativa");

        Recognition recognition = Recognition.create(
                cmd.recognizerId(), cmd.recognizedId(), cmd.categoryId(),
                cmd.skills(), cmd.testimonial(), cmd.projectId(), cmd.teamId()
        );
        recognitionRepository.save(recognition);

        return toView(recognition, recognizer, recognized, category);
    }

    private RecognitionView toView(Recognition r, User recognizer, User recognized, Category category) {
        return new RecognitionView(
                r.id(),
                new RecognitionView.PersonRef(recognizer.id(), recognizer.name(), null),
                new RecognitionView.PersonRef(recognized.id(), recognized.name(), null),
                new RecognitionView.CategoryRef(category.id(), category.name()),
                r.skills(), r.testimonial(), r.projectId(), r.teamId(), r.createdAt()
        );
    }
}
