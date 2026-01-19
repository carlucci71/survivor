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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

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
        giocate.add(giocataMapper.toDTO(saved));

        dto.setGiocate(giocate);
        return dto;
    }

    @Transactional
    public Long getRevNumberOfGiocata(GiocataDTO giocata) {
        Revisions<Long, Giocata> revisions = giocataRevisionRepository.findRevisions(giocata.getId());
        System.out.println("revisions = " + revisions);
        Revision<Long, Giocata> lastRevOpt = giocataRevisionRepository.findLastChangeRevision(giocata.getId())
                .orElseThrow(() -> new RuntimeException("Revisione non trovata"));
        return lastRevOpt.getRequiredRevisionNumber();

    }

    @Transactional
    public void aggiornaSnapshotGiocata(GiocataDTO giocata) {
        Long revNumber = getRevNumberOfGiocata(giocata);
        // Prepare snapshot rows to persist
        List<GiocataSnapshot> snapshots = List.of(
                creaGiocataSnapshot(giocata.getId(), revNumber, "giocatore_nome", giocatoreService.findById(giocata.getGiocatoreId()).getNome()),
                creaGiocataSnapshot(giocata.getId(), revNumber, "squadra_sigla", giocata.getSquadraSigla()),
                creaGiocataSnapshot(giocata.getId(), revNumber, "lega_nome", legaService.getLegaDTO(giocata.getLegaId(), false, null).getName())
        );

        giocataSnapshotRepository.saveAll(snapshots);

    }

    private GiocataSnapshot creaGiocataSnapshot(Long idGiocata, Long revNumber, String columnName, String columnValue) {
        GiocataSnapshot s = new GiocataSnapshot();
        s.setGiocataId(idGiocata);
        s.setRevisionNumber(revNumber);
        s.setColumnName("snapshot_" + columnName);
        s.setColumnValue(columnValue);
        return s;

    }

}
