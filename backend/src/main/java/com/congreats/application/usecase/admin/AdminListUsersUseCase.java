package com.congreats.application.usecase.admin;

import com.congreats.application.dto.PageResult;
import com.congreats.application.dto.UserAdminView;
import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.User;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;

import java.util.List;

@ApplicationScoped
public class AdminListUsersUseCase {

    @Inject UserRepository userRepository;

    public PageResult<UserAdminView> execute(int page, int size) {
        List<UserAdminView> users = userRepository.findAll(page, size).stream()
                .map(this::toView).toList();
        long total = userRepository.count();
        return new PageResult<>(users, total, page, size);
    }

    private UserAdminView toView(User u) {
        return new UserAdminView(u.id(), u.name(), u.email().value(), u.role(), u.active(), u.createdAt());
    }
}
