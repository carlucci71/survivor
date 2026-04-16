package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
public class GiocataDTO {
    private Long id;
    private Integer giornata;
    private Long giocatoreId;
    private Long legaId;
    private String squadraId;
    private String squadraSigla;
    private String squadraNome;
    private Enumeratori.EsitoGiocata esito;
    private String forzatura;
    private Boolean pubblica; // Se true, la giocata è visibile a tutti; se false/null, è nascosta fino all'inizio della giornata
    // reactions: emoji -> conteggio (es. {"👏": 2, "🔥": 1})
    private Map<String, Integer> reactions;
    // emoji scelta dall'utente corrente (null se non ha reagito)
    private String miaReaction;
    // reactionAutori: emoji -> lista nomi giocatori (es. {"👏": ["Mario", "Luigi"]})
    private Map<String, List<String>> reactionAutori;
}

