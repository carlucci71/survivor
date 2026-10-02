package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.service.FotoProfiloService;
import it.ddlsolution.survivor.service.GiocatoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.CacheControl;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@RequestMapping("/giocatore")

@RestController
@RequiredArgsConstructor
public class GiocatoreController {

    private final GiocatoreService giocatoreService;
    private final FotoProfiloService fotoProfiloService;


    @GetMapping("/me")
    public ResponseEntity<GiocatoreDTO> me() {
        GiocatoreDTO giocatoreDTO=giocatoreService.me();
        return ResponseEntity.ok(giocatoreDTO);
    }

    @PutMapping("/me")
    public ResponseEntity<GiocatoreDTO> aggiornaMe(@RequestBody GiocatoreDTO giocatoreDTO) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        if (!giocatoreDTO.getUser().getId().equals(userId)){
            throw new RuntimeException("Non stai aggiornando te stesso");
        }
        giocatoreDTO  = giocatoreService.aggiorna(giocatoreDTO);
        return ResponseEntity.ok(giocatoreDTO);
    }

    /**
     * Salva la lingua preferita dell'utente (it|en|es): usata dal backend per tradurre le
     * notifiche push. Il frontend la chiama ogni volta che l'utente cambia lingua nell'app.
     */
    @PutMapping("/lingua")
    public ResponseEntity<Void> aggiornaLingua(@RequestBody Map<String, String> body) {
        giocatoreService.aggiornaLingua(body.get("lingua"));
        return ResponseEntity.ok().build();
    }

    // ─── Foto profilo ───────────────────────────────────────────────────────

    /** Carica (o sostituisce) la mia foto. Il file viene comunque ricodificato lato server (JPEG 256x256). */
    @PutMapping(value = "/me/foto", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Long>> caricaFoto(@RequestParam("file") MultipartFile file) throws IOException {
        Long versione = fotoProfiloService.carica(file.getBytes());
        return ResponseEntity.ok(Map.of("fotoVersion", versione));
    }

    /** Toglie la mia foto (tornano le iniziali). */
    @DeleteMapping("/me/foto")
    public ResponseEntity<Map<String, String>> rimuoviFoto() {
        fotoProfiloService.rimuoviMia();
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }

    /**
     * La foto di un giocatore, se posso vederla (stessa lega, o sono io, o sono admin). 204 e non 404 quando non c'e'
     * o non e' visibile: e' un caso normale, e il frontend non deve mostrare un errore (le iniziali bastano).
     * La cache e' per versione (il frontend passa ?v=): una foto cambiata ha un URL nuovo.
     */
    @GetMapping("/{id:[0-9]+}/foto")
    public ResponseEntity<byte[]> foto(@PathVariable Long id) {
        return fotoProfiloService.leggi(id)
                .map(bytes -> ResponseEntity.ok()
                        .contentType(MediaType.IMAGE_JPEG)
                        .cacheControl(CacheControl.maxAge(1, TimeUnit.HOURS).cachePrivate())
                        .body(bytes))
                .orElseGet(() -> ResponseEntity.noContent().build());
    }

    /** Segnala la foto di un altro giocatore: da quel momento non la vedo piu'. */
    @PostMapping("/{id:[0-9]+}/foto/segnala")
    public ResponseEntity<Map<String, String>> segnalaFoto(@PathVariable Long id) {
        fotoProfiloService.segnala(id);
        return ResponseEntity.ok(Map.of("ESITO", "OK"));
    }

}
