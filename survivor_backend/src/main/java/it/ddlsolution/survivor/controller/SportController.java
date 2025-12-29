package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.SportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/sport")
@RequiredArgsConstructor
public class SportController {
    private final SportService sportService;

    @GetMapping
    public ResponseEntity<List<SportDTO>> inserisciGiocata() {
        return ResponseEntity.ok(sportService.all());
    }
}

