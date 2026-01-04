package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampionatoService {
    private final CacheableService cacheableService;
    private final UtilCalendarioService utilCalendarioService;
    private final ICalendario calendario;

    @Transactional(readOnly = true)
    public CampionatoDTO getCampionato(String campionatoId) {
        return allCampionati()
                .stream()
                .filter(c -> c.getId().equals(campionatoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Lega non trovata per campionato: " + campionatoId));
    }

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

        for (CampionatoDTO campionatoDTO : campionatiBySport(Enumeratori.SportDisponibili.TENNIS.name())) {
            ret.put(campionatoDTO.getId(), calendario.roundTennis());
        }

        ret.put(Enumeratori.CampionatiDisponibili.NBA_RS.name(), desNbaRS());
        return ret;
    }

    private Map<Integer, String> desNbaRS(){
        CampionatoDTO campionatoDTO = campionatiBySport(Enumeratori.SportDisponibili.BASKET.name()).stream()
                .filter(c->c.getId().equals(Enumeratori.CampionatiDisponibili.NBA_RS.name()))
                .findFirst().get();
        Map<Integer, String> ret = new HashMap<>();
        for (int i=1;i<=campionatoDTO.getNumGiornate();i++){
            ret.put(i,"Settimana " + i);
        }

        return ret;
    }

}
