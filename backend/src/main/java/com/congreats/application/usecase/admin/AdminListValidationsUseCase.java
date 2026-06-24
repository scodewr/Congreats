package com.congreats.application.usecase.admin;

import com.congreats.application.dto.SkillValidationView;
import com.congreats.application.port.out.QuestionnaireRepository;
import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.ValidatorAssignmentRepository;
import com.congreats.domain.model.Questionnaire;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.User;
import com.congreats.domain.model.ValidatorAssignment;
import com.congreats.domain.model.ValidationStatus;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class AdminListValidationsUseCase {

    @Inject SkillValidationRepository skillValidationRepository;
    @Inject ValidatorAssignmentRepository validatorAssignmentRepository;
    @Inject QuestionnaireRepository questionnaireRepository;
    @Inject UserRepository userRepository;

    public record Result(List<SkillValidationView> items, long total) {}

    public Result execute(ValidationStatus status, int page, int size) {
        List<SkillValidation> validations = skillValidationRepository.findByStatus(status, page, size);
        long total = skillValidationRepository.countByStatus(status);

        List<UUID> allUserIds = validations.stream()
                .flatMap(v -> {
                    List<UUID> ids = new java.util.ArrayList<>();
                    ids.add(v.userId());
                    validatorAssignmentRepository.findByValidationId(v.id())
                            .forEach(a -> ids.add(a.validatorId()));
                    return ids.stream();
                })
                .distinct().toList();

        Map<UUID, String> userNames = allUserIds.stream()
                .map(id -> userRepository.findById(id))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toMap(User::id, User::name));

        List<SkillValidationView> items = validations.stream().map(v -> {
            List<ValidatorAssignment> assignments = validatorAssignmentRepository.findByValidationId(v.id());
            List<Questionnaire> questionnaires = questionnaireRepository.findByValidationId(v.id());
            return new SkillValidationView(
                    v.id(), v.userId(), userNames.getOrDefault(v.userId(), "—"),
                    v.skill(), v.status(), v.requestedAt(), v.resolvedAt(),
                    assignments.stream().map(a -> new SkillValidationView.AssignmentView(
                            a.id(), a.validatorId(), userNames.getOrDefault(a.validatorId(), "—"), a.assignedAt()
                    )).toList(),
                    questionnaires.stream().map(q -> new SkillValidationView.QuestionnaireView(
                            q.id(), q.validatorId(), userNames.getOrDefault(q.validatorId(), "—"),
                            q.decision(), q.level(), q.level().label(), q.reasoning(), q.submittedAt()
                    )).toList()
            );
        }).toList();

        return new Result(items, total);
    }
}
