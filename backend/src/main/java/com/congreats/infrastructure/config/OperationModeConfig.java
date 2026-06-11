package com.congreats.infrastructure.config;

import com.congreats.application.port.in.OperationMode;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class OperationModeConfig {

    @Inject
    @ConfigProperty(name = "congreats.mode", defaultValue = "WORLD")
    String rawMode;

    public OperationMode mode() {
        try {
            return OperationMode.valueOf(rawMode.toUpperCase());
        } catch (IllegalArgumentException e) {
            return OperationMode.WORLD;
        }
    }
}
