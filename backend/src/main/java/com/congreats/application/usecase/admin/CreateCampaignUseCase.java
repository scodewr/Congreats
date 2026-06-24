package com.congreats.application.usecase.admin;

import com.congreats.application.dto.CampaignView;
import com.congreats.application.port.out.CampaignRepository;
import com.congreats.application.port.out.CategoryRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Campaign;
import com.congreats.domain.model.Category;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.time.Instant;
import java.util.UUID;

@ApplicationScoped
public class CreateCampaignUseCase {

    @Inject CampaignRepository campaignRepository;
    @Inject CategoryRepository categoryRepository;

    public record Command(String name, String description, UUID categoryId,
                          Instant startsAt, Instant endsAt) {}

    @Transactional
    public CampaignView execute(Command cmd) {
        Category category = categoryRepository.findById(cmd.categoryId())
                .orElseThrow(() -> new NotFoundException("Categoria não encontrada"));
        if (!category.active()) throw new DomainException("Categoria inativa");

        Campaign campaign = Campaign.create(cmd.name(), cmd.description(), cmd.categoryId(),
                cmd.startsAt(), cmd.endsAt());
        campaignRepository.save(campaign);

        return new CampaignView(campaign.id(), campaign.name(), campaign.description(),
                category.id(), category.name(),
                campaign.startsAt(), campaign.endsAt(), campaign.isActive(), campaign.createdAt());
    }
}
