package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.PartitaLiveDTO;
import it.ddlsolution.survivor.service.LiveScoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/live")
@RequiredArgsConstructor
public class LiveScoreController {

    private final LiveScoreService liveScoreService;

    /**
     * Partite della giornata Serie A corrente (in corso o appena conclusa), solo se l'utente ha
     * una lega Serie A attiva. Pensato per essere richiamato dal frontend ogni 45-60s: il dato è
     * comunque cachato lato server per ~50s a prescindere da quanti utenti lo richiedono.
     */
    @GetMapping("/serieA")
    public ResponseEntity<List<PartitaLiveDTO>> partiteGiornataSerieA() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        return ResponseEntity.ok(liveScoreService.partiteGiornataSerieAPerUtente(userId));
    }
}
