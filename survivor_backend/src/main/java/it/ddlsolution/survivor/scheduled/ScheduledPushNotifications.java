package it.ddlsolution.survivor.scheduled;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.GiocatoreDTO;
import it.ddlsolution.survivor.dto.LegaDTO;
import it.ddlsolution.survivor.dto.PushNotificationDTO;
import it.ddlsolution.survivor.entity.NotificheInviate;
import it.ddlsolution.survivor.mapper.CampionatoMapper;
import it.ddlsolution.survivor.repository.NotificheInviateRepository;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.LegaService;
import it.ddlsolution.survivor.service.NotificheInviateService;
import it.ddlsolution.survivor.service.PushNotificationService;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.ObjectUtils;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_MOCK;

@Component
@RequiredArgsConstructor
@Slf4j
public class ScheduledPushNotifications {

    private final PushNotificationService pushNotificationService;
    private final CacheableService cacheableService;
    private final LegaService legaService;
    private final NotificheInviateService notificheInviateService;

    @Value("${push.notification.scheduler-enabled}")
    private boolean notificationsEnabled;

    public void gimmi() {
        for (CampionatoDTO campionatoDTO : cacheableService.allCampionati()) {
            if (campionatoDTO.getId().equals("SERIE_A")) {
                Map<GiocatoreDTO, List<LegaDTO>> giocatoreLeghe = new HashMap<>();
                LocalDateTime prossimoInizio = campionatoDTO.getIniziGiornate().get(campionatoDTO.getGiornataDaGiocare() - 1);
                //ZoneId roma = ZoneId.of("Europe/Rome");
                //LocalDateTime loc = LocalDateTime.now(roma);
                LocalDateTime loc = LocalDateTime.now();
                long diffMinutes = java.time.Duration.between(loc, prossimoInizio).toMinutes();
                log.info("----->>>>>>>>>>>> Ora attuale: {}, Prossimo Inizio {}, diffMinutes {} <<<<<<<<-------", loc, prossimoInizio, diffMinutes);
                if (diffMinutes >= 0 && diffMinutes <= 60) {
                    log.info("Invio notifiche per campionato {}", campionatoDTO.getId());
                    List<LegaDTO> legheAttiveDelCampionato = legaService.legheByCampionato(campionatoDTO.getId(), campionatoDTO.getAnnoCorrente());
                    for (LegaDTO legaAttiveDelCampionato : legheAttiveDelCampionato) {
                        if (legaAttiveDelCampionato.getId()==83) {
                            for (GiocatoreDTO giocatoreDTO : legaAttiveDelCampionato.getGiocatori()) {
                                if (giocatoreDTO.getStatiPerLega().get(legaAttiveDelCampionato.getId()) == Enumeratori.StatoGiocatore.ATTIVO
                                        && !ObjectUtils.isEmpty(giocatoreDTO.getUser())) {
                                    List<LegaDTO> legheDelGiocatore = giocatoreLeghe.computeIfAbsent(giocatoreDTO, l -> new ArrayList<>());
                                    legheDelGiocatore.add(legaAttiveDelCampionato);
                                }
                            }
                        }
                    }
                    for (Map.Entry<GiocatoreDTO, List<LegaDTO>> giocatoreDTOListEntry : giocatoreLeghe.entrySet()) {
                        List<LegaDTO> legaAttiveDelCampionato = giocatoreDTOListEntry.getValue();
                        GiocatoreDTO giocatore = giocatoreDTOListEntry.getKey();
                        String desLega = legaAttiveDelCampionato
                                .stream()
                                .map(l -> "la lega " + l.getId() + " " + l.getName() + " edizione " + l.getEdizione())
                                .collect(Collectors.joining("-"));
                        String desGiocatore = giocatore.getNickname() + " - " + giocatore.getUser();
                        log.info("giocatore {}, in leghe {} ", desGiocatore, desLega);
                    }
                }
            }
        }
    }

    @Scheduled(cron = "0 */15 * * * ?") // Ogni 15 minuti
    public void sendUpcomingMatchNotificationsOrig() {
        if (!notificationsEnabled) {
            log.debug("Schedulazione invio notifiche push disabilitate");
            return;
        }

        ZoneId roma = ZoneId.of("Europe/Rome");
        LocalDateTime now = LocalDateTime.now(roma);

        // 1. Trova tutti i campionati con giornata imminente non ancora notificati
        List<CampionatoDTO> campionatiDaNotificare = new ArrayList<>();
        Map<String, LocalDateTime> iniziPerCampionato = new HashMap<>();

        for (CampionatoDTO campionatoDTO : cacheableService.allCampionati()) {
            List<LocalDateTime> iniziGiornate = campionatoDTO.getIniziGiornate();
            int giornataDaGiocare = campionatoDTO.getGiornataDaGiocare();
            if (ObjectUtils.isEmpty(iniziGiornate) || giornataDaGiocare < 1 || giornataDaGiocare > iniziGiornate.size()) {
                log.debug("Campionato {} senza date giornate configurate, skip notifiche", campionatoDTO.getId());
                continue;
            }
            LocalDateTime prossimoInizio = iniziGiornate.get(giornataDaGiocare - 1);
            long diffMinutes = java.time.Duration.between(now, prossimoInizio).toMinutes();
            if (diffMinutes >= 0 && diffMinutes <= 60) {
                Optional<NotificheInviate> notificaInviata = notificheInviateService.cerca(
                        campionatoDTO.getId(), campionatoDTO.getAnnoCorrente(),
                        campionatoDTO.getGiornataDaGiocare(), Enumeratori.TipoNotifica.INIZIO_PARTITA);
                if (notificaInviata.isEmpty()) {
                    campionatiDaNotificare.add(campionatoDTO);
                    iniziPerCampionato.put(campionatoDTO.getId(), prossimoInizio);
                }
            }
        }

        if (campionatiDaNotificare.isEmpty()) return;

        // 2. Aggrega per utente: una voce per lega con orario specifico del campionato
        Map<GiocatoreDTO, List<String>> giocatoreVoci = new HashMap<>();
        Map<GiocatoreDTO, Set<String>> giocatoreSport = new HashMap<>();

        for (CampionatoDTO campionatoDTO : campionatiDaNotificare) {
            String orario = Utility.toLocalDateTimeItalyReadable(iniziPerCampionato.get(campionatoDTO.getId()));
            String sportNome = campionatoDTO.getSport() != null ? campionatoDTO.getSport().getNome().toLowerCase() : "";
            log.info("Raccolta utenti per campionato {} ({}) alle {}", campionatoDTO.getId(), sportNome, orario);
            List<LegaDTO> legheAttive = legaService.legheByCampionato(campionatoDTO.getId(), campionatoDTO.getAnnoCorrente());
            for (LegaDTO lega : legheAttive) {
                for (GiocatoreDTO giocatore : lega.getGiocatori()) {
                    if (giocatore.getStatiPerLega().get(lega.getId()) == Enumeratori.StatoGiocatore.ATTIVO
                            && !ObjectUtils.isEmpty(giocatore.getUser())) {
                        giocatoreVoci.computeIfAbsent(giocatore, k -> new ArrayList<>())
                                .add("\u00ab" + lega.getName() + "\u00bb alle " + orario);
                        giocatoreSport.computeIfAbsent(giocatore, k -> new LinkedHashSet<>()).add(sportNome);
                    }
                }
            }
        }

        // 3. Invia una sola notifica per utente con tutte le sue leghe
        for (Map.Entry<GiocatoreDTO, List<String>> entry : giocatoreVoci.entrySet()) {
            GiocatoreDTO giocatore = entry.getKey();
            List<String> voci = entry.getValue();
            Set<String> sport = giocatoreSport.getOrDefault(giocatore, Collections.emptySet());

            String body = voci.size() == 1
                    ? "La tua lega " + voci.get(0) + " sta per iniziare. Dai il tuo pronostico!"
                    : "Hai " + voci.size() + " leghe in gioco: " + String.join(", ", voci) + ". Dai i tuoi pronostici!";

            log.info("Notifica per {}: {}", giocatore.getNickname(), body);
            PushNotificationDTO notification = PushNotificationDTO.builder()
                    .title(sportEmoji(sport) + " \u00c8 ora del pronostico!")
                    .body(body)
                    .sound("default")
                    .tipoNotifica(Enumeratori.TipoNotifica.INIZIO_PARTITA)
                    .expiringAt(LocalDateTime.now(roma).plusMinutes(60))
                    .imageUrl(sportImageUrl(sport))
                    .build();
            pushNotificationService.sendNotificationToUsers(List.of(giocatore.getUser().getId()), notification);
        }

        // 4. Marca tutti i campionati elaborati come notificati
        for (CampionatoDTO campionatoDTO : campionatiDaNotificare) {
            notificheInviateService.salva(campionatoDTO);
        }
    }

    /**
     * Promemoria serale: alle 20:00 di ogni sera, notifica gli utenti che domani
     * hanno una giornata in programma (finestra: tra 12h e 32h dall'ora corrente).
     */
    @Scheduled(cron = "0 0 20 * * ?") // Ogni sera alle 20:00
    public void sendReminderGiornataPrecedente() {
        if (!notificationsEnabled) {
            log.debug("Schedulazione invio notifiche push disabilitate");
            return;
        }

        ZoneId roma = ZoneId.of("Europe/Rome");
        LocalDateTime now = LocalDateTime.now(roma);

        List<CampionatoDTO> campionatiDaNotificare = new ArrayList<>();
        Map<String, LocalDateTime> iniziPerCampionato = new HashMap<>();

        for (CampionatoDTO campionatoDTO : cacheableService.allCampionati()) {
            List<LocalDateTime> iniziGiornate = campionatoDTO.getIniziGiornate();
            int giornataDaGiocare = campionatoDTO.getGiornataDaGiocare();
            if (ObjectUtils.isEmpty(iniziGiornate) || giornataDaGiocare < 1 || giornataDaGiocare > iniziGiornate.size()) {
                continue;
            }
            LocalDateTime prossimoInizio = iniziGiornate.get(giornataDaGiocare - 1);
            long diffHours = java.time.Duration.between(now, prossimoInizio).toHours();
            // Giornata tra 12h e 32h = domani (copre kickoff mattina, pomeriggio e sera)
            if (diffHours >= 12 && diffHours <= 32) {
                Optional<NotificheInviate> notificaInviata = notificheInviateService.cerca(
                        campionatoDTO.getId(), campionatoDTO.getAnnoCorrente(),
                        campionatoDTO.getGiornataDaGiocare(), Enumeratori.TipoNotifica.REMINDER_GIORNATA);
                if (notificaInviata.isEmpty()) {
                    campionatiDaNotificare.add(campionatoDTO);
                    iniziPerCampionato.put(campionatoDTO.getId(), prossimoInizio);
                }
            }
        }

        if (campionatiDaNotificare.isEmpty()) return;

        Map<GiocatoreDTO, List<String>> giocatoreVoci = new HashMap<>();
        Map<GiocatoreDTO, Set<String>> giocatoreSport = new HashMap<>();

        for (CampionatoDTO campionatoDTO : campionatiDaNotificare) {
            String orario = Utility.toLocalDateTimeItalyReadable(iniziPerCampionato.get(campionatoDTO.getId()));
            String sportNome = campionatoDTO.getSport() != null ? campionatoDTO.getSport().getNome().toLowerCase() : "";
            List<LegaDTO> legheAttive = legaService.legheByCampionato(campionatoDTO.getId(), campionatoDTO.getAnnoCorrente());
            for (LegaDTO lega : legheAttive) {
                for (GiocatoreDTO giocatore : lega.getGiocatori()) {
                    if (giocatore.getStatiPerLega().get(lega.getId()) == Enumeratori.StatoGiocatore.ATTIVO
                            && !ObjectUtils.isEmpty(giocatore.getUser())) {
                        giocatoreVoci.computeIfAbsent(giocatore, k -> new ArrayList<>())
                                .add("\u00ab" + lega.getName() + "\u00bb alle " + orario);
                        giocatoreSport.computeIfAbsent(giocatore, k -> new LinkedHashSet<>()).add(sportNome);
                    }
                }
            }
        }

        for (Map.Entry<GiocatoreDTO, List<String>> entry : giocatoreVoci.entrySet()) {
            GiocatoreDTO giocatore = entry.getKey();
            List<String> voci = entry.getValue();
            Set<String> sport = giocatoreSport.getOrDefault(giocatore, Collections.emptySet());

            String body = voci.size() == 1
                    ? "Domani si gioca! Dai il tuo pronostico per la lega " + voci.get(0) + " prima che sia tardi."
                    : "Domani si gioca in " + voci.size() + " leghe: " + String.join(", ", voci) + ". Dai i tuoi pronostici in anticipo!";

            log.info("Reminder serale per {}: {}", giocatore.getNickname(), body);
            PushNotificationDTO notification = PushNotificationDTO.builder()
                    .title(sportEmoji(sport) + " Domani si gioca — hai votato?")
                    .body(body)
                    .sound("default")
                    .tipoNotifica(Enumeratori.TipoNotifica.REMINDER_GIORNATA)
                    .expiringAt(LocalDateTime.now(roma).plusHours(16))
                    .imageUrl(sportImageUrl(sport))
                    .build();
            pushNotificationService.sendNotificationToUsers(List.of(giocatore.getUser().getId()), notification);
        }

        for (CampionatoDTO campionatoDTO : campionatiDaNotificare) {
            notificheInviateService.salva(campionatoDTO, Enumeratori.TipoNotifica.REMINDER_GIORNATA);
        }
    }

    private String sportEmoji(Set<String> sport) {
        if (sport.size() == 1) {
            String s = sport.iterator().next();
            if (s.contains("calcio")) return "\u26bd\ufe0f";
            if (s.contains("basket")) return "\ud83c\udfc0";
            if (s.contains("tennis")) return "\ud83c\udfbe";
        }
        return "\ud83c\udfc6";
    }

    private String sportImageUrl(Set<String> sport) {
        if (sport.size() == 1) {
            String s = sport.iterator().next();
            if (s.contains("calcio")) return "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80";
            if (s.contains("basket")) return "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&q=80";
            if (s.contains("tennis")) return "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=400&q=80";
        }
        return "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=80";
    }

}
