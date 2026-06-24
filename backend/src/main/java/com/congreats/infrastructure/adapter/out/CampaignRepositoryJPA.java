package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.CampaignRepository;
import com.congreats.domain.model.Campaign;
import com.congreats.infrastructure.entity.CampaignEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.time.Instant;
import java.util.List;

@ApplicationScoped
public class CampaignRepositoryJPA implements PanacheRepository<CampaignEntity>, CampaignRepository {

    @Override
    public void save(Campaign campaign) {
        persist(CampaignEntity.from(campaign));
    }

    @Override
    public List<Campaign> findActive() {
        Instant now = Instant.now();
        return find("startsAt <= ?1 and endsAt > ?1 order by startsAt asc", now)
                .list().stream().map(CampaignEntity::toDomain).toList();
    }

    @Override
    public List<Campaign> findAll(int page, int size) {
        return findAll().page(page, size).list().stream().map(CampaignEntity::toDomain).toList();
    }

    @Override
    public long countAll() {
        return count();
    }
}
