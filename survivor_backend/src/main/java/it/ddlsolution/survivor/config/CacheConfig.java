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

@Configuration
@RequiredArgsConstructor
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        Caffeine<Object, Object> oneDayCache = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.DAYS)
                .maximumSize(1000);
        Caffeine<Object, Object> tenMinutesCache = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000);

        CaffeineCache sport = new CaffeineCache(SPORT, oneDayCache.build());
        //CaffeineCache squadre = new CaffeineCache("SQUADRE", oneDayCache.build());
        CaffeineCache sospensioni = new CaffeineCache(SOSPENSIONI, oneDayCache.build());
        CaffeineCache cachePartite = new CaffeineCache(PARTITE, oneDayCache.build());

        CaffeineCache campionati = new CaffeineCache(CAMPIONATI, tenMinutesCache.build());

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(cachePartite, sospensioni, campionati,sport));//cacheUrl
        return manager;
    }

}
