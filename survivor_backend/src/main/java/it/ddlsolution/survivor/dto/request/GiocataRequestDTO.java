package it.ddlsolution.survivor.dto.request;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

@Data
public class GiocataRequestDTO {
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraSigla;
    private Enumeratori.EsitoGiocata esitoGiocata;
}

