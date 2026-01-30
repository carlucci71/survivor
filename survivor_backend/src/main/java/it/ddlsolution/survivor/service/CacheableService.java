package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SospensioneLegaDTO;
import it.ddlsolution.survivor.dto.SportDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.dto.response.SospensioniLegaResponseDTO;
import it.ddlsolution.survivor.entity.Sport;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.mapper.LegaMapper;
import it.ddlsolution.survivor.mapper.PartitaMapper;
import it.ddlsolution.survivor.mapper.SospensioneLegaMapper;
import it.ddlsolution.survivor.mapper.SportMapper;
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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import java.util.concurrent.Semaphore;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.TimeoutException;
import java.util.stream.Collectors;

@Service
@Data
@RequiredArgsConstructor
@Slf4j
public class CacheableService {
    private final CacheManager cacheManager;
    private final LegaRepository legaRepository;
    private final CampionatoService campionatoService;
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
    private final SquadraService squadraService;


    // Lazy provider e servizio di utilità per calcolo stato giornata
    private final ObjectProvider<ICalendario> calendarioProvider;
    private final UtilCalendarioService utilCalendarioService;

    // Self provider per invocare metodi transazionali sul proxy del bean (per worker threads)
    private final ObjectProvider<CacheableService> selfProvider;

    public final static String CAMPIONATI = "campionati";
    public final static String SQUADRE = "squadre";
    public final static String SPORT = "sport";
    public final static String SOSPENSIONI = "sospensioni";
    public final static String PARTITE = "partite";

    @Value("${cache.allcampionati.threads:11}")
    private int allCampionatiThreads;

    @Value("${cache.allcampionati.timeout-seconds:240}")
    private long allCampionatiTimeoutSeconds;

    // Limite di quanti worker possono accedere al DB contemporaneamente (configurabile)
    @Value("${cache.allcampionati.db-parallelism:6}")
    private int allCampionatiDbParallelism;

    // Semaphore lazy inizializzato per rispettare il valore configurato
    private volatile Semaphore dbSemaphore;

    private Semaphore getDbSemaphore() {
        if (dbSemaphore == null) {
            synchronized (this) {
                if (dbSemaphore == null) {
                    int permits = Math.max(1, allCampionatiDbParallelism);
                    dbSemaphore = new Semaphore(permits);
                    log.info("Inizializzato semaphore DB parallelism con {} permessi", permits);
                }
            }
        }
        return dbSemaphore;
    }

    private final ConcurrentHashMap<String, CompletableFuture<CampionatoDTO>> elaborazioniInCorso = new ConcurrentHashMap<>();


    @Cacheable(value = CAMPIONATI, sync = true)
    // Nota: rimuoviamo l'annotazione @Transactional da questo metodo per evitare che
    // il thread chiamante mantenga una connessione al DB aperta per tutta la durata
    // dell'elaborazione parallela. Il metodo avvia molti task su thread separati che
    // possono eseguire operazioni sui repository; se il thread principale trattiene
    // una connessione, si può esaurire il pool (HikariPool - Connection is not available).
    // Le chiamate ai repository dovrebbero essere gestite con transazioni locali
    // (es. annotando i metodi chiamati dai worker con @Transactional) così che ogni
    // worker apra e chiuda rapidamente le proprie connessioni.
    public List<CampionatoDTO> allCampionati() {

        List<CampionatoDTO> campionatiDTO = new ArrayList<>();
        List<CampionatoDTO> campionatiDaElaborare = campionatoService.leggiCampionati();

        ExecutorService executor = Executors.newFixedThreadPool(allCampionatiThreads);
        try {
            // Crea i future e li passa a elaboraCampionato per la gestione della sincronizzazione
            List<CompletableFuture<CampionatoDTO>> futures = campionatiDaElaborare.stream()
                    .map(campionatoDTO -> {
                        CompletableFuture<CampionatoDTO> future = new CompletableFuture<>();
                        executor.submit(() -> elaboraCampionato(campionatoDTO, campionatoDTO.getAnnoCorrente(), future));
                        return future;
                    })
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
                // Log già gestito nei singoli future
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

    /**
     * Overload per compatibilità con chiamate dirette (es. da LegaService).
     * Crea un CompletableFuture internamente e attende il risultato.
     */
    public CampionatoDTO elaboraCampionato(final CampionatoDTO campionatoDTO, short anno) {
        CompletableFuture<CampionatoDTO> future = new CompletableFuture<>();
        elaboraCampionato(campionatoDTO, anno, future);
        return future.join();
    }

    public void elaboraCampionato(final CampionatoDTO campionatoDTO, short anno, CompletableFuture<CampionatoDTO> futureInput) {

        String lockKey = campionatoDTO.getId() + "_" + anno;
        log.info("elaboracampionato {}", lockKey);

        // Verifica se c'è già un'elaborazione in corso per gli stessi parametri
        CompletableFuture<CampionatoDTO> existingFuture = elaborazioniInCorso.putIfAbsent(lockKey, futureInput);

        if (existingFuture != null) {
            // Un altro thread sta già elaborando questo campionato
            // Aspetta il risultato e poi completa il future ricevuto con lo stesso valore
            log.debug("Thread {} attende il risultato dall'elaborazione già in corso per campionato: {} anno: {}",
                Thread.currentThread().getName(), campionatoDTO.getId(), anno);

            existingFuture.whenComplete((result, error) -> {
                if (error != null) {
                    futureInput.completeExceptionally(error);
                } else {
                    futureInput.complete(result);
                }
            });
            return;
        }

        // Questo thread è il primo ad elaborare questo campionato
        log.debug("Thread {} avvia nuova elaborazione per campionato: {} anno: {}",
            Thread.currentThread().getName(), campionatoDTO.getId(), anno);

        boolean permitAcquired = false;
        try {
            // Acquisisce un permesso per limitare l'accesso concorrente al DB
            Semaphore sem = getDbSemaphore();
            try {
                sem.acquire();
                permitAcquired = true;
            } catch (InterruptedException ie) {
                Thread.currentThread().interrupt();
                throw ie;
            }

            // Esegui l'elaborazione dentro un metodo transazionale invocato via proxy del bean
            // in modo che ogni worker apra/chiuda la propria transazione e non mantenga
            // la connessione del chiamante per tutta la durata dell'elaborazione.
            CampionatoDTO result = selfProvider.getObject().processCampionatoTransactional(campionatoDTO, anno);
            futureInput.complete(result);

        } catch (InterruptedException ie) {
            log.error("Thread interrotto durante l'acquisizione del permesso DB per campionato {} anno {}", campionatoDTO.getId(), anno, ie);
            futureInput.completeExceptionally(ie);
        } catch (Exception e) {
            // In caso di errore, completa il future con l'eccezione
            log.error("Errore durante l'elaborazione del campionato {} anno {}", campionatoDTO.getId(), anno, e);
            futureInput.completeExceptionally(e);
        } finally {
            // Rilascia il permesso se acquisito e rimuove il future dalla mappa
            if (permitAcquired) {
                try {
                    getDbSemaphore().release();
                } catch (Exception ex) {
                    log.warn("Errore durante il rilascio del permesso DB", ex);
                }
            }
            elaborazioniInCorso.remove(lockKey);
        }
    }

    /**
     * Metodo invocato dai worker threads tramite il proxy del bean per garantire
     * che la logica che accede ai repository venga eseguita all'interno di una
     * transazione separata per ogni worker. Questo evita che il thread chiamante
     * (es. il thread HTTP che ha attivato la cache) mantenga la connessione al DB
     * per tutta la durata dell'elaborazione parallela.
     */
    @Transactional
    public CampionatoDTO processCampionatoTransactional(final CampionatoDTO campionatoDTO, short anno) {
        List<LocalDateTime> iniziGiornate = new ArrayList<>();
        Integer giornataDaGiocare = null;
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

                Enumeratori.StatoPartita statoGiornata = utilCalendarioService.statoGiornata(partiteDTO, giornata);
                log.info("La giornata {} di {} è {}", giornata, campionatoDTO.getNome(), statoGiornata);
                if (giornataDaGiocare == null && (statoGiornata != Enumeratori.StatoPartita.TERMINATA)) {
                    giornataDaGiocare = giornata;
                }
            }
        }
        if (giornataDaGiocare==null){
            giornataDaGiocare=campionatoDTO.getNumGiornate();
        }
        campionatoDTO.setGiornataDaGiocare(giornataDaGiocare);
        campionatoDTO.setIniziGiornate(iniziGiornate);

        utilCalendarioService.refreshPartite(campionatoDTO, anno);
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

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = SQUADRE, key = "#root.args[0]", sync = true)
    public List<SquadraDTO> getSquadreFromIdCampionato(String idCampionato){
        return squadraService.getSquadreFromIdCampionato(idCampionato);
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
