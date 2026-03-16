package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LegaJoinRequestDTO {
    private Long id;
    private Long legaId;
    private String legaName;
    private Long giocatoreId;
    private String giocatoreNickname;
    private String giocatoreEmail;
    private Enumeratori.StatoRichiesta stato;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
