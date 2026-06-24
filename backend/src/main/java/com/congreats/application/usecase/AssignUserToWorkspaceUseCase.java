package com.congreats.application.usecase;

import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.ForbiddenException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AssignUserToWorkspaceUseCase {

    @Inject WorkspaceRepository workspaceRepository;
    @Inject UserRepository userRepository;

    @Transactional
    public void execute(UUID requesterId, UUID workspaceId, UUID targetUserId) {
        Workspace workspace = workspaceRepository.findById(workspaceId)
                .orElseThrow(() -> new NotFoundException("Workspace não encontrado"));

        if (!workspace.ownerId().equals(requesterId))
            throw new ForbiddenException("Apenas o dono do workspace pode adicionar membros");

        userRepository.findById(targetUserId)
                .filter(u -> u.active())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado ou inativo"));

        if (workspaceRepository.isMember(workspaceId, targetUserId))
            throw new DomainException("Usuário já é membro deste workspace");

        workspaceRepository.addMember(workspaceId, targetUserId);
    }
}
