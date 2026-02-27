package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.LeaderRule;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.PartitaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final PartitaService partitaService;

    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    @PutMapping("/partita/forzata/{idLega}")
    public ResponseEntity<PartitaDTO> aggiornaForzataPartita(
            @PathVariable Long idLega,
            @RequestParam String campionatoId,
            @RequestParam short anno,
            @RequestParam int giornata,
            @RequestParam String casaSigla,
            @RequestParam String fuoriSigla,
            @RequestParam Boolean forzata
    ) {
        PartitaDTO partita = partitaService.aggiornaForzataPartita(campionatoId, anno, giornata, casaSigla, fuoriSigla, forzata);
        return ResponseEntity.ok(partita);
    }

}

