package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.entity.Sport;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.mapper.SospensioneLegaMapper;
import it.ddlsolution.survivor.mapper.SportMapper;
import it.ddlsolution.survivor.repository.CampionatoRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.SospensioneLegaRepository;
import it.ddlsolution.survivor.repository.SportRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@Data
@RequiredArgsConstructor
public class CacheableService {
    private final LegaRepository legaRepository;
    private final CampionatoRepository campionatoRepository;
    private final CampionatoMapper campionatoMapper;
    private final LegaMapper legaMapper;
    private final RestTemplate restTemplate;
    private final SospensioneLegaRepository sospensioneLegaRepository;
    private final SospensioneLegaMapper sospensioneLegaMapper;
    private final SportRepository sportRepository;
    private final SportMapper sportMapper;

    // Lazy provider e servizio di utilità per calcolo stato giornata
    private final ObjectProvider<ICalendario> calendarioProvider;
    private final UtilCalendarioService utilCalendarioService;

    public final static String CAMPIONATI="campionati";
    public final static String SPORT="sport";
    public final static String SOSPENSIONI="sospensioni";
    public final static String URL="cache-url";

    @Cacheable(value = CAMPIONATI)
    @Transactional(readOnly = true)
    public List<CampionatoDTO> allCampionati() {
        List<CampionatoDTO> campionatiDTO =  campionatoMapper.toDTOList(campionatoRepository.findAll());

        ICalendario calendario = calendarioProvider.getIfAvailable();
        if (calendario == null) {
            throw new RuntimeException("Nessuna implementazione di calendario disponibile");
        }

        for (CampionatoDTO campionatoDTO : campionatiDTO) {
            List<LocalDateTime> iniziGiornate=new ArrayList<>();
            Enumeratori.StatoPartita statoPartita=null;
            int giornata = 0;
            int giornataDaGiocare = 0;
            do {
                giornata++;
                List<PartitaDTO> partiteDTO = utilCalendarioService.partite(campionatoDTO, giornata);
                if (partiteDTO.size()>0) {
                    LocalDateTime inizioGiornata = partiteDTO.stream().map(f -> f.getOrario()).sorted().findFirst().get();
                    iniziGiornate.add(inizioGiornata);
                    Enumeratori.StatoPartita statoPartitaGiornata = utilCalendarioService.statoGiornata(partiteDTO, giornata);
                    if (statoPartitaGiornata != Enumeratori.StatoPartita.DA_GIOCARE) {
                        statoPartita = statoPartitaGiornata;
                        giornataDaGiocare = giornata;
                    }
                }
            } while (giornata < campionatoDTO.getNumGiornate());
            if (statoPartita == Enumeratori.StatoPartita.TERMINATA) {
                giornataDaGiocare = 1; // per testare wimbledon
            }
            campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
            campionatoDTO.setIniziGiornate(iniziGiornate);

        }
        return campionatiDTO;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = SPORT)
    public List<SportDTO> allSport() {
        List<Sport> sport = sportRepository.findAll();
        return sportMapper.toDTOList(sport);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = URL, key = "#root.args[0]")
    public <T> T cacheUrl(String url, Class<T> clazz) {
        ResponseEntity<T> forEntity = restTemplate.getForEntity(url, clazz);
        T response = forEntity.getBody();
        return response;
    }

    @Transactional(readOnly = true)
    @Cacheable(value = SOSPENSIONI)
    public Map<Long, List<Integer>> allSospensioni() {
        List<SospensioneLegaDTO> sospensioniLegaDTO = sospensioneLegaMapper.toDTOList(sospensioneLegaRepository.findAll());
        return sospensioniLegaDTO.stream()
                .collect(Collectors.groupingBy(
                        SospensioneLegaDTO::getIdLega,
                        Collectors.mapping(SospensioneLegaDTO::getGiornata, Collectors.toList())
                ));
    }
}
