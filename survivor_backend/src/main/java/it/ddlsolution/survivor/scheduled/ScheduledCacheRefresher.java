package it.ddlsolution.survivor.scheduled;

import it.ddlsolution.survivor.service.CacheableService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.cache.Cache;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;

import java.util.concurrent.CompletableFuture;

import static it.ddlsolution.survivor.service.CacheableService.CAMPIONATI;
import static it.ddlsolution.survivor.service.CacheableService.PARTITE;
import static it.ddlsolution.survivor.service.CacheableService.SOSPENSIONI;
import static it.ddlsolution.survivor.service.CacheableService.SPORT;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledCacheRefresher {

    private final CacheManager cacheManager;
    private final CacheableService cacheableService;
    private final WarmupService warmupService;

    @Scheduled(cron = "0 0/5 * * * ?") // OGNI 5 MINUTI
    public void autoRefresh(){
        if (isCacheEmpty(CAMPIONATI)) {
            cacheableService.allCampionati();
        }
        if (isCacheEmpty(SOSPENSIONI)) {
            cacheableService.allSospensioni();
        }
        if (isCacheEmpty(SPORT)) {
            cacheableService.allSport();
        }
    }

    @EventListener(ApplicationReadyEvent.class) //Avvio dell'applicazione
    public void runAtStartup() {
        log.info("App startup: scheduling warmup cache asynchronously");
        CompletableFuture.runAsync(() -> {
            try {
                log.info("App startup: inizio warmup cache (async)");
                // Esegui un primo refresh synchronously all'interno del worker async
                autoRefresh();
                log.info("App startup: warmup cache completato (async)");
            } catch (Exception e) {
                log.error("Errore durante autoRefresh all'avvio (async)", e);
            } finally {
                // Segna l'applicazione come pronta anche se qualche cache può non essere stata popolata
                // in modo da permettere alle richieste REST di essere servite (ma il filtro 503 sarà attivo
                // solo fino a qui). Questo evita che l'app rimanga inbackstage se qualche chiamata di warmup fallisce.
                warmupService.markReady();
                log.info("App startup: warmup stato impostato a READY (async)");
            }
        });
    }

    private boolean isCacheEmpty(String cacheName){
        Cache cache = cacheManager.getCache(cacheName);
        if (cache == null) {
            return true;
        }
        // recupera direttamente il tipo nativo Caffeine
        com.github.benmanes.caffeine.cache.Cache<Object, Object> nativeCaffeine =
                ((CaffeineCache) cache).getNativeCache();
        // Forza la pulizia delle entry scadute/evicted (Caffeine esegue l'eviction in modo lazy)
        nativeCaffeine.cleanUp();
        return nativeCaffeine.estimatedSize() == 0;
    }
}
