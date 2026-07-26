package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.PronosticoVincitoreDTO;
import it.ddlsolution.survivor.dto.VotoPronosticoDTO;
import it.ddlsolution.survivor.service.GiocatoreService;
import it.ddlsolution.survivor.service.PronosticoVincitoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/lega")
@RequiredArgsConstructor
public class PronosticoVincitoreController {

    private final PronosticoVincitoreService pronosticoVincitoreService;
    private final GiocatoreService giocatoreService;

    @PostMapping("/{idLega}/pronostico")
    public ResponseEntity<PronosticoVincitoreDTO> salvaPronostico(@PathVariable Long idLega, @RequestBody Map<String, Long> body) {
        Long idGiocatorePronosticato = body.get("giocatorePronosticatoId");
        return ResponseEntity.ok(pronosticoVincitoreService.salvaPronostico(idLega, idGiocatorePronosticato));
    }

    @GetMapping("/{idLega}/pronostico")
    public ResponseEntity<PronosticoVincitoreDTO> getMioPronostico(@PathVariable Long idLega) {
        return ResponseEntity.ok(pronosticoVincitoreService.getMioPronostico(idLega));
    }

    @GetMapping("/{idLega}/pronostici/classifica")
    public ResponseEntity<List<VotoPronosticoDTO>> getClassificaPronostici(@PathVariable Long idLega) {
        return ResponseEntity.ok(pronosticoVincitoreService.getClassificaPronostici(idLega));
    }

    @GetMapping("/pronostici-corretti/me")
    public ResponseEntity<Map<String, Long>> getMieiPronosticiCorretti() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Long userId = (Long) authentication.getPrincipal();
        Long giocatoreId = giocatoreService.findByUserId(userId).getId();
        long count = pronosticoVincitoreService.countPronosticiCorretti(giocatoreId);
        return ResponseEntity.ok(Map.of("pronosticiCorretti", count));
    }
}
