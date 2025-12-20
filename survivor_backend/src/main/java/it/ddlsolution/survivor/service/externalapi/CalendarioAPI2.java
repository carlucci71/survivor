package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.extern.slf4j.Slf4j;
import org.jspecify.annotations.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
public class CalendarioAPI2 implements ICalendario {

    private final CampionatoService campionatoService;
    private final CacheableService campionatoCacheableService;

    @Value("${external-api.calendario.implementation.API2.url-calendar}")
    String urlCalendar;

    @Value("${external-api.calendario.implementation.API2.url-info}")
    String urlInfo;

    public CalendarioAPI2(CampionatoService campionatoService, CacheableService campionatoCacheableService) {
        this.campionatoService = campionatoService;
        this.campionatoCacheableService = campionatoCacheableService;
    }


    @Override
    public List<PartitaDTO> partite(String sport, String campionato, int giornata) {
        return getPartite(sport, campionato, giornata);
    }

    @Override
    public List<PartitaDTO> ultimiRisultati(String sport, String campionato, String squadra, int giornataAttuale) {
        List<PartitaDTO> partite = new ArrayList<>();
        for (int g = giornataAttuale; g >= giornataAttuale - 20; g--) {
            if (g > 0) {
                partite.addAll(
                        partite(sport, campionato, g)
                                .stream()
                                .filter(p -> p.getCasa().equals(squadra) || p.getFuori().equals(squadra))
                                .sorted(Comparator.comparing(PartitaDTO::getOrario))
                                .toList().reversed()
                );
            }
        }
        return partite;
    }

    @Override
    public List<PartitaDTO> partite(String sport, String campionato) {
        List<PartitaDTO> ret = new ArrayList<>();
        CampionatoDTO campionatoDTO = campionatoService.findCampionato(campionato).orElseThrow(() -> new RuntimeException("Campionato non trovato: " + campionato));
        for (int giornata = 1; giornata <= campionatoDTO.getNumGiornate(); giornata++) {
            List<PartitaDTO> calendarioGiornata = getPartite(sport, campionato, giornata);
            ret.addAll(calendarioGiornata);
        }
        return ret;
    }

    private List<PartitaDTO> getPartite(String sport, String campionato, int giornata) {
        List<PartitaDTO> ret = new ArrayList<>();
        String urlGiornata = Integer.toString(giornata);
        String attUrlCalendar;
        if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())) {
            String fase = "regularSeason";
            attUrlCalendar = urlCalendar + "&phase=" + fase;
            urlGiornata = calcolaGiornataNBA(sport, campionato, giornata, fase);
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_B.name())) {
            attUrlCalendar = urlCalendar + "&phase=regularSeason";
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_A.name()) || campionato.equals(EnumAPI2.Campionato.LIGA.name())) {
            attUrlCalendar = urlCalendar;
        } else {
            throw new RuntimeException("Campionato da configurare: " + campionato);
        }
        String urlResolved = String.format(attUrlCalendar, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id, urlGiornata);
        Map response = campionatoCacheableService.cacheUrl(urlResolved, Map.class);
        Map m = (Map) response.get("data");

        List<Map<String, Object>> games = (List<Map<String, Object>>) m.get("games");
        for (Map<String, Object> game : games) {
            List<Map<String, Object>> matches = (List<Map<String, Object>>) game.get("matches");
            for (Map<String, Object> match : matches) {
                OffsetDateTime odt = OffsetDateTime.parse(match.get("date").toString());
                LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
                String status;
                try {
                    status = ((Map) match.get("timing")).get("tag").toString();
                } catch (Exception e) {
                    status = match.get("status").toString();
                }
                Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;

                Result resultHome = getResult(match, "home", statoPartita);
                Result resultAway = getResult(match, "away", statoPartita);


                PartitaDTO calendarioDTO = PartitaDTO.builder()
                        .sportId(sport)
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(statoPartita)
                        .casa(resultHome.teamCode())
                        .fuori(resultAway.teamCode())
                        .scoreCasa(resultHome.teamScore())
                        .scoreFuori(resultAway.teamScore())
                        .build();
                log.info("calendarioDTO = " + calendarioDTO);
                ret.add(calendarioDTO);
            }
        }
        return ret;
    }

    private static @NonNull Result getResult(Map<String, Object> match, String dove, Enumeratori.StatoPartita statoPartita) {
        Map team = (Map) match.get(dove.toLowerCase() + "Team");
        if (team == null) {
            team = (Map) match.get("team" + dove.substring(0, 1).toUpperCase() + dove.substring(1).toLowerCase());
        }
        String teamCode = team.get("teamCode").toString();
        Integer teamScore;
        if (statoPartita== Enumeratori.StatoPartita.TERMINATA) {
            teamScore = (Integer) team.get("score");
            if (teamScore == null) {
                teamScore = Integer.parseInt(((Map) team.get("scores")).get("total").toString());
            }
        } else {
            teamScore = 0;
        }
        Result result = new Result(teamCode, teamScore);
        return result;
    }

    private record Result(String teamCode, Integer teamScore) {
    }

    private String calcolaGiornataNBA(String sport, String campionato, int giornata, String fase) {
        String urlResolved = String.format(urlInfo, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id);
        Map responseInfo = campionatoCacheableService.cacheUrl(urlResolved, Map.class);
        String startDate = ((Map) ((Map) ((Map) responseInfo.get("data")).get("phases")).get(fase)).get("startDate").toString();
        LocalDate ldStartDate = OffsetDateTime.parse(startDate).toLocalDate();
        ldStartDate=ldStartDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        ldStartDate = ldStartDate.plusDays(7 * (giornata - 1));
        return ldStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

}
