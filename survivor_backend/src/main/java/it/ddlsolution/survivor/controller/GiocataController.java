package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.dispologger.LoggaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.GuardContextHolder;
import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.GiocataRule;
import it.ddlsolution.survivor.dto.request.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.service.GiocataService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@Slf4j
@RestController
@RequestMapping("/giocate")
@RequiredArgsConstructor
public class GiocataController {
    private final GiocataService giocataService;

    @PostMapping
    @LoggaDispositiva(tipologia = "gioca")
    @GuardiaDispositiva(rule = GiocataRule.class, idLegaParam = "request.legaId", giornataParam = "request.giornata", idGiocatoreParam = "request.giocatoreId", siglaSquadraParam = "request.squadraSigla")
    public ResponseEntity<GiocatoreDTO> inserisciGiocata(@RequestBody GiocataRequestDTO request) {
        // Recupera la mappa dalla GuardiaDispositiva (passata dall'aspect)
        Map<String, Object> guardReturn = GuardContextHolder.getGuardReturn();

        if (!ObjectUtils.isEmpty(guardReturn)) {
            log.info("Dati ricevuti dalla GuardiaDispositiva: {}", guardReturn);
            request.setGuardReturn(guardReturn);
        }

        GiocatoreDTO result = giocataService.inserisciGiocata(request);
        return ResponseEntity.ok(result);
    }
}

