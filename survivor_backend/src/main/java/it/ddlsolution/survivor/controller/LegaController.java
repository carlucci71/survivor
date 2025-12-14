package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/lega")

@RestController
@RequiredArgsConstructor
@Slf4j
public class LegaController {

    private final LegaService legaService;


    @GetMapping(value = "/mieLeghe")
    public ResponseEntity<List<LegaDTO>> mieLeghe() {
        List<LegaDTO> dtoList = legaService.mieLeghe();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LegaDTO> getLegaById(@PathVariable Long id) {
        LegaDTO legaDTO = legaService.getLegaDTO(id);
        if (legaDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(legaDTO);
    }


}
