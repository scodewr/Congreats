package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AdminRemoveWorkspaceMemberUseCase {

    @Inject WorkspaceRepository workspaceRepository;

    @Transactional
    public void execute(UUID workspaceId, UUID userId) {
        if (workspaceRepository.findById(workspaceId).isEmpty())
            throw new NotFoundException("Workspace não encontrado");

        if (!workspaceRepository.isMember(workspaceId, userId))
            throw new DomainException("Usuário não é membro deste workspace");

        workspaceRepository.removeMember(workspaceId, userId);
    }
}
