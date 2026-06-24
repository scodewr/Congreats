package com.congreats.application.usecase;

import com.congreats.application.dto.SkillValidationView;
import com.congreats.application.port.out.QuestionnaireRepository;
import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.ValidatorAssignmentRepository;
import com.congreats.domain.model.Questionnaire;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.User;
import com.congreats.domain.model.ValidatorAssignment;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetMyValidationsUseCase {

    @Inject SkillValidationRepository skillValidationRepository;
    @Inject ValidatorAssignmentRepository validatorAssignmentRepository;
    @Inject QuestionnaireRepository questionnaireRepository;
    @Inject UserRepository userRepository;

    public List<SkillValidationView> execute(UUID userId) {
        List<SkillValidation> validations = skillValidationRepository.findByUserId(userId);

        User user = userRepository.findById(userId).orElseThrow();
        Map<UUID, String> userNames = resolveUserNames(validations);
        userNames.put(userId, user.name());

        return validations.stream()
                .map(v -> toView(v, user.name(), userNames))
                .toList();
    }

    private SkillValidationView toView(SkillValidation v, String userName, Map<UUID, String> names) {
        List<ValidatorAssignment> assignments = validatorAssignmentRepository.findByValidationId(v.id());
        List<Questionnaire> questionnaires = questionnaireRepository.findByValidationId(v.id());

        return new SkillValidationView(
                v.id(), v.userId(), userName, v.skill(), v.status(),
                v.requestedAt(), v.resolvedAt(),
                assignments.stream().map(a -> new SkillValidationView.AssignmentView(
                        a.id(), a.validatorId(), names.getOrDefault(a.validatorId(), "—"), a.assignedAt()
                )).toList(),
                questionnaires.stream().map(q -> new SkillValidationView.QuestionnaireView(
                        q.id(), q.validatorId(), names.getOrDefault(q.validatorId(), "—"),
                        q.decision(), q.level(), q.level().label(), q.reasoning(), q.submittedAt()
                )).toList()
        );
    }

    private Map<UUID, String> resolveUserNames(List<SkillValidation> validations) {
        List<UUID> validationIds = validations.stream().map(SkillValidation::id).toList();

        List<UUID> validatorIds = validationIds.stream()
                .flatMap(id -> validatorAssignmentRepository.findByValidationId(id).stream()
                        .map(ValidatorAssignment::validatorId))
                .distinct().toList();

        return validatorIds.stream()
                .map(id -> userRepository.findById(id))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toMap(User::id, User::name));
    }
}
