package it.ddlsolution.survivor.dto.request;

import com.fasterxml.jackson.annotation.JsonIgnore;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.util.Map;

@Data
public class GiocataRequestDTO {
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraSigla;
    private Enumeratori.EsitoGiocata esitoGiocata;
    private Boolean pubblica; // Se true, la giocata è visibile a tutti; se false/null, è nascosta fino all'inizio della giornata
    @JsonIgnore
    private Map<String, Object> guardReturn;
}

