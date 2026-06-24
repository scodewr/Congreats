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
import java.util.stream.Collectors;

@ApplicationScoped
public class GetMyAssignmentsUseCase {

    @Inject ValidatorAssignmentRepository validatorAssignmentRepository;
    @Inject SkillValidationRepository skillValidationRepository;
    @Inject QuestionnaireRepository questionnaireRepository;
    @Inject UserRepository userRepository;

    public List<SkillValidationView> execute(UUID validatorId) {
        List<ValidatorAssignment> assignments = validatorAssignmentRepository.findByValidatorId(validatorId);

        List<UUID> validationIds = assignments.stream().map(ValidatorAssignment::validationId).toList();

        Map<UUID, SkillValidation> validationMap = validationIds.stream()
                .map(skillValidationRepository::findById)
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toMap(SkillValidation::id, v -> v));

        List<UUID> userIds = validationMap.values().stream().map(SkillValidation::userId).distinct().toList();
        Map<UUID, String> userNames = userIds.stream()
                .map(id -> userRepository.findById(id))
                .filter(java.util.Optional::isPresent)
                .map(java.util.Optional::get)
                .collect(Collectors.toMap(User::id, User::name));

        return validationIds.stream()
                .filter(validationMap::containsKey)
                .map(id -> {
                    SkillValidation v = validationMap.get(id);
                    List<ValidatorAssignment> allAssignments = validatorAssignmentRepository.findByValidationId(id);
                    List<Questionnaire> questionnaires = questionnaireRepository.findByValidationId(id);

                    return new SkillValidationView(
                            v.id(), v.userId(), userNames.getOrDefault(v.userId(), "—"),
                            v.skill(), v.status(), v.requestedAt(), v.resolvedAt(),
                            allAssignments.stream().map(a -> new SkillValidationView.AssignmentView(
                                    a.id(), a.validatorId(), userNames.getOrDefault(a.validatorId(), "—"), a.assignedAt()
                            )).toList(),
                            questionnaires.stream().map(q -> new SkillValidationView.QuestionnaireView(
                                    q.id(), q.validatorId(), userNames.getOrDefault(q.validatorId(), "—"),
                                    q.decision(), q.level(), q.level().label(), q.reasoning(), q.submittedAt()
                            )).toList()
                    );
                }).toList();
    }
}
