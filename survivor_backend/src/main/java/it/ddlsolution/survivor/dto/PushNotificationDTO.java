package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PushNotificationDTO {
    private String title;
    private String body;
    private String imageUrl;
    private String sound;
    private Object data; // Map<String, String> per dati custom
}
