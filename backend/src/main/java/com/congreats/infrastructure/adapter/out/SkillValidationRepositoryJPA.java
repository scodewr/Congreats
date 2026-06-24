package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.SkillValidationRepository;
import com.congreats.domain.model.SkillValidation;
import com.congreats.domain.model.ValidationStatus;
import com.congreats.infrastructure.entity.SkillValidationEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class SkillValidationRepositoryJPA implements PanacheRepository<SkillValidationEntity>, SkillValidationRepository {

    @Override
    public void save(SkillValidation v) {
        persist(SkillValidationEntity.from(v));
    }

    @Override
    public Optional<SkillValidation> findById(UUID id) {
        return find("id", id).firstResultOptional().map(SkillValidationEntity::toDomain);
    }

    @Override
    public List<SkillValidation> findByUserId(UUID userId) {
        return find("userId = ?1 order by requestedAt desc", userId)
                .list().stream().map(SkillValidationEntity::toDomain).toList();
    }

    @Override
    public List<SkillValidation> findByStatus(ValidationStatus status, int page, int size) {
        return find("status = ?1 order by requestedAt asc", status)
                .page(page, size).list().stream().map(SkillValidationEntity::toDomain).toList();
    }

    @Override
    public long countByStatus(ValidationStatus status) {
        return count("status = ?1", status);
    }

    @Override
    public boolean hasActive(UUID userId, String skill) {
        return count("userId = ?1 and skill = ?2 and status in ?3",
                userId, skill, List.of(ValidationStatus.PENDING, ValidationStatus.IN_PROGRESS)) > 0;
    }

    @Override
    public void updateStatus(UUID id, ValidationStatus status, Instant resolvedAt) {
        update("status = ?1, resolvedAt = ?2 where id = ?3", status, resolvedAt, id);
    }
}
