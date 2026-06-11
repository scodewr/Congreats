package com.congreats.application.port.out;

public interface PasswordHasher {
    String hash(String plainPassword);
    boolean matches(String plainPassword, String hash);
}
