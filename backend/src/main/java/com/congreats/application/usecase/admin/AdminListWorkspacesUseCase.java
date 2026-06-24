package com.congreats.application.usecase.admin;

import com.congreats.application.dto.PageResult;
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
public class AdminListWorkspacesUseCase {

    @Inject WorkspaceRepository workspaceRepository;
    @Inject UserRepository userRepository;

    public PageResult<WorkspaceView> execute(int page, int size) {
        List<Workspace> workspaces = workspaceRepository.findAll(page, size);
        long total = workspaceRepository.countAll();

        Map<UUID, String> ownerNames = userRepository.findAll(0, 1000).stream()
                .collect(Collectors.toMap(u -> u.id(), u -> u.name()));

        List<WorkspaceView> views = workspaces.stream().map(ws -> {
            int memberCount = workspaceRepository.findMemberIds(ws.id()).size();
            String ownerName = ownerNames.getOrDefault(ws.ownerId(), "");
            return new WorkspaceView(ws.id(), ws.name(), ws.description(),
                    ws.ownerId(), ownerName, memberCount, ws.archived(), ws.createdAt());
        }).toList();

        return new PageResult<>(views, total, page, size);
    }
}
