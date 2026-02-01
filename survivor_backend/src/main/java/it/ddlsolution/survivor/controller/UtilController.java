package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.config.DataSourceConnectionLogger;
import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.UtilCalendarioService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/util")

@RestController
@RequiredArgsConstructor
@Slf4j
public class UtilController {

    private final Environment environment;
    private final UtilCalendarioService utilCalendarioService;
    private final CampionatoService campionatoService;
    private final ObjectProvider<DataSourceConnectionLogger> dsLoggerProvider;

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
}
