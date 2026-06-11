package com.congreats.application.port.out;

import com.congreats.domain.model.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {
    List<Category> findAllActive();
    Optional<Category> findById(UUID id);
}
