package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Category;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "categories")
public class CategoryEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(nullable = false, unique = true, length = 100)
    public String name;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(nullable = false)
    public boolean active;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "category_suggested_skills",
            joinColumns = @JoinColumn(name = "category_id"))
    @Column(name = "skill", length = 100)
    public List<String> suggestedSkills;

    public static CategoryEntity from(Category c) {
        CategoryEntity e = new CategoryEntity();
        e.id = c.id();
        e.name = c.name();
        e.description = c.description();
        e.active = c.active();
        e.suggestedSkills = new java.util.ArrayList<>(c.suggestedSkills());
        return e;
    }

    public Category toDomain() {
        return new Category(id, name, description,
                suggestedSkills != null ? suggestedSkills : List.of(), active);
    }
}
