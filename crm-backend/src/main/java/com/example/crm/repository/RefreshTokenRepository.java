package com.example.crm.repository;

import com.example.crm.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, UUID> {
    Optional<RefreshToken> findByToken(String token);

    void deleteByUser_Id(UUID userId);

    void deleteByExpiresAtBeforeOrRevokedIsTrue(Instant cutoff);
}
