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
    void deleteByUserAndTipo(User user, String tipo);
    void deleteByUser(User user);
    /** Ultimo token non usato di un utente per tipo: per il login c'e' sempre al massimo un token attivo. */
    Optional<MagicLinkToken> findFirstByUserAndTipoAndUsedFalseOrderByCreatedAtDesc(User user, String tipo);

}

