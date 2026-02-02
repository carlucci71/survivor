package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.config.DataSourceConnectionLogger;
import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.entity.PartitaMock;
import it.ddlsolution.survivor.repository.PartitaMockRepository;
import it.ddlsolution.survivor.repository.PartitaRepository;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.ParametriService;
import it.ddlsolution.survivor.service.UtilCalendarioService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.Optional;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@RequestMapping("/util")

@RestController
@RequiredArgsConstructor
@Slf4j
public class UtilController {

    private final Environment environment;
    private final UtilCalendarioService utilCalendarioService;
    private final CampionatoService campionatoService;
    private final ParametriService parametriService;
    private final CacheableService cacheableService;
    private final ObjectProvider<DataSourceConnectionLogger> dsLoggerProvider;
    private final PartitaMockRepository partitaMockRepository;
    private final PartitaRepository partitaRepository;

    @GetMapping("/profilo")
    public ResponseEntity<Map<String, String>> profilo() {
        String[] activeProfiles = environment.getActiveProfiles();
        String profilo = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "default";

        return ResponseEntity.ok(Map.of("profilo", profilo));
    }

    @GetMapping("/calendario")
    public ResponseEntity<List<PartitaDTO>> calendario() {
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(Enumeratori.CampionatiDisponibili.SERIE_A.name());
        return ResponseEntity.ok(utilCalendarioService.partite(campionatoDTO, campionatoDTO.getAnnoCorrente()));
    }

    @GetMapping("/connessioni")
    public ResponseEntity<String> connessioni() {
        try {
            DataSourceConnectionLogger logger = dsLoggerProvider.getIfAvailable();
            if (logger != null) {
                logger.logOpenConnections();
            }
        } catch (Exception ex) {
            log.warn("Errore durante il log delle connection aperte", ex);
        }
        return ResponseEntity.ok("OK");
    }

    @PutMapping("/updateMock/{idCampionato}/{anno}/{giornata}")
    public ResponseEntity<String> updateMock(
            @PathVariable String idCampionato
            ,@PathVariable Short anno
            ,@PathVariable Integer giornata
            ,@RequestParam(value="dataRif", required = false) String dataRif
            ,@RequestParam(value="casaSigla", required = false) String casaSigla
            //TODO ,@RequestParam(value="fuoriSigla", required = false) String fuoriSigla
            ,@RequestParam(value="scoreCasa", required = false) Integer scoreCasa
            ,@RequestParam(value="scoreFuori", required = false) Integer scoreFuori
    ) {
        if (dataRif != null) {
            parametriService.aggiornaMockLocalDateRif(dataRif);
        }

        List<Partita> partite = partitaRepository.findByCampionato_IdAndAnnoAndGiornataAndImplementationExternalApi(idCampionato, anno, giornata,  CALENDARIO_MOCK);
        partite.forEach(p -> p.setStato(Enumeratori.StatoPartita.DA_GIOCARE));
        partitaRepository.saveAll(partite);

        if (casaSigla != null) {//TODO || fuoriSigla != null
            if (scoreCasa == null || scoreFuori==null){
                throw new RuntimeException("Se è presente casaSigla o fuoriSigla allora sono obbligatori scoreCasa e scoreFuori");
            }

            PartitaMock partitaMock = partitaMockRepository.findByCampionato_IdAndAnnoAndGiornataAndCasaSigla(idCampionato, anno, giornata, casaSigla)
                    .orElseThrow(()->new RuntimeException("Partitamock non trovata"));
            partitaMock.setScoreCasa(scoreCasa);
            partitaMock.setScoreFuori(scoreFuori);
            partitaMockRepository.save(partitaMock);
        }
        cacheableService.clearCacheCampionati();
        cacheableService.clearCachePartite(idCampionato,anno);
        return ResponseEntity.ok("OK");
    }

}
