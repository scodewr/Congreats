package com.congreats.domain.model;

public enum MedalMilestone {
    FIRST(1, "Primeiro Reconhecimento"),
    FIFTH(5, "5 Reconhecimentos"),
    TENTH(10, "10 Reconhecimentos"),
    TWENTY_FIFTH(25, "25 Reconhecimentos"),
    FIFTIETH(50, "50 Reconhecimentos"),
    HUNDREDTH(100, "100 Reconhecimentos");

    private final int threshold;
    private final String label;

    MedalMilestone(int threshold, String label) {
        this.threshold = threshold;
        this.label = label;
    }

    public int threshold() { return threshold; }
    public String label() { return label; }

    public static MedalMilestone fromCount(long count) {
        MedalMilestone result = null;
        for (MedalMilestone m : values()) {
            if (count >= m.threshold) result = m;
        }
        return result;
    }
}
