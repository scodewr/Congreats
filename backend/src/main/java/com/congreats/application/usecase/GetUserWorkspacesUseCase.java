package com.congreats.application.usecase;

import com.congreats.application.dto.WorkspaceView;
import com.congreats.application.port.out.UserRepository;
import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.model.Workspace;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetUserWorkspacesUseCase {

    @Inject WorkspaceRepository workspaceRepository;
    @Inject UserRepository userRepository;

    public List<WorkspaceView> execute(UUID userId) {
        List<Workspace> workspaces = workspaceRepository.findByMemberId(userId);

        Map<UUID, String> ownerNames = userRepository.findAll(0, 1000).stream()
                .collect(Collectors.toMap(u -> u.id(), u -> u.name()));

        return workspaces.stream().map(ws -> {
            int memberCount = workspaceRepository.findMemberIds(ws.id()).size();
            String ownerName = ownerNames.getOrDefault(ws.ownerId(), "");
            return new WorkspaceView(ws.id(), ws.name(), ws.description(),
                    ws.ownerId(), ownerName, memberCount, ws.createdAt());
        }).toList();
    }
}
