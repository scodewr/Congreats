package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.IntegrationRepository;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Integration;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class DeactivateIntegrationUseCase {

    @Inject IntegrationRepository integrationRepository;

    @Transactional
    public void execute(UUID integrationId) {
        Integration integration = integrationRepository.findById(integrationId)
                .orElseThrow(() -> new NotFoundException("Integração não encontrada"));
        integrationRepository.update(integration.deactivate());
    }
}
