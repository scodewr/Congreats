package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AdminArchiveWorkspaceUseCase {

    @Inject WorkspaceRepository workspaceRepository;

    @Transactional
    public void execute(UUID workspaceId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new NotFoundException("Workspace não encontrado"));

        if (workspace.archived()) throw new DomainException("Workspace já está arquivado");

        workspaceRepository.archive(workspaceId);
    }
}
