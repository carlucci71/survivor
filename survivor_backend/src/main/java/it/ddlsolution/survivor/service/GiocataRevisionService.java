package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataRevisionDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.RevInfo;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hibernate.envers.AuditReader;
import org.hibernate.envers.AuditReaderFactory;
import org.hibernate.envers.RevisionType;
import org.hibernate.envers.query.AuditEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class GiocataRevisionService {

    @PersistenceContext
    private EntityManager entityManager;

    /**
     * Ottiene tutte le revisioni di una Giocata
     */
    @Transactional(readOnly = true)
    public List<GiocataRevisionDTO> findRevisions(Long giocataId) {
        log.info("Ricerca revisioni per giocata con ID: {}", giocataId);

        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        // Ottieni tutti i numeri di revisione per questa giocata
        List<Number> revisions = auditReader.getRevisions(Giocata.class, giocataId);

        return revisions.stream()
                .map(revNumber -> {
                    Giocata giocata = auditReader.find(Giocata.class, giocataId, revNumber);
                    RevInfo revInfo = auditReader.findRevision(RevInfo.class, revNumber);

                    Object[] result = (Object[]) auditReader.createQuery()
                            .forRevisionsOfEntity(Giocata.class, false, true)
                            .add(AuditEntity.id().eq(giocataId))
                            .add(AuditEntity.revisionNumber().eq(revNumber))
                            .getSingleResult();

                    RevisionType revisionType = (RevisionType) result[2];

                    return convertToDTO(giocata, revInfo, revisionType, revNumber.longValue());
                })
                .collect(Collectors.toList());
    }

    /**
     * Ottiene l'ultima revisione di una Giocata
     */
    @Transactional(readOnly = true)
    public Optional<GiocataRevisionDTO> findLastChangeRevision(Long giocataId) {
        log.info("Ricerca ultima revisione per giocata con ID: {}", giocataId);

        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        // Ottieni tutti i numeri di revisione
        List<Number> revisions = auditReader.getRevisions(Giocata.class, giocataId);

        if (revisions.isEmpty()) {
            return Optional.empty();
        }

        // Prendi l'ultimo numero di revisione
        Number lastRevNumber = revisions.getLast();

        Giocata giocata = auditReader.find(Giocata.class, giocataId, lastRevNumber);
        RevInfo revInfo = auditReader.findRevision(RevInfo.class, lastRevNumber);

        Object[] result = (Object[]) auditReader.createQuery()
                .forRevisionsOfEntity(Giocata.class, false, true)
                .add(AuditEntity.id().eq(giocataId))
                .add(AuditEntity.revisionNumber().eq(lastRevNumber))
                .getSingleResult();

        RevisionType revisionType = (RevisionType) result[2];

        return Optional.of(convertToDTO(giocata, revInfo, revisionType, lastRevNumber.longValue()));
    }

    /**
     * Ottiene una specifica revisione di una Giocata
     */
    @Transactional(readOnly = true)
    public Optional<GiocataRevisionDTO> findRevision(Long giocataId, Long revisionNumber) {
        log.info("Ricerca revisione {} per giocata con ID: {}", revisionNumber, giocataId);

        AuditReader auditReader = AuditReaderFactory.get(entityManager);

        try {
            Giocata giocata = auditReader.find(Giocata.class, giocataId, revisionNumber);

            if (giocata == null) {
                return Optional.empty();
            }

            RevInfo revInfo = auditReader.findRevision(RevInfo.class, revisionNumber);

            Object[] result = (Object[]) auditReader.createQuery()
                    .forRevisionsOfEntity(Giocata.class, false, true)
                    .add(AuditEntity.id().eq(giocataId))
                    .add(AuditEntity.revisionNumber().eq(revisionNumber))
                    .getSingleResult();

            RevisionType revisionType = (RevisionType) result[2];

            return Optional.of(convertToDTO(giocata, revInfo, revisionType, revisionNumber));
        } catch (Exception e) {
            log.warn("Revisione {} non trovata per giocata {}: {}", revisionNumber, giocataId, e.getMessage());
            return Optional.empty();
        }
    }

    /**
     * Converte i dati in GiocataRevisionDTO
     */
    private GiocataRevisionDTO convertToDTO(Giocata giocata, RevInfo revInfo, RevisionType revisionType, Long revisionNumber) {
        String revType = switch (revisionType) {
            case ADD -> "CREAZIONE";
            case MOD -> "MODIFICA";
            case DEL -> "ELIMINAZIONE";
        };

        // Recupera i nomi snapshot direttamente dalla tabella giocata_aud se esistono
        String giocatoreNome = getSnapshotFromAud(giocata.getId(), revisionNumber, "snapshot_giocatore_nome");
        String legaNome = getSnapshotFromAud(giocata.getId(), revisionNumber, "snapshot_lega_nome");
        String squadraSigla = getSnapshotFromAud(giocata.getId(), revisionNumber, "snapshot_squadra_sigla");

        // Fallback ai nomi attuali se gli snapshot non esistono
        if (giocatoreNome == null && giocata.getGiocatore() != null) {
            giocatoreNome = giocata.getGiocatore().getNome();
        }
        if (legaNome == null && giocata.getLega() != null) {
            legaNome = giocata.getLega().getName();
        }
        if (squadraSigla == null && giocata.getSquadra() != null) {
            squadraSigla = giocata.getSquadra().getSigla();
        }

        return GiocataRevisionDTO.builder()
                .revisionNumber(revisionNumber)
                .revisionDate(GiocataRevisionDTO.convertTimestamp(revInfo.getRevtstmp()))
                .username(revInfo.getUsername())
                .userId(revInfo.getUserId())
                .revisionType(revType)
                .id(giocata.getId())
                .giornata(giocata.getGiornata())
                .giocatoreId(giocata.getGiocatore() != null ? giocata.getGiocatore().getId() : null)
                .giocatoreNome(giocatoreNome)
                .legaId(giocata.getLega() != null ? giocata.getLega().getId() : null)
                .legaNome(legaNome)
                .squadraId(giocata.getSquadra() != null ? String.valueOf(giocata.getSquadra().getId()) : null)
                .squadraSigla(squadraSigla)
                .esito(giocata.getEsito())
                .forzatura(giocata.getForzatura())
                .build();
    }

    /**
     * Recupera un campo snapshot dalla tabella giocata_aud tramite query nativa
     */
    private String getSnapshotFromAud(Long giocataId, Long revNumber, String columnName) {
        try {
            String sql = "SELECT " + columnName + " FROM giocata_aud WHERE id = ?1 AND rev = ?2";
            Object result = entityManager.createNativeQuery(sql)
                    .setParameter(1, giocataId)
                    .setParameter(2, revNumber)
                    .getSingleResult();
            return result != null ? result.toString() : null;
        } catch (Exception e) {
            // Se la colonna non esiste o non c'è il record, ritorna null
            return null;
        }
    }
}
