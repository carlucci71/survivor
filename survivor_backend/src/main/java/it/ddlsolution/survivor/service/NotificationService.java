package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.NotificationDTO;
import it.ddlsolution.survivor.entity.Notification;
import it.ddlsolution.survivor.entity.User;
import it.ddlsolution.survivor.mapper.NotificationMapper;
import it.ddlsolution.survivor.repository.NotificationRepository;
import it.ddlsolution.survivor.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static it.ddlsolution.survivor.util.Utility.getInSeconds;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final NotificationMapper notificationMapper;

    @Transactional(readOnly = true)
    public List<NotificationDTO> listNotifications(Long userId, boolean active) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isEmpty()) {
            throw new RuntimeException("User not found: " + userId);
        }
        User user = userOpt.get();

        List<Notification> notifications = active
                ? notificationRepository.findByUserAndReadAndExpiringAtGreaterThanOrderByCreatedAtDesc(user, false, getInSeconds(LocalDateTime.now()))
                : notificationRepository.findByUserOrderByCreatedAtDesc(user);

        return notifications.stream()
                .map(notificationMapper::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public void markAsRead(Long notificationId, Long userId) {
        Notification notification = notificationRepository.findById(notificationId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notificationId));

        if (notification.getUser() == null || !notification.getUser().getId().equals(userId)) {
            throw new RuntimeException("Non autorizzato o notifica non appartiene all'utente");
        }

        if (Boolean.TRUE.equals(notification.getRead())) {
            // già letta, niente da fare
            return;
        }

        notification.setRead(true);
        notificationRepository.save(notification);
    }

    @Transactional
    public NotificationDTO createNotification(NotificationDTO dto) {
        if (dto == null) {
            throw new IllegalArgumentException("NotificationDTO cannot be null");
        }

        Long userId = dto.getUser() != null ? dto.getUser().getId() : null;
        if (userId == null) {
            throw new RuntimeException("User id missing in NotificationDTO");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        Notification notification = notificationMapper.toEntity(dto);
        // Ensure user association (mapper might not set full user)
        notification.setUser(user);

        // Let entity @PrePersist handle createdAt/read defaults if null
        Notification saved = notificationRepository.save(notification);
        return notificationMapper.toDTO(saved);
    }
}
