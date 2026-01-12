package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.util.enums.Enumeratori;
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

    private Map<Integer, String> roundTennis() {
        Map<Integer, String> ret = new HashMap<>();
        Enumeratori.DesRoundTennis[] values = Enumeratori.DesRoundTennis.values();
        for (int i = 0; i < values.length; i++) {
            ret.put((i + 1), values[i].getDescrizione());
        }
        return ret;
    }
    @Transactional(readOnly = true)
    public Map<String, Map<Integer, String>> desGiornate() {
        Map<String, Map<Integer, String>> ret = new HashMap<>();

        for (CampionatoDTO campionatoDTO : campionatiBySport(Enumeratori.SportDisponibili.TENNIS.name())) {
            ret.put(campionatoDTO.getId(), roundTennis());
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
