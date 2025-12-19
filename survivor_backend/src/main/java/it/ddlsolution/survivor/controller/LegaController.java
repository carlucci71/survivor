package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.service.externalapi.CalendarioAPI2;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
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


    @GetMapping(value = "/ultimiRisultati/{sportId}/{campionatoId}/{squadraId}/{giornata}")
    public ResponseEntity<List<PartitaDTO>> ultimiRisultati(@PathVariable String sportId,@PathVariable String campionatoId,@PathVariable String squadraId,@PathVariable Integer giornata) {
        List<PartitaDTO> squadraDTOListMap = calendarioAPI2.ultimiRisultati(sportId, campionatoId, squadraId, giornata);
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


}
