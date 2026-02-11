package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.PartitaMockDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.ParametriService;
import it.ddlsolution.survivor.service.PartitaMockService;
import it.ddlsolution.survivor.service.PartitaService;
import it.ddlsolution.survivor.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.List;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;
import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

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
    private final Utility utility;

    @PutMapping("/reset/{idCampionato}/{anno}/{implementazioneApiFrom}")
    public ResponseEntity<String> reset(
            @PathVariable String idCampionato
            , @PathVariable Short anno
            , @PathVariable String implementazioneApiFrom

    ) {
        if (!utility.getImplementationExternalApi().equals(CALENDARIO_MOCK)){
            throw new RuntimeException("API richiamabili solo se mock attivo");
        }
        partitaMockService.reset(idCampionato, anno, implementazioneApiFrom);
        campionatoService.refreshCampionato(campionatoService.getCampionato(idCampionato), anno);
        return ResponseEntity.ok("OK");
    }

    @GetMapping("/partite/{idCampionato}/{anno}/{giornata}")
    public ResponseEntity<List<PartitaMockDTO>> partite(
            @PathVariable String idCampionato
            , @PathVariable Short anno
            , @PathVariable Integer giornata
    ) {
        if (!utility.getImplementationExternalApi().equals(CALENDARIO_MOCK)){
            throw new RuntimeException("API richiamabili solo se mock attivo");
        }
        return ResponseEntity.ok(partitaMockService.getPartiteDellaGiornata(idCampionato, anno, giornata));
    }

    @GetMapping("/dataRiferimento")
    public ResponseEntity<LocalDateTime> dataRiferimento() {
        if (!utility.getImplementationExternalApi().equals(CALENDARIO_MOCK)){
            throw new RuntimeException("API richiamabili solo se mock attivo");
        }
        return ResponseEntity.ok(partitaMockService.getDataRiferimento());
    }


    @PutMapping("/updateMock/{idCampionato}/{anno}/{giornata}")
    public ResponseEntity<String> updateMock(
            @PathVariable String idCampionato
            , @PathVariable Short anno
            , @PathVariable Integer giornata
            , @RequestParam(value = "clearCache") Boolean clearCache
            , @RequestParam(value = "dataRif", required = false) String dataRif
            , @RequestParam(value = "casaSigla", required = false) String casaSigla
            , @RequestParam(value = "fuoriSigla", required = false) String fuoriSigla
            , @RequestParam(value = "scoreCasa", required = false) Integer scoreCasa
            , @RequestParam(value = "scoreFuori", required = false) Integer scoreFuori
            , @RequestParam(value = "orarioPartita", required = false) String orarioPartita
    ) {
        if (!utility.getImplementationExternalApi().equals(CALENDARIO_MOCK)){
            throw new RuntimeException("API richiamabili solo se mock attivo");
        }
        if (dataRif != null) {
            parametriService.aggiornaMockLocalDateRif(dataRif);
        }
        partitaService.resetDaGiocareGiornata(idCampionato, anno, giornata);
        if (casaSigla != null || fuoriSigla != null) {
            if ((scoreCasa != null && scoreFuori == null) || (scoreFuori != null && scoreCasa == null)) {
                throw new RuntimeException("ScoreCasa e scoreFuori sono obbligatori insieme");
            }
            partitaMockService.aggiornaPartitaMockDiUnaGiornata(idCampionato, anno, giornata, casaSigla, fuoriSigla, scoreCasa, scoreFuori, orarioPartita);
        }
        if (clearCache){
            cacheableService.clearCacheCampionati();
            cacheableService.clearCachePartite(idCampionato, anno);
        }
        return ResponseEntity.ok("OK");
    }

}
