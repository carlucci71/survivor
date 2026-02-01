package it.ddlsolution.survivor.scheduled;

import org.springframework.stereotype.Service;

import java.util.concurrent.atomic.AtomicBoolean;

/**
 * Servizio che mantiene lo stato di warmup/ready dell'applicazione.
 * All'avvio è false; viene impostato a true alla fine del warmup (cache pre-caricate).
 */
@Service
public class WarmupService {
    private final AtomicBoolean ready = new AtomicBoolean(false);

    public boolean isReady() {
        return ready.get();
    }

    public void markReady() {
        ready.set(true);
    }

    public void markNotReady() {
        ready.set(false);
    }
}
