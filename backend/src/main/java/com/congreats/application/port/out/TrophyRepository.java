package com.congreats.application.port.out;

import com.congreats.domain.model.Trophy;
import com.congreats.domain.model.TrophyLevel;

import java.util.List;
import java.util.UUID;

public interface TrophyRepository {
    void save(Trophy trophy);
    List<Trophy> findByUserId(UUID userId);
    boolean exists(UUID userId, String skill, TrophyLevel level);
}
