package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.MagicLinkToken;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.MagicLinkTokenRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MagicLinkService {

    private final UserRepository userRepository;
    private final MagicLinkTokenRepository tokenRepository;
    private final EmailService emailService;

    @Value("${magic-link.expiration-minutes:15}")
    private int expirationMinutes;

    @Value("${magic-link.base-url:http://localhost:8389}")
    private String baseUrl;

    @Value("${magic-link.relative-url-send-mail:/api/auth/verify?token=}")//questo url di default serve per richiamare direttamente il BE
    private String relativeUrlSendMail;

    @Transactional
    public void sendMagicLink(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("L'email è obbligatoria");
        }

        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Formato email non valido");
        }

        User user = userRepository.findByEmail(email)
            .orElseGet(() -> createNewUser(email));

        // Elimina i token precedenti per questo utente
        tokenRepository.deleteByUser(user);

        // Genera un nuovo token
        String token = generateSecureToken();

        MagicLinkToken magicLinkToken = new MagicLinkToken();
        magicLinkToken.setToken(token);
        magicLinkToken.setUser(user);
        magicLinkToken.setExpiresAt(LocalDateTime.now().plusMinutes(expirationMinutes));
        magicLinkToken.setUsed(false);

        tokenRepository.save(magicLinkToken);

        // Invia l'email
        String magicLink = baseUrl + relativeUrlSendMail + token;
        emailService.sendMagicLinkEmail(email, magicLink);

        log.info("Magic link inviato a: {}", email);
    }

    @Transactional
    public Optional<User> validateToken(String token) {
        Optional<MagicLinkToken> magicLinkTokenOpt = tokenRepository
            .findByTokenAndUsedFalseAndExpiresAtAfter(token, LocalDateTime.now());

        if (magicLinkTokenOpt.isEmpty()) {
            return Optional.empty();
        }

        MagicLinkToken magicLinkToken = magicLinkTokenOpt.get();
        magicLinkToken.setUsed(true);
        magicLinkToken.setUsedAt(LocalDateTime.now());
        tokenRepository.save(magicLinkToken);

        User user = magicLinkToken.getUser();
        user.setLastLoginAt(LocalDateTime.now());
        userRepository.save(user);

        log.info("Utente autenticato con successo: {}", user.getEmail());
        return Optional.of(user);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        tokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private User createNewUser(String email) {
        User user = new User();
        user.setEmail(email);
        user.setName(extractNameFromEmail(email));
        user.setEnabled(true);
        return userRepository.save(user);
    }

    private String extractNameFromEmail(String email) {
        return email.substring(0, email.indexOf('@'));
    }

    private String generateSecureToken() {
        SecureRandom random = new SecureRandom();
        byte[] bytes = new byte[32];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }
}

