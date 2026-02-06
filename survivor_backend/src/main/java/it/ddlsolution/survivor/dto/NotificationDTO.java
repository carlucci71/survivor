package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
public class NotificationDTO {
    private Long id;
    private UserDTO user;
    private String title;
    private String body;
    private String type;
    private String imageUrl;
    private Boolean read = false;
    private OffsetDateTime createdAt;
    private String expiringAt;
}