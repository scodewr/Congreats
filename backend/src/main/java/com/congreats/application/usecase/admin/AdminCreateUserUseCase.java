package com.congreats.application.usecase.admin;

import com.congreats.application.dto.UserAdminView;
import com.congreats.application.port.out.PasswordHasher;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AdminCreateUserUseCase {

    @Inject UserRepository userRepository;
    @Inject PasswordHasher passwordHasher;

    public record Command(String name, String email, UserRole role) {}
    public record Result(UserAdminView user, String temporaryPassword) {}

    @Transactional
    public Result execute(Command cmd) {
        Email email = new Email(cmd.email());
        if (userRepository.findByEmail(email).isPresent())
            throw new DomainException("E-mail já cadastrado");

        String tempPassword = UUID.randomUUID().toString().replace("-", "").substring(0, 12);
        String hash = passwordHasher.hash(tempPassword);

        User user = User.create(cmd.name(), email, hash, cmd.role() != null ? cmd.role() : UserRole.USER);
        userRepository.save(user);

        UserAdminView view = new UserAdminView(user.id(), user.name(), user.email().value(),
                user.role(), user.active(), user.createdAt());
        return new Result(view, tempPassword);
    }
}
