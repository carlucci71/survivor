package it.ddlsolution.survivor.controller;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.UtilCalendarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/campionato")
@RequiredArgsConstructor
public class CampionatoController {
    private final CampionatoService campionatoService;
    private final UtilCalendarioService utilCalendarioService;

    @GetMapping("/{idSport}")
    public ResponseEntity<List<CampionatoDTO>> campionatiBySport(@PathVariable("idSport") String idSport ) {
        return ResponseEntity.ok(campionatoService.campionatiBySport(idSport));
    }

    @GetMapping("desGiornate")
    public ResponseEntity<Map<String,Map<Integer, String>>> desGiornate() {
        return ResponseEntity.ok(campionatoService.desGiornate());
    }
    @GetMapping(value = "/calendario/{campionatoId}/{squadraId}/{giornata}")
    public ResponseEntity<List<PartitaDTO>> calendario(@PathVariable String campionatoId, @PathVariable String squadraId, @PathVariable Integer giornata, @RequestParam Boolean prossimi) {
        CampionatoDTO campionatoDTO = campionatoService.getCampionato(campionatoId);
        List<PartitaDTO> squadraDTOListMap = utilCalendarioService.calendario(campionatoDTO, squadraId, giornata, prossimi);
        return ResponseEntity.ok(squadraDTOListMap);
    }

}

