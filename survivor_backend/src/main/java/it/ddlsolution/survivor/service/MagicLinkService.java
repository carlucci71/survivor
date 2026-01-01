package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.MagicLinkToken;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.MagicLinkTokenRepository;
import it.ddlsolution.survivor.util.Enumeratori;
import it.ddlsolution.survivor.util.SignedTokenGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MagicLinkService {

    private final UserService userService;
    private final MagicLinkTokenRepository magicLinkTokenRepository;
    private final EmailService emailService;
    private final SignedTokenGenerator signedTokenGenerator;

    @Value("${magic-link.expiration-minutes}")
    private int expirationMinutes;

    @Value("${magic-link.base-url}")
    private String baseUrl;

    @Value("${magic-link.relative-url-send-mail}")
    private String relativeUrlSendMail;

    @Transactional
    public void sendMagicLink(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("L'email è obbligatoria");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Formato email non valido");
        }
        User user = userService.findByEmail(email);
        // Genera un nuovo token
        String tipo = Enumeratori.TipoMagicToken.LOG.getCodice();
        magicLinkTokenRepository.deleteByUserAndTipo(user, tipo);
        String token = salvaMagicToken(user, expirationMinutes, null, tipo, "");
        String subject = "Il tuo Magic Link per accedere a Survivor";
        String magicLink = getUrlMagicLink(token);
        emailService.send(email, subject, buildEmailContent(magicLink));

        log.info("Magic link inviato a: {}", email);
    }

    @Transactional
    public String salvaMagicToken(User user, Integer minutesExpiration, Integer daysExpiration, String tipo, String addInfo) {
        String token = generateSecureToken(addInfo);
        MagicLinkToken magicLinkToken = new MagicLinkToken();
        magicLinkToken.setToken(token);
        magicLinkToken.setTipo(tipo);
        magicLinkToken.setUser(user);
        if (minutesExpiration != null) {
            magicLinkToken.setExpiresAt(LocalDateTime.now().plusMinutes(minutesExpiration));
        }
        if (daysExpiration != null) {
            magicLinkToken.setExpiresAt(LocalDateTime.now().plusDays(daysExpiration));
        }
        magicLinkToken.setUsed(false);
        magicLinkTokenRepository.save(magicLinkToken);
        return token;
    }

    private String getUrlMagicLink(String token) {
        return baseUrl + relativeUrlSendMail + URLEncoder.encode(token, StandardCharsets.UTF_8);
    }

    private String buildEmailContent(String magicLink) {
        return """
                Ciao,
                
                Clicca sul link seguente per accedere a Survivor:
                
                %s
                
                Questo link è valido per %d minuti.
                
                Se non hai richiesto questo accesso, ignora questa email.
                
                Saluti,
                Il team di Survivor
                """.formatted(magicLink, expirationMinutes);
    }

    @Transactional
    public Optional<User> validateToken(String token) {

        if (!signedTokenGenerator.verifyAndExtract(token)) {
            throw new RuntimeException("Token manomesso");
        }

        //Optional<MagicLinkToken> magicLinkTokenOpt = magicLinkTokenRepository.findByTokenAndExpiresAtAfter(token, LocalDateTime.now());
        Optional<MagicLinkToken> magicLinkTokenOpt = magicLinkTokenRepository.findByTokenAndUsedFalseAndExpiresAtAfter(token, LocalDateTime.now());

        if (magicLinkTokenOpt.isEmpty()) {
            return Optional.empty();
        }

        MagicLinkToken magicLinkToken = magicLinkTokenOpt.get();

        if (magicLinkToken.getTipo().equals(Enumeratori.TipoMagicToken.LOG.getCodice())) {
            magicLinkToken.setUsed(true);
            magicLinkToken.setUsedAt(LocalDateTime.now());
        }
        magicLinkTokenRepository.save(magicLinkToken);

        User user = magicLinkToken.getUser();
        user.setLastLoginAt(LocalDateTime.now());
        user = userService.salva(user);

        log.info("Utente autenticato con successo: {}", user.getEmail());
        return Optional.of(user);
    }

    @Transactional
    public void cleanupExpiredTokens() {
        magicLinkTokenRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }

    private String generateSecureToken(String addInfo) {
        try {
            return signedTokenGenerator.generateToken(addInfo);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    public String extractAddInfo(String token){
        return signedTokenGenerator.extractAddInfo(token);
    }
}

