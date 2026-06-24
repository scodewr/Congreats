package com.congreats.domain.model;

public enum TrophyLevel {
    BRONZE(3, "Bronze"),
    SILVER(10, "Prata"),
    GOLD(25, "Ouro");

    private final int threshold;
    private final String label;

    TrophyLevel(int threshold, String label) {
        this.threshold = threshold;
        this.label = label;
    }

    public int threshold() { return threshold; }
    public String label() { return label; }
}
