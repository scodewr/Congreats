package com.congreats.application.port.out;

import com.congreats.domain.model.Campaign;

import java.util.List;
import java.util.UUID;

public interface CampaignRepository {
    void save(Campaign campaign);
    List<Campaign> findActive();
    List<Campaign> findAll(int page, int size);
    long countAll();
}
