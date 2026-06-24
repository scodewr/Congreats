package com.congreats.application.port.out;

import com.congreats.domain.model.Category;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface CategoryRepository {
    List<Category> findAllActive();
    List<Category> searchByName(String q, int limit);
    Optional<Category> findById(UUID id);
    Optional<Category> findByNameIgnoreCase(String name);
    void save(Category category);
}
