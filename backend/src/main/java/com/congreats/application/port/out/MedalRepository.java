package com.congreats.application.port.out;

import com.congreats.domain.model.Medal;
import com.congreats.domain.model.MedalMilestone;

import java.util.List;
import java.util.UUID;

public interface MedalRepository {
    void save(Medal medal);
    List<Medal> findByUserId(UUID userId);
    boolean exists(UUID userId, MedalMilestone milestone);
}
