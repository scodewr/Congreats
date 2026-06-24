package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.TrophyRepository;
import com.congreats.domain.model.Trophy;
import com.congreats.domain.model.TrophyLevel;
import com.congreats.infrastructure.entity.TrophyEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class TrophyRepositoryJPA implements PanacheRepository<TrophyEntity>, TrophyRepository {

    @Override
    public void save(Trophy trophy) {
        persist(TrophyEntity.from(trophy));
    }

    @Override
    public List<Trophy> findByUserId(UUID userId) {
        return find("userId = ?1 order by level desc, skill asc", userId)
                .list().stream().map(TrophyEntity::toDomain).toList();
    }

    @Override
    public boolean exists(UUID userId, String skill, TrophyLevel level) {
        return count("userId = ?1 and skill = ?2 and level = ?3", userId, skill, level) > 0;
    }
}
