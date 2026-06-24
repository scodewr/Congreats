package com.congreats.application.usecase;

import com.congreats.application.dto.CampaignView;
import com.congreats.application.port.out.CampaignRepository;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.domain.model.Category;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class GetActiveCampaignsUseCase {

    @Inject CampaignRepository campaignRepository;
    @Inject CategoryRepository categoryRepository;

    public List<CampaignView> execute() {
        Map<UUID, String> categoryNames = categoryRepository.findAllActive().stream()
                .collect(Collectors.toMap(Category::id, Category::name));

        return campaignRepository.findActive().stream()
                .map(c -> new CampaignView(c.id(), c.name(), c.description(),
                        c.categoryId(), categoryNames.getOrDefault(c.categoryId(), ""),
                        c.startsAt(), c.endsAt(), true, c.createdAt()))
                .toList();
    }
}
