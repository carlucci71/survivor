package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.aspect.guardlogger.GuardiaDispositiva;
import it.ddlsolution.survivor.aspect.guardlogger.rule.LeaderRule;
import it.ddlsolution.survivor.dto.LegaJoinRequestDTO;
import it.ddlsolution.survivor.service.LegaJoinRequestService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RequestMapping("/lega/richieste")
@RestController
@RequiredArgsConstructor
@Slf4j
public class LegaJoinRequestController {

    private final LegaJoinRequestService legaJoinRequestService;

    /** Utente: richiedi ingresso alla lega */
    @PostMapping("/{idLega}")
    public ResponseEntity<LegaJoinRequestDTO> richiediIngresso(@PathVariable Long idLega) {
        LegaJoinRequestDTO dto = legaJoinRequestService.richiediIngresso(idLega);
        return ResponseEntity.ok(dto);
    }

    /** Leader: lista delle richieste in attesa */
    @GetMapping("/{idLega}")
    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    public ResponseEntity<List<LegaJoinRequestDTO>> richiestePendenti(@PathVariable Long idLega) {
        List<LegaJoinRequestDTO> list = legaJoinRequestService.richiestePendenti(idLega);
        return ResponseEntity.ok(list);
    }

    /** Leader: approva una richiesta */
    @PostMapping("/{idLega}/approva/{requestId}")
    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    public ResponseEntity<LegaJoinRequestDTO> approva(
            @PathVariable Long idLega,
            @PathVariable Long requestId) {
        LegaJoinRequestDTO dto = legaJoinRequestService.approva(idLega, requestId);
        return ResponseEntity.ok(dto);
    }

    /** Leader: rifiuta una richiesta */
    @PostMapping("/{idLega}/rifiuta/{requestId}")
    @GuardiaDispositiva(idLegaParam = "idLega", rule = LeaderRule.class)
    public ResponseEntity<LegaJoinRequestDTO> rifiuta(
            @PathVariable Long idLega,
            @PathVariable Long requestId) {
        LegaJoinRequestDTO dto = legaJoinRequestService.rifiuta(idLega, requestId);
        return ResponseEntity.ok(dto);
    }

    /** Utente: annulla la propria richiesta */
    @DeleteMapping("/{idLega}")
    public ResponseEntity<Map<String, String>> annullaRichiesta(@PathVariable Long idLega) {
        legaJoinRequestService.annullaRichiesta(idLega);
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }
}
