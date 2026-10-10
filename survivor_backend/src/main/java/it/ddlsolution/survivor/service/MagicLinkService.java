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

        String subject = "Il tuo link di accesso a Survivor";
        String magicLink = getUrlMagicLink(token, tipo, mobile);
        emailService.sendHtml(email, subject, buildEmailContent(magicLink), buildEmailHtml(magicLink));
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

    private String buildEmailHtml(String magicLink) {
        String link = magicLink.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
        return """
                <!DOCTYPE html>
                <html lang="it">
                <body style="margin:0;padding:24px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1a2433;">
                  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;">
                    <h2 style="margin:0 0 12px;color:#0A3D91;">Accedi a Survivor</h2>
                    <p style="margin:0 0 20px;line-height:1.5;">Ciao, tocca il pulsante per accedere. Il link è valido per %d minuti.</p>
                    <p style="margin:0 0 24px;">
                      <a href="%s" style="display:inline-block;background:#0A3D91;color:#ffffff;text-decoration:none;font-weight:bold;padding:14px 28px;border-radius:8px;">Accedi a Survivor</a>
                    </p>
                    <p style="margin:0 0 8px;font-size:13px;color:#5b6676;">Se il pulsante non funziona, copia questo indirizzo nel browser:</p>
                    <p style="margin:0 0 20px;font-size:12px;word-break:break-all;color:#5b6676;">%s</p>
                    <p style="margin:0;font-size:13px;color:#5b6676;">Se non hai richiesto questo accesso, ignora questa email.</p>
                  </div>
                </body>
                </html>
                """.formatted(expirationMinutes, link, link);
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

