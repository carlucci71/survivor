package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GiocataService {
    private final GiocataRepository giocataRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final LegaRepository legaRepository;
    private final SquadraRepository squadraRepository;
    private final GiocataMapper giocataMapper;
    private final GiocatoreMapper giocatoreMapper;

    @Transactional
    public GiocatoreDTO inserisciGiocata(GiocataRequestDTO request) {
        Giocatore giocatore = giocatoreRepository.findById(request.getGiocatoreId())
                .orElseThrow(() -> new IllegalArgumentException("Giocatore non trovato"));
        Lega lega = legaRepository.findById(request.getLegaId())
                .orElseThrow(() -> new IllegalArgumentException("Lega non trovata"));
        Squadra squadra = squadraRepository.findBySiglaAndCampionato_Id(request.getSquadraSigla(), lega.getCampionato().getId())
                .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));


        Giocata giocata = giocataRepository.findByGiornataAndGiocatoreAndLega(request.getGiornata(), giocatore, lega).orElse(new Giocata());
        giocata.setGiornata(request.getGiornata());
        giocata.setGiocatore(giocatore);
        giocata.setLega(lega);
        giocata.setSquadra(squadra);
        giocataRepository.save(giocata);
        giocatore = giocatoreRepository.findById(request.getGiocatoreId())
                .orElseThrow(() -> new IllegalArgumentException("Giocatore non trovato"));
        GiocatoreDTO dto = giocatoreMapper.toDTO(giocatore);
        dto.setGiocate(
                dto.getGiocate().stream().filter(g -> g.getLegaId().equals(lega.getId())).toList()
        );
        return dto;
    }
}

