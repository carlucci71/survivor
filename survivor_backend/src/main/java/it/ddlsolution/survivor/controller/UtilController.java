package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import lombok.RequiredArgsConstructor;
import org.springframework.core.env.Environment;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/util")

@RestController
@RequiredArgsConstructor
public class UtilController {

    private final Environment environment;
    private final ICalendario calendario;
    private final LegaService legaService;


    @GetMapping("/profilo")
    public ResponseEntity<Map<String, String>> profilo() {
        String[] activeProfiles = environment.getActiveProfiles();
        String profilo = activeProfiles.length > 0 ? String.join(", ", activeProfiles) : "default";

        return ResponseEntity.ok(Map.of("profilo", profilo));
    }

    @GetMapping("/calendario")
    public ResponseEntity<List<PartitaDTO>> calendario() {
        return ResponseEntity.ok(calendario.partite("CALCIO", "SERIE_A"));
    }
}
