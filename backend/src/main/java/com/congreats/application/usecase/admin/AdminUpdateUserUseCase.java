package com.congreats.application.usecase.admin;

import com.congreats.application.dto.UserAdminView;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class AdminUpdateUserUseCase {

    @Inject UserRepository userRepository;

    public record Command(UUID targetUserId, String name, String email, UserRole role) {}

    @Transactional
    public UserAdminView execute(Command cmd) {
        User existing = userRepository.findById(cmd.targetUserId())
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        Email newEmail = cmd.email() != null ? new Email(cmd.email()) : existing.email();
        if (!newEmail.value().equals(existing.email().value())) {
            Optional<User> conflict = userRepository.findByEmail(newEmail);
            if (conflict.isPresent() && !conflict.get().id().equals(existing.id()))
                throw new DomainException("E-mail já utilizado por outro usuário");
        }

        String name = cmd.name() != null && !cmd.name().isBlank() ? cmd.name().strip() : existing.name();
        UserRole role = cmd.role() != null ? cmd.role() : existing.role();

        User updated = new User(existing.id(), name, newEmail, existing.passwordHash(),
                role, existing.active(), existing.createdAt());
        userRepository.update(updated);

        return new UserAdminView(updated.id(), updated.name(), updated.email().value(),
                updated.role(), updated.active(), updated.createdAt());
    }
}
