package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.EventoPartitaDTO;
import it.ddlsolution.survivor.dto.PartitaLiveDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.util.Utility;
import it.ddlsolution.survivor.util.enums.Enumeratori;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

/**
 * Client dedicato alla feature "risultati live" (banner home): interroga Gazzetta per il
 * punteggio e gli eventi (gol/cartellini/sostituzioni) di una giornata, incluse le partite
 * ancora IN_CORSO — a differenza di {@link CalendarioAPI2#getPartite}, che per le partite non
 * ancora TERMINATA azzera volutamente il punteggio (serve solo al calcolo dell'esito finale).
 *
 * Isolato dal resto di ICalendario/CalendarioAPI2 apposta: non scrive su DB e va richiamato
 * con una cache a vita breve (vedi LiveScoreService), non con la cache "partite" ad 1 giorno
 * usata per il calcolo delle giocate.
 */
@Component
@Profile(CALENDARIO_API2)
@Slf4j
@RequiredArgsConstructor
public class LiveScoreGazzettaClient {

    private final Utility utility;
    private final CalendarioAPI2 calendarioAPI2;

    @org.springframework.beans.factory.annotation.Value("${external-api.calendario.implementation.API2.url-calendar}")
    private String urlCalendar;

    /**
     * Ritorna TUTTE le partite di quella giornata/anno per il campionato indicato (in corso,
     * terminate o non ancora iniziate), con punteggio, minuto (solo se in corso) ed eventi.
     */
    public List<PartitaLiveDTO> getPartiteGiornata(CampionatoDTO campionatoDTO, int giornata, short anno) {
        List<PartitaLiveDTO> ret = new ArrayList<>();
        try {
            String urlResolved = String.format(urlCalendar,
                    EnumAPI2.Sport.valueOf(campionatoDTO.getSport().getId()).id,
                    EnumAPI2.Campionato.valueOf(campionatoDTO.getId()).id.get(Integer.valueOf(anno)),
                    Integer.toString(giornata),
                    anno);
            urlResolved = urlResolved.replaceAll("&seasonId=" + campionatoDTO.getAnnoCorrente(), "");

            Map response = utility.callUrl(urlResolved, Map.class);
            Map data = (Map) response.get("data");
            Object gamesObj = data == null ? null : data.get("games");
            if (!(gamesObj instanceof List)) {
                return ret;
            }
            List<Map<String, Object>> games = (List<Map<String, Object>>) gamesObj;
            for (Map<String, Object> game : games) {
                Object matchesObj = game.get("matches");
                if (!(matchesObj instanceof List)) continue;
                for (Map<String, Object> match : (List<Map<String, Object>>) matchesObj) {
                    PartitaLiveDTO dto = buildPartitaLive(match, campionatoDTO.getId(), campionatoDTO.getSquadre());
                    if (dto != null) ret.add(dto);
                }
            }
        } catch (Exception e) {
            log.warn("Errore recupero risultati live campionato={} giornata={} anno={}: {}",
                    campionatoDTO.getId(), giornata, anno, e.getMessage());
        }
        return ret;
    }

    private PartitaLiveDTO buildPartitaLive(Map<String, Object> match, String campionatoId, List<SquadraDTO> squadre) {
        try {
            String status;
            try {
                status = ((Map<?, ?>) match.get("timing")).get("tag").toString();
            } catch (Exception e) {
                status = match.get("status").toString();
            }
            Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;
            // "HalfTime" è mappato su IN_CORSO come FirstHalf/SecondHalf, ma il minuto resta
            // fermo (l'intervallo non avanza): distinguiamo per non mostrare un minuto "congelato".
            boolean intervallo = "HalfTime".equalsIgnoreCase(status);

            Map<String, Object> homeTeam = (Map<String, Object>) match.get("homeTeam");
            Map<String, Object> awayTeam = (Map<String, Object>) match.get("awayTeam");

            String casaSigla = calendarioAPI2.getSquadraDTO(homeTeam.get("teamCode").toString(), campionatoId, squadre).getSigla();
            String fuoriSigla = calendarioAPI2.getSquadraDTO(awayTeam.get("teamCode").toString(), campionatoId, squadre).getSigla();

            String minuto = null;
            if (statoPartita == Enumeratori.StatoPartita.IN_CORSO) {
                try {
                    Object val = ((Map<?, ?>) match.get("timing")).get("val");
                    if (val != null) minuto = String.valueOf(val);
                } catch (Exception ignored) {
                }
            }

            List<EventoPartitaDTO> eventi = new ArrayList<>();
            eventi.addAll(estraiEventiSquadra(homeTeam, casaSigla));
            eventi.addAll(estraiEventiSquadra(awayTeam, fuoriSigla));

            return PartitaLiveDTO.builder()
                    .casaNome(homeTeam.get("teamName") != null ? homeTeam.get("teamName").toString() : homeTeam.get("italianName").toString())
                    .casaSigla(casaSigla)
                    .fuoriNome(awayTeam.get("teamName") != null ? awayTeam.get("teamName").toString() : awayTeam.get("italianName").toString())
                    .fuoriSigla(fuoriSigla)
                    .scoreCasa((Integer) homeTeam.get("score"))
                    .scoreFuori((Integer) awayTeam.get("score"))
                    .minuto(minuto)
                    .stato(statoPartita.name())
                    .intervallo(intervallo)
                    .eventi(eventi)
                    .build();
        } catch (Exception e) {
            log.warn("Errore elaborazione partita live: {}", e.getMessage());
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    private List<EventoPartitaDTO> estraiEventiSquadra(Map<String, Object> team, String squadraSigla) {
        List<EventoPartitaDTO> eventi = new ArrayList<>();
        Object starDataObj = team.get("starData");
        if (!(starDataObj instanceof Map)) return eventi;
        Map<String, Object> starData = (Map<String, Object>) starDataObj;

        Object goalsObj = starData.get("goals");
        if (goalsObj instanceof List) {
            for (Map<String, Object> goal : (List<Map<String, Object>>) goalsObj) {
                Map<String, Object> player = (Map<String, Object>) goal.get("goalPlayer");
                eventi.add(EventoPartitaDTO.builder()
                        .tipo("GOL")
                        .minuto(String.valueOf(goal.get("goalAbsoluteTime")))
                        .squadraSigla(squadraSigla)
                        .giocatore(player != null ? String.valueOf(player.get("playerName")) : null)
                        .build());
            }
        }

        Object bookingsObj = starData.get("bookings");
        if (bookingsObj instanceof List) {
            for (Map<String, Object> booking : (List<Map<String, Object>>) bookingsObj) {
                String cardType = String.valueOf(booking.get("CardType"));
                Map<String, Object> player = (Map<String, Object>) booking.get("PlayerRef");
                eventi.add(EventoPartitaDTO.builder()
                        .tipo(cardType.toLowerCase().contains("red") ? "ROSSO" : "GIALLO")
                        .minuto(String.valueOf(booking.get("Min")))
                        .squadraSigla(squadraSigla)
                        .giocatore(player != null ? String.valueOf(player.get("playerName")) : null)
                        .build());
            }
        }

        Object substitutionsObj = starData.get("substitutions");
        if (substitutionsObj instanceof List) {
            for (Map<String, Object> sub : (List<Map<String, Object>>) substitutionsObj) {
                Map<String, Object> subOff = (Map<String, Object>) sub.get("SubOff");
                Map<String, Object> subOn = (Map<String, Object>) sub.get("SubOn");
                eventi.add(EventoPartitaDTO.builder()
                        .tipo("SOSTITUZIONE")
                        .minuto(String.valueOf(sub.get("Min")))
                        .squadraSigla(squadraSigla)
                        .giocatore(subOff != null ? String.valueOf(subOff.get("playerName")) : null)
                        .giocatoreSubentrato(subOn != null ? String.valueOf(subOn.get("playerName")) : null)
                        .build());
            }
        }

        return eventi;
    }
}
