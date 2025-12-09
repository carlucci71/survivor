package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocataRequestDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.SquadraRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class GiocataService {
    private final GiocataRepository giocataRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final SquadraRepository squadraRepository;
    private final GiocataMapper giocataMapper;

    @Transactional
    public GiocataDTO inserisciGiocata(GiocataRequestDTO request) {
        Giocatore giocatore = giocatoreRepository.findById(request.getGiocatoreId())
                .orElseThrow(() -> new IllegalArgumentException("Giocatore non trovato"));
        Squadra squadra = squadraRepository.findById(request.getSquadraId())
                .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));
        Giocata giocata = new Giocata();
        giocata.setGiornata(request.getGiornata());
        giocata.setGiocatore(giocatore);
        giocata.setSquadra(squadra);
        giocata = giocataRepository.save(giocata);
        return giocataMapper.toDTO(giocata);
    }
}

