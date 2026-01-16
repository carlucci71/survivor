package it.ddlsolution.survivor.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

import static it.ddlsolution.survivor.service.CacheableService.CAMPIONATI;
import static it.ddlsolution.survivor.service.CacheableService.PARTITE;
import static it.ddlsolution.survivor.service.CacheableService.SOSPENSIONI;
import static it.ddlsolution.survivor.service.CacheableService.SPORT;
import static it.ddlsolution.survivor.service.CacheableService.URL;

@Configuration
@RequiredArgsConstructor
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        Caffeine<Object, Object> oneHourCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(1000);
        CaffeineCache cacheUrl = new CaffeineCache(URL, oneHourCache.build());
        CaffeineCache cachePartite = new CaffeineCache(PARTITE, oneHourCache.build());
        CaffeineCache sospensioni = new CaffeineCache(SOSPENSIONI, oneHourCache.build());
        CaffeineCache sport = new CaffeineCache(SPORT, oneHourCache.build());

        Caffeine<Object, Object> tenMinutesCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000);
        CaffeineCache campionati = new CaffeineCache(CAMPIONATI, tenMinutesCache.build());

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(cacheUrl,cachePartite, sospensioni, campionati,sport));
        return manager;
    }

}
