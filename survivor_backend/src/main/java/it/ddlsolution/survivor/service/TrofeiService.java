package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.StatisticheTrofeiDTO;
import it.ddlsolution.survivor.dto.TrofeoDTO;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.TrofeiRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class TrofeiService {

    private final TrofeiRepository trofeiRepository;
    private final GiocataRepository giocataRepository;

    /**
     * Ottiene le statistiche complete dei trofei di un giocatore
     */
    @Transactional(readOnly = true)
    public StatisticheTrofeiDTO getStatisticheTrofei(Long giocatoreId) {
        log.debug("Recupero statistiche trofei per giocatore: {}", giocatoreId);

        StatisticheTrofeiDTO stats = new StatisticheTrofeiDTO();

        // Recupera tutti i trofei (leghe con posizione finale)
        List<GiocatoreLega> trofei = trofeiRepository.findTrofeiByGiocatoreId(giocatoreId);

        // Mappa a DTO
        List<TrofeoDTO> trofeiDTO = trofei.stream()
                .map(this::mapToTrofeoDTO)
                .collect(Collectors.toList());

        stats.setTrofei(trofeiDTO);

        // Calcola statistiche aggregate
        Long vittorie = trofeiRepository.countVittorieByGiocatoreId(giocatoreId);
        Long podi = trofeiRepository.countPodiByGiocatoreId(giocatoreId);
        Long torneiGiocati = trofeiRepository.countTorneiGiocatiByGiocatoreId(giocatoreId);

        stats.setVittorie(vittorie.intValue());
        stats.setPodi(podi.intValue());
        stats.setTorneiGiocati(torneiGiocati.intValue());

        // Calcola win rate
        if (torneiGiocati > 0) {
            stats.setWinRate((vittorie.doubleValue() / torneiGiocati.doubleValue()) * 100);
        } else {
            stats.setWinRate(0.0);
        }

        log.debug("Statistiche calcolate - Vittorie: {}, Podi: {}, Tornei: {}, WinRate: {}%",
                vittorie, podi, torneiGiocati, stats.getWinRate());

        return stats;
    }

    /**
     * Mappa un GiocatoreLega a TrofeoDTO
     */
    private TrofeoDTO mapToTrofeoDTO(GiocatoreLega gl) {
        TrofeoDTO dto = new TrofeoDTO();
        dto.setIdLega(gl.getLega().getId());
        dto.setNomeLega(gl.getLega().getName());
        dto.setEdizione(gl.getLega().getEdizione());
        dto.setAnno(gl.getLega().getAnno());
        dto.setPosizioneFinale(gl.getPosizioneFinale());
        dto.setNomeCampionato(gl.getLega().getCampionato().getNome());
        dto.setNomeSport(gl.getLega().getCampionato().getSport().getNome());
        dto.setIdSport(gl.getLega().getCampionato().getSport().getId());

        // Calcola numero giornate giocate - conta le giocate dalla entity
        if (!ObjectUtils.isEmpty(gl.getLega().getGiornataFinale())) {
            dto.setGiornateGiocate(gl.getLega().getGiornataFinale() - gl.getLega().getGiornataIniziale()+1);
        }

        // Recupera ultima squadra scelta (se disponibile) usando query nativa
        giocataRepository.findTopByGiocatore_IdAndLega_IdOrderByGiornataDesc(
                gl.getGiocatore().getId(),
                gl.getLega().getId()
        ).ifPresent(ultimaGiocata -> {
            if (ultimaGiocata.getSquadra() != null) {
                dto.setUltimaSquadraScelta(ultimaGiocata.getSquadra().getNome());
            }
        });

        return dto;
    }

    /**
     * Ottiene solo le vittorie (primi posti) di un giocatore
     */
    @Transactional(readOnly = true)
    public List<TrofeoDTO> getVittorie(Long giocatoreId) {
        return trofeiRepository.findTrofeiByGiocatoreId(giocatoreId).stream()
                .filter(gl -> gl.getPosizioneFinale() != null && gl.getPosizioneFinale() == 1)
                .map(this::mapToTrofeoDTO)
                .collect(Collectors.toList());
    }

    /**
     * Ottiene i podi (primi 3 posti) di un giocatore
     */
    @Transactional(readOnly = true)
    public List<TrofeoDTO> getPodi(Long giocatoreId) {
        return trofeiRepository.findTrofeiByGiocatoreId(giocatoreId).stream()
                .filter(gl -> gl.getPosizioneFinale() != null && gl.getPosizioneFinale() <= 3)
                .map(this::mapToTrofeoDTO)
                .collect(Collectors.toList());
    }
}
