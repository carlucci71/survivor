package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.RankingTennisDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;
    private final ObjectProvider<CacheableService> cacheableProvider;
    private final RankingTennisService rankingTennisService;

    @Transactional(readOnly = true)
    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId, short anno) {
        // Per il Roland Garros non esistono partite nel DB: restituiamo il ranking ATP live.
        if ("ROLAND_GARROS".equals(campionatoId)) {
            return rankingTennisService.getRankingAtp().stream()
                    .map(p -> {
                        SquadraDTO dto = new SquadraDTO();
                        dto.setSigla(normalizzaNome(p.getDisplayName()));
                        dto.setNome(p.getDisplayName());
                        dto.setIdCampionato("ROLAND_GARROS");
                        return dto;
                    })
                    .toList();
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

    @Transactional(readOnly = true)
    public Squadra findBySiglaAndNazione(String squadraSigla, String nazione) {
        return squadraRepository.findBySiglaAndNazione(squadraSigla, nazione)
                .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));
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
