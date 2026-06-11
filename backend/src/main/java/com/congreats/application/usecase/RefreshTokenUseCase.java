package com.congreats.application.usecase;

import com.congreats.application.dto.AuthTokens;
import com.congreats.application.port.out.TokenService;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.AccountInactiveException;
import com.congreats.domain.exception.InvalidTokenException;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class RefreshTokenUseCase {

    @Inject TokenService tokenService;
    @Inject UserRepository userRepository;

    @Transactional
    public AuthTokens execute(String refreshToken) {
        UUID userId = tokenService.validateAndRevokeRefreshToken(refreshToken);

        User user = userRepository.findById(userId).orElseThrow(InvalidTokenException::new);
        if (!user.active()) throw new AccountInactiveException();

        return new AuthTokens(
                tokenService.generateAccessToken(user),
                tokenService.generateRefreshToken(userId)
        );
    }
}
