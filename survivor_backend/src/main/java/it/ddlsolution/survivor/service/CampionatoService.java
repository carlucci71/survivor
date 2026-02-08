package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.entity.Campionato;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.repository.CampionatoRepository;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CampionatoService {
//    private final CacheableService cacheableService;
    private final ObjectProvider<CacheableService> cacheableProvider;
    private final CampionatoRepository campionatoRepository;
    private final CampionatoMapper campionatoMapper;

    @Transactional(readOnly = true)
    public CampionatoDTO getCampionato(String campionatoId) {
        return allCampionati()
                .stream()
                .filter(c -> c.getId().equals(campionatoId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Campionato non trovato: " + campionatoId));
    }

    @Transactional(readOnly = true)
    public List<CampionatoDTO> allCampionati() {
        return cacheableProvider.getIfAvailable().allCampionati();
    }

    @Transactional(readOnly = true)
    public List<CampionatoDTO> leggiCampionati() {
        List<Campionato> all = campionatoRepository.findAll();
        List<CampionatoDTO> dtoList = campionatoMapper.toDTOList(all);
        dtoList.forEach(c->c.setSquadre(cacheableProvider.getIfAvailable().getSquadreFromIdCampionato(c.getId())));
        return dtoList;
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
        return campionatiBySport(Enumeratori.SportDisponibili.BASKET.name()).stream()
                .filter(c -> c.getId().equals(Enumeratori.CampionatiDisponibili.NBA_RS.name()))
                .findFirst()
                .map(campionatoDTO -> {
                    Map<Integer, String> ret = new HashMap<>();
                    for (int i = 1; i <= campionatoDTO.getNumGiornate(); i++){
                        ret.put(i, "Settimana " + i);
                    }
                    return ret;
                })
                .orElseGet(HashMap::new);
    }

    public CampionatoDTO refreshCampionato(CampionatoDTO campionatoDTO, short anno) {
        CacheableService cacheableService = cacheableProvider.getIfAvailable();
        cacheableService.clearCachePartite(campionatoDTO.getId(), anno);
        return cacheableService.elaboraCampionato(campionatoDTO, anno);
    }


}
