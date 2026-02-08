package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.PartitaMockDTO;
import it.ddlsolution.survivor.entity.PartitaMock;
import it.ddlsolution.survivor.mapper.PartitaMockMapper;
import it.ddlsolution.survivor.repository.PartitaMockRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

import static it.ddlsolution.survivor.util.Utility.toLocalDateTimeItaly;

@Service
@RequiredArgsConstructor
public class PartitaMockService {
    private final PartitaMockRepository partitaMockRepository;
    private final PartitaService partitaService;
    private final ParametriService parametriService;
    private final PartitaMockMapper partitaMockMapper;

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

    @Transactional(readOnly = true)
    public List<PartitaMockDTO> getPartiteDellaGiornata(String idCampionato, Short anno, Integer giornata) {
        List<PartitaMock> partiteMock = partitaMockRepository.findByCampionato_IdAndAnnoAndGiornataOrderByOrario(idCampionato, anno, giornata);
        return partitaMockMapper.toDTOList(partiteMock);
    }

    @Transactional(readOnly = true)
    public LocalDateTime getDataRiferimento(){
        String dateString = parametriService.valueByCodeSystem(Enumeratori.CodiciParametri.MOCK_LOCALDATE_RIF);
        return toLocalDateTimeItaly(dateString);
    }

}
