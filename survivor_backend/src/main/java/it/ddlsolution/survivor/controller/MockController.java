package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.ParametriService;
import it.ddlsolution.survivor.service.PartitaMockService;
import it.ddlsolution.survivor.service.PartitaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@RequestMapping("/mock")

@RestController
@RequiredArgsConstructor
@Slf4j
public class MockController {

    private final ParametriService parametriService;
    private final CacheableService cacheableService;
    private final PartitaMockService partitaMockService;
    private final PartitaService partitaService;
    private final CampionatoService campionatoService;

    @PutMapping("/reset/{idCampionato}/{anno}/{implementazioneApiFrom}")
    public ResponseEntity<String> reset(
            @PathVariable String idCampionato
            , @PathVariable Short anno
            , @PathVariable String implementazioneApiFrom

    ) {
        partitaMockService.reset(idCampionato, anno,implementazioneApiFrom);
        campionatoService.refreshCampionato(campionatoService.getCampionato(idCampionato),anno);
        return ResponseEntity.ok("OK");
    }


    @PutMapping("/updateMock/{idCampionato}/{anno}/{giornata}")
    public ResponseEntity<String> updateMock(
            @PathVariable String idCampionato
            , @PathVariable Short anno
            , @PathVariable Integer giornata
            , @RequestParam(value = "dataRif", required = false) String dataRif
            , @RequestParam(value = "casaSigla", required = false) String casaSigla
            , @RequestParam(value = "fuoriSigla", required = false) String fuoriSigla
            , @RequestParam(value = "scoreCasa", required = false) Integer scoreCasa
            , @RequestParam(value = "scoreFuori", required = false) Integer scoreFuori
            , @RequestParam(value = "orarioPartita", required = false) String orarioPartita
    ) {
        if (dataRif != null) {
            parametriService.aggiornaMockLocalDateRif(dataRif);
        }

        partitaService.resetDaGiocareGiornata(idCampionato, anno, giornata);
        if (casaSigla != null || fuoriSigla != null) {
            if ((scoreCasa != null && scoreFuori == null) || (scoreFuori != null && scoreCasa == null)){
                throw new RuntimeException("ScoreCasa e scoreFuori sono obbligatori insieme");
            }
            partitaMockService.aggiornaPartitaMockDiUnaGiornata(idCampionato, anno, giornata, casaSigla, fuoriSigla, scoreCasa, scoreFuori, orarioPartita);
        }
        cacheableService.clearCacheCampionati();
        cacheableService.clearCachePartite(idCampionato, anno);
        return ResponseEntity.ok("OK");
    }

}
