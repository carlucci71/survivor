package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.mapper.PartitaMapper;
import it.ddlsolution.survivor.repository.PartitaRepository;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;
import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Service
@RequiredArgsConstructor
public class PartitaService {
    private final PartitaRepository partitaRepository;
    private final PartitaMapper partitaMapper;
    private final Utility utility;


    @Transactional
    public PartitaDTO salvaSeNonTerminata(PartitaDTO partitaDTO) {
        Partita partita = partitaMapper.toEntity(partitaDTO);
        partita.setImplementationExternalApi(utility.getImplementationExternalApi());

        // Verifica se esiste già una partita con gli stessi criteri
        Optional<Partita> partitaEsistente = partitaRepository.findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSiglaAndAnno(
                partitaDTO.getCampionatoId(), partitaDTO.getGiornata(), CALENDARIO_API2,
                partitaDTO.getCasaSigla(), partitaDTO.getFuoriSigla(), partita.getAnno());

        if (partitaEsistente.isPresent()) {
            Partita esistente = partitaEsistente.get();
            if (esistente.getStato() != Enumeratori.StatoPartita.TERMINATA) {
                partita.setId(esistente.getId());
                partita = partitaRepository.save(partita);
                return partitaMapper.toDTO(partita);
            } else {
                return partitaMapper.toDTO(esistente);
            }
        } else {
            // Se non esiste, inseriamo una nuova partita
            partita = partitaRepository.save(partita);
            return partitaMapper.toDTO(partita);
        }
    }
/*
    @Transactional(readOnly = true)
    public List<PartitaDTO> getPartiteFromDb(String idCampionato, short anno){
        List<Partita> partite = partitaRepository.findByCampionato_IdAndImplementationExternalApiAndAnno(idCampionato, utility.getImplementationExternalApi(),anno);
        return partitaMapper.toDTOList(partite);
    }

    @Transactional(readOnly = true)
    public List<PartitaDTO> getPartiteFromDb(String idCampionato, int giornata, short anno){
        return getPartiteFromDb(idCampionato,anno)
                .stream()
                .filter(p->p.getGiornata()==giornata)
                .toList();
    }
*/

}

