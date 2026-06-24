package com.congreats.application.port.out;

import com.congreats.domain.model.Integration;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface IntegrationRepository {
    Integration save(Integration integration);
    Optional<Integration> findById(UUID id);
    Optional<Integration> findByWebhookSecret(String secret);
    List<Integration> findAllIntegrations();
    List<Integration> findByOwnerId(UUID ownerId);
    void update(Integration integration);
}
