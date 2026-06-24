package com.congreats.application.usecase.admin;

import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.exception.DomainException;
import com.congreats.domain.exception.NotFoundException;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import java.util.UUID;

@ApplicationScoped
public class AdminDeactivateUserUseCase {

    @Inject UserRepository userRepository;

    @Transactional
    public void execute(UUID targetUserId) {
        User user = userRepository.findById(targetUserId)
                .orElseThrow(() -> new NotFoundException("Usuário não encontrado"));

        if (!user.active()) throw new DomainException("Usuário já está inativo");

        if (UserRole.ADMIN.equals(user.role()) && userRepository.countActiveAdmins() <= 1)
            throw new DomainException("Não é possível desativar o único administrador ativo");

        user.deactivate();
        userRepository.update(user);
    }
}
