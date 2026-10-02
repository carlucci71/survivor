package it.ddlsolution.survivor.dto;

import lombok.Data;

/** Riga della lista admin delle foto profilo segnalate, nascoste o con caricamento bloccato. */
@Data
public class FotoSegnalataDTO {
    private Long giocatoreId;
    private String nickname;
    private long numSegnalazioni;
    /** Nascosta in automatico (troppe segnalazioni) in attesa di decisione. */
    private boolean nascosta;
    /** L'admin ha vietato nuovi caricamenti a questo giocatore. */
    private boolean bloccata;
    /** Esiste ancora un file da guardare/rimuovere. */
    private boolean haFoto;
}
