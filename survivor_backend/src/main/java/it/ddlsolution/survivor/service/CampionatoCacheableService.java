package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.repository.CampionatoRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Data
@RequiredArgsConstructor
public class CampionatoCacheableService {
    private final CampionatoRepository campionatoRepository;
    private final CampionatoMapper campionatoMapper;

    @Cacheable(value = "campionati")
    public List<CampionatoDTO> allCampionati() {
        return campionatoMapper.toDTOList(campionatoRepository.findAll());
    }
}
