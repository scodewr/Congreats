package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.PasswordHasher;
import jakarta.enterprise.context.ApplicationScoped;
import org.mindrot.jbcrypt.BCrypt;

@ApplicationScoped
public class BCryptPasswordHasher implements PasswordHasher {

    private static final int ROUNDS = 12;

    @Override
    public String hash(String plainPassword) {
        return BCrypt.hashpw(plainPassword, BCrypt.gensalt(ROUNDS));
    }

    @Override
    public boolean matches(String plainPassword, String hash) {
        return BCrypt.checkpw(plainPassword, hash);
    }
}
