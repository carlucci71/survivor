package it.ddlsolution.survivor.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class VitaPersaDTO {
    private Long id;
    private Long idGiocatore;
    private String nicknameGiocatore;
    private Long idLega;
    private int giornata;
    private LocalDateTime persaAt;
}
