package com.congreats.application.usecase;

import com.congreats.application.port.out.PasswordHasher;
import com.congreats.application.port.out.TokenService;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.InvalidCredentialsException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class ChangePasswordUseCase {

    @Inject UserRepository userRepository;
    @Inject PasswordHasher passwordHasher;
    @Inject TokenService tokenService;

    public record Command(UUID userId, String currentPassword, String newPassword) {}

    @Transactional
    public void execute(Command cmd) {
        if (cmd.newPassword() == null || cmd.newPassword().length() < 8) {
            throw new DomainException("Nova senha deve ter no mínimo 8 caracteres");
        }

        User user = userRepository.findById(cmd.userId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (!passwordHasher.matches(cmd.currentPassword(), user.passwordHash())) {
            throw new InvalidCredentialsException();
        }

        user.changePassword(passwordHasher.hash(cmd.newPassword()));
        userRepository.update(user);
        tokenService.revokeAllRefreshTokens(cmd.userId());
    }
}
