package it.ddlsolution.survivor.scheduled;

import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.entity.Lega;
import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.repository.LegaRepository;
import it.ddlsolution.survivor.repository.PartitaRepository;
import it.ddlsolution.survivor.service.PushNotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.*;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledPushNotifications {

    private final PartitaRepository partitaRepository;
    private final LegaRepository legaRepository;
    private final PushNotificationService pushNotificationService;

    @Value("${push.notifications.enabled:false}")
    private boolean notificationsEnabled;

    /**
     * Esegue ogni 15 minuti e invia notifiche per le partite che iniziano tra ~1 ora
     * (finestra: tra 50 e 70 minuti da ora)
     */
    @Scheduled(cron = "0 */1 * * * ?") // Ogni 1 minuti
    public void sendUpcomingMatchNotifications() {
        PushNotificationDTO notification = PushNotificationDTO.builder()
                .title("Partita in arrivo!")
                .body(String.format("%s vs %s inizia tra 1 ora",
                        "GIMMI",
                        "BUBU"))
                .sound("default")
                .data(Map.of(
                        "type", "match_starting",
                        "matchId", String.valueOf(11),
                        "matchDate", LocalDateTime.now().toString()
                ))
                .build();

        pushNotificationService.sendNotificationToUsers(List.of(9L), notification);

    }

    //@Scheduled(cron = "0 */15 * * * ?") // Ogni 15 minuti
    public void sendUpcomingMatchNotificationsOrig() {
        if (!notificationsEnabled) {
            log.debug("Notifiche push disabilitate");
            return;
        }

        try {
            LocalDateTime now = LocalDateTime.now();
            LocalDateTime windowStart = now.plusMinutes(50);
            LocalDateTime windowEnd = now.plusMinutes(70);

            log.info("Controllo partite in arrivo tra {} e {}", windowStart, windowEnd);

            // TODO: QUI INSERISCI LA TUA QUERY CUSTOM PER TROVARE LE PARTITE
            // Esempio scheletro base:
            List<Partita> upcomingMatches = findUpcomingMatches(windowStart, windowEnd);

            if (upcomingMatches.isEmpty()) {
                log.debug("Nessuna partita in arrivo nella finestra T-1h");
                return;
            }

            for (Partita partita : upcomingMatches) {
                notifyUsersForMatch(partita);
            }

        } catch (Exception e) {
            log.error("Errore durante invio notifiche partite in arrivo", e);
        }
    }

    /**
     * TODO: IMPLEMENTA QUI LA TUA QUERY PERSONALIZZATA
     *
     * Logica da implementare:
     * - Trova le Partite con orario tra windowStart e windowEnd
     * - Filtra per stato DA_GIOCARE o IN_CORSO
     * - Considera solo partite di campionati con leghe attive
     * - Opzionale: aggiungi flag per evitare invio duplicato
     */
    private List<Partita> findUpcomingMatches(LocalDateTime windowStart, LocalDateTime windowEnd) {
        // ESEMPIO BASE - SOSTITUISCI CON LA TUA QUERY
        // return partitaRepository.findByOrarioBetweenAndStatoIn(
        //     windowStart, windowEnd,
        //     List.of(Enumeratori.StatoPartita.DA_GIOCARE)
        // );

        log.warn("findUpcomingMatches non implementata - inserisci la tua query custom");
        return Collections.emptyList();
    }

    /**
     * TODO: IMPLEMENTA QUI LA LOGICA PER TROVARE GLI UTENTI DA NOTIFICARE
     *
     * Possibili strategie:
     * A) Tutti i membri delle leghe associate al campionato della partita
     * B) Solo utenti con giocate attive nella lega
     * C) Solo utenti che non hanno ancora giocato la giornata corrente
     */
    private void notifyUsersForMatch(Partita partita) {
        try {
            // TODO: INSERISCI QUI LA TUA LOGICA PER TROVARE GLI USER IDs
            List<Long> userIds = findUsersToNotifyForMatch(partita);

            if (userIds.isEmpty()) {
                log.debug("Nessun utente da notificare per partita {}", partita.getId());
                return;
            }

            PushNotificationDTO notification = PushNotificationDTO.builder()
                    .title("Partita in arrivo!")
                    .body(String.format("%s vs %s inizia tra 1 ora",
                        partita.getCasaNome(),
                        partita.getFuoriNome()))
                    .sound("default")
                    .data(Map.of(
                        "type", "match_starting",
                        "matchId", String.valueOf(partita.getId()),
                        "matchDate", partita.getOrario().toString()
                    ))
                    .build();

            pushNotificationService.sendNotificationToUsers(userIds, notification);
            log.info("Notifica inviata a {} utenti per partita {}", userIds.size(), partita.getId());

        } catch (Exception e) {
            log.error("Errore notifica per partita {}", partita.getId(), e);
        }
    }

    /**
     * TODO: IMPLEMENTA LA QUERY PER TROVARE GLI UTENTI DA NOTIFICARE
     */
    private List<Long> findUsersToNotifyForMatch(Partita partita) {
        // ESEMPIO: trova tutti gli utenti delle leghe collegate al campionato della partita
        // List<Lega> leghe = legaRepository.findByCampionato_IdAndStatoNot(
        //     partita.getCampionato().getId(),
        //     Enumeratori.StatoLega.TERMINATA
        // );
        //
        // Set<Long> userIds = new HashSet<>();
        // for (Lega lega : leghe) {
        //     lega.getGiocatoreLeghe().stream()
        //         .filter(gl -> gl.getStato() == Enumeratori.StatoGiocatore.ATTIVO)
        //         .map(gl -> gl.getGiocatore().getUser().getId())
        //         .forEach(userIds::add);
        // }
        // return new ArrayList<>(userIds);

        log.warn("findUsersToNotifyForMatch non implementata - inserisci la tua query custom");
        return Collections.emptyList();
    }
}
