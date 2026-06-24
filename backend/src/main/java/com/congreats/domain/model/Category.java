package com.congreats.domain.model;

import java.util.List;
import java.util.UUID;

public class Category {

    private final UUID id;
    private final String name;
    private final String description;
    private final List<String> suggestedSkills;
    private final boolean active;

    public Category(UUID id, String name, String description, List<String> suggestedSkills, boolean active) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.suggestedSkills = suggestedSkills != null ? List.copyOf(suggestedSkills) : List.of();
        this.active = active;
    }

    public UUID id() { return id; }
    public String name() { return name; }
    public String description() { return description; }
    public List<String> suggestedSkills() { return suggestedSkills; }
    public boolean active() { return active; }

    public static Category create(String name) {
        return new Category(java.util.UUID.randomUUID(), name.trim(), null, List.of(), true);
    }
}
