package it.ddlsolution.survivor.controller;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Hidden;
import it.ddlsolution.survivor.dto.request.MagicLinkRequestDTO;
import it.ddlsolution.survivor.dto.request.RefreshTokenRequestDTO;
import it.ddlsolution.survivor.dto.response.AuthResponseDTO;
import it.ddlsolution.survivor.dto.response.MagicLinkResponseDTO;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LogDispositivaRepository;
import it.ddlsolution.survivor.repository.MagicLinkTokenRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import it.ddlsolution.survivor.service.JwtService;
import it.ddlsolution.survivor.service.MagicLinkService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final UserRepository userRepository;
    private final MagicLinkTokenRepository magicLinkTokenRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final LogDispositivaRepository logDispositivaRepository;

    private final MagicLinkService magicLinkService;
    private final JwtService jwtService;

    @PostMapping("/request-magic-link")
    public ResponseEntity<MagicLinkResponseDTO> requestMagicLink(
            @RequestBody MagicLinkRequestDTO request) {
        try {
            magicLinkService.sendMagicLink(request.getEmail());
            return ResponseEntity.ok(new MagicLinkResponseDTO(
                    "Magic link inviato con successo. Controlla la tua email.", true));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MagicLinkResponseDTO(
                    "Errore nell'invio del magic link: " + e.getMessage(), false));
        }
    }

    @GetMapping("/verify")
    public ResponseEntity<?> verifyMagicLink(@RequestParam String token, @RequestParam String codiceTipoMagicLink) {
        boolean setUsed = true;
        if (codiceTipoMagicLink.equals(Enumeratori.TipoMagicToken.JOIN.getCodice())) {
            setUsed = false;
        }

        Optional<User> userOpt = magicLinkService.validateToken(token, setUsed, codiceTipoMagicLink);

        String addInfo = magicLinkService.extractAddInfo(token);
        System.out.println("addInfo = " + addInfo);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MagicLinkResponseDTO(
                    "Token non valido", false));
        }

        User user = userOpt.get();
        String jwtToken = jwtService.generateToken(user.getId().toString(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponseDTO(
                jwtToken,
                user.getId(),
                user.getName(),
                user.getRole().name(),
                addInfo
        ));


    }


    @PostMapping("/myData")
    public ResponseEntity<?> myData(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        if (authHeader == null) {
            return ResponseEntity.ok(new AuthResponseDTO());
        }
        if (!authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Authorization non Bearer");
        }


        String jwt = authHeader.substring(7);
        if (jwt.equals("null")) {
            jwt = null;
        }

        AuthResponseDTO authResponseDTO;
        if (jwt == null) {
            authResponseDTO = new AuthResponseDTO();
        } else {
            final Long id = Long.parseLong(jwtService.extractId(jwt));
            User user = userRepository.findById(id).get();

            String roleFromToken = jwtService.extractRole(jwt);
            if (!roleFromToken.equals(user.getRole().name())){
                throw new InsufficientAuthenticationException("Ruoli obsoleti");
            }

            authResponseDTO = new AuthResponseDTO(
                    jwt,
                    user.getId(),
                    user.getName(),
                    user.getRole().name(),
                    ""
            );
        }
        return ResponseEntity.ok(authResponseDTO);
    }


    @Hidden
    @GetMapping("/token")
    public ResponseEntity<String> token(@RequestParam String role, @RequestParam String id) {
        String jwtToken = jwtService.generateToken(id, role);
        return ResponseEntity.ok(jwtToken);
    }


    @PostMapping("/refresh-token")
    public ResponseEntity<?> refreshToken(@RequestBody RefreshTokenRequestDTO request) {
        String oldToken = request.getRefreshToken();
        try {
            // Verifica la firma anche se il token è scaduto
            String userId;
            String role;
            try {
                userId = jwtService.extractId(oldToken);
                role = jwtService.extractRole(oldToken);
            } catch (ExpiredJwtException eje) {
                // Token scaduto ma firma valida: estrai claims dal token scaduto
                userId = eje.getClaims().getSubject();
                role = (String) eje.getClaims().get("role");
            }
            // Se la firma è valida (anche se scaduto), genero un nuovo JWT
            String newToken = jwtService.generateToken(userId, role);
            return ResponseEntity.ok(new AuthResponseDTO(
                    newToken,
                    Long.parseLong(userId),
                    null, // nome utente non disponibile dal solo token
                    role,
                    ""
            ));
        } catch (ExpiredJwtException eje) {
            // Non dovrebbe mai entrare qui, ma per sicurezza
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Token scaduto e non valido");
        } catch (JwtException | IllegalArgumentException e) {
            // Firma non valida, token manomesso o malformato
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Refresh token non valido o manomesso");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Errore durante il refresh del token");
        }
    }

    @DeleteMapping("/delete-account")
    @Transactional
    public ResponseEntity<?> deleteAccount(@RequestHeader(value = "Authorization") String authHeader) {
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "Token non valido"));
            }

            String jwt = authHeader.substring(7);
            final Long userId = Long.parseLong(jwtService.extractId(jwt));

            Optional<User> userOpt = userRepository.findById(userId);
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("success", false, "message", "Utente non trovato"));
            }

            User user = userOpt.get();

            // 1. Elimina tutti i magic link tokens dell'utente
            magicLinkTokenRepository.deleteByUser(user);

            // 2. Elimina prima i param_log_dispositiva (figli) e poi log_dispositiva (padri)
            logDispositivaRepository.deleteParamLogDispositivaByUserId(userId);
            logDispositivaRepository.deleteByUserId(userId);

            // 3. Elimina il giocatore associato all'utente (questo eliminerà anche giocate e giocatoreLeghe per cascade)
            giocatoreRepository.deleteByUser_Id(userId);

            // 4. Elimina l'utente dal database
            userRepository.deleteById(userId);

            log.info("Account eliminato con successo per l'utente con ID: {}", userId);

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "Account eliminato con successo"
            ));
        } catch (Exception e) {
            log.error("Errore durante l'eliminazione dell'account: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "message", "Errore durante l'eliminazione dell'account: " + e.getMessage()));
        }
    }
}
