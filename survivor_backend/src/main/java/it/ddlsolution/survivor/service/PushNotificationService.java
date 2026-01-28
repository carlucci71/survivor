package it.ddlsolution.survivor.service;

import com.google.auth.oauth2.GoogleCredentials;
import com.google.firebase.FirebaseApp;
import com.google.firebase.FirebaseOptions;
import com.google.firebase.messaging.*;
import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.entity.PushToken;
import it.ddlsolution.survivor.entity.User;
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
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PushNotificationService {

    private final PushTokenRepository pushTokenRepository;
    private final UserRepository userRepository;

    @Value("${push.fcm.enabled:false}")
    private boolean fcmEnabled;

    @Value("${push.fcm.credentials-path:}")
    private String fcmCredentialsPath;

    @Value("${push.fcm.credentials-json:}")
    private String fcmCredentialsJson;

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

                FirebaseApp.initializeApp(options);
                log.info("Firebase FCM inizializzato con successo");
            }
        } catch (IOException e) {
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
        } catch (Exception e){
            log.error("******************** REGISTER ERROR",e);
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
     * Invia una notifica push a un singolo utente (tutti i suoi token attivi)
     */
    public void sendNotificationToUser(Long userId, PushNotificationDTO notification) {
        List<PushToken> tokens = pushTokenRepository.findByUser_IdAndActiveTrue(userId);
        if (tokens.isEmpty()) {
            log.warn("Nessun token attivo per user {}", userId);
            return;
        }
        sendToTokens(tokens, notification);
    }

    /**
     * Invia una notifica push a più utenti
     */
    public void sendNotificationToUsers(List<Long> userIds, PushNotificationDTO notification) {
        List<PushToken> tokens = pushTokenRepository.findByUser_IdInAndActiveTrue(userIds);
        log.info("****************************************** INVIATA A TOKEN" + tokens.size());
        if (tokens.isEmpty()) {
            log.warn("Nessun token attivo per users {}", userIds);
            return;
        }
        log.info("****************************************** TOKEN -> " + tokens.get(0).getUser().getEmail());
        sendToTokens(tokens, notification);
    }

    /**
     * Logica di invio ai token (FCM per Android/iOS)
     */
    private void sendToTokens(List<PushToken> pushTokens, PushNotificationDTO notificationDTO) {
        if (!fcmEnabled) {
            log.warn("FCM disabilitato, notifica non inviata: {}", notificationDTO.getTitle());
            return;
        }

        // Raggruppa per piattaforma se necessario
        Map<String, List<String>> tokensByPlatform = pushTokens.stream()
                .collect(Collectors.groupingBy(
                        PushToken::getPlatform,
                        Collectors.mapping(PushToken::getToken, Collectors.toList())
                ));

        for (Map.Entry<String, List<String>> entry : tokensByPlatform.entrySet()) {
            String platform = entry.getKey();
            List<String> tokens = entry.getValue();

            if ("ios".equalsIgnoreCase(platform)) {
                sendToIosTokens(tokens, notificationDTO);
            } else if ("android".equalsIgnoreCase(platform)) {
                log.info("****************************************** sendToAndroidTokens");
                sendToAndroidTokens(tokens, notificationDTO);
            } else {
                log.warn("Piattaforma non supportata: {}", platform);
            }
        }
    }

    private void sendToAndroidTokens(List<String> tokens, PushNotificationDTO dto) {
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
                    .putAllData(convertData(dto.getData()))
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
                    .putAllData(convertData(dto.getData()))
                    .addAllTokens(tokens)
                    .build();

            BatchResponse response = FirebaseMessaging.getInstance().sendEachForMulticast(message);
            log.info("iOS FCM inviato: {} successi, {} fallimenti", response.getSuccessCount(), response.getFailureCount());
            handleFailedTokens(tokens, response);
        } catch (Exception e) {
            log.error("Errore invio FCM iOS", e);
        }
    }

    private void handleFailedTokens(List<String> tokens, BatchResponse response) {
        List<SendResponse> responses = response.getResponses();
        for (int i = 0; i < responses.size(); i++) {
            SendResponse sr = responses.get(i);
            if (!sr.isSuccessful() && sr.getException() != null) {
                String errorCode = sr.getException().getMessagingErrorCode() != null
                    ? sr.getException().getMessagingErrorCode().name()
                    : "UNKNOWN";

                // Disattiva token non più validi
                if ("INVALID_ARGUMENT".equals(errorCode) || "UNREGISTERED".equals(errorCode)) {
                    String failedToken = tokens.get(i);
                    log.warn("Token non valido, disattivo: {}", failedToken);
                    deactivateToken(failedToken);
                }
            }
        }
    }

    private Map<String, String> convertData(Object data) {
        if (data == null) {
            return new HashMap<>();
        }
        if (data instanceof Map) {
            @SuppressWarnings("unchecked")
            Map<String, String> map = (Map<String, String>) data;
            return map;
        }
        return new HashMap<>();
    }
}
