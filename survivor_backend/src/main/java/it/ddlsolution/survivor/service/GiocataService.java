package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.GiocataSnapshot;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocataRevisionRepository;
import it.ddlsolution.survivor.repository.GiocataSnapshotRepository;
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


    @Transactional
    public GiocatoreDTO inserisciGiocata(GiocataRequestDTO request) {
        Giocatore giocatore = giocatoreService.findByIdEntity(request.getGiocatoreId());
        Lega lega = legaService.findByIdEntity(request.getLegaId());
        Squadra squadra = null;
        if (!ObjectUtils.isEmpty(request.getSquadraSigla())) {
            squadra = squadraService.findBySiglaAndNazione(request.getSquadraSigla(), lega.getCampionato().getNazione());
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
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
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

    @Transactional
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


}
