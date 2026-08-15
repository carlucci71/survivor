package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.MagicLinkToken;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.MagicLinkTokenRepository;
import it.ddlsolution.survivor.util.SignedTokenGenerator;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

    @Value("${magic-link.relative-url-send-mail-mobile}")
    private String relativeUrlSendMailMobile;

    @Value("${app.appstore-review-email}")
    private String appStoreReviewEmail;

    @Transactional
    public String sendMagicLink(String email, boolean mobile, String addInfo) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("L'email è obbligatoria");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Formato email non valido");
        }
        // findByEmail crea l'utente se non esiste (flusso registrazione)
        User user = userService.findByEmail(email);
        return sendMagicLinkForUser(user, email, mobile, addInfo);
    }

    @Transactional
    public String sendMagicLinkToExistingUser(String email, boolean mobile, String addInfo) {
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("L'email è obbligatoria");
        }
        if (!email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new IllegalArgumentException("Formato email non valido");
        }
        // findByEmail without creating — caller must have already verified user exists
        User user = userService.findByEmailExisting(email);
        return sendMagicLinkForUser(user, email, mobile, addInfo);
    }

    /**
     * Ritorna il token in chiaro solo per l'account riservato alla review Apple/Google
     * (nessuna casella di posta reale disponibile per i reviewer): in quel solo caso il
     * chiamante può completare il login senza passare dalla mail. Per ogni altro utente
     * ritorna sempre null e il token viene inviato via email come di consueto.
     */
    private String sendMagicLinkForUser(User user, String email, boolean mobile, String addInfo) {
        String tipo = Enumeratori.TipoMagicToken.LOG.getCodice();
        magicLinkTokenRepository.deleteByUserAndTipo(user, tipo);
        String token = salvaMagicToken(user, expirationMinutes, null, tipo, addInfo != null ? addInfo : "");

        if (email.equalsIgnoreCase(appStoreReviewEmail)) {
            log.info("Login account review store: token restituito direttamente senza invio email");
            return token;
        }

        String subject = "Il tuo Magic Link per accedere a Survivor";
        String magicLink = getUrlMagicLink(token, tipo, mobile);
        emailService.send(email, subject, buildEmailContent(magicLink));
        log.info("Magic link inviato a: {}", email);
        return null;
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

    public String getUrlMagicLinkInvita(String token, String codiceTipoMagicLink) {
        return baseUrl + relativeUrlSendMailMobile + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&codiceTipoMagicLink=" + codiceTipoMagicLink;
    }

    public String getUrlMagicLink(String token, String codiceTipoMagicLink, boolean mobile) {
        // Passa sempre da /magic-redirect (non solo quando mobile=true): chi clicca il link da un
        // browser web non ha comunque modo di sapere se ha l'app installata, quindi lasciamo che sia
        // l'utente a scegliere "apri l'app" / "continua nel browser" invece di decidere qui in anticipo
        // in base a mobile, che riflette solo il contesto della RICHIESTA del link, non di chi lo apre.
        return baseUrl + relativeUrlSendMailMobile + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&codiceTipoMagicLink=" + codiceTipoMagicLink
                + "&sourceMobile=" + mobile;
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
    public Optional<User> validateToken(String token, boolean setUsed, String codiceTipoMagicLink) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (!signedTokenGenerator.verifyAndExtract(token)) {
            throw new RuntimeException("Token manomesso");
        }
        Optional<MagicLinkToken> magicLinkTokenOpt = magicLinkTokenRepository.findByTokenAndUsedFalseAndExpiresAtAfter(token, LocalDateTime.now());

        if (magicLinkTokenOpt.isEmpty()) {
            return Optional.empty();
        }

        MagicLinkToken magicLinkToken = magicLinkTokenOpt.get();
        if (setUsed) {

            if (codiceTipoMagicLink.equals(Enumeratori.TipoMagicToken.JOIN.getCodice()) && !magicLinkToken.getUser().getId().equals(authentication.getPrincipal())) {
                throw new RuntimeException("User link:" + magicLinkToken.getUser().getId() + " diverso da user loggato: " + authentication.getPrincipal());
            }


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

    public String extractAddInfo(String token) {
        return signedTokenGenerator.extractAddInfo(token);
    }
}

