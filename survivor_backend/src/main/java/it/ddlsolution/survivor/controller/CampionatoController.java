package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.service.CampionatoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/campionato")
@RequiredArgsConstructor
public class CampionatoController {
    private final CampionatoService campionatoService;

    @GetMapping("/{idSport}")
    public ResponseEntity<List<CampionatoDTO>> campionatiBySport(@PathVariable("idSport") String idSport ) {
        return ResponseEntity.ok(campionatoService.campionatiBySport(idSport));
    }
}

