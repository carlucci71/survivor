package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataRevisionDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.RevInfo;
import it.ddlsolution.survivor.repository.GiocataRevisionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.history.Revision;
import org.springframework.data.history.Revisions;
import org.springframework.data.history.RevisionMetadata;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GiocataRevisionService {

    private final GiocataRevisionRepository giocataRevisionRepository;

    /**
     * Ottiene tutte le revisioni di una Giocata
     */
    @Transactional(readOnly = true)
    public List<GiocataRevisionDTO> findRevisions(Long giocataId) {
        log.info("Ricerca revisioni per giocata con ID: {}", giocataId);

        Revisions<Long, Giocata> revisions = giocataRevisionRepository.findRevisions(giocataId);

        return revisions.getContent().stream()
                .map(this::convertRevisionToDto)
                .collect(Collectors.toList());
    }

    /**
     * Ottiene l'ultima revisione di una Giocata
     */
    @Transactional(readOnly = true)
    public Optional<GiocataRevisionDTO> findLastChangeRevision(Long giocataId) {
        log.info("Ricerca ultima revisione per giocata con ID: {}", giocataId);

        return giocataRevisionRepository.findLastChangeRevision(giocataId)
                .map(this::convertRevisionToDto);
    }

    /**
     * Ottiene una specifica revisione di una Giocata
     */
    @Transactional(readOnly = true)
    public Optional<GiocataRevisionDTO> findRevision(Long giocataId, Long revisionNumber) {
        log.info("Ricerca revisione {} per giocata con ID: {}", revisionNumber, giocataId);

        return giocataRevisionRepository.findRevision(giocataId, revisionNumber)
                .map(this::convertRevisionToDto);
    }

    private GiocataRevisionDTO convertRevisionToDto(Revision<Long, Giocata> revision) {
        Giocata g = revision.getEntity();
        Long revNumber = revision.getRequiredRevisionNumber();
        RevisionMetadata<Long> meta = revision.getMetadata();

        String revType = null;
        String username = null;
        Long userId = null;
        Long revtstmp = null;

        if (meta != null) {
            var rt = meta.getRevisionType();
            if (rt != null) {
                revType = switch (rt) {
                    case INSERT -> "CREAZIONE";
                    case UPDATE -> "MODIFICA";
                    case DELETE -> "ELIMINAZIONE";
                    default -> rt.name();
                };
            }

            Object delegate = meta.getDelegate();
            if (delegate instanceof RevInfo) {
                RevInfo revInfo = (RevInfo) delegate;
                username = revInfo.getUsername();
                userId = revInfo.getUserId();
                revtstmp = revInfo.getRevtstmp();
            }
        }

        // Fallback su instant se revtstmp non disponibile
        if (revtstmp == null && revision.getRevisionInstant().isPresent()) {
            revtstmp = revision.getRevisionInstant().get().toEpochMilli();
        }

        return GiocataRevisionDTO.builder()
                .revisionNumber(revNumber)
                .revisionDate(GiocataRevisionDTO.convertTimestamp(revtstmp))
                .username(username)
                .userId(userId)
                .revisionType(revType)
                .id(g.getId())
                .giornata(g.getGiornata())
                .giocatoreId(g.getGiocatore() != null ? g.getGiocatore().getId() : null)
                .legaId(g.getLega() != null ? g.getLega().getId() : null)
                .squadraId(g.getSquadra() != null ? String.valueOf(g.getSquadra().getId()) : null)
                .esito(g.getEsito())
                .forzatura(g.getForzatura())
                .build();
    }
}
