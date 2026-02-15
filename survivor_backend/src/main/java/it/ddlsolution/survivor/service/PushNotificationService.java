package it.ddlsolution.survivor.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.AndroidConfig;
import com.google.firebase.messaging.AndroidNotification;
import com.google.firebase.messaging.ApnsConfig;
import com.google.firebase.messaging.Aps;
import com.google.firebase.messaging.BatchResponse;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.MulticastMessage;
import com.google.firebase.messaging.Notification;
import com.google.firebase.messaging.SendResponse;
import it.ddlsolution.survivor.dto.NotificationDTO;
import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.entity.PushToken;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.repository.NotificationRepository;
import it.ddlsolution.survivor.repository.PushTokenRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import static it.ddlsolution.survivor.util.Utility.getInSeconds;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {
    private final NotificationRepository notificationRepository;

    private final PushTokenRepository pushTokenRepository;
    private final NotificationService notificationService;
    private final UserRepository userRepository;
    private final UserService userService;

    @Value("${push.fcm.enabled}")
    private boolean fcmEnabled;

    @Value("${push.fcm.credentials-path}")
    private String fcmCredentialsPath;

    @Value("${push.fcm.credentials-json}")
    private String fcmCredentialsJson;

    // Flag che indica se Firebase è stato inizializzato correttamente
    private volatile boolean firebaseInitialized = false;

    @PostConstruct
    public void initializeFirebase() {
        if (!fcmEnabled) {
            log.warn("Push FCM disabilitato nella configurazione");
            return;
        }

        try {
            if (FirebaseApp.getApps().isEmpty()) {
                GoogleCredentials credentials;

                if (fcmCredentialsJson != null && !fcmCredentialsJson.isBlank()) {
                    // Da variabile env JSON base64 o JSON inline
                    credentials = GoogleCredentials.fromStream(
                            new ByteArrayInputStream(fcmCredentialsJson.getBytes(StandardCharsets.UTF_8))
                    );
                } else if (fcmCredentialsPath != null && !fcmCredentialsPath.isBlank()) {
                    // Da file
                    credentials = GoogleCredentials.fromStream(new FileInputStream(fcmCredentialsPath));
                } else {
                    log.error("FCM credentials non configurate");
                    return;
                }

                FirebaseOptions options = FirebaseOptions.builder()
                        .setCredentials(credentials)
                        .build();

                FirebaseApp app = FirebaseApp.initializeApp(options);
                firebaseInitialized = true;
                log.info("Firebase FCM inizializzato con successo");
                log.info("  - Project ID: {}", app.getOptions().getProjectId());
//                log.info("  - Service Account Email: {}", credentials.get
                log.info("IMPORTANTE: Il client deve usare il google-services.json con project_id={}", 
                        app.getOptions().getProjectId());
            } else {
                // Se già presente almeno un'app, consideriamo Firebase inizializzato
                firebaseInitialized = true;
                log.info("Firebase FCM già inizializzato (app esistente)");
            }
        } catch (IOException e) {
            firebaseInitialized = false;
            log.error("Errore inizializzazione Firebase FCM", e);
        }
    }

    /**
     * Registra o aggiorna un token push per l'utente autenticato
     */
    @Transactional
    public void registerToken(Long userId, String token, String platform, String deviceId) {
        log.info("******************** REGISTER");
        try {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new RuntimeException("Utente non trovato: " + userId));

            Optional<PushToken> existing = pushTokenRepository.findByTokenAndUser_Id(token, userId);

            if (existing.isPresent()) {
                PushToken pushToken = existing.get();
                pushToken.setLastUsedAt(LocalDateTime.now());
                pushToken.setActive(true);
                pushToken.setPlatform(platform);
                if (deviceId != null) {
                    pushToken.setDeviceId(deviceId);
                }
                pushTokenRepository.save(pushToken);
                log.info("Token push aggiornato per user {}", userId);
            } else {
                PushToken newToken = new PushToken();
                newToken.setToken(token);
                newToken.setPlatform(platform);
                newToken.setUser(user);
                newToken.setDeviceId(deviceId);
                newToken.setActive(true);
                pushTokenRepository.save(newToken);
                log.info("Nuovo token push registrato per user {}", userId);
            }
            log.info("******************** REGISTER OK");
        } catch (Exception e) {
            log.error("******************** REGISTER ERROR", e);
        }
    }

    /**
     * Disattiva un token specifico
     */
    @Transactional
    public void deactivateToken(String token) {
        int updated = pushTokenRepository.deactivateByToken(token);
        log.info("Token disattivato: {}, rows: {}", token, updated);
    }

    /**
     * Disattiva tutti i token (utile dopo cambio progetto Firebase)
     */
    @Transactional
    public int deactivateAllTokens() {
        int count = pushTokenRepository.deactivateAllTokens();
        log.warn("Disattivati {} token in totale (cambio progetto Firebase?)", count);
        return count;
    }


    /**
     * Invia una notifica push a più utenti
     */
    @Transactional
    public void sendNotificationToUsers(List<Long> userIds, PushNotificationDTO pushNotificationDTO) {
        sendToUsers(userIds, pushNotificationDTO);
        List<PushToken> tokens = pushTokenRepository.findByUser_IdInAndActiveTrue(userIds);
        log.info("****************************************** INVIATA A TOKEN SIZE: " + tokens.size());
        if (tokens.isEmpty()) {
            log.warn("Nessun token attivo per users {}", userIds);
            return;
        }
        log.info("****************************************** PRIMO TOKEN -> {}  SIZE {}", tokens.get(0), tokens.size());
        sendToTokens(tokens, pushNotificationDTO);
    }

    private void sendToUsers(List<Long> userIds, PushNotificationDTO pushNotificationDTO) {
        for (Long userId : userIds) {
            NotificationDTO notificationDTO = new NotificationDTO();
            notificationDTO.setUser(userService.userById(userId));
            notificationDTO.setBody(pushNotificationDTO.getBody());
            notificationDTO.setImageUrl(pushNotificationDTO.getImageUrl());
            notificationDTO.setTitle(pushNotificationDTO.getTitle());
            notificationDTO.setType(pushNotificationDTO.getTipoNotifica().name());
            notificationDTO.setExpiringAt(getInSeconds(pushNotificationDTO.getExpiringAt()));
            notificationService.createNotification(notificationDTO);
        }


    }

    /**
     * Logica di invio ai token (FCM per Android/iOS)
     */
    private void sendToTokens(List<PushToken> pushTokens, PushNotificationDTO pushNotificationDTO) {
        if (!fcmEnabled) {
            log.warn("FCM disabilitato, notifica non inviata: {}", pushNotificationDTO.getTitle());
            return;
        }

        if (!firebaseInitialized) {
            log.warn("Firebase non inizializzato correttamente: notifica non inviata: {}", pushNotificationDTO.getTitle());
            return;
        }

        // Raggruppa per piattaforma se necessario
        Map<String, List<String>> tokensByPlatform = pushTokens.stream()
                .collect(Collectors.groupingBy(
                        PushToken::getPlatform,
                        Collectors.mapping(PushToken::getToken, Collectors.toList())
                ));

        for (Map.Entry<String, List<String>> tokenByPlatform : tokensByPlatform.entrySet()) {
            String platform = tokenByPlatform.getKey();
            List<String> tokens = tokenByPlatform.getValue();

            if ("ios".equalsIgnoreCase(platform)) {
                sendToIosTokens(tokens, pushNotificationDTO);
            } else if ("android".equalsIgnoreCase(platform)) {
                log.info("****************************************** sendToAndroidTokens");
                sendToAndroidTokens(tokens, pushNotificationDTO);
            } else {
                log.warn("Piattaforma non supportata: {}", platform);
            }
        }
    }

    private void sendToAndroidTokens(List<String> tokens, PushNotificationDTO dto) {
        // Se Firebase non è inizializzato, evita la chiamata che lancia IllegalStateException
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("FCM non inizializzato: salta invio FCM Android");
            return;
        }
        try {
            Notification notification = Notification.builder()
                    .setTitle(dto.getTitle())
                    .setBody(dto.getBody())
                    .setImage(dto.getImageUrl())
                    .build();

            AndroidConfig androidConfig = AndroidConfig.builder()
                    .setPriority(AndroidConfig.Priority.HIGH)
                    .setNotification(AndroidNotification.builder()
                            .setSound(dto.getSound() != null ? dto.getSound() : "default")
                            .build())
                    .build();

            MulticastMessage message = MulticastMessage.builder()
                    .setNotification(notification)
                    .setAndroidConfig(androidConfig)
                    .putAllData(getAllDataFromPushNotification(dto))
                    .addAllTokens(tokens)
                    .build();

            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(message);
            log.info("Android FCM inviato: {} successi, {} fallimenti", response.getSuccessCount(), response.getFailureCount());
            handleFailedTokens(tokens, response);
        } catch (Exception e) {
            log.error("Errore invio FCM Android", e);
        }
    }

    private void sendToIosTokens(List<String> tokens, PushNotificationDTO dto) {
        // Se Firebase non è inizializzato, evita la chiamata che lancia IllegalStateException
        if (FirebaseApp.getApps().isEmpty()) {
            log.warn("FCM non inizializzato: salta invio FCM iOS");
            return;
        }
        try {
            Notification notification = Notification.builder()
                    .setTitle(dto.getTitle())
                    .setBody(dto.getBody())
                    .setImage(dto.getImageUrl())
                    .build();

            ApnsConfig apnsConfig = ApnsConfig.builder()
                    .setAps(Aps.builder()
                            .setSound(dto.getSound() != null ? dto.getSound() : "default")
                            .build())
                    .build();

            MulticastMessage message = MulticastMessage.builder()
                    .setNotification(notification)
                    .setApnsConfig(apnsConfig)
                    .putAllData(getAllDataFromPushNotification(dto))
                    .addAllTokens(tokens)
                    .build();

            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(message);
            log.info("iOS FCM inviato: {} successi, {} fallimenti", response.getSuccessCount(), response.getFailureCount());
            handleFailedTokens(tokens, response);
        } catch (Exception e) {
            log.error("Errore invio FCM iOS", e);
        }
    }

    private Map<String, String> getAllDataFromPushNotification(PushNotificationDTO dto) {
        Map ret = new HashMap();
        ret.put("TYPE", dto.getTipoNotifica().getDescrizione());
        ret.put("EXPIRING_AT", dto.getExpiringAt().toString());
        return ret;
    }

    private void handleFailedTokens(List<String> tokens, BatchResponse response) {
        List<SendResponse> responses = response.getResponses();
        for (int i = 0; i < responses.size(); i++) {
            SendResponse sr = responses.get(i);
            if (!sr.isSuccessful() && sr.getException() != null) {
                String errorCode = sr.getException().getMessagingErrorCode() != null
                        ? sr.getException().getMessagingErrorCode().name()
                        : "UNKNOWN";
                
                String errorMessage = sr.getException().getMessage();
                String failedToken = tokens.get(i);

                log.error("Token fallito [{}]: errorCode={}, message={}, token={}", 
                        i, errorCode, errorMessage, failedToken.substring(0, Math.min(20, failedToken.length())) + "...");

                // Disattiva token non più validi o con SenderId mismatch
                if ("INVALID_ARGUMENT".equals(errorCode) || 
                    "UNREGISTERED".equals(errorCode) ||
                    (errorMessage != null && errorMessage.contains("SenderId mismatch"))) {
                    log.warn("Disattivo token non valido (error: {}, message: {})", errorCode, errorMessage);
                    deactivateToken(failedToken);
                }
            }
        }
    }
}
