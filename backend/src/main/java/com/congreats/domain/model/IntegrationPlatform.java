package com.congreats.domain.model;

public enum IntegrationPlatform {
    GITHUB("GitHub"),
    JIRA("Jira"),
    LINEAR("Linear");

    private final String label;

    IntegrationPlatform(String label) { this.label = label; }

    public String label() { return label; }
}
