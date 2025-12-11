package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/admin")

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final LegaService legaService;
    @GetMapping
    public ResponseEntity<String> prova(){
        return ResponseEntity.ok("BRAVO!");
    }

    @GetMapping("/calcola/{id}")
    public ResponseEntity<LegaDTO> calcola(@PathVariable Long id) {
        log.info("CALCOLA");

        LegaDTO legaDTO = legaService.getLegaDTO(id);
        if (legaDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(legaDTO);


    }

}
