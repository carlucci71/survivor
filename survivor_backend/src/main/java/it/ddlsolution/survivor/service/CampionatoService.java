package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CampionatoService {
    private final CacheableService campionatoCacheableService;

    public Optional<CampionatoDTO> findCampionato(String id) {
        return allCampionati()
                .stream()
                .filter(c -> c.getId().equalsIgnoreCase(id))
                .findAny();
    }

    public List<CampionatoDTO> allCampionati() {
        return campionatoCacheableService.allCampionati();
    }
}

