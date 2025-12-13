package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.service.LegaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/admin")

@RestController
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final LegaService legaService;

    @PutMapping("/calcola/{idLega}")
    public ResponseEntity<LegaDTO> calcola(@PathVariable Long idLega, @RequestParam int giornata) {
        return ResponseEntity.ok(legaService.calcola(idLega,giornata));
    }

}
