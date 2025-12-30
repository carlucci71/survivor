package it.ddlsolution.survivor.config.cache;

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

import static it.ddlsolution.survivor.service.CacheableService.CAMPIONATI;
import static it.ddlsolution.survivor.service.CacheableService.SOSPENSIONI;
import static it.ddlsolution.survivor.service.CacheableService.SPORT;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledCacheRefresher {

    private final CacheManager cacheManager;
    private final CacheableService cacheableService;

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

    // Esegui anche all'avvio dell'applicazione
    @EventListener(ApplicationReadyEvent.class)
    public void runAtStartup() {
        try {
            autoRefresh();
        } catch (Exception e) {
            log.error("Errore durante autoRefresh all'avvio", e);
        }
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
