package com.congreats.infrastructure.entity;

import com.congreats.domain.model.Email;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "users", indexes = @Index(name = "idx_users_email", columnList = "email"))
public class UserEntity extends PanacheEntityBase {

    @Id
    @Column(columnDefinition = "uuid")
    public UUID id;

    @Column(nullable = false, length = 150)
    public String name;

    @Column(nullable = false, unique = true, length = 255)
    public String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    public String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    public UserRole role;

    @Column(nullable = false)
    public boolean active;

    @Column(name = "created_at", nullable = false, updatable = false)
    public Instant createdAt;

    public static UserEntity from(User user) {
        UserEntity e = new UserEntity();
        e.id = user.id();
        e.name = user.name();
        e.email = user.email().value();
        e.passwordHash = user.passwordHash();
        e.role = user.role();
        e.active = user.active();
        e.createdAt = user.createdAt();
        return e;
    }

    public User toDomain() {
        return new User(id, name, new Email(email), passwordHash, role, active, createdAt);
    }
}
