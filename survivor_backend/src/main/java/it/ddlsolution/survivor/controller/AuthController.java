package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.AuthResponseDTO;
import it.ddlsolution.survivor.dto.MagicLinkRequestDTO;
import it.ddlsolution.survivor.dto.MagicLinkResponseDTO;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.service.JwtService;
import it.ddlsolution.survivor.service.MagicLinkService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

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
    public ResponseEntity<?> verifyMagicLink(@RequestParam String token) {
        Optional<User> userOpt = magicLinkService.validateToken(token);

        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body(new MagicLinkResponseDTO(
                "Token non valido o scaduto", false));
        }

        User user = userOpt.get();
        String jwtToken = jwtService.generateToken(user.getEmail(), user.getRole().name());

        return ResponseEntity.ok(new AuthResponseDTO(
            jwtToken,
            user.getEmail(),
            user.getName(),
            user.getRole().name()
        ));
    }
}

