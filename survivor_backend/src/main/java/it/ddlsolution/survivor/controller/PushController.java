package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.NotificationDTO;
import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.dto.PushTokenDTO;
import it.ddlsolution.survivor.service.NotificationService;
import it.ddlsolution.survivor.service.PushNotificationService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/push")
@RequiredArgsConstructor
@Slf4j
public class PushController {

    private final PushNotificationService pushNotificationService;
    private final NotificationService notificationService;

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
            @PathVariable Long userId, @RequestParam String type, @RequestParam(required = false) Integer minutesExpiring
    ) {
        log.info("****************************************** INVIATA?");



        PushNotificationDTO notification = PushNotificationDTO.builder()
                .title("Partita in arrivo!")
                .body(String.format("%s vs %s inizia tra 1 ora",
                        "GIMMI",
                        "BUBU"))
                .sound("default")
                .tipoNotifica(Enumeratori.TipoNotifica.INIZIO_PARTITA)
                .expiringAt(minutesExpiring==null ? null : LocalDateTime.now(ZoneId.of("Europe/Rome")).plusMinutes(minutesExpiring))
                .imageUrl("https://st4.depositphotos.com/1014627/26361/v/1600/depositphotos_263610928-stock-illustration-3d-gold-trophy-or-cup.jpg")
                .build();

        pushNotificationService.sendNotificationToUsers(List.of(userId), notification);
        log.info("****************************************** INVIATA!");

    }


    /**
     * GET /api/notifications?userId=123&unreadOnly=true
     * Scheletro dell'endpoint: riceve userId e unreadOnly come query params.
     */
    @GetMapping
    public ResponseEntity<List<NotificationDTO>> getNotifications(
            @RequestParam Long userId,
            @RequestParam(required = false, defaultValue = "false") boolean active
    ) {
        log.info("GET /api/notifications userId={} unreadOnly={}", userId, active);

        List<NotificationDTO> notifications = notificationService.listNotifications(userId, active);
        return ResponseEntity.ok(notifications);
    }

    /**
     * POST /api/notifications/{id}/read
     * Marca la notifica come letta per l'utente autenticato.
     */
    @PostMapping("/{id}/read")
    public ResponseEntity<Void> markAsRead(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        notificationService.markAsRead(id, userId);

        return ResponseEntity.ok().build();
    }

    /**
     * DELETE /push/tokens/all
     * ADMIN: Disattiva tutti i token FCM (da usare dopo cambio progetto Firebase)
     */
    @DeleteMapping("/tokens/all")
    public ResponseEntity<String> deactivateAllTokens() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        log.warn("ADMIN: Richiesta disattivazione tutti i token da user {}", userId);
        
        int count = pushNotificationService.deactivateAllTokens();
        
        return ResponseEntity.ok(String.format("Disattivati %d token", count));
    }


}
