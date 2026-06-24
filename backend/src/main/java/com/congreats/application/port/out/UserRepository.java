package com.congreats.application.port.out;

import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {
    void save(User user);
    void update(User user);
    Optional<User> findById(UUID id);
    Optional<User> findByEmail(Email email);
    List<User> findAll(int page, int size);
    long count();
    long countActiveAdmins();
}
