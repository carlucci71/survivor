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
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.function.Supplier;
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

    @Value("${anno-default}")
    short annoDefault;

    @Value("${cache.allcampionati.threads:10}")
    private int allCampionatiThreads;

    @Value("${cache.allcampionati.timeout-seconds:60}")
    private long allCampionatiTimeoutSeconds;


    @Cacheable(value = CAMPIONATI)
    @Transactional
    public List<CampionatoDTO> allCampionati() {

        List<CampionatoDTO> campionatiDTO = new ArrayList<>();
        // Crea la lista di supplier (ognuno ritorna il CampionatoDTO elaborato)
        List<Supplier<CampionatoDTO>> suppliers = campionatoMapper.toDTOList(campionatoRepository.findAll()).stream()
                .map(campionatoDTO -> (Supplier<CampionatoDTO>) () -> elaboraCapionato(campionatoDTO,
                        campionatoDTO.getId().equals(Enumeratori.CampionatiDisponibili.TENNIS_AO.name()) ? 2026 : annoDefault))
                .toList();


        ExecutorService executor = Executors.newFixedThreadPool(allCampionatiThreads);
        try {
            List<CompletableFuture<CampionatoDTO>> futures = suppliers.stream()
                    .map(s -> CompletableFuture.supplyAsync(s, executor))
                    .toList();

            CompletableFuture<Void> all = CompletableFuture.allOf(futures.toArray(new CompletableFuture[0]));
            try {
                all.get(allCampionatiTimeoutSeconds, TimeUnit.SECONDS);
            } catch (TimeoutException te) {
                futures.forEach(f -> f.cancel(true));
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                log.warn("Thread interrotto mentre si attendeva il completamento di allCampionati", ie);
            } catch (ExecutionException ee) {
            }

            for (CompletableFuture<CampionatoDTO> f : futures) {
                try {
                    CampionatoDTO result = f.join(); // rilancia CompletionException se il task ha fallito
                    if (result != null) {
                        campionatiDTO.add(result);
                    }
                } catch (CompletionException ex) {
                    log.error("Errore durante l'elaborazione di un campionato (parallelo)", ex.getCause());
                }
            }
            log.info("Elaborati {} campionati con successo su {}.", campionatiDTO.size(), futures.size());

        } finally {
            executor.shutdown();
            try {
                if (!executor.awaitTermination(5, TimeUnit.SECONDS)) {
                    executor.shutdownNow();
                }
            } catch (InterruptedException e) {
                executor.shutdownNow();
                Thread.currentThread().interrupt();
            }
        }

        return campionatiDTO;
    }

    public CampionatoDTO elaboraCapionato(final CampionatoDTO campionatoDTO, short anno) {
        List<LocalDateTime> iniziGiornate = new ArrayList<>();
        int giornataDaGiocare = 1;
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            List<PartitaDTO> partiteDTO = utilCalendarioService.partiteCampionatoDellaGiornataWithRefreshFromWeb(campionatoDTO, giornata, anno);

            if (!partiteDTO.isEmpty()) {
                final int currentGiornata = giornata;
                LocalDateTime first = partiteDTO.stream()
                        .map(PartitaDTO::getOrario)
                        .sorted()
                        .findFirst()
                        .orElseThrow(() -> new RuntimeException("Inizio non trovato per campionato: " + campionatoDTO.getId() + " giornata: " + currentGiornata));
                iniziGiornate.add(first);

                Enumeratori.StatoPartita statoPartitaGiornata = utilCalendarioService.statoGiornata(partiteDTO, giornata);
                log.info("La giornata {} di {} è {}", giornata, campionatoDTO.getNome(), statoPartitaGiornata);
                if (statoPartitaGiornata != Enumeratori.StatoPartita.DA_GIOCARE) {
                    giornataDaGiocare = giornata;
                }
            }
        }
        campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
        campionatoDTO.setIniziGiornate(iniziGiornate);
        return campionatoDTO;
    }


    @Transactional(readOnly = true)
    @Cacheable(value = SPORT)
    public List<SportDTO> allSport() {
        List<Sport> sport = sportRepository.findAll();
        return sportMapper.toDTOList(sport);
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
    @Cacheable(cacheNames = PARTITE, key = "#root.args[0] + '_' + #root.args[1]")
    public List<PartitaDTO> getPartiteCampionatoAnno(String idCampionato, short anno) {
        return partitaMapper.toDTOList(partitaRepository.findByCampionato_IdAndImplementationExternalApiAndAnno(idCampionato, utility.getImplementationExternalApi(), anno));
    }

    @CacheEvict(cacheNames = PARTITE, key = "#root.args[0] + '_' + #root.args[1]")
    public void clearCachePartite(String idCampionato, short anno) {
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
