package it.ddlsolution.survivor.controller;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.swagger.v3.oas.annotations.Hidden;
import it.ddlsolution.survivor.dto.AuthResponseDTO;
import it.ddlsolution.survivor.dto.MagicLinkRequestDTO;
import it.ddlsolution.survivor.dto.MagicLinkResponseDTO;
import it.ddlsolution.survivor.dto.RefreshTokenRequestDTO;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.UserRepository;
import it.ddlsolution.survivor.service.JwtService;
import it.ddlsolution.survivor.service.MagicLinkService;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {
    private final UserRepository userRepository;

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
}
