package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

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