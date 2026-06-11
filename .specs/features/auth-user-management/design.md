# Authentication & User Management — Design

**Feature:** AUTH
**Version:** v1.0

---

## Architecture Overview

```
[React Frontend]
     |
     | HTTP/HTTPS (Bearer JWT)
     v
[AuthController] ← infrastructure/
     |
     | calls
     v
[RegisterUserUseCase]    [AuthenticateUserUseCase]    [ChangePasswordUseCase]
        ↓                          ↓                          ↓
   [UserRepository port]    [TokenService port]       [UserRepository port]
        ↓                          ↓
[UserRepositoryJPA] ← impl  [JwtTokenServiceImpl] ← impl
        ↓
   [PostgreSQL — users table]
```

---

## Domain Layer (`domain/`)

### Entity: `User`

```
User
├── id: UUID
├── name: String
├── email: Email (Value Object)
├── passwordHash: String
├── createdAt: Instant
├── active: boolean
└── behaviors:
    ├── changePassword(currentHash, newHash): void
    └── deactivate(): void
```

### Value Object: `Email`

- Normaliza para minúsculas na construção.
- Valida formato RFC 5322 simplificado.
- Lança `InvalidEmailException` se inválido.

### Domain Events

- `UserRegistered { userId, email, name, occurredAt }`
- `UserPasswordChanged { userId, occurredAt }`

---

## Application Layer (`application/`)

### Port: `UserRepository`

```java
interface UserRepository {
    void save(User user);
    Optional<User> findByEmail(Email email);
    Optional<User> findById(UUID id);
    void update(User user);
}
```

### Port: `TokenService`

```java
interface TokenService {
    String generateAccessToken(UUID userId);
    String generateRefreshToken(UUID userId);
    UUID validateAccessToken(String token);     // throws InvalidTokenException
    UUID validateRefreshToken(String token);    // throws InvalidTokenException
    void revokeRefreshToken(String token);
    void revokeAllRefreshTokens(UUID userId);
}
```

### Port: `PasswordHasher`

```java
interface PasswordHasher {
    String hash(String plainPassword);
    boolean matches(String plainPassword, String hash);
}
```

### Use Case: `RegisterUser`

**Input:** `RegisterUserCommand { name, email, password }`
**Output:** `AuthTokens { accessToken, refreshToken }`

**Steps:**
1. Validate: email format, password min 8 chars.
2. Check: email not already in use → `EmailAlreadyExistsException`.
3. Hash password via `PasswordHasher`.
4. Create `User` entity.
5. Save via `UserRepository`.
6. Generate tokens via `TokenService`.
7. Publish `UserRegistered` event.
8. Return `AuthTokens`.

### Use Case: `AuthenticateUser`

**Input:** `AuthenticateUserCommand { email, password }`
**Output:** `AuthTokens { accessToken, refreshToken }`

**Steps:**
1. Find user by email → if not found, throw `InvalidCredentialsException` (generic).
2. Verify password hash → if mismatch, throw `InvalidCredentialsException` (same generic).
3. Check user is active → throw `AccountInactiveException` if not.
4. Generate and return `AuthTokens`.

### Use Case: `RefreshToken`

**Input:** `refreshToken: String`
**Output:** `AuthTokens { accessToken, refreshToken }`

**Steps:**
1. Validate refresh token → extract userId.
2. Verify user exists and is active.
3. Revoke old refresh token.
4. Generate new access + refresh tokens.
5. Return `AuthTokens`.

### Use Case: `ChangePassword`

**Input:** `ChangePasswordCommand { userId, currentPassword, newPassword }`
**Output:** void

**Steps:**
1. Find user by id.
2. Verify current password.
3. Validate new password ≠ current.
4. Hash new password, update user.
5. Revoke all refresh tokens for userId.

### Use Case: `Logout`

**Input:** `LogoutCommand { refreshToken }`
**Output:** void

**Steps:**
1. Revoke refresh token.

---

## Infrastructure Layer (`infrastructure/`)

### `AuthController` (REST)

| Method | Path | Protected | Use Case |
|--------|------|-----------|----------|
| POST | `/auth/register` | No | RegisterUser |
| POST | `/auth/login` | No | AuthenticateUser |
| POST | `/auth/refresh` | No | RefreshToken |
| POST | `/auth/logout` | Yes | Logout |
| PUT | `/auth/password` | Yes | ChangePassword |

### DTOs

```
RegisterRequest  { name, email, password }
LoginRequest     { email, password }
RefreshRequest   { refreshToken }
ChangePasswordRequest { currentPassword, newPassword }
AuthResponse     { accessToken, refreshToken, expiresIn }
```

### `UserRepositoryJPA`

- JPA/Hibernate via Jakarta Persistence.
- Maps `User` entity to `users` table.

### `JwtTokenServiceImpl`

- Library: `io.jsonwebtoken:jjwt` (ou MicroProfile JWT).
- Access token: HS256, 15 min TTL, payload `{ sub: userId }`.
- Refresh tokens: stored in `refresh_tokens` table (UUID, userId, expiresAt, revokedAt).

### `BCryptPasswordHasher`

- Uses BCrypt with strength 12.

### `JwtAuthFilter` (JAX-RS ContainerRequestFilter)

- Intercepts all requests except `/auth/*`.
- Extracts Bearer token from `Authorization` header.
- Calls `TokenService.validateAccessToken`.
- Injects `userId` into `SecurityContext`.
- Returns 401 on failure.

---

## Database Schema

### `users`

```sql
CREATE TABLE users (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(150) NOT NULL,
    email       VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    active      BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_users_email ON users(email);
```

### `refresh_tokens`

```sql
CREATE TABLE refresh_tokens (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID NOT NULL REFERENCES users(id),
    token_hash  VARCHAR(255) NOT NULL UNIQUE,
    expires_at  TIMESTAMPTZ NOT NULL,
    revoked_at  TIMESTAMPTZ,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX idx_refresh_tokens_user ON refresh_tokens(user_id);
```

---

## Frontend Components

```
src/
├── pages/
│   ├── RegisterPage.tsx
│   └── LoginPage.tsx
├── components/auth/
│   ├── RegisterForm.tsx
│   └── LoginForm.tsx
├── services/
│   └── authService.ts       ← API calls (register, login, refresh, logout)
├── hooks/
│   └── useAuth.ts           ← auth state + token management
└── contexts/
    └── AuthContext.tsx      ← global auth state provider
```

### Token Storage Strategy

- `accessToken`: memory only (React state / context) — não persiste.
- `refreshToken`: `httpOnly cookie` ou `localStorage` (decisão de segurança a confirmar).
- Auto-refresh: interceptor Axios que detecta 401 e tenta refresh antes de redirect.

---

## Security Considerations

- Senhas nunca trafegam em plain text após o boundary do controller.
- Tokens JWT não contêm dados sensíveis além do `userId`.
- Refresh tokens têm TTL no banco e podem ser revogados individualmente.
- Login failure não revela se email existe ou não.
- HTTPS obrigatório em produção (TLS termination no load balancer ou servidor).
