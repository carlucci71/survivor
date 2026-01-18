package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
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
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;

import static it.ddlsolution.survivor.util.Constant.WARNING_GIOCATA_RULE;

@Service
@RequiredArgsConstructor
@Slf4j
public class GiocataService {
    private final GiocataRepository giocataRepository;
    private final GiocatoreRepository giocatoreRepository;
    private final LegaRepository legaRepository;
    private final SquadraRepository squadraRepository;
    private final GiocataMapper giocataMapper;
    private final GiocatoreMapper giocatoreMapper;

    @PersistenceContext
    private EntityManager entityManager;


    @Transactional
    public GiocatoreDTO inserisciGiocata(GiocataRequestDTO request) {
        Giocatore giocatore = giocatoreRepository.findById(request.getGiocatoreId())
                .orElseThrow(() -> new IllegalArgumentException("Giocatore non trovato"));
        Lega lega = legaRepository.findById(request.getLegaId())
                .orElseThrow(() -> new IllegalArgumentException("Lega non trovata"));
        Squadra squadra = null;
        if (!ObjectUtils.isEmpty(request.getSquadraSigla())) {
            squadra = squadraRepository.findBySiglaAndCampionato_IdAndAnno(request.getSquadraSigla(), lega.getCampionato().getId(), lega.getAnno())
                    .orElseThrow(() -> new IllegalArgumentException("Squadra non trovata"));
        }

        GiocatoreDTO dto = giocatoreMapper.toDTO(giocatore);
        List<GiocataDTO> giocate = new ArrayList<>(dto.getGiocate().stream()
                .filter(g -> g.getLegaId().equals(lega.getId()) && g.getGiornata() != request.getGiornata())
                .toList());

        Giocata giocata = giocataRepository.findByGiornataAndGiocatoreAndLega(request.getGiornata(), giocatore, lega).orElse(new Giocata());
        giocata.setGiornata(request.getGiornata());
        giocata.setGiocatore(giocatore);
        giocata.setLega(lega);
        giocata.setSquadra(squadra);
        giocata.setEsito(request.getEsitoGiocata());
        if (!ObjectUtils.isEmpty(request.getGuardReturn())) {
            String forzatura = String.join(" - ", (List<String>)request.getGuardReturn().get(WARNING_GIOCATA_RULE));
            giocata.setForzatura(forzatura);
        }

        Giocata saved = giocataRepository.save(giocata);

        // Popola i campi snapshot in giocata_aud
        populateAuditSnapshots(saved);

        giocate.add(giocataMapper.toDTO(saved));

        dto.setGiocate(giocate);
        return dto;
    }

    /**
     * Popola i campi snapshot nella tabella giocata_aud dopo il salvataggio.
     * Viene eseguito automaticamente dopo ogni save di Giocata.
     */
    private void populateAuditSnapshots(Giocata giocata) {
        try {
            entityManager.flush(); // Forza Envers a creare la revisione

            String sql = """
                UPDATE giocata_aud 
                SET snapshot_giocatore_nome = (SELECT nome FROM giocatore WHERE id = :giocatoreId),
                    snapshot_lega_nome = (SELECT name FROM lega WHERE id = :legaId),
                    snapshot_squadra_nome = (SELECT nome FROM squadra WHERE id = :squadraId),
                    snapshot_squadra_sigla = (SELECT sigla FROM squadra WHERE id = :squadraId)
                WHERE id = :giocataId 
                  AND rev = (SELECT MAX(rev) FROM giocata_aud WHERE id = :giocataId)
                """;

            entityManager.createNativeQuery(sql)
                .setParameter("giocataId", giocata.getId())
                .setParameter("giocatoreId", giocata.getGiocatore() != null ? giocata.getGiocatore().getId() : null)
                .setParameter("legaId", giocata.getLega() != null ? giocata.getLega().getId() : null)
                .setParameter("squadraId", giocata.getSquadra() != null ? giocata.getSquadra().getId() : null)
                .executeUpdate();

            log.debug("Snapshot popolati in giocata_aud per giocata {}", giocata.getId());
        } catch (Exception e) {
            log.warn("Errore popolamento snapshot per giocata {}: {}", giocata.getId(), e.getMessage());
            // Non propago l'errore per non bloccare il salvataggio
        }
    }
}

