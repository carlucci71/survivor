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
     * Estrae i giocatori dal tabellone Roland Garros (giornata 1 = draw completo).
     * Prima tenta da DB/cache; in fallback chiama direttamente l'API tabellone.
     */
    private List<SquadraDTO> getPlayersFromTabellone(String campionatoId, short anno) {
        // Prova prima dalla cache/DB (populate da processCampionatoTransactional)
        List<PartitaDTO> partite = cacheableProvider.getIfAvailable().getPartiteCampionatoAnno(campionatoId, anno);
        List<PartitaDTO> giornata1 = partite.stream().filter(p -> p.getGiornata() == 1).toList();

        if (giornata1.isEmpty()) {
            // Fallback: chiama il calendario API direttamente
            log.info("Roland Garros: partite non ancora in DB, chiamo API tabellone direttamente");
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
                    giornata1 = calendario.getPartite(campDto, 1, anno);
                } catch (Exception e) {
                    log.warn("Roland Garros fallback API call failed: {}", e.getMessage());
                }
            }
        }

        return extractPlayersFromPartite(giornata1, campionatoId);
    }

    /** Estrae giocatori unici da una lista di partite (casaSigla+fuoriSigla). */
    private static List<SquadraDTO> extractPlayersFromPartite(List<PartitaDTO> partite, String campionatoId) {
        Map<String, SquadraDTO> bySignla = new LinkedHashMap<>();
        for (PartitaDTO p : partite) {
            if (p.getCasaSigla() != null && !bySignla.containsKey(p.getCasaSigla())) {
                SquadraDTO dto = new SquadraDTO();
                dto.setSigla(p.getCasaSigla());
                dto.setNome(p.getCasaNome() != null ? p.getCasaNome() : p.getCasaSigla());
                dto.setIdCampionato(campionatoId);
                bySignla.put(p.getCasaSigla(), dto);
            }
            if (p.getFuoriSigla() != null && !bySignla.containsKey(p.getFuoriSigla())) {
                SquadraDTO dto = new SquadraDTO();
                dto.setSigla(p.getFuoriSigla());
                dto.setNome(p.getFuoriNome() != null ? p.getFuoriNome() : p.getFuoriSigla());
                dto.setIdCampionato(campionatoId);
                bySignla.put(p.getFuoriSigla(), dto);
            }
        }
        return bySignla.values().stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
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
