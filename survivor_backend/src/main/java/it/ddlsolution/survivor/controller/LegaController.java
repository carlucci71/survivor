package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.LeaderRule;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.request.LegaInsertDTO;
import it.ddlsolution.survivor.dto.request.LegaInvitaDTO;
import it.ddlsolution.survivor.dto.request.LegaJoinDTO;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.util.Utility;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/lega")

@RestController
@RequiredArgsConstructor
@Slf4j
public class LegaController {

    private final LegaService legaService;
    private final Utility utility;


    @GetMapping(value = "/mieLeghe")
    public ResponseEntity<List<LegaDTO>> mieLeghe() {
        List<LegaDTO> dtoList = legaService.mieLeghe();
        return ResponseEntity.ok(dtoList);
    }

    @GetMapping("/{id}")
    public ResponseEntity<LegaDTO> getLegaById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        LegaDTO legaDTO = legaService.getLegaDTO(id,true,userId);
        if (legaDTO == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(legaDTO);
    }

    @PostMapping
    public ResponseEntity<LegaDTO> salva(@RequestBody LegaInsertDTO legaInsertDTO) {
        LegaDTO legaDTO = legaService.inserisciLega(legaInsertDTO);
        return ResponseEntity.ok(legaDTO);
    }

    @GetMapping(value = "/legheLibere")
    public ResponseEntity<List<LegaDTO>> legheLibere() {
        List<LegaDTO> dtoList = legaService.legheLibere();
        return ResponseEntity.ok(dtoList);
    }

    @PutMapping("join/{idLega}")
    public ResponseEntity<LegaDTO> join(@RequestBody LegaJoinDTO legaJoinDTO, @PathVariable("idLega") Long idLega) {
        LegaDTO legaDTO = legaService.join(idLega, legaJoinDTO);
        return ResponseEntity.ok(legaDTO);
    }

    @PostMapping("/invita/{idLega}")
    public ResponseEntity<Map<String, String>> invita(@RequestBody LegaInvitaDTO legaInvitaDTO, @PathVariable("idLega") Long idLega) {
        legaService.invita(idLega, legaInvitaDTO.getEmails());
        return ResponseEntity.ok(Map.of("ESITO","OK"));
    }

    @PutMapping("/calcola/{idLega}")
    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    public ResponseEntity<LegaDTO> calcola(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.calcola(idLega));
    }

    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    @PutMapping("/undoCalcola/{idLega}")
    public ResponseEntity<LegaDTO> undoCalcola(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.undoCalcola(idLega));
    }

    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    @PutMapping("/termina/{idLega}")
    public ResponseEntity<LegaDTO> termina(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.termina(idLega));
    }

    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    @PutMapping("/riapri/{idLega}")
    public ResponseEntity<LegaDTO> riapri(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.riapri(idLega));
    }

    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    @PutMapping("/secondaOccasione/{idLega}")
    public ResponseEntity<LegaDTO> secondaOccasione(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.secondaOccasione(idLega));
    }

    @PutMapping("/nuovaEdizione/{idLega}")
    public ResponseEntity<LegaDTO> nuovaEdizione(@PathVariable Long idLega) {
        return ResponseEntity.ok(legaService.nuovaEdizione(idLega));
    }

    @PutMapping("/cancellaGiocatoreDaLega/{idLega}/{idGiocatore}")
    public ResponseEntity<LegaDTO> cancellaGiocatoreDaLega(@PathVariable Long idLega,@PathVariable Long idGiocatore) {
        return ResponseEntity.ok(legaService.cancellaGiocatoreDaLega(idLega, idGiocatore));
    }

}
