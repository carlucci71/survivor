package it.ddlsolution.survivor.dto;

import lombok.Builder;
import lombok.Data;

/**
 * Un evento avvenuto durante una partita live (gol, cartellino, sostituzione).
 * Usato solo dalla feature "risultati live" (vedi LiveScoreService), non persistito su DB.
 */
@Data
@Builder
public class EventoPartitaDTO {
    /** GOL | GIALLO | ROSSO | SOSTITUZIONE */
    private String tipo;
    /** Minuto di gioco, es. "45" o "90+3" */
    private String minuto;
    /** Sigla interna della squadra (stessa convenzione di Giocata.squadraSigla) */
    private String squadraSigla;
    /** Marcatore/ammonito/espulso, oppure giocatore uscito in caso di SOSTITUZIONE */
    private String giocatore;
    /** Solo per SOSTITUZIONE: giocatore subentrato */
    private String giocatoreSubentrato;
}
