package com.congreats.application.usecase;

import com.congreats.application.dto.WorkspaceView;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class CreateWorkspaceUseCase {

    @Inject WorkspaceRepository workspaceRepository;
    @Inject UserRepository userRepository;

    public record Command(UUID ownerId, String name, String description) {}

    @Transactional
    public WorkspaceView execute(Command cmd) {
        if (cmd.name() == null || cmd.name().isBlank())
            throw new DomainException("Nome do workspace é obrigatório");

        String ownerName = userRepository.findById(cmd.ownerId())
                .map(u -> u.name())
                .orElseThrow(() -> new DomainException("Usuário não encontrado"));

        Workspace workspace = Workspace.create(cmd.name().strip(), cmd.description(), cmd.ownerId());
        workspaceRepository.save(workspace);
        workspaceRepository.addMember(workspace.id(), cmd.ownerId());

        return new WorkspaceView(workspace.id(), workspace.name(), workspace.description(),
                workspace.ownerId(), ownerName, 1, false, workspace.createdAt());
    }
}
