package com.congreats.application.usecase.admin;

import com.congreats.application.dto.IntegrationView;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.application.port.out.IntegrationRepository;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.model.Category;
import com.congreats.domain.model.Integration;
import com.congreats.domain.model.User;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.stream.Collectors;

@ApplicationScoped
public class ListIntegrationsUseCase {

    @Inject IntegrationRepository integrationRepository;
    @Inject CategoryRepository categoryRepository;
    @Inject UserRepository userRepository;
    @Inject WorkspaceRepository workspaceRepository;

    public List<IntegrationView> execute() {
        return integrationRepository.findAllIntegrations().stream()
                .map(this::toView)
                .collect(Collectors.toList());
    }

    private IntegrationView toView(Integration i) {
        String categoryName = i.categoryId() != null
                ? categoryRepository.findById(i.categoryId()).map(Category::name).orElse(null)
                : null;
        String workspaceName = i.workspaceId() != null
                ? workspaceRepository.findById(i.workspaceId()).map(Workspace::name).orElse(null)
                : null;
        String ownerName = userRepository.findById(i.ownerId()).map(User::name).orElse(null);
        return CreateIntegrationUseCase.toView(i, categoryName, workspaceName, ownerName);
    }
}
