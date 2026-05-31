package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.RankingTennisDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Campionato;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;
    private final ObjectProvider<CacheableService> cacheableProvider;
    private final ObjectProvider<ICalendario> calendarioProvider;
    private final RankingTennisService rankingTennisService;

    @Transactional(readOnly = true)
    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId, short anno) {
        // Per il Roland Garros i giocatori vengono estratti dal tabellone (giornata 1 = main draw)
        if ("ROLAND_GARROS".equals(campionatoId)) {
            return getPlayersFromTabellone(campionatoId, anno);
        }
        List<Squadra> squadre;
        // Per i campionati internazionali (es. Mondiali) restituiamo tutte le
        // squadre registrate, incluse quelle non ancora qualificate, senza
        // filtrare tramite la tabella partita.
        if (campionatoId != null && campionatoId.startsWith("MONDIALI")) {
            squadre = squadraRepository.findAllByIdCampionato(campionatoId);
        } else {
            squadre = squadraRepository.findByNazioneOfCampionatoAndAnno(campionatoId, anno);
        }
        return squadraMapper.toDTOList(squadre)
                .stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
    }

    /** Normalizza il displayName in chiave-immagine: "Jannik Sinner" → "jannik_sinner" */
    private static String normalizzaNome(String displayName) {
        if (displayName == null) return "";
        return displayName.toLowerCase().replace(' ', '_');
    }

    /**
     * Estrae i giocatori dal tabellone Roland Garros.
     * Strategia a cascata:
     * 1. Giornata 1 da DB/cache (draw completo = 128 giocatori)
     * 2. Se vuota → fallback API per giornata 1
     * 3. Se ancora vuota → usa TUTTE le giornate in DB/cache (unione di tutti i round)
     *    Garantisce che i giocatori ancora in gara (es. ottavi) siano sempre visibili
     *    anche quando il round 1 non è più disponibile nell'API esterna.
     */
    private List<SquadraDTO> getPlayersFromTabellone(String campionatoId, short anno) {
        // Usa la union di TUTTI i round in DB/cache: questo garantisce che giocatori
        // entrati come Lucky Losers o Qualifiers in round successivi al round 1
        // (e quindi assenti dalla giornata 1) vengano comunque inclusi nella lista.
        List<PartitaDTO> partite = cacheableProvider.getIfAvailable().getPartiteCampionatoAnno(campionatoId, anno);

        if (partite.isEmpty()) {
            // Fallback: nessun dato in DB, chiama direttamente l'API per giornata 1
            log.info("Roland Garros: nessuna partita in DB, chiamo API tabellone direttamente");
            ICalendario calendario = calendarioProvider.getIfAvailable();
            if (calendario != null) {
                try {
                    CampionatoDTO campDto = new CampionatoDTO();
                    campDto.setId(campionatoId);
                    SportDTO sport = new SportDTO();
                    sport.setId("TENNIS");
                    campDto.setSport(sport);
                    campDto.setSquadre(new ArrayList<>());
                    campDto.setAnnoCorrente(anno);
                    partite = calendario.getPartite(campDto, 1, anno);
                } catch (Exception e) {
                    log.warn("Roland Garros fallback API call failed: {}", e.getMessage());
                }
            }
        }

        log.info("Roland Garros: costruisco lista giocatori da {} partite totali su tutti i round", partite.size());
        return extractPlayersFromPartite(partite, campionatoId);
    }

    /** Estrae giocatori unici da una lista di partite (casaSigla+fuoriSigla). */
    private static List<SquadraDTO> extractPlayersFromPartite(List<PartitaDTO> partite, String campionatoId) {
        Map<String, SquadraDTO> bySignla = new LinkedHashMap<>();
        // Dedup secondario "iniziale_cognome": cattura casi in cui lo stesso giocatore
        // è stato salvato con sigla diversa (es. "CARLOS_ALCARAZ" dal singolare e
        // "C._ALCARAZ" dal doppio). La chiave è "INIZIALE_COGNOME" estratta via extractNormKey.
        Map<String, String> normNameToSigla = new LinkedHashMap<>();

        for (PartitaDTO p : partite) {
            addPlayer(p.getCasaSigla(), p.getCasaNome(), campionatoId, bySignla, normNameToSigla);
            addPlayer(p.getFuoriSigla(), p.getFuoriNome(), campionatoId, bySignla, normNameToSigla);
        }
        return bySignla.values().stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
    }

    /**
     * Aggiunge un giocatore alla mappa deduplicata.
     * Salta i placeholder BYE/QUALIFIER e i giocatori già presenti con
     * sigla identica O con chiave "iniziale_cognome" identica
     * (es. "CARLOS_ALCARAZ" e "C._ALCARAZ" sono lo stesso giocatore).
     */
    private static void addPlayer(String sigla, String nome, String campionatoId,
                                   Map<String, SquadraDTO> bySignla,
                                   Map<String, String> normNameToSigla) {
        if (sigla == null || sigla.isEmpty()) return;
        // Salta placeholder che non sono giocatori reali
        if (sigla.startsWith("BYE") || sigla.startsWith("QUALIFIER") || sigla.startsWith("Q_")) return;

        // Dedup primario per sigla identica
        if (bySignla.containsKey(sigla)) return;

        // Dedup secondario "iniziale_cognome": cattura lo stesso giocatore
        // quando il doppio usa il nome abbreviato (es. "C._ALCARAZ" per "CARLOS_ALCARAZ").
        // Usa l'ultimo token come cognome e il primo carattere del primo token come iniziale.
        String normKey = extractNormKey(sigla);
        if (!normKey.isEmpty() && normNameToSigla.containsKey(normKey)) {
            log.debug("Squadra deduplicata per chiave '{}': scarto '{}', già presente come '{}'",
                    normKey, sigla, normNameToSigla.get(normKey));
            return;
        }

        SquadraDTO dto = new SquadraDTO();
        dto.setSigla(sigla);
        dto.setNome(nome != null ? nome : sigla);
        dto.setIdCampionato(campionatoId);
        bySignla.put(sigla, dto);
        if (!normKey.isEmpty()) {
            normNameToSigla.put(normKey, sigla);
        }
    }

    /**
     * Calcola una chiave di normalizzazione "iniziale_cognome" dalla sigla.
     * "CARLOS_ALCARAZ"   → "C_ALCARAZ"
     * "C._ALCARAZ"       → "C_ALCARAZ"  (stesso giocatore, nome abbreviato nel doppio)
     * "JANNIK_SINNER"    → "J_SINNER"
     * "FRANCISCO_CERUNDOLO"   → "F_CERUNDOLO"
     * "JUAN_MANUEL_CERUNDOLO" → "J_CERUNDOLO"  (cognomi diversi → nessun falso positivo)
     */
    private static String extractNormKey(String sigla) {
        if (sigla == null || sigla.isEmpty()) return "";
        // Conserva solo lettere maiuscole e underscore, poi split
        String[] tokens = sigla.toUpperCase().replaceAll("[^A-Z_]", "").split("_");
        // Filtra i token vuoti (prodotti da underscore consecutivi o iniziali come "C_")
        List<String> parts = Arrays.stream(tokens)
                .filter(t -> !t.isEmpty())
                .toList();
        if (parts.isEmpty()) return "";
        String cognome = parts.get(parts.size() - 1);            // ultimo token
        String iniziale = String.valueOf(parts.get(0).charAt(0)); // prima lettera del primo token
        return iniziale + "_" + cognome;
    }

    @Transactional(readOnly = true)
    public Squadra findBySiglaAndNazione(String squadraSigla, String nazione) {
        return squadraRepository.findBySiglaAndNazione(squadraSigla, nazione)
                .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));
    }

    /**
     * Per i campionati tennis (es. Roland Garros) i giocatori non sono nella
     * tabella squadra: li cerca per sigla + campionato e li crea al volo se mancanti.
     */
    @Transactional
    public Squadra findOrCreateBySiglaAndCampionato(String sigla, Campionato campionato) {
        String nazione = campionato.getNazione() != null ? campionato.getNazione() : "TENNIS";
        // Lookup con la stessa chiave della unique constraint (sigla, nazione)
        // per evitare duplicate-key se il record esiste già con nazione diversa o campionato diverso
        return squadraRepository.findBySiglaAndNazione(sigla, nazione)
                .orElseGet(() -> {
                    String nome = Arrays.stream(sigla.split("_"))
                            .map(w -> w.isEmpty() ? w : Character.toUpperCase(w.charAt(0)) + w.substring(1).toLowerCase())
                            .collect(Collectors.joining(" "));
                    Squadra s = new Squadra();
                    s.setSigla(sigla);
                    s.setNome(nome);
                    s.setNazione(nazione);
                    s.setCampionato(campionato);
                    log.info("Creata squadra tennis al volo: sigla={}, nome={}", sigla, nome);
                    return squadraRepository.save(s);
                });
    }

    @Transactional(readOnly = true)
    public List<SquadraDTO> getSquadreFromIdCampionato(String idCampionato) {
        List<Squadra> squadre = squadraRepository.findByNazioneOfCampionato(idCampionato);
        return squadraMapper.toDTOList(squadre);
    }

    @Transactional(readOnly = true)
    public SquadraDTO findByNome(String nome) {
        Squadra squadra = squadraRepository.findByNome(nome)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Squadra non trovata: " + nome));
        return squadraMapper.toDTO(squadra);
    }

    @Transactional(readOnly = true)
    public List<SquadraDTO> all() {
        return cacheableProvider.getIfAvailable().allCampionati()
                .stream()
                .flatMap(c -> c.getSquadre().stream())
                .distinct()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<SquadraDTO> getBySport(String sportId) {
        // Filtra le squadre in base allo sport
        return cacheableProvider.getIfAvailable().allCampionati()
                .stream()
                .filter(c -> sportId.equals(c.getSport().getId()))
                .flatMap(c -> c.getSquadre().stream())
                .distinct()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
    }

}
