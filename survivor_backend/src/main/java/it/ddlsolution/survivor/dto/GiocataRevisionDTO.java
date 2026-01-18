package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GiocataRevisionDTO {

    // Dati della revisione
    private Long revisionNumber;
    private LocalDateTime revisionDate;
    private String username;
    private Long userId;
    private String revisionType; // CREAZIONE, MODIFICA, ELIMINAZIONE

    // Dati della Giocata in quella revisione
    private Long id;
    private Integer giornata;
    private Long giocatoreId;
    private String giocatoreNome;
    private Long legaId;
    private String legaNome;
    private String squadraId;
    private String squadraSigla;
    private Enumeratori.EsitoGiocata esito;
    private String forzatura;

    public static LocalDateTime convertTimestamp(Long timestamp) {
        if (timestamp == null) {
            return null;
        }
        return LocalDateTime.ofInstant(Instant.ofEpochMilli(timestamp), ZoneId.systemDefault());
    }
}
