package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.CategoryRepository;
import com.congreats.domain.model.Category;
import com.congreats.infrastructure.entity.CategoryEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class CategoryRepositoryJPA implements PanacheRepository<CategoryEntity>, CategoryRepository {

    @Override
    public List<Category> findAllActive() {
        return find("active", true).list().stream().map(CategoryEntity::toDomain).toList();
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return find("id", id).firstResultOptional().map(CategoryEntity::toDomain);
    }
}
