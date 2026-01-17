package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.dto.response.SospensioniLegaResponseDTO;
import it.ddlsolution.survivor.entity.Sport;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.mapper.PartitaMapper;
import it.ddlsolution.survivor.mapper.SospensioneLegaMapper;
import it.ddlsolution.survivor.mapper.SportMapper;
import it.ddlsolution.survivor.repository.CampionatoRepository;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.PartitaRepository;
import it.ddlsolution.survivor.repository.SospensioneLegaRepository;
import it.ddlsolution.survivor.repository.SportRepository;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;
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
    private final PartitaRepository partitaRepository;
    private final PartitaMapper partitaMapper;
    private final Utility utility;


    // Lazy provider e servizio di utilità per calcolo stato giornata
    private final ObjectProvider<ICalendario> calendarioProvider;
    private final UtilCalendarioService utilCalendarioService;

    public final static String CAMPIONATI = "campionati";
    public final static String SPORT = "sport";
    public final static String SOSPENSIONI = "sospensioni";
    public final static String PARTITE = "partite";
    public final static String URL = "cache-url";

    @Value("${anno-default}")
    short annoDefault;


    @Cacheable(value = CAMPIONATI)
    @Transactional
    public List<CampionatoDTO> allCampionati() {
        List<CampionatoDTO> campionatiDTO = campionatoMapper.toDTOList(campionatoRepository.findAll());
        for (CampionatoDTO campionatoDTO : campionatiDTO) {
            CompletableFuture.runAsync(() ->
                    elaboraCapionato(campionatoDTO)
            );
        }
        return campionatiDTO;
    }

    private void elaboraCapionato(CampionatoDTO campionatoDTO) {
        try {
            List<LocalDateTime> iniziGiornate = new ArrayList<>();
            Integer giornataDaGiocare = 1;
            for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
                List<PartitaDTO> partiteDTO = utilCalendarioService.partiteCampionatoDellaGiornataWithRefreshFromWeb(campionatoDTO, giornata, campionatoDTO.getId().equals(Enumeratori.CampionatiDisponibili.TENNIS_AO.name()) ? 2026 : annoDefault);

                if (partiteDTO.size() > 0) {
                    Optional<LocalDateTime> first = partiteDTO
                            .stream()
                            .map(f -> f.getOrario())
                            .sorted()
                            .findFirst();
                    if (first.isPresent()) {
                        iniziGiornate.add(first.get());
                    } else {
                        throw new RuntimeException("Inizio non trovato per campionato: " + campionatoDTO.getId() + " giornata: " + giornata);
                    }

                    Enumeratori.StatoPartita statoPartitaGiornata = utilCalendarioService.statoGiornata(partiteDTO, giornata);
                    log.info("La giornata {} di {} è {}", giornata, campionatoDTO.getNome(), statoPartitaGiornata);
                    if (statoPartitaGiornata == Enumeratori.StatoPartita.TERMINATA) {
                        giornataDaGiocare = giornata;
                    }
                }
            }
            campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
            campionatoDTO.setIniziGiornate(iniziGiornate);
        } catch (Exception e) {
            log.info("Errore nel recupero del campionato: " + campionatoDTO.getNome(), e);
        }
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

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = PARTITE,
            key = "#idCampionato + '_' + #anno + '_' + T(String).valueOf(@utility.getImplementationExternalApi())"
    )
    public List<PartitaDTO> getPartiteCampionatoAnno(String idCampionato, short anno) {
        return partitaMapper.toDTOList(partitaRepository.findByCampionato_IdAndImplementationExternalApiAndAnno(idCampionato, utility.getImplementationExternalApi(), anno));
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

    private void invalidateCacheEntry(String cacheName, Object key) {
        Cache cache = cacheManager.getCache(cacheName);
        if (cache != null) {
            cache.evict(key);
            log.info("Entry '{}' della cache '{}' invalidata manualmente.", key, cacheName);
        } else {
            log.warn("Cache '{}' non trovata. Impossibile invalidare la key '{}'.", cacheName, key);
        }
    }

}
