package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
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
}

