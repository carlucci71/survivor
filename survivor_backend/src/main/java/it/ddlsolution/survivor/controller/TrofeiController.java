package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.StatisticheTrofeiDTO;
import it.ddlsolution.survivor.dto.TrofeoDTO;
import it.ddlsolution.survivor.service.GiocatoreService;
import it.ddlsolution.survivor.service.TrofeiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/trofei")
@RequiredArgsConstructor
@Slf4j
public class TrofeiController {

    private final TrofeiService trofeiService;
    private final GiocatoreService giocatoreService;

    /**
     * GET /trofei/me
     * Ottiene le statistiche complete dei trofei dell'utente loggato
     */
    @GetMapping("/me")
    public ResponseEntity<StatisticheTrofeiDTO> getMieiTrofei() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        log.debug("Richiesta trofei per user: {}", userId);

        // Recupera il giocatore associato all'utente
        Long giocatoreId = giocatoreService.findByUserId(userId).getId();

        StatisticheTrofeiDTO stats = trofeiService.getStatisticheTrofei(giocatoreId);

        return ResponseEntity.ok(stats);
    }

    /**
     * GET /trofei/me/vittorie
     * Ottiene solo le vittorie (primi posti) dell'utente loggato
     */
    @GetMapping("/me/vittorie")
    public ResponseEntity<List<TrofeoDTO>> getMieVittorie() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        Long giocatoreId = giocatoreService.findByUserId(userId).getId();
        List<TrofeoDTO> vittorie = trofeiService.getVittorie(giocatoreId);

        return ResponseEntity.ok(vittorie);
    }

    /**
     * GET /trofei/me/podi
     * Ottiene i podi (primi 3 posti) dell'utente loggato
     */
    @GetMapping("/me/podi")
    public ResponseEntity<List<TrofeoDTO>> getMieiPodi() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();

        Long giocatoreId = giocatoreService.findByUserId(userId).getId();
        List<TrofeoDTO> podi = trofeiService.getPodi(giocatoreId);

        return ResponseEntity.ok(podi);
    }

    /**
     * GET /trofei/giocatore/{giocatoreId}
     * Ottiene le statistiche dei trofei di un giocatore specifico (per admin/leader)
     */
    @GetMapping("/giocatore/{giocatoreId}")
    public ResponseEntity<StatisticheTrofeiDTO> getTrofeiGiocatore(@PathVariable Long giocatoreId) {
        log.debug("Richiesta trofei per giocatore: {}", giocatoreId);

        StatisticheTrofeiDTO stats = trofeiService.getStatisticheTrofei(giocatoreId);

        return ResponseEntity.ok(stats);
    }
}
