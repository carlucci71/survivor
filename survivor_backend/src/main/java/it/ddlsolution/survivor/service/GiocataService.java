package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.GiocataSnapshot;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.GiocatoreLega;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import org.springframework.security.access.AccessDeniedException;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocataRevisionRepository;
import it.ddlsolution.survivor.repository.GiocataSnapshotRepository;
import it.ddlsolution.survivor.repository.ReactionGiocataRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.history.Revision;
import org.springframework.data.history.Revisions;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import static it.ddlsolution.survivor.util.Constant.WARNING_GIOCATA_RULE;

@Service
@RequiredArgsConstructor
@Slf4j
public class GiocataService {
    private final GiocataRepository giocataRepository;
    private final GiocatoreService giocatoreService;
    private final GiocataMapper giocataMapper;
    private final GiocatoreMapper giocatoreMapper;
    private final GiocataSnapshotRepository giocataSnapshotRepository;
    private final GiocataRevisionRepository giocataRevisionRepository;
    private final LegaService legaService;
    private final SquadraService squadraService;
    private final ReactionGiocataRepository reactionGiocataRepository;


    @Transactional
    public GiocatoreDTO inserisciGiocata(GiocataRequestDTO request) {
        Giocatore giocatore = giocatoreService.findByIdEntity(request.getGiocatoreId());
        Lega lega = legaService.findByIdEntity(request.getLegaId());

        // Defense-in-depth: verifica che l'utente autenticato abbia il diritto
        // di inserire la giocata per questo giocatore, indipendentemente dal guard AOP.
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Long currentUserId = (Long) authentication.getPrincipal();
            Long giocatoreUserId = giocatore.getUser() != null ? giocatore.getUser().getId() : null;
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

            if (giocatoreUserId != null && !currentUserId.equals(giocatoreUserId) && !isAdmin) {
                boolean isLeader = lega.getGiocatoreLeghe().stream()
                        .filter(gl -> gl.getGiocatore() != null
                                && gl.getGiocatore().getUser() != null
                                && gl.getGiocatore().getUser().getId().equals(currentUserId))
                        .map(GiocatoreLega::getRuolo)
                        .anyMatch(r -> r == Enumeratori.RuoloGiocatoreLega.LEADER);
                if (!isLeader) {
                    throw new AccessDeniedException("Non sei autorizzato a giocare per un altro utente");
                }
            }
        }

        Squadra squadra = null;
        if (!ObjectUtils.isEmpty(request.getSquadraSigla())) {
            String sport = lega.getCampionato().getSport() != null ? lega.getCampionato().getSport().getId() : null;
            if ("TENNIS".equals(sport)) {
                // Per i campionati tennis (es. Roland Garros) i giocatori non sono nella
                // tabella squadra: li trova o li crea al volo tramite sigla + campionato.
                squadra = squadraService.findOrCreateBySiglaAndCampionato(
                        request.getSquadraSigla(), lega.getCampionato());
            } else {
                squadra = squadraService.findBySiglaAndNazione(request.getSquadraSigla(), lega.getCampionato().getNazione());
            }
        }

        GiocatoreDTO dto = giocatoreMapper.toDTO(giocatore);
        List<GiocataDTO> giocate = new ArrayList<>(dto.getGiocate().stream()
                .filter(g -> Objects.equals(g.getLegaId(), lega.getId()) && !Objects.equals(g.getGiornata(), request.getGiornata()))
                .toList());

        Giocata giocata = giocataRepository.findByGiornataAndGiocatore_IdAndLega_Id(request.getGiornata(), giocatore.getId(), lega.getId()).orElse(new Giocata());
        giocata.setGiornata(request.getGiornata());
        giocata.setGiocatore(giocatore);
        giocata.setLega(lega);
        giocata.setSquadra(squadra);
        giocata.setEsito(request.getEsitoGiocata());
        giocata.setPunti(request.getPunti());
        giocata.setPubblica(request.getPubblica() != null ? request.getPubblica() : false); // Default false (nascosta)

        // Gestione forzatura: popola il campo se il guard ha restituito warning
        String forzaturaText = null;
        if (!ObjectUtils.isEmpty(request.getGuardReturn())) {
            Object guardObj = request.getGuardReturn().get(WARNING_GIOCATA_RULE);
            if (guardObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> guardList = (List<String>) guardObj;
                forzaturaText = String.join(" - ", guardList);
                log.info("✅ Forzatura dal guard: {}", forzaturaText);
            }
        }

        // Se non c'è forzatura dal guard, ma l'utente corrente è diverso dal giocatore,
        // aggiungiamo comunque un indicatore di forzatura
        if (ObjectUtils.isEmpty(forzaturaText)) {
            if (authentication != null && authentication.isAuthenticated()) {
                Long currentUserId = (Long) authentication.getPrincipal();
                Long giocatoreUserId = giocatore.getUser() != null ? giocatore.getUser().getId() : null;

                if (giocatoreUserId != null && !currentUserId.equals(giocatoreUserId)) {
                    // È una forzatura: leader/admin sta giocando per un altro utente
                    boolean isAdmin = authentication.getAuthorities().stream()
                            .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
                    forzaturaText = "Giocata forzata da " + (isAdmin ? "Admin" : "Leader");
                    log.info("✅ Forzatura rilevata: {} gioca per userId {}", currentUserId, giocatoreUserId);
                }
            }
        }

        giocata.setForzatura(forzaturaText);
        log.info("💾 Salvataggio giocata - Giocatore: {}, Giornata: {}, Squadra: {}, Forzatura: {}",
                 giocatore.getId(), request.getGiornata(), request.getSquadraSigla(), forzaturaText);

        Giocata saved = giocataRepository.save(giocata);
        giocate.add(giocataMapper.toDTO(saved));

        dto.setGiocate(giocate);
        return dto;
    }

    @Transactional
    public Optional<Long> getRevNumberOfGiocata(GiocataDTO giocata) {
        Revisions<Long, Giocata> revisions = giocataRevisionRepository.findRevisions(giocata.getId());
        System.out.println("revisions = " + revisions);
        Optional<Revision<Long, Giocata>> lastRevOpt = giocataRevisionRepository.findLastChangeRevision(giocata.getId());
        if (lastRevOpt.isEmpty()){
            return Optional.empty();
        }
        return Optional.of(lastRevOpt.get().getRequiredRevisionNumber());

    }

    @Transactional(propagation = org.springframework.transaction.annotation.Propagation.REQUIRES_NEW)
    public void aggiornaSnapshotGiocata(GiocataDTO giocata) {
        Optional<Long> revNumber = getRevNumberOfGiocata(giocata);
        if (revNumber.isPresent()) {
            // Prepare snapshot rows to persist
            List<GiocataSnapshot> snapshots = List.of(
                    creaGiocataSnapshot(giocata.getId(), revNumber.get(), "giocatore_nome", giocatoreService.findById(giocata.getGiocatoreId()).getNickname()),
                    creaGiocataSnapshot(giocata.getId(), revNumber.get(), "squadra_sigla", giocata.getSquadraSigla()),
                    creaGiocataSnapshot(giocata.getId(), revNumber.get(), "lega_nome", legaService.getLegaDTO(giocata.getLegaId(), false, null).getName())
            );

            giocataSnapshotRepository.saveAll(snapshots);
        }

    }

    private GiocataSnapshot creaGiocataSnapshot(Long idGiocata, Long revNumber, String columnName, String columnValue) {
        GiocataSnapshot s = new GiocataSnapshot();
        s.setGiocataId(idGiocata);
        s.setRevisionNumber(revNumber);
        s.setColumnName("snapshot_" + columnName);
        s.setColumnValue(columnValue);
        return s;

    }

    @Transactional(readOnly = true)
    public List<Giocata> giocateOfGiocatoreInLega(Long giocatoreId, Long idLega) {
       return giocataRepository.findAll()
                        .stream()
                .filter(g->g.getLega().getId().equals(idLega) && g.getGiocatore().getId().equals(giocatoreId))
                .toList();
    }

    /**
     * Elimina la giocata di un giocatore per una specifica giornata in una lega.
     * Consentito solo quando la giornata è ancora in stato DA_GIOCARE (nessun esito calcolato).
     * Restituisce il GiocatoreDTO aggiornato senza la giocata eliminata.
     */
    @Transactional
    public GiocatoreDTO eliminaGiocata(Integer giornata, Long giocatoreId, Long legaId) {
        Giocatore giocatore = giocatoreService.findByIdEntity(giocatoreId);
        Lega lega = legaService.findByIdEntity(legaId);

        // Verifica che l'utente autenticato sia il giocatore stesso (o admin/leader)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated()) {
            Long currentUserId = (Long) authentication.getPrincipal();
            Long giocatoreUserId = giocatore.getUser() != null ? giocatore.getUser().getId() : null;
            boolean isAdmin = authentication.getAuthorities().stream()
                    .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
            if (giocatoreUserId != null && !currentUserId.equals(giocatoreUserId) && !isAdmin) {
                boolean isLeader = lega.getGiocatoreLeghe().stream()
                        .filter(gl -> gl.getGiocatore() != null
                                && gl.getGiocatore().getUser() != null
                                && gl.getGiocatore().getUser().getId().equals(currentUserId))
                        .map(GiocatoreLega::getRuolo)
                        .anyMatch(r -> r == Enumeratori.RuoloGiocatoreLega.LEADER);
                if (!isLeader) {
                    throw new AccessDeniedException("Non sei autorizzato a eliminare la giocata di un altro utente");
                }
            }
        }

        Giocata giocata = giocataRepository
                .findByGiornataAndGiocatore_IdAndLega_Id(giornata, giocatoreId, legaId)
                .orElseThrow(() -> new IllegalArgumentException("Giocata non trovata"));

        // Blocca l'eliminazione se la giocata ha già un esito
        if (giocata.getEsito() != null) {
            throw new IllegalStateException("Non è possibile eliminare una giocata con esito calcolato");
        }

        // Elimina prima le reaction collegate (FK constraint)
        reactionGiocataRepository.deleteByGiocata_Id(giocata.getId());

        giocataRepository.delete(giocata);
        log.info("🗑️ Eliminata giocata - Giocatore: {}, Giornata: {}, Lega: {}", giocatoreId, giornata, legaId);

        // Restituisce il DTO aggiornato senza la giocata eliminata
        GiocatoreDTO dto = giocatoreMapper.toDTO(giocatore);
        dto.setGiocate(dto.getGiocate().stream()
                .filter(g -> !(g.getGiornata().equals(giornata) && g.getLegaId().equals(legaId)))
                .toList());
        return dto;
    }

}
