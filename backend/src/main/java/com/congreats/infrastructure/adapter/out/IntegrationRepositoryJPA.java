package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.IntegrationRepository;
import com.congreats.domain.model.Integration;
import com.congreats.infrastructure.entity.IntegrationEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.transaction.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class IntegrationRepositoryJPA implements IntegrationRepository, PanacheRepository<IntegrationEntity> {

    @Override
    @Transactional
    public Integration save(Integration integration) {
        IntegrationEntity entity = IntegrationEntity.from(integration);
        persist(entity);
        return entity.toDomain();
    }

    @Override
    public Optional<Integration> findById(UUID id) {
        return find("id", id).firstResultOptional().map(IntegrationEntity::toDomain);
    }

    @Override
    public Optional<Integration> findByWebhookSecret(String secret) {
        return find("webhookSecret", secret).firstResultOptional().map(IntegrationEntity::toDomain);
    }

    @Override
    public List<Integration> findAllIntegrations() {
        return listAll().stream().map(IntegrationEntity::toDomain).collect(Collectors.toList());
    }

    @Override
    public List<Integration> findByOwnerId(UUID ownerId) {
        return find("ownerId", ownerId).stream().map(IntegrationEntity::toDomain).collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void update(Integration integration) {
        IntegrationEntity entity = find("id", integration.id()).firstResult();
        if (entity == null) return;
        entity.active = integration.active();
        entity.name = integration.name();
    }
}
