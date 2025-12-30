package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampionatoService {
    private final CacheableService cacheableService;
    private final ICalendario calendario;

    public Optional<CampionatoDTO> findCampionato(String id) {
        return allCampionati()
                .stream()
                .filter(c -> c.getId().equalsIgnoreCase(id))
                .findAny();
    }

    public List<CampionatoDTO> allCampionati() {
        // ora deleghiamo al cacheable service che restituisce i campionati già arricchiti con giornataDaGiocare
        return cacheableService.allCampionati();
    }

    public List<CampionatoDTO> campionatiBySport(String idSport) {
        return allCampionati().stream()
                .filter(c -> c.getSport().getId().equals(idSport))
                .toList();
    }

    public Map<Integer, String> desGiornate(String idSport) {
        Map<Integer, String> ret=new HashMap<>();
        if (idSport.equals("TENNIS")){
            ret=calendario.roundTennis();
        }
        return ret;
    }
}
