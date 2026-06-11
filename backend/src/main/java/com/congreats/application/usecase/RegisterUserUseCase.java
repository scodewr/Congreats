package com.congreats.application.usecase;

import com.congreats.application.dto.AuthTokens;
import com.congreats.application.port.in.OperationMode;
import com.congreats.application.port.out.PasswordHasher;
import com.congreats.application.port.out.TokenService;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.EmailAlreadyExistsException;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import com.congreats.infrastructure.config.OperationModeConfig;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

@ApplicationScoped
public class RegisterUserUseCase {

    @Inject UserRepository userRepository;
    @Inject PasswordHasher passwordHasher;
    @Inject TokenService tokenService;
    @Inject OperationModeConfig modeConfig;

    public record Command(String name, String email, String password) {}

    @Transactional
    public AuthTokens execute(Command cmd) {
        if (modeConfig.mode() == OperationMode.ENTERPRISE) {
            throw new DomainException("Registro público não habilitado nesta instalação");
        }
        if (cmd.password() == null || cmd.password().length() < 8) {
            throw new DomainException("Senha deve ter no mínimo 8 caracteres");
        }

        Email email = new Email(cmd.email());

        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyExistsException();
        }

        UserRole role = modeConfig.mode() == OperationMode.WORLD ? UserRole.ADMIN : UserRole.USER;
        User user = User.create(cmd.name(), email, passwordHasher.hash(cmd.password()), role);
        userRepository.save(user);

        return new AuthTokens(
                tokenService.generateAccessToken(user),
                tokenService.generateRefreshToken(user.id())
        );
    }
}
