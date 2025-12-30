package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampionatoService {
    private final CacheableService cacheableService;
    private final ICalendario calendario;

    @Transactional(readOnly = true)
    public List<CampionatoDTO> allCampionati() {
        return cacheableService.allCampionati();
    }

    @Transactional(readOnly = true)
    public List<CampionatoDTO> campionatiBySport(String idSport) {
        return allCampionati().stream()
                .filter(c -> c.getSport().getId().equals(idSport))
                .toList();
    }

    @Transactional(readOnly = true)
    public Map<String, Map<Integer, String>> desGiornate() {
        Map<String, Map<Integer, String>> ret = new HashMap<>();
        Map<Integer, String> mapSport = calendario.roundTennis();
        ret.put("TENNIS", mapSport);
        return ret;
    }
}
