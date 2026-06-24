package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.WorkspaceRepository;
import com.congreats.domain.model.Workspace;
import com.congreats.infrastructure.entity.WorkspaceEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class WorkspaceRepositoryJPA implements PanacheRepository<WorkspaceEntity>, WorkspaceRepository {

    @Override
    public void save(Workspace workspace) {
        persist(WorkspaceEntity.from(workspace));
    }

    @Override
    public Optional<Workspace> findById(UUID id) {
        return find("id", id).firstResultOptional().map(WorkspaceEntity::toDomain);
    }

    @Override
    public List<Workspace> findByMemberId(UUID userId) {
        return find("?1 member of memberIds", userId)
                .list().stream().map(WorkspaceEntity::toDomain).toList();
    }

    @Override
    public boolean isMember(UUID workspaceId, UUID userId) {
        return find("id = ?1 and ?2 member of memberIds", workspaceId, userId).count() > 0;
    }

    @Override
    public void addMember(UUID workspaceId, UUID userId) {
        find("id", workspaceId).firstResultOptional()
                .ifPresent(ws -> {
                    if (!ws.memberIds.contains(userId)) {
                        ws.memberIds.add(userId);
                    }
                });
    }

    @Override
    public List<UUID> findMemberIds(UUID workspaceId) {
        return find("id", workspaceId).firstResultOptional()
                .map(ws -> List.copyOf(ws.memberIds))
                .orElse(List.of());
    }
}
