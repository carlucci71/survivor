package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.SquadraMapper;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SquadraService {
    private final SquadraRepository squadraRepository;
    private final SquadraMapper squadraMapper;

    public List<SquadraDTO> getSquadreByCampionatoId(String campionatoId) {
        List<Squadra> squadre = squadraRepository.findByCampionato_Id(campionatoId);
        return squadraMapper.toDTOList(squadre);
    }
}

