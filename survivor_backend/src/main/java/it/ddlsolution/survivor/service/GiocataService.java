package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import it.ddlsolution.survivor.entity.Giocata;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.RevInfo;
import it.ddlsolution.survivor.entity.Squadra;
import it.ddlsolution.survivor.entity.GiocataSnapshot;
import it.ddlsolution.survivor.mapper.GiocataMapper;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.repository.GiocataRepository;
import it.ddlsolution.survivor.repository.GiocatoreRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.SquadraRepository;
import it.ddlsolution.survivor.repository.GiocataSnapshotRepository;
import it.ddlsolution.survivor.repository.GiocataRevisionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.history.Revision;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

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
    private final GiocataSnapshotRepository giocataSnapshotRepository;
    private final GiocataRevisionRepository giocataRevisionRepository;


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
                .filter(g -> !Objects.equals(g.getLegaId(), lega.getId()) || !Objects.equals(g.getGiornata(), request.getGiornata()))
                .toList());

        Giocata giocata = giocataRepository.findByGiornataAndGiocatoreAndLega(request.getGiornata(), giocatore, lega).orElse(new Giocata());
        giocata.setGiornata(request.getGiornata());
        giocata.setGiocatore(giocatore);
        giocata.setLega(lega);
        giocata.setSquadra(squadra);
        giocata.setEsito(request.getEsitoGiocata());
        if (!ObjectUtils.isEmpty(request.getGuardReturn())) {
            Object guardObj = request.getGuardReturn().get(WARNING_GIOCATA_RULE);
            if (guardObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<String> guardList = (List<String>) guardObj;
                String forzatura = String.join(" - ", guardList);
                giocata.setForzatura(forzatura);
            }
        }

        Giocata saved = giocataRepository.save(giocata);

        // Ensure Envers has registered the revision by flushing before querying revisions
        giocataRepository.flush();

        // Try to obtain the latest revision number for this giocata
        Optional<Revision<Long, Giocata>> lastRevOpt = giocataRevisionRepository.findLastChangeRevision(saved.getId());
        Long revNumber = 1L;
        if (lastRevOpt.isPresent()) {
            revNumber = lastRevOpt.get().getRequiredRevisionNumber() + 1;
        }

        // Prepare snapshot rows to persist
        List<GiocataSnapshot> snapshots = new ArrayList<>();

        String giocatoreNome = saved.getGiocatore() != null ? saved.getGiocatore().getNome() : null;
        if (giocatoreNome != null) {
            GiocataSnapshot s = new GiocataSnapshot();
            s.setGiocataId(saved.getId());
            s.setRevisionNumber(revNumber);
            s.setColumnName("snapshot_giocatore_nome");
            s.setColumnValue(giocatoreNome);
            snapshots.add(s);
        }

        String squadraNome = saved.getSquadra() != null ? saved.getSquadra().getNome() : null;
        if (squadraNome != null) {
            GiocataSnapshot s = new GiocataSnapshot();
            s.setGiocataId(saved.getId());
            s.setRevisionNumber(revNumber);
            s.setColumnName("snapshot_squadra_nome");
            s.setColumnValue(squadraNome);
            snapshots.add(s);
        }

        // Add other snapshot fields here if needed, e.g. squadra name, lega name...

        if (!snapshots.isEmpty()) {
            giocataSnapshotRepository.saveAll(snapshots);
        }

        giocate.add(giocataMapper.toDTO(saved));

        dto.setGiocate(giocate);
        return dto;
    }

}
