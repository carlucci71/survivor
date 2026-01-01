package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.SquadraService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/squadre")
@RequiredArgsConstructor
public class SquadraController {
    private final SquadraService squadraService;

    @GetMapping("/campionato/{idCampionato}")
    public ResponseEntity<List<SquadraDTO>> getSquadreByCampionato(@PathVariable String idCampionato) {
        return ResponseEntity.ok(squadraService.getSquadreByCampionatoId(idCampionato));
    }
}

