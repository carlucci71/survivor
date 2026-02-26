package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.mapper.PartitaMapper;
import it.ddlsolution.survivor.repository.PartitaRepository;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Service
@RequiredArgsConstructor
public class PartitaService {
    private final PartitaRepository partitaRepository;
    private final PartitaMapper partitaMapper;
    private final Utility utility;

    @Autowired
    @Lazy
    private CacheableService cacheableService;

    @Value("${REFRESH_TERMINATE:false}")
    private boolean refreshTerminate;


    @Transactional
    public PartitaDTO aggiornaPartitaSuDB(PartitaDTO partitaDTO) {
        Partita nuovaPartita = partitaMapper.toEntity(partitaDTO);
        nuovaPartita.setImplementationExternalApi(utility.getImplementationExternalApi());

        // Verifica se esiste già una nuovaPartita con gli stessi criteri
        Optional<Partita> partitaEsistente = partitaRepository.findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSiglaAndAnno(
                partitaDTO.getCampionatoId(), partitaDTO.getGiornata(), utility.getImplementationExternalApi(),
                partitaDTO.getCasaSigla(), partitaDTO.getFuoriSigla(), nuovaPartita.getAnno());

        if (partitaEsistente.isPresent()) {
            Partita esistente = partitaEsistente.get();
            if (refreshTerminate || esistente.getStato() != Enumeratori.StatoPartita.TERMINATA) {
                //FORZATA
                nuovaPartita.setId(esistente.getId());
                nuovaPartita.setForzata(esistente.getForzata());
                nuovaPartita = partitaRepository.save(nuovaPartita);
                return partitaMapper.toDTO(nuovaPartita);
            } else {
                return partitaMapper.toDTO(esistente);
            }
        } else {
            // Se non esiste, inseriamo una nuova nuovaPartita
            nuovaPartita = partitaRepository.save(nuovaPartita);
            return partitaMapper.toDTO(nuovaPartita);
        }
    }

    @Transactional
    public void resetDaGiocareGiornata(String idCampionato, short anno, int giornata) {
        partitaRepository.updateStatoByCampionato(Enumeratori.StatoPartita.DA_GIOCARE,idCampionato,anno,giornata,CALENDARIO_MOCK);
    }

    @Transactional
    public int resetMock(String idCampionato, short anno) {
        return partitaRepository.deleteByCampionatoAndAnnoAndImplementationExternalApi(idCampionato,anno,CALENDARIO_MOCK);
    }

    @Transactional
    public PartitaDTO aggiornaForzataPartita(String campionatoId, short anno, int giornata, String casaSigla, String fuoriSigla, Boolean forzata) {
        Optional<Partita> partitaOpt = partitaRepository.findByCampionato_IdAndGiornataAndImplementationExternalApiAndCasaSiglaAndFuoriSiglaAndAnno(
                campionatoId, giornata, utility.getImplementationExternalApi(), casaSigla, fuoriSigla, anno
        );

        if (partitaOpt.isPresent()) {
            Partita partita = partitaOpt.get();
            partita.setForzata(forzata);
            partita = partitaRepository.save(partita);
            // Invalida la cache per far sì che la prossima lettura rilegga dal DB con forzata aggiornato
            cacheableService.clearCachePartite(campionatoId, anno);
            return partitaMapper.toDTO(partita);
        }

        throw new RuntimeException("Partita non trovata");
    }

}

