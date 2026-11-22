package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.MagicLinkToken;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.MagicLinkTokenRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import it.ddlsolution.survivor.util.SignedTokenGenerator;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
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
    private final UserRepository userRepository;

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
        // Un nuovo invio annulla link e codice precedenti
        magicLinkTokenRepository.deleteByUserAndTipo(user, tipo);
        String codice = generaCodice();
        String token = salvaMagicToken(user, expirationMinutes, null, tipo, addInfo != null ? addInfo : "",
                CODICE_ENCODER.encode(codice));

        if (email.equalsIgnoreCase(appStoreReviewEmail)) {
            log.info("Login account review store: token restituito direttamente senza invio email");
            return token;
        }

        // Il codice sta nell'oggetto: su iPhone si legge dalla notifica della mail senza aprirla
        String subject = "Il tuo codice Survivor: " + codice;
        String magicLink = getUrlMagicLink(token, tipo, mobile);
        emailService.sendHtml(email, subject, buildEmailContent(codice, magicLink), buildEmailHtml(codice, magicLink));
        log.info("Codice e magic link inviati a: {}", email);
        return null;
    }

    @Transactional
    public String salvaMagicToken(User user, Integer minutesExpiration, Integer daysExpiration, String tipo, String addInfo) {
        return salvaMagicToken(user, minutesExpiration, daysExpiration, tipo, addInfo, null);
    }

    private String salvaMagicToken(User user, Integer minutesExpiration, Integer daysExpiration, String tipo, String addInfo,
                                   String codiceHash) {
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
        magicLinkToken.setCodiceHash(codiceHash);
        magicLinkToken.setTentativiCodice(0);
        magicLinkTokenRepository.save(magicLinkToken);
        return token;
    }

    // ── Login con codice a 6 cifre ──────────────────────────────────────────────────────────
    // Stesso token del magic link: la mail contiene sia il codice (da scrivere nell'app) sia il
    // link (seconda strada, e unica strada per le versioni dell'app precedenti al codice).

    /** Minuti di validita' del codice (il link nella stessa mail resta valido expirationMinutes). */
    public static final int CODICE_VALIDITA_MINUTI = 10;
    /** Tentativi sbagliati ammessi prima di dover chiedere un nuovo codice. */
    public static final int CODICE_MAX_TENTATIVI = 5;

    private static final BCryptPasswordEncoder CODICE_ENCODER = new BCryptPasswordEncoder();
    private static final SecureRandom RANDOM = new SecureRandom();

    public enum ErroreCodice { CODICE_ERRATO, CODICE_SCADUTO, TROPPI_TENTATIVI }

    /** Esito della verifica: user valorizzato se il codice e' giusto, altrimenti errore (+ tentativi rimasti). */
    public record EsitoCodice(User user, String token, String addInfo, ErroreCodice errore, int tentativiRimasti) {
        static EsitoCodice errore(ErroreCodice e, int rimasti) {
            return new EsitoCodice(null, null, null, e, rimasti);
        }
    }

    private String generaCodice() {
        return String.format("%06d", RANDOM.nextInt(1_000_000));
    }

    @Transactional
    public EsitoCodice verificaCodice(String email, String codice) {
        if (email == null || codice == null || !codice.trim().matches("\\d{6}")) {
            return EsitoCodice.errore(ErroreCodice.CODICE_ERRATO, CODICE_MAX_TENTATIVI);
        }
        // Email sconosciuta: stessa risposta di un codice sbagliato, per non rivelare chi e' registrato
        Optional<User> userOpt = userRepository.findByEmailIgnoreCase(email.trim());
        if (userOpt.isEmpty()) {
            return EsitoCodice.errore(ErroreCodice.CODICE_ERRATO, CODICE_MAX_TENTATIVI);
        }
        User user = userOpt.get();
        Optional<MagicLinkToken> tokenOpt = magicLinkTokenRepository
                .findFirstByUserAndTipoAndUsedFalseOrderByCreatedAtDesc(user, Enumeratori.TipoMagicToken.LOG.getCodice());
        if (tokenOpt.isEmpty() || tokenOpt.get().getCodiceHash() == null) {
            return EsitoCodice.errore(ErroreCodice.CODICE_SCADUTO, 0);
        }
        MagicLinkToken t = tokenOpt.get();
        LocalDateTime adesso = LocalDateTime.now();
        if (t.getCreatedAt().plusMinutes(CODICE_VALIDITA_MINUTI).isBefore(adesso) || t.getExpiresAt().isBefore(adesso)) {
            return EsitoCodice.errore(ErroreCodice.CODICE_SCADUTO, 0);
        }
        if (t.getTentativiCodice() >= CODICE_MAX_TENTATIVI) {
            return EsitoCodice.errore(ErroreCodice.TROPPI_TENTATIVI, 0);
        }
        if (!CODICE_ENCODER.matches(codice.trim(), t.getCodiceHash())) {
            t.setTentativiCodice(t.getTentativiCodice() + 1);
            magicLinkTokenRepository.save(t);
            int rimasti = CODICE_MAX_TENTATIVI - t.getTentativiCodice();
            log.info("Codice errato per {} (tentativi rimasti {})", email, rimasti);
            return rimasti <= 0
                    ? EsitoCodice.errore(ErroreCodice.TROPPI_TENTATIVI, 0)
                    : EsitoCodice.errore(ErroreCodice.CODICE_ERRATO, rimasti);
        }
        t.setUsed(true);
        t.setUsedAt(adesso);
        magicLinkTokenRepository.save(t);
        user.setLastLoginAt(adesso);
        user = userService.salva(user);
        log.info("Utente autenticato con codice: {}", user.getEmail());
        return new EsitoCodice(user, t.getToken(), extractAddInfo(t.getToken()), null, 0);
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

    private String buildEmailHtml(String codice, String magicLink) {
        String link = magicLink.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;").replace("\"", "&quot;");
        return """
                <!DOCTYPE html>
                <html lang="it">
                <body style="margin:0;padding:24px;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#1a2433;">
                  <div style="max-width:480px;margin:0 auto;background:#ffffff;border-radius:12px;padding:28px;text-align:center;">
                    <h2 style="margin:0 0 8px;color:#0A3D91;">Il tuo codice di accesso</h2>
                    <p style="margin:0 0 20px;line-height:1.5;color:#5b6676;">Scrivilo nell'app Survivor per entrare.</p>
                    <div style="display:inline-block;margin:0 0 12px;padding:14px 22px;background:#EEF4FF;border-radius:12px;font-size:34px;font-weight:bold;letter-spacing:10px;color:#0A3D91;font-family:'Courier New',monospace;">%s</div>
                    <p style="margin:0 0 28px;font-size:13px;color:#5b6676;">Il codice vale %d minuti.</p>
                    <p style="margin:0 0 8px;font-size:13px;color:#5b6676;">Oppure accedi direttamente da qui:</p>
                    <p style="margin:0 0 24px;"><a href="%s" style="color:#0A3D91;font-weight:bold;font-size:14px;">Accedi a Survivor</a></p>
                    <p style="margin:0;font-size:12px;color:#8a94a3;">Se non hai richiesto questo accesso, ignora questa email.</p>
                  </div>
                </body>
                </html>
                """.formatted(codice, CODICE_VALIDITA_MINUTI, link);
    }

    private String buildEmailContent(String codice, String magicLink) {
        return """
                Ciao,

                il tuo codice di accesso a Survivor è: %s

                Scrivilo nell'app per entrare. Il codice vale %d minuti.

                Oppure accedi direttamente da questo link:
                %s

                Se non hai richiesto questo accesso, ignora questa email.

                Il team di Survivor
                """.formatted(codice, CODICE_VALIDITA_MINUTI, magicLink);
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

