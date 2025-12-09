package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.service.LegaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/lega")

@RestController
@RequiredArgsConstructor
public class LegaController {

    private final LegaService legaService;

    @GetMapping(value = "/prova")
    public ResponseEntity<List<LegaDTO>> prova(){
        List<LegaDTO> dtoList = legaService.prova();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping(value = "/mieLeghe")
    public ResponseEntity<List<LegaDTO>> mieLeghe(){
        List<LegaDTO> dtoList = legaService.mieLeghe();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LegaDTO> getLegaById(@PathVariable Long id) {
        LegaDTO lega = legaService.getLegaById(id);
        if (lega == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(lega);
    }
}
