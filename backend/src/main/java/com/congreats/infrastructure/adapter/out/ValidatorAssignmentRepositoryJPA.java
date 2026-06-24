package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.ValidatorAssignmentRepository;
import com.congreats.domain.model.ValidatorAssignment;
import com.congreats.infrastructure.entity.ValidatorAssignmentEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class ValidatorAssignmentRepositoryJPA implements PanacheRepository<ValidatorAssignmentEntity>, ValidatorAssignmentRepository {

    @Override
    public void save(ValidatorAssignment a) {
        persist(ValidatorAssignmentEntity.from(a));
    }

    @Override
    public List<ValidatorAssignment> findByValidationId(UUID validationId) {
        return find("validationId = ?1 order by assignedAt asc", validationId)
                .list().stream().map(ValidatorAssignmentEntity::toDomain).toList();
    }

    @Override
    public List<ValidatorAssignment> findByValidatorId(UUID validatorId) {
        return find("validatorId = ?1 order by assignedAt desc", validatorId)
                .list().stream().map(ValidatorAssignmentEntity::toDomain).toList();
    }

    @Override
    public boolean exists(UUID validationId, UUID validatorId) {
        return count("validationId = ?1 and validatorId = ?2", validationId, validatorId) > 0;
    }
}
