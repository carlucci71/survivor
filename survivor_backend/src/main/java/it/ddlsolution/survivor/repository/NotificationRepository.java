package it.ddlsolution.survivor.repository;

import it.ddlsolution.survivor.entity.Notification;
import it.ddlsolution.survivor.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByUserOrderByCreatedAtDesc(User user);

    List<Notification> findByUserAndReadAndExpiringAtGreaterThanOrderByCreatedAtDesc(User user, Boolean read, String expiringAt);

}
