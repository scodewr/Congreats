package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.MedalRepository;
import com.congreats.domain.model.Medal;
import com.congreats.domain.model.MedalMilestone;
import com.congreats.infrastructure.entity.MedalEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.UUID;

@ApplicationScoped
public class MedalRepositoryJPA implements PanacheRepository<MedalEntity>, MedalRepository {

    @Override
    public void save(Medal medal) {
        persist(MedalEntity.from(medal));
    }

    @Override
    public List<Medal> findByUserId(UUID userId) {
        return find("userId = ?1 order by awardedAt desc", userId)
                .list().stream().map(MedalEntity::toDomain).toList();
    }

    @Override
    public boolean exists(UUID userId, MedalMilestone milestone) {
        return count("userId = ?1 and milestone = ?2", userId, milestone) > 0;
    }
}
