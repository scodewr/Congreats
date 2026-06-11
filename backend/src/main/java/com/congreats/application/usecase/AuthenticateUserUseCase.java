package com.congreats.application.usecase;

import com.congreats.application.dto.AuthTokens;
import com.congreats.application.port.out.PasswordHasher;
import com.congreats.application.port.out.TokenService;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.AccountInactiveException;
import com.congreats.domain.exception.InvalidCredentialsException;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class AuthenticateUserUseCase {

    @Inject UserRepository userRepository;
    @Inject PasswordHasher passwordHasher;
    @Inject TokenService tokenService;

    public record Command(String email, String password) {}

    @Transactional
    public AuthTokens execute(Command cmd) {
        Email email = new Email(cmd.email());
        User user = userRepository.findByEmail(email).orElseThrow(InvalidCredentialsException::new);

        if (!passwordHasher.matches(cmd.password(), user.passwordHash())) {
            throw new InvalidCredentialsException();
        }
        if (!user.active()) throw new AccountInactiveException();

        return new AuthTokens(
                tokenService.generateAccessToken(user),
                tokenService.generateRefreshToken(user.id())
        );
    }
}
