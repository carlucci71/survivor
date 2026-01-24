package it.ddlsolution.survivor.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import it.ddlsolution.survivor.dto.GiocataRevisionDTO;
import it.ddlsolution.survivor.service.GiocataRevisionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/giocate/revisions")
@RequiredArgsConstructor
@Slf4j
@Tag(name = "Giocata Revisions", description = "API per la gestione della cronologia delle giocate")
@SecurityRequirement(name = "bearerAuth")
public class GiocataRevisionController {

    private final GiocataRevisionService giocataRevisionService;

    @GetMapping("/{giocataId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(
            summary = "Ottieni tutte le revisioni di una giocata",
            description = "Restituisce la cronologia completa di tutte le modifiche apportate a una giocata specifica"
    )
    public ResponseEntity<List<GiocataRevisionDTO>> getRevisions(@PathVariable Long giocataId) {
        log.info("Richiesta revisioni per giocata ID: {}", giocataId);
        List<GiocataRevisionDTO> revisions = giocataRevisionService.findRevisions(giocataId);
        return ResponseEntity.ok(revisions);
    }

    @GetMapping("/{giocataId}/last")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(
            summary = "Ottieni l'ultima revisione di una giocata",
            description = "Restituisce l'ultima modifica apportata a una giocata specifica"
    )
    public ResponseEntity<GiocataRevisionDTO> getLastRevision(@PathVariable Long giocataId) {
        log.info("Richiesta ultima revisione per giocata ID: {}", giocataId);
        return giocataRevisionService.findLastChangeRevision(giocataId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{giocataId}/revision/{revisionNumber}")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(
            summary = "Ottieni una specifica revisione di una giocata",
            description = "Restituisce una specifica revisione di una giocata identificata dal numero di revisione"
    )
    public ResponseEntity<GiocataRevisionDTO> getRevision(
            @PathVariable Long giocataId,
            @PathVariable Long revisionNumber) {
        log.info("Richiesta revisione {} per giocata ID: {}", revisionNumber, giocataId);
        return giocataRevisionService.findRevision(giocataId, revisionNumber)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
