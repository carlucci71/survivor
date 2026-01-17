package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.dto.response.PartitaDTO;
import it.ddlsolution.survivor.dto.response.SospensioniLegaResponseDTO;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
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
@Slf4j
public class CacheableService {
    private final CacheManager cacheManager;
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
            try {
                List<LocalDateTime> iniziGiornate = new ArrayList<>();
                int giornata = 0;
                Integer giornataDaGiocare = null;
                do {
                    giornata++;
                    List<PartitaDTO> partiteDTO = utilCalendarioService.partite(campionatoDTO, giornata);
                    if (partiteDTO.size() > 0) {
                        LocalDateTime inizioGiornata = partiteDTO.stream().map(f -> f.getOrario()).sorted().findFirst().get();
                        iniziGiornate.add(inizioGiornata);
                        Enumeratori.StatoPartita statoPartitaGiornata = utilCalendarioService.statoGiornata(partiteDTO, giornata);
                        log.info("La giornata {} è {}", giornata, statoPartitaGiornata);
                        if (statoPartitaGiornata == Enumeratori.StatoPartita.TERMINATA) {
                            giornataDaGiocare = giornata + 1;
                        }
                    }
                } while (giornata < campionatoDTO.getNumGiornate());
                if (giornataDaGiocare == null || giornataDaGiocare.equals(0)){
                    giornataDaGiocare=1;
                }
                campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
                campionatoDTO.setIniziGiornate(iniziGiornate);
            }
            catch (Exception e){
                log.info("Errore nel recupero del campionato: " + campionatoDTO.getNome(),e);
            }
        }
        /*
        for (CampionatoDTO campionatoDTO : campionatiDTO) {
            List<LocalDateTime> iniziGiornate=new ArrayList<>();
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
                        giornataDaGiocare = giornata+1;
                    }
                }
            } while (giornata < campionatoDTO.getNumGiornate());
            campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
            campionatoDTO.setIniziGiornate(iniziGiornate);

        }

         */
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
    public List<SospensioniLegaResponseDTO> allSospensioni() {
        List<SospensioneLegaDTO> sospensioniLegaDTO = sospensioneLegaMapper.toDTOList(sospensioneLegaRepository.findAll());

        // Raggruppa per idLega e crea la lista di SospensioniLegaResponseDTO
        Map<Long, List<SospensioneLegaDTO>> grouped = sospensioniLegaDTO.stream()
                .collect(Collectors.groupingBy(SospensioneLegaDTO::getIdLega));


        return grouped.entrySet().stream()
                .map(entry -> {
                    SospensioniLegaResponseDTO response = new SospensioniLegaResponseDTO();
                    response.setIdLega(entry.getKey());
                    // Estrae la lista delle giornate sospese per la lega
                    List<Integer> giornate = entry.getValue().stream()
                        .map(SospensioneLegaDTO::getGiornata)
                        .collect(Collectors.toList());
                    response.setGiornate(giornate);
                    return response;
                })
                .collect(Collectors.toList());
    }


    /**
     * Invalida manualmente la cache specificata
     */
    public void invalidateCache(String cacheName) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.clear();
            log.info("Cache '{}' invalidata manualmente.", cacheName);
        } else {
            log.warn("Cache '{}' non trovata.", cacheName);
        }
    }

}
