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
        return find("active = true", io.quarkus.panache.common.Sort.by("name"))
                .list().stream().map(CategoryEntity::toDomain).toList();
    }

    @Override
    public List<Category> searchByName(String q, int limit) {
        if (q == null || q.isBlank()) return findAllActive();
        return find("lower(name) like lower(?1) and active = true",
                io.quarkus.panache.common.Sort.by("name"), "%" + q.trim() + "%")
                .page(0, limit).list().stream().map(CategoryEntity::toDomain).toList();
    }

    @Override
    public Optional<Category> findById(UUID id) {
        return find("id", id).firstResultOptional().map(CategoryEntity::toDomain);
    }

    @Override
    public Optional<Category> findByNameIgnoreCase(String name) {
        return find("lower(name) = lower(?1) and active = true", name.trim())
                .firstResultOptional().map(CategoryEntity::toDomain);
    }

    @Override
    public void save(Category category) {
        persist(CategoryEntity.from(category));
    }
}
