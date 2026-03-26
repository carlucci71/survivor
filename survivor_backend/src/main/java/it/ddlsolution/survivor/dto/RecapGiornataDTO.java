package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class RecapGiornataDTO {

    private Long legaId;
    private String legaNome;
    private Integer edizione;
    private Integer giornata;           // giornata assoluta del campionato
    private Integer giornataRelativa;   // numero progressivo nella lega (1, 2, 3…)
    private String campionatoNome;
    private String sport;
    private int totaleMembri;           // tutti i partecipanti alla giornata
    private int sopravvissuti;          // ancora ATTIVI dopo questa giornata
    private int eliminatiQuestaGiornata;
    private int totaleEliminati;
    private List<PickEntry> picks;
    private StatGiornata stats;

    @Data
    @Builder
    public static class PickEntry {
        private String nickname;
        private String squadraNome;
        private String squadraSigla;
        private Enumeratori.EsitoGiocata esito; // OK / KO / null (non ha giocato)
        private Enumeratori.StatoGiocatore statoDopoGiornata;
        private boolean eliminatoQuestaGiornata;
        private boolean forzata;
    }

    @Data
    @Builder
    public static class StatGiornata {
        private String squadraPiuScelta;     // team scelto dal maggior numero di giocatori
        private int quanti;                  // quanti l'hanno scelta
        private String pickPiuReagito;       // nickname del giocatore con più reazioni emoji
        private int reazioni;
    }
}
