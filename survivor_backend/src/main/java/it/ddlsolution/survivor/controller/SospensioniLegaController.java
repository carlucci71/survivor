package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.LeaderRule;
import it.ddlsolution.survivor.dto.request.SospensioneLegaRequestDTO;
import it.ddlsolution.survivor.dto.response.SospensioniLegaResponseDTO;
import it.ddlsolution.survivor.service.SospensioniLegaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RequestMapping("/sospensioniLega")

@RestController
@RequiredArgsConstructor
public class SospensioniLegaController {

    private final SospensioniLegaService sospensioniLegaService;

    @GetMapping
    public ResponseEntity<List<SospensioniLegaResponseDTO>> all(){
        return ResponseEntity.ok(sospensioniLegaService.allSospensioni());
    }

    @GetMapping("/{idLega}")
    public ResponseEntity<List<SospensioniLegaResponseDTO>> allByLega(@PathVariable Long idLega){
        return ResponseEntity.ok(sospensioniLegaService.allSospensioni(idLega));
    }

    @PutMapping
    @GuardiaDispositiva(idLegaParam = "sospensioneLegaRequestDTO.idLega", rule = LeaderRule.class)
    public ResponseEntity<List<SospensioniLegaResponseDTO>> save(@RequestBody SospensioneLegaRequestDTO sospensioneLegaRequestDTO){
        sospensioniLegaService.save(sospensioneLegaRequestDTO);
        return all();
    }



}
