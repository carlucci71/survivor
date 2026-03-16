package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.service.ReactionGiocataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/reaction")
@RequiredArgsConstructor
public class ReactionController {

    private final ReactionGiocataService reactionGiocataService;

    /**
     * Aggiunge o cambia reaction su una giocata.
     * Body: { "emoji": "👏" }
     */
    @PostMapping("/{giocataId}")
    public ResponseEntity<Void> reagisci(
            @PathVariable Long giocataId,
            @RequestBody Map<String, String> body) {
        String emoji = body.get("emoji");
        reactionGiocataService.reagisci(giocataId, emoji);
        return ResponseEntity.ok().build();
    }

    /**
     * Rimuove la propria reaction da una giocata.
     */
    @DeleteMapping("/{giocataId}")
    public ResponseEntity<Void> rimuovi(@PathVariable Long giocataId) {
        reactionGiocataService.rimuoviReaction(giocataId);
        return ResponseEntity.noContent().build();
    }
}
