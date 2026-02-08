package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.repository.PartitaMockRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import static it.ddlsolution.survivor.util.Utility.toLocalDateTimeItaly;

@Service
@RequiredArgsConstructor
public class PartitaMockService {
    private final PartitaMockRepository partitaMockRepository;
    private final PartitaService partitaService;

    @Transactional
    public void aggiornaPartitaMockDiUnaGiornata(String idCampionato, short anno, int giornata, String casaSigla, String fuoriSigla, Integer scoreCasa, Integer scoreFuori, String orarioPartita) {
        if (scoreCasa != null && scoreFuori != null) {
            partitaMockRepository.updateScoreByCampionato(scoreCasa, scoreFuori, idCampionato, anno, giornata, casaSigla, fuoriSigla);
        }
        if (orarioPartita != null) {
            partitaMockRepository.updateOrarioByCampionato(toLocalDateTimeItaly(orarioPartita), idCampionato, anno, giornata, casaSigla, fuoriSigla);
        }
    }

    @Transactional
    public void reset(String idCampionato, Short anno, String implementazioneApiFrom) {
        partitaMockRepository.deleteByCampionatoAndAnno(idCampionato, anno);
        partitaService.resetMock(idCampionato, anno);
        partitaMockRepository.ribaltaCampionatoInMock(idCampionato, anno, implementazioneApiFrom);
    }
}
