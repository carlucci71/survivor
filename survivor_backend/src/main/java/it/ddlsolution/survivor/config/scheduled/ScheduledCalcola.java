package it.ddlsolution.survivor.config.scheduled;

import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.LegaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.util.ArrayList;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledCalcola {
    private final LegaService legaService;

    @Scheduled(cron = "0 0 */6 * * ?") //OGNI 6 ORE
    //@Scheduled(cron = "0 0/1 * * * ?") //OGNI MINUTO
    public void calcolaCampionati() {
        legaService.allLeghe().forEach(
                l -> {
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(0L, null, new ArrayList<>()));
                    try {
                        legaService.calcola(l.getId(), l.getGiornataCalcolata() == null ? l.getGiornataIniziale() + 1 : l.getGiornataCalcolata() + 1);
                    } catch (Exception e) {
                        log.error("Errore in calcolo batch ", e);
                    } finally {
                        // sempre pulire il contesto per evitare leak su thread del pool
                        SecurityContextHolder.clearContext();
                    }
                }
        );
    }

}
