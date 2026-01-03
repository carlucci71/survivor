package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.dispologger.LoggaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.GiocataRule;
import it.ddlsolution.survivor.dto.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.service.GiocataService;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/giocate")
@RequiredArgsConstructor
public class GiocataController {
    private final GiocataService giocataService;

    @PostMapping
    @LoggaDispositiva(tipologia = "gioca")
    @GuardiaDispositiva(rule = GiocataRule.class, idLegaParam = "request.legaId", giornataParam = "request.giornata", giocatoreParam = "request.giocatoreId", siglaSquadraParam = "request.squadraSigla")
    public ResponseEntity<GiocatoreDTO> inserisciGiocata(@RequestBody GiocataRequestDTO request) {
        return ResponseEntity.ok(giocataService.inserisciGiocata(request));
    }
}

