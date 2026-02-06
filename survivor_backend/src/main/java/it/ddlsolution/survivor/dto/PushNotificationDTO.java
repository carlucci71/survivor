package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushNotificationDTO {
    private String title;
    private String body;
    private String imageUrl;
    private String sound;
    private String type;
    private LocalDateTime expiringAt;

    public LocalDateTime getExpiringAt() {
        if (expiringAt==null){
            return LocalDateTime.of(2050,1,1,12,0);
        }
        return expiringAt;
    }
}
