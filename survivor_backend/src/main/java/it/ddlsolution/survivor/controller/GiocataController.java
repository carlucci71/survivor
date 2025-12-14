package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.GiocataDTO;
import it.ddlsolution.survivor.dto.GiocataRequestDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.service.GiocataService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/giocate")
@RequiredArgsConstructor
public class GiocataController {
    private final GiocataService giocataService;

    @PostMapping
    public GiocatoreDTO inserisciGiocata(@RequestBody GiocataRequestDTO request) {
        return giocataService.inserisciGiocata(request);
    }
}

