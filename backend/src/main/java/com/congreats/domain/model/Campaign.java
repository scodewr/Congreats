package com.congreats.domain.model;

import com.congreats.domain.exception.DomainException;

import java.time.Instant;
import java.util.UUID;

public record Campaign(
        UUID id,
        String name,
        String description,
        UUID categoryId,
        Instant startsAt,
        Instant endsAt,
        Instant createdAt
) {
    public static Campaign create(String name, String description, UUID categoryId,
                                  Instant startsAt, Instant endsAt) {
        if (name == null || name.isBlank()) throw new DomainException("Nome da campanha é obrigatório");
        if (categoryId == null) throw new DomainException("Categoria é obrigatória");
        if (startsAt == null || endsAt == null) throw new DomainException("Período é obrigatório");
        if (!endsAt.isAfter(startsAt)) throw new DomainException("Data de fim deve ser após a data de início");
        return new Campaign(UUID.randomUUID(), name.strip(), description, categoryId,
                startsAt, endsAt, Instant.now());
    }

    public boolean isActive() {
        Instant now = Instant.now();
        return !now.isBefore(startsAt) && now.isBefore(endsAt);
    }
}
