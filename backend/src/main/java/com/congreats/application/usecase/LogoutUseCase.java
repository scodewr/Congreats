package com.congreats.application.usecase;

import com.congreats.application.port.out.TokenService;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class LogoutUseCase {

    @Inject TokenService tokenService;

    @Transactional
    public void execute(String refreshToken) {
        tokenService.validateAndRevokeRefreshToken(refreshToken);
    }
}
