package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.LegaInsertDTO;
import it.ddlsolution.survivor.dto.LegaInvitaDTO;
import it.ddlsolution.survivor.dto.LegaJoinDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.service.externalapi.CalendarioAPI2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/lega")

@RestController
@RequiredArgsConstructor
@Slf4j
public class LegaController {

    private final LegaService legaService;
    private final CalendarioAPI2 calendarioAPI2;


    @GetMapping(value = "/calendario/{sportId}/{campionatoId}/{squadraId}/{giornata}")
    public ResponseEntity<List<PartitaDTO>> calendario(@PathVariable String sportId, @PathVariable String campionatoId, @PathVariable String squadraId, @PathVariable Integer giornata, @RequestParam Boolean prossimi) {
        List<PartitaDTO> squadraDTOListMap = calendarioAPI2.calendario(sportId, campionatoId, squadraId, giornata, prossimi);
        return ResponseEntity.ok(squadraDTOListMap);
    }

    @GetMapping(value = "/mieLeghe")
    public ResponseEntity<List<LegaDTO>> mieLeghe() {
        List<LegaDTO> dtoList = legaService.mieLeghe();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LegaDTO> getLegaById(@PathVariable Long id) {
        LegaDTO legaDTO = legaService.getLegaDTO(id,true);
        if (legaDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(legaDTO);
    }

    @PostMapping
    public ResponseEntity<LegaDTO> salva(@RequestBody LegaInsertDTO legaInsertDTO) {
        LegaDTO legaDTO = legaService.inserisciLega(legaInsertDTO);
        return ResponseEntity.ok(legaDTO);
    }

    @GetMapping(value = "/legheLibere")
    public ResponseEntity<List<LegaDTO>> legheLibere() {
        List<LegaDTO> dtoList = legaService.legheLibere();
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("join/{idLega}")
    public ResponseEntity<LegaDTO> join(@RequestBody LegaJoinDTO legaInsertDTO, @PathVariable("idLega") Long idLega) {
        LegaDTO legaDTO = legaService.join(idLega, legaInsertDTO);
        return ResponseEntity.ok(legaDTO);
    }

    @PostMapping("/invita/{idLega}")
    public ResponseEntity<Map<String, String>> invita(@RequestBody LegaInvitaDTO legaInvitaDTO, @PathVariable("idLega") Long idLega) {
        legaService.invita(idLega, legaInvitaDTO.getEmails());
        return ResponseEntity.ok(Map.of("ESITO","OK"));
    }


}
