package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

@Data
public class GiocataDTO {
    private Long id;
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraId;
    private String squadraSigla;
    private Enumeratori.EsitoGiocata esito;
    private String forzatura;
    private Boolean pubblica; // Se true, la giocata è visibile a tutti; se false/null, è nascosta fino all'inizio della giornata
}

