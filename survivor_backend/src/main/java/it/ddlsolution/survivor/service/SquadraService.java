package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;
    private final ObjectProvider<CacheableService> cacheableProvider;

    @Transactional(readOnly = true)
    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId, short anno) {
        List<Squadra> squadre = squadraRepository.findByNazioneOfCampionatoAndAnno(campionatoId, anno);
        return squadraMapper.toDTOList(squadre)
                .stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();
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
                .orElseThrow(() -> new RuntimeException("Squadra non trovata: " + nome));
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

}
