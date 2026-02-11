package it.ddlsolution.survivor.scheduled;

import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.util.enums.Enumeratori;
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

    @Scheduled(cron = "0 0 */1 * * ?") //OGNI 1 ORE
    //@Scheduled(cron = "0 0/1 * * * ?") //OGNI MINUTO
    public void calcolaCampionati() {
        legaService.allLeghe().forEach(
                l -> {
                    SecurityContextHolder.getContext().setAuthentication(new UsernamePasswordAuthenticationToken(0L, null, new ArrayList<>()));
                    try {
                        if (l.getStato() != Enumeratori.StatoLega.TERMINATA) {
                            legaService.calcola(l.getId());
                        }
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
