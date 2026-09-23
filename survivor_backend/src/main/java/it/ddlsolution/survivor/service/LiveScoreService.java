package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaLiveDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.service.externalapi.API2.LiveScoreGazzettaClient;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;

/**
 * Bottone "risultati live" della home: prima versione, solo Serie A (vedi conversazione con
 * l'utente su costi/rischi di interrogare l'API esterna troppo spesso). Poi estesa a Serie B,
 * Liga e Premier League: stessa logica, generalizzata (vedi partiteGiornataPerUtente/Condiviso).
 *
 * Due responsabilità separate:
 * 1) capire se mostrare qualcosa a QUESTO utente (deve avere una lega attiva in quel campionato);
 * 2) recuperare le partite della giornata "corrente" (in corso o appena conclusa, es. i risultati
 *    di stasera), in una cache CONDIVISA fra tutti gli utenti (chiave = campionato, non utente),
 *    aggiornata al massimo ogni ~50s (vedi CacheConfig.LIVE_SERIE_A / LIVE_SCORE_MULTI).
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class LiveScoreService {

    public static final String SERIE_A_ID = "SERIE_A";
    /** Campionati aggiunti dopo la Serie A per il bottone "risultati live": stesso meccanismo,
     *  ma su una cache/endpoint generici invece di uno dedicato come per la Serie A. */
    public static final Set<String> ALTRI_CAMPIONATI_LIVE = Set.of("SERIE_B", "LIGA", "PREMIER_LEAGUE");
    /** TEMPORANEO PER TEST: true = mostra il bottone a tutti, anche senza lega Serie A attiva.
     *  Rimettere a false finito il test in ambiente di test. */
    private static final boolean BYPASS_CONTROLLO_LEGA_ATTIVA_PER_TEST = false;

    private final LegaRepository legaRepository;
    private final CampionatoService campionatoService;
    private final ObjectProvider<LiveScoreGazzettaClient> liveScoreGazzettaClientProvider;
    // Self provider: una chiamata diretta (this.xxx(...)) salterebbe il proxy Spring e quindi la
    // cache @Cacheable. Passando dal proxy (stesso trucco di CacheableService.selfProvider) la
    // condivisione della cache fra tutti gli utenti funziona davvero.
    private final ObjectProvider<LiveScoreService> selfProvider;

    public List<PartitaLiveDTO> partiteGiornataSerieAPerUtente(Long userId) {
        boolean haLegaSerieAAttiva = legaRepository.findByGiocatoreLeghe_Giocatore_User_Id(userId)
                .stream()
                .anyMatch(l -> l.getCampionato() != null
                        && SERIE_A_ID.equals(l.getCampionato().getId())
                        && l.getStato() != Enumeratori.StatoLega.TERMINATA);

        if (!haLegaSerieAAttiva) {
            if (!BYPASS_CONTROLLO_LEGA_ATTIVA_PER_TEST) {
                return List.of();
            }
            log.warn("[TEST] Nessuna lega Serie A attiva per l'utente {}: bottone live mostrato comunque (BYPASS_CONTROLLO_LEGA_ATTIVA_PER_TEST=true)", userId);
        }

        return selfProvider.getObject().partiteGiornataSerieACondiviso();
    }

    @Cacheable(cacheNames = "LIVE_SERIE_A", key = "'current'")
    public List<PartitaLiveDTO> partiteGiornataSerieACondiviso() {
        LiveScoreGazzettaClient client = liveScoreGazzettaClientProvider.getIfAvailable();
        if (client == null) {
            return List.of();
        }
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(SERIE_A_ID);
        short anno = campionatoDTO.getAnnoCorrente();

        // "giornataDaGiocare" è la PROSSIMA giornata non ancora iniziata (nessuna partita
        // giocata): quella immediatamente precedente è quindi sempre la giornata "corrente" da
        // mostrare, che sia ancora in corso (partite miste finite/in corso/da giocare) o appena
        // conclusa del tutto (es. i risultati di stasera).
        int giornata = Math.max(1, campionatoDTO.getGiornataDaGiocare() - 1);
        return client.getPartiteGiornata(campionatoDTO, giornata, anno);
    }

    /**
     * Stessa logica di partiteGiornataSerieAPerUtente, generalizzata per Serie B/Liga/Premier
     * League (vedi ALTRI_CAMPIONATI_LIVE). Non usata per la Serie A, che resta sul suo metodo/
     * cache/endpoint dedicati per non toccare un percorso già in produzione.
     */
    public List<PartitaLiveDTO> partiteGiornataPerUtente(Long userId, String campionatoId) {
        if (!ALTRI_CAMPIONATI_LIVE.contains(campionatoId)) {
            return List.of();
        }
        boolean haLegaAttiva = legaRepository.findByGiocatoreLeghe_Giocatore_User_Id(userId)
                .stream()
                .anyMatch(l -> l.getCampionato() != null
                        && campionatoId.equals(l.getCampionato().getId())
                        && l.getStato() != Enumeratori.StatoLega.TERMINATA);

        if (!haLegaAttiva) {
            return List.of();
        }

        return selfProvider.getObject().partiteGiornataCondivisa(campionatoId);
    }

    @Cacheable(cacheNames = "LIVE_SCORE_MULTI", key = "#campionatoId")
    public List<PartitaLiveDTO> partiteGiornataCondivisa(String campionatoId) {
        LiveScoreGazzettaClient client = liveScoreGazzettaClientProvider.getIfAvailable();
        if (client == null) {
            return List.of();
        }
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(campionatoId);
        short anno = campionatoDTO.getAnnoCorrente();
        int giornata = Math.max(1, campionatoDTO.getGiornataDaGiocare() - 1);
        return client.getPartiteGiornata(campionatoDTO, giornata, anno);
    }
}
