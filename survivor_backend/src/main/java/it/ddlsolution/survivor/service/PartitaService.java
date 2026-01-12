package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.mapper.PartitaMapper;
import it.ddlsolution.survivor.repository.PartitaRepository;
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
    private final Environment environment;


    @Transactional
    public PartitaDTO salvaSeNonTerminata(PartitaDTO partitaDTO) {
        Partita partita = partitaMapper.toEntity(partitaDTO);
        partita.setImplementationExternalApi(getImplementationExternalApi());

        // Verifica se esiste già una partita con gli stessi criteri
        Optional<Partita> partitaEsistente = partitaRepository.findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSigla(
                partitaDTO.getCampionatoId(), partitaDTO.getGiornata(), CALENDARIO_API2,
                partitaDTO.getCasaSigla(), partitaDTO.getFuoriSigla());

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

    @Transactional(readOnly = true)
    public List<PartitaDTO> getPartiteFromDb(String idCampionato, int giornata){
        List<Partita> partite = partitaRepository.findByCampionato_IdAndGiornataAndImplementationExternalApi(idCampionato, giornata, getImplementationExternalApi());
        return partitaMapper.toDTOList(partite);
    }

    private String getImplementationExternalApi() {
        String[] activeProfiles = environment.getActiveProfiles();
        String implementationExternalApi = Arrays.stream(activeProfiles)
                .filter(p -> p.equals(CALENDARIO_MOCK) || p.equals(CALENDARIO_API2))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Implementazione Api External non trovata"));
        return implementationExternalApi;
    }

}

