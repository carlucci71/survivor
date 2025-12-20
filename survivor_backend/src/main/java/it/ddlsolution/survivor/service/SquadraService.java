package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;

    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId) {
        List<Squadra> squadre = squadraRepository.findByCampionato_Id(campionatoId);
        List<SquadraDTO> squadreDTO = squadraMapper.toDTOList(squadre)
                .stream()
                .sorted(Comparator.comparing(SquadraDTO::getNome))
                .toList();

        return squadreDTO;
    }

}

