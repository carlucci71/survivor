package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;

    @Transactional(readOnly = true)
    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId) {
        List<Squadra> squadre = squadraRepository.findByNazioneOfCampionato(campionatoId);
        List<SquadraDTO> squadreDTO = squadraMapper.toDTOList(squadre)
                .stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();

        return squadreDTO;
    }

    @Transactional(readOnly = true)
    public Squadra findBySiglaAndCampionato_Id(String squadraSigla, String campionatoId){
        return squadraRepository.findBySiglaAndCampionato_Id(squadraSigla, campionatoId)
                .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));
    }

}

