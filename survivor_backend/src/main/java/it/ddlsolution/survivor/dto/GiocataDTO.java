package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enumeratori;
import lombok.Data;

@Data
public class GiocataDTO {
    private Long id;
    private Integer giornata;
    private Long giocatoreId;
    private String squadraId;
    private enumeratori.EsitoGiocata esito;
}

