package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class LegaJoinRequestDTO {
    private Long id;
    private Long legaId;
    private String legaName;
    /** Stato della lega (TERMINATA ecc.): serve al leader per mettere in fondo le richieste delle leghe concluse. */
    private Enumeratori.StatoLega legaStato;
    private Long giocatoreId;
    private String giocatoreNickname;
    private String giocatoreEmail;
    private Enumeratori.StatoRichiesta stato;
    private LocalDateTime createdAt;
    private LocalDateTime resolvedAt;
}
