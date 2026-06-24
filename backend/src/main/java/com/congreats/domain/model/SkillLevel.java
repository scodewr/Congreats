package com.congreats.domain.model;

public enum SkillLevel {
    BEGINNER("Iniciante"),
    INTERMEDIATE("Intermediário"),
    ADVANCED("Avançado"),
    EXPERT("Especialista");

    private final String label;

    SkillLevel(String label) { this.label = label; }

    public String label() { return label; }
}
