package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.FotoSegnalataDTO;
import it.ddlsolution.survivor.service.FotoProfiloService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Moderazione delle foto profilo (solo ruolo ADMIN: la regola /admin/** sta in SecurityConfig). La foto vera si
 * guarda con GET /giocatore/{id}/foto, che per gli admin non ha restrizioni.
 */
@RestController
@RequestMapping("/admin/foto")
@RequiredArgsConstructor
public class AdminFotoController {

    private final FotoProfiloService fotoProfiloService;

    /** Foto segnalate, nascoste in automatico o con caricamento bloccato. */
    @GetMapping("/segnalate")
    public ResponseEntity<List<FotoSegnalataDTO>> segnalate() {
        return ResponseEntity.ok(fotoProfiloService.segnalate());
    }

    /** Rimuove la foto; con {@code blocca=true} vieta anche nuovi caricamenti a quel giocatore. */
    @PostMapping("/{giocatoreId:[0-9]+}/rimuovi")
    public ResponseEntity<Map<String, String>> rimuovi(@PathVariable Long giocatoreId,
                                                       @RequestParam(defaultValue = "false") boolean blocca) {
        fotoProfiloService.adminRimuovi(giocatoreId, blocca);
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }

    /** Le segnalazioni erano infondate: la foto torna visibile. */
    @PostMapping("/{giocatoreId:[0-9]+}/ripristina")
    public ResponseEntity<Map<String, String>> ripristina(@PathVariable Long giocatoreId) {
        fotoProfiloService.adminRipristina(giocatoreId);
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }

    /** Toglie il divieto di caricamento. */
    @PostMapping("/{giocatoreId:[0-9]+}/sblocca")
    public ResponseEntity<Map<String, String>> sblocca(@PathVariable Long giocatoreId) {
        fotoProfiloService.adminSblocca(giocatoreId);
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }
}
