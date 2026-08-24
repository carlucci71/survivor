package it.ddlsolution.survivor.dto;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Partita in corso mostrata nel banner "risultati live" della home. Dato non persistito,
 * pensato per essere rinfrescato ogni 45-60s (vedi LiveScoreService).
 */
@Data
@Builder
public class PartitaLiveDTO {
    private String casaNome;
    private String casaSigla;
    private String fuoriNome;
    private String fuoriSigla;
    private Integer scoreCasa;
    private Integer scoreFuori;
    /** Minuto di gioco corrente, es. "59" o "45+2"; valorizzato solo se stato=IN_CORSO */
    private String minuto;
    /** DA_GIOCARE | IN_CORSO | TERMINATA */
    private String stato;
    /** true se la partita è IN_CORSO ma in questo momento è l'intervallo (il minuto resta fermo) */
    private boolean intervallo;
    /** Calcio d'inizio (ora italiana): usato in UI per le partite ancora DA_GIOCARE */
    private LocalDateTime orario;
    private List<EventoPartitaDTO> eventi;
}
