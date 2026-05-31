package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.RankingTennisDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.RankingTennisService;
import it.ddlsolution.survivor.service.SquadraService;
import it.ddlsolution.survivor.service.UtilCalendarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/squadre")
@RequiredArgsConstructor
public class SquadraController {
    private final SquadraService squadraService;
    private final CampionatoService campionatoService;
    private final UtilCalendarioService utilCalendarioService;
    private final RankingTennisService rankingTennisService;

    @GetMapping("/campionato/{idCampionato}/{anno}")
    public ResponseEntity<List<SquadraDTO>> getSquadreByCampionato(@PathVariable String idCampionato, @PathVariable short anno) {
        return ResponseEntity.ok(squadraService.getSquadreByCampionatoId(idCampionato, anno));
    }

    @GetMapping(value = "/calendario/{campionatoId}/squadreDisponibili/{anno}/{giornata}")
    public ResponseEntity<List<String>> squadreDisponibili(@PathVariable String campionatoId, @PathVariable Short anno, @PathVariable Integer giornata) {
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(campionatoId);
        // Recupera le partite del turno corrente con refresh dall'API esterna,
        // così se il DB ha dati parziali o stantii vengono aggiornati al volo.
        List<PartitaDTO> partite = utilCalendarioService.partiteCampionatoDellaGiornataWithRefreshFromWeb(campionatoDTO, giornata, anno);
        List<String> siglaList = new ArrayList<>();
        partite.stream().map(PartitaDTO::getCasaSigla).filter(s -> s != null && !s.isBlank()).forEach(siglaList::add);
        partite.stream().map(PartitaDTO::getFuoriSigla).filter(s -> s != null && !s.isBlank()).forEach(siglaList::add);
        return ResponseEntity.ok(siglaList);
    }

    @GetMapping("/search/{nome}")
    public ResponseEntity<SquadraDTO> searchByNome(@PathVariable String nome) {
        return ResponseEntity.ok(squadraService.findByNome(nome));
    }

    @GetMapping
    public ResponseEntity<List<SquadraDTO>> all() {
        return ResponseEntity.ok(squadraService.all());
    }

    @GetMapping("/sport/{sportId}")
    public ResponseEntity<List<SquadraDTO>> getBySport(@PathVariable String sportId) {
        return ResponseEntity.ok(squadraService.getBySport(sportId));
    }

    @GetMapping("/ranking/tennis/atp")
    public ResponseEntity<List<RankingTennisDTO>> getRankingAtp() {
        return ResponseEntity.ok(rankingTennisService.getRankingAtp());
    }

}

