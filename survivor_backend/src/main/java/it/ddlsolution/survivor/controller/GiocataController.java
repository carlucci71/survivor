package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.LoggaDispositiva;
import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.service.GiocataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/giocate")
@RequiredArgsConstructor
public class GiocataController {
    private final GiocataService giocataService;

    @PostMapping
    @LoggaDispositiva(tipologia = "gioca")
    public ResponseEntity<GiocatoreDTO> inserisciGiocata(@RequestBody GiocataRequestDTO request) {
        return ResponseEntity.ok(giocataService.inserisciGiocata(request));
    }
}

