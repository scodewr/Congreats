package com.congreats.infrastructure.adapter.out;

import com.congreats.application.port.out.UserRepository;
import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import com.congreats.infrastructure.entity.UserEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepositoryJPA implements PanacheRepository<UserEntity>, UserRepository {

    @Override
    public void save(User user) {
        persist(UserEntity.from(user));
    }

    @Override
    public void update(User user) {
        UserEntity entity = find("id", user.id()).firstResult();
        if (entity != null) {
            entity.name = user.name();
            entity.email = user.email().value();
            entity.passwordHash = user.passwordHash();
            entity.role = user.role();
            entity.active = user.active();
        }
    }

    @Override
    public Optional<User> findById(UUID id) {
        return find("id", id).firstResultOptional().map(UserEntity::toDomain);
    }

    @Override
    public Optional<User> findByEmail(Email email) {
        return find("email", email.value()).firstResultOptional().map(UserEntity::toDomain);
    }

    @Override
    public List<User> findAll(int page, int size) {
        return find("active = true", io.quarkus.panache.common.Sort.by("name"))
                .page(page, size).list().stream().map(UserEntity::toDomain).toList();
    }

    @Override
    public List<User> searchByName(String q, int page, int size) {
        if (q == null || q.isBlank()) return findAll(page, size);
        return find("lower(name) like lower(?1) and active = true",
                io.quarkus.panache.common.Sort.by("name"), "%" + q.trim() + "%")
                .page(page, size).list().stream().map(UserEntity::toDomain).toList();
    }

    @Override
    public long count() {
        return findAll().count();
    }

    @Override
    public long countActiveAdmins() {
        return count("role = ?1 and active = true", UserRole.ADMIN);
    }
}
