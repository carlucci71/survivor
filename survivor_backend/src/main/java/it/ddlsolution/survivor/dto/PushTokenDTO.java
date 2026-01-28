package it.ddlsolution.survivor.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PushTokenDTO {
    private String token;
    private String platform;
    private String deviceId;
}
