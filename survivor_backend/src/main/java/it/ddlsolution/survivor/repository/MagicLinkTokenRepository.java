package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.MagicLinkToken;
import it.ddlsolution.survivor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface MagicLinkTokenRepository extends JpaRepository<MagicLinkToken, Long> {
    Optional<MagicLinkToken> findByTokenAndUsedFalseAndExpiresAtAfter(String token, LocalDateTime now);
    void deleteByExpiresAtBefore(LocalDateTime now);
    void deleteByUser(User user);
}

