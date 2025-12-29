package it.ddlsolution.survivor.config;

import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.cache.CacheManager;
import org.springframework.cache.caffeine.CaffeineCache;
import org.springframework.cache.support.SimpleCacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.cache.annotation.EnableCaching;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {

    @Bean
    public CacheManager cacheManager() {
        // configurazione comune per cache-url e sospensioni
        Caffeine<Object, Object> commonCaffeine = Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(1000);

        // configurazione specifica per campionati (10 minuti)
        Caffeine<Object, Object> campionatiCaffeine = Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(1000);

        CaffeineCache cacheUrl = new CaffeineCache("cache-url", commonCaffeine.build());
        CaffeineCache sospensioni = new CaffeineCache("sospensioni", commonCaffeine.build());
        CaffeineCache campionati = new CaffeineCache("campionati", campionatiCaffeine.build());
        CaffeineCache sport = new CaffeineCache("sport", campionatiCaffeine.build());

        SimpleCacheManager manager = new SimpleCacheManager();
        manager.setCaches(List.of(cacheUrl, sospensioni, campionati,sport));
        return manager;
    }
}
