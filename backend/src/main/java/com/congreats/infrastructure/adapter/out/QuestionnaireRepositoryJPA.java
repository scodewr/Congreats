package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.QuestionnaireRepository;
import com.congreats.domain.model.Questionnaire;
import com.congreats.infrastructure.entity.QuestionnaireEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class QuestionnaireRepositoryJPA implements PanacheRepository<QuestionnaireEntity>, QuestionnaireRepository {

    @Override
    public void save(Questionnaire q) {
        persist(QuestionnaireEntity.from(q));
    }

    @Override
    public List<Questionnaire> findByValidationId(UUID validationId) {
        return find("validationId = ?1 order by submittedAt asc", validationId)
                .list().stream().map(QuestionnaireEntity::toDomain).toList();
    }

    @Override
    public boolean existsByValidationAndValidator(UUID validationId, UUID validatorId) {
        return count("validationId = ?1 and validatorId = ?2", validationId, validatorId) > 0;
    }
}
