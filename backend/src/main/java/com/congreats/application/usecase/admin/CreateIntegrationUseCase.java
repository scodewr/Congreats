package com.congreats.application.usecase.admin;

import com.congreats.application.dto.IntegrationView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.IntegrationRepository;
import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Integration;
import com.congreats.domain.model.IntegrationPlatform;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.HexFormat;
import java.util.UUID;

@ApplicationScoped
public class CreateIntegrationUseCase {

    @Inject IntegrationRepository integrationRepository;
    @Inject CategoryRepository categoryRepository;
    @Inject WorkspaceRepository workspaceRepository;

    public record Command(IntegrationPlatform platform, String name,
                          UUID categoryId, UUID workspaceId, UUID ownerId) {}

    @Transactional
    public IntegrationView execute(Command cmd) {
        String secret = generateSecret();

        Integration integration = Integration.create(
                cmd.platform(), cmd.name(), secret,
                cmd.categoryId(), cmd.workspaceId(), cmd.ownerId());

        integrationRepository.save(integration);

        String categoryName = cmd.categoryId() != null
                ? categoryRepository.findById(cmd.categoryId()).map(Category::name).orElse(null)
                : null;
        String workspaceName = cmd.workspaceId() != null
                ? workspaceRepository.findById(cmd.workspaceId()).map(Workspace::name).orElse(null)
                : null;

        return toView(integration, categoryName, workspaceName, null);
    }

    private String generateSecret() {
        byte[] bytes = new byte[32];
        new java.security.SecureRandom().nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    static IntegrationView toView(Integration i, String categoryName, String workspaceName, String ownerName) {
        return new IntegrationView(
                i.id(), i.platform().name(), i.platform().label(),
                i.name(), i.webhookSecret(),
                i.categoryId(), categoryName,
                i.workspaceId(), workspaceName,
                i.ownerId(), ownerName,
                i.active(), i.createdAt());
    }
}
