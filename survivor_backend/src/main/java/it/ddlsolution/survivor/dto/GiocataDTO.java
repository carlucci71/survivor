package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.util.Map;

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
    private Boolean pubblica;
    private java.math.BigDecimal quotaBloccata;
    private java.math.BigDecimal punti;
    private Map<String, Integer> reactions;
    private String miaReaction;
}

