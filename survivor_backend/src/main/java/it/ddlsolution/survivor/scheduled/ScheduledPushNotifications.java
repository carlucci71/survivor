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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

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

    @Scheduled(cron = "0 */15 * * * ?") // Ogni 15 minuti
    public void sendUpcomingMatchNotificationsOrig() {
        if (!notificationsEnabled) {
            log.debug("Schedulazione invio notifiche push disabilitate");
            return;
        }
        for (CampionatoDTO campionatoDTO : cacheableService.allCampionati()) {
            Map<GiocatoreDTO, List<LegaDTO>> giocatoreLeghe = new HashMap<>();
            LocalDateTime prossimoInizio = campionatoDTO.getIniziGiornate().get(campionatoDTO.getGiornataDaGiocare() - 1);
            long diffMinutes = java.time.Duration.between(LocalDateTime.now(), prossimoInizio).toMinutes();
            if (diffMinutes >= 0 && diffMinutes <= 60) {
                Optional<NotificheInviate> notificaInviata = notificheInviateService.cerca(campionatoDTO.getId(), campionatoDTO.getAnnoCorrente(), campionatoDTO.getGiornataDaGiocare(), Enumeratori.TipoNotifica.INIZIO_PARTITA);
                if (notificaInviata.isEmpty()) {//VERIFICO PER NON MANDARE DUE VOLTE LA STESSA NOTIFICA
                    log.info("Invio notifiche per campionato {}", campionatoDTO.getId());
                    List<LegaDTO> legheAttiveDelCampionato = legaService.legheByCampionato(campionatoDTO.getId(), campionatoDTO.getAnnoCorrente());
                    for (LegaDTO legaAttiveDelCampionato : legheAttiveDelCampionato) {
                        for (GiocatoreDTO giocatoreDTO : legaAttiveDelCampionato.getGiocatori()) {
                            if (!ObjectUtils.isEmpty(giocatoreDTO.getUser())) {
                                List<LegaDTO> legheDelGiocatore = giocatoreLeghe.computeIfAbsent(giocatoreDTO, l -> new ArrayList<>());
                                legheDelGiocatore.add(legaAttiveDelCampionato);
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

                        PushNotificationDTO notification = PushNotificationDTO.builder()
                                .title("Preparati a giocare!")
                                .body(String.format("Controlla: %s. Il campionato %s inizia alle %s", //TODO TRANSLATE
                                        desLega,
                                        campionatoDTO.getNome(),
                                        Utility.toLocalDateTimeItalyReadable(prossimoInizio)))
                                .sound("default")
                                .tipoNotifica(Enumeratori.TipoNotifica.INIZIO_PARTITA)
                                .expiringAt(LocalDateTime.now(ZoneId.of("Europe/Rome")).plusMinutes(60))
                                .imageUrl("https://st4.depositphotos.com/1014627/26361/v/1600/depositphotos_263610928-stock-illustration-3d-gold-trophy-or-cup.jpg") //TODO IMMAGINE IN APP
                                .build();
                        pushNotificationService.sendNotificationToUsers(List.of(giocatore.getUser().getId()), notification);
                    }
                    notificheInviateService.salva(campionatoDTO);
                }
            }
        }
    }

}
