package com.congreats.application.port.out;

import com.congreats.domain.model.Workspace;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkspaceRepository {
    void save(Workspace workspace);
    Optional<Workspace> findById(UUID id);
    List<Workspace> findByMemberId(UUID userId);
    boolean isMember(UUID workspaceId, UUID userId);
    void addMember(UUID workspaceId, UUID userId);
    List<UUID> findMemberIds(UUID workspaceId);
}
