package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;

@Data
public class GiocataRequestDTO {
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraSigla;
    private Enumeratori.EsitoGiocata esitoGiocata;
}

