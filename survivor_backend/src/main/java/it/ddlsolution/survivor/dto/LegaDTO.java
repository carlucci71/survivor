package it.ddlsolution.survivor.dto;

import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Data
public class LegaDTO {
    private Long id;
    private int giornataIniziale;
    private int giornataDaGiocare;
    private Integer giornataCalcolata;
    private Integer giornataFinale;
    private List<Integer> edizioni;
    private String name;
    private Integer edizione;
    private boolean withPwd;
    private Enumeratori.StatoLega stato;
    private CampionatoDTO campionato;
    private List<GiocatoreDTO> giocatori;
    private int giornataCorrente;
    private Enumeratori.StatoPartita statoGiornataCorrente;
    private Enumeratori.RuoloGiocatoreLega ruoloGiocatoreLega;
    private Map<Integer,Enumeratori.StatoPartita> statiGiornate;
    private LocalDateTime inizioProssimaGiornata;
    private short anno;
    private boolean pubblica;
    private int numPartecipanti;
    private Integer maxPartecipanti;
    private boolean accessoLibero;
    private int richiesteInAttesa;
    /** Giocata dell'utente corrente per la giornata in corso (null se non ancora effettuata) */
    private GiocataDTO miaGiocataCorrente;
    /** Ultima giocata con esito definitivo (OK/KO): usata dalla home per mostrare il risultato precedente quando non c'è ancora una pick per la giornata corrente */
    private GiocataDTO miaUltimaGiocataConEsito;
    /** Modalità di gioco della lega (SURVIVOR o CAMPIONATO) */
    private Enumeratori.ModalitaLega modalita;
}

