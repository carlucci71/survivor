package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.entity.Giocatore;
import it.ddlsolution.survivor.mapper.GiocatoreMapper;
import it.ddlsolution.survivor.service.GiocatoreService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RequestMapping("/giocatore")

@RestController
@RequiredArgsConstructor
public class GiocatoreController {

    private final GiocatoreService giocatoreService;


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

}
