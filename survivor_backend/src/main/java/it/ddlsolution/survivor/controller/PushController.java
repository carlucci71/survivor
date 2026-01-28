package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.dto.PushTokenDTO;
import it.ddlsolution.survivor.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/push")
@RequiredArgsConstructor
@Slf4j
public class PushController {

    private final PushNotificationService pushNotificationService;

    /**
     * Endpoint per registrare un token push dall'app mobile
     */
    @PostMapping("/register")
    public ResponseEntity<Void> registerToken(@RequestBody PushTokenDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        log.info("Registrazione token push per user {}, platform {}", userId, dto.getPlatform());

        pushNotificationService.registerToken(
            userId,
            dto.getToken(),
            dto.getPlatform(),
            dto.getDeviceId()
        );

        return ResponseEntity.ok().build();
    }

    /**
     * Endpoint per disattivare un token (logout o rimozione device)
     */
    @DeleteMapping("/token")
    public ResponseEntity<Void> deactivateToken(@RequestBody PushTokenDTO dto) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        log.info("Disattivazione token push per user {}", userId);
        pushNotificationService.deactivateToken(dto.getToken());

        return ResponseEntity.ok().build();
    }

    @GetMapping("/notificaFittizia/{userId}")
    public void sendUpcomingMatchNotificationsFittizia(
            @PathVariable Long userId
    ) {
        log.info("****************************************** INVIATA?");
        PushNotificationDTO notification = PushNotificationDTO.builder()
                .title("Partita in arrivo!")
                .body(String.format("%s vs %s inizia tra 1 ora",
                        "GIMMI",
                        "BUBU"))
                .sound("default")
                .data(Map.of(
                        "type", "match_starting",
                        "matchId", String.valueOf(11),
                        "matchDate", LocalDateTime.now().toString()
                ))
                .build();

        pushNotificationService.sendNotificationToUsers(List.of(userId), notification);
        log.info("****************************************** INVIATA!");

    }



}
