package com.congreats.infrastructure.adapter.out;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.congreats.application.dto.TokenClaims;
import com.congreats.application.port.out.TokenService;
import com.congreats.domain.exception.InvalidTokenException;
import com.congreats.domain.model.User;
import com.congreats.domain.model.UserRole;
import com.congreats.infrastructure.entity.RefreshTokenEntity;
import io.quarkus.hibernate.orm.panache.PanacheRepository;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.UUID;

@ApplicationScoped
public class JwtTokenServiceImpl implements PanacheRepository<RefreshTokenEntity>, TokenService {

    @Inject
    @ConfigProperty(name = "congreats.jwt.secret")
    String secret;

    @Inject
    @ConfigProperty(name = "congreats.jwt.access-token-expiry-minutes", defaultValue = "15")
    int accessTokenExpiryMinutes;

    @Inject
    @ConfigProperty(name = "congreats.jwt.refresh-token-expiry-days", defaultValue = "7")
    int refreshTokenExpiryDays;

    @Inject
    @ConfigProperty(name = "congreats.jwt.issuer", defaultValue = "https://congreats.app")
    String issuer;

    private Algorithm algorithm() {
        return Algorithm.HMAC256(secret);
    }

    @Override
    public String generateAccessToken(User user) {
        Instant now = Instant.now();
        return JWT.create()
                .withIssuer(issuer)
                .withSubject(user.id().toString())
                .withClaim("name", user.name())
                .withClaim("email", user.email().value())
                .withClaim("role", user.role().name())
                .withIssuedAt(Date.from(now))
                .withExpiresAt(Date.from(now.plus(accessTokenExpiryMinutes, ChronoUnit.MINUTES)))
                .sign(algorithm());
    }

    @Override
    @Transactional
    public String generateRefreshToken(UUID userId) {
        String token = UUID.randomUUID().toString();
        RefreshTokenEntity entity = new RefreshTokenEntity();
        entity.id = UUID.randomUUID();
        entity.userId = userId;
        entity.tokenHash = token;
        entity.expiresAt = Instant.now().plus(refreshTokenExpiryDays, ChronoUnit.DAYS);
        entity.createdAt = Instant.now();
        persist(entity);
        return token;
    }

    @Override
    public UUID validateAccessToken(String token) {
        try {
            DecodedJWT decoded = JWT.require(algorithm()).withIssuer(issuer).build().verify(token);
            return UUID.fromString(decoded.getSubject());
        } catch (JWTVerificationException | IllegalArgumentException e) {
            throw new InvalidTokenException();
        }
    }

    @Override
    public TokenClaims validateAndGetClaims(String token) {
        try {
            DecodedJWT decoded = JWT.require(algorithm()).withIssuer(issuer).build().verify(token);
            UUID userId = UUID.fromString(decoded.getSubject());
            UserRole role = UserRole.valueOf(decoded.getClaim("role").asString());
            return new TokenClaims(userId, role);
        } catch (JWTVerificationException | IllegalArgumentException e) {
            throw new InvalidTokenException();
        }
    }

    @Override
    @Transactional
    public UUID validateAndRevokeRefreshToken(String token) {
        RefreshTokenEntity entity = find("tokenHash = ?1 and revokedAt is null and expiresAt > ?2",
                token, Instant.now()).firstResult();
        if (entity == null) throw new InvalidTokenException();
        entity.revokedAt = Instant.now();
        return entity.userId;
    }

    @Override
    @Transactional
    public void revokeAllRefreshTokens(UUID userId) {
        update("revokedAt = ?1 where userId = ?2 and revokedAt is null", Instant.now(), userId);
    }
}
