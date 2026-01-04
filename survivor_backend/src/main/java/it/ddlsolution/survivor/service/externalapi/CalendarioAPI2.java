package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.response.PartitaDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.UtilCalendarioService;
import it.ddlsolution.survivor.util.Enumeratori;
import lombok.RequiredArgsConstructor;
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
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
@RequiredArgsConstructor
public class CalendarioAPI2 implements ICalendario {

    private final CacheableService cacheableService;
    private final UtilCalendarioService utilCalendarioService;

    @Value("${external-api.calendario.implementation.API2.url-calendar}")
    String urlCalendar;

    @Value("${external-api.calendario.implementation.API2.url-info}")
    String urlInfo;

    @Override
    public List<PartitaDTO> getPartite(String sport, String campionato, int giornata) {
        List<PartitaDTO> ret = new ArrayList<>();
        String urlGiornata = Integer.toString(giornata);
        String attUrlCalendar;
        if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())) {
            String fase = "regularSeason";
            attUrlCalendar = urlCalendar + "&phase=" + fase;
            urlGiornata = calcolaGiornataNBA(sport, campionato, giornata, fase);
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_B.name())) {
            attUrlCalendar = urlCalendar + "&phase=regularSeason";
        } else if (campionato.equals(EnumAPI2.Campionato.TENNIS_AO.name()) || campionato.equals(EnumAPI2.Campionato.TENNIS_W.name())) {
            attUrlCalendar = urlCalendar;
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_A.name()) || campionato.equals(EnumAPI2.Campionato.LIGA.name())) {
            attUrlCalendar = urlCalendar;
        } else {
            throw new RuntimeException("Campionato da configurare: " + campionato);
        }
        String urlResolved = String.format(attUrlCalendar, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id, urlGiornata);
        Map response = cacheableService.cacheUrl(urlResolved, Map.class);
        Map m = (Map) response.get("data");
        if (sport.equals(EnumAPI2.Sport.CALCIO.name()) || sport.equals(EnumAPI2.Sport.BASKET.name())) {
            elaboraCalcioBasket(sport, campionato, giornata, m, ret);
        } else if (sport.equals(EnumAPI2.Sport.TENNIS.name())) {
            elaboraTennis(sport, campionato, giornata, m, ret);
        } else {
            throw new RuntimeException("Sport non configurato: " + sport);
        }
        return ret;
    }

    @Override
    public Map<String, Map<String, String>> mapForAdapt(){
        Map<String, Map<String, String>> ret = new HashMap<>();
        for (Enumeratori.CampionatiDisponibili campionato : Enumeratori.CampionatiDisponibili.values()) {
            ret.put(
                    campionato.name(),
                    Arrays.stream(EnumAPI2.Campionato.valueOf(campionato.name()).squadre).collect(Collectors.toMap(EnumAPI2.IEnumSquadre::getSigla, EnumAPI2.IEnumSquadre::name))
            );
        }
        return ret;
    }




    public Map<Integer, String> roundTennis(){
        Map<Integer, String> ret = new HashMap<>();
        EnumAPI2.RoundTennis[] values = EnumAPI2.RoundTennis.values();
        for (int i=0;i< values.length;i++){
            ret.put((i+1),values[i].descrizione);
        }
        return ret;
    }

    private void elaboraTennis(String sport, String campionato, int giornata, Map m, List<PartitaDTO> ret) {
        String round = EnumAPI2.RoundTennis.values()[giornata-1].key;
        List<Map<String, Object>> cr = (List<Map<String, Object>>) m.get("competitionRounds");
        List<Map<String, Object>> matches = cr.stream()
                .filter(map -> round.equals(map.get("name")))
                .map(map -> (List<Map<String, Object>>) map.get("match"))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Round non trovato: " + round));

        for (Map<String, Object> match : matches) {
            OffsetDateTime odt = OffsetDateTime.parse(match.get("date").toString());
            LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
            String status = match.get("status").toString();
            if (match.get("matchId").toString().equals("386621")
                    || match.get("matchId").toString().equals("386607")
                    || match.get("matchId").toString().equals("360665")
                    || match.get("matchId").toString().equals("360681")
                    || match.get("matchId").toString().equals("360690")
                    || match.get("matchId").toString().equals("386620")
                    || match.get("matchId").toString().equals("386664")
                    || match.get("matchId").toString().equals("386675")
                    || match.get("matchId").toString().equals("400942")
                    || match.get("matchId").toString().equals("400949")
                    || match.get("matchId").toString().equals("400976")
                    || match.get("matchId").toString().equals("396446")
                    || match.get("matchId").toString().equals("396456")
                    || match.get("matchId").toString().equals("396499")
            ) {//TODO GESTIRE FORZATURE
                status = EnumAPI2.StatoPartitaAP2.FINISHED.name();
            }

            if (!status.equals("FINISHED")) {
                //System.out.println(match.get("matchId").toString());
                //System.out.println();
            }

            Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;

            Result resultHome = getResultTennis(match, "first", statoPartita);
            Result resultAway = getResultTennis(match, "second", statoPartita);


            PartitaDTO calendarioDTO = PartitaDTO.builder()
                    .sportId(sport)
                    .campionatoId(campionato)
                    .giornata(giornata)
                    .orario(romaTime)
                    .stato(statoPartita)
                    .casaSigla(resultHome.teamCode())
                    .fuoriSigla(resultAway.teamCode())
                    .casaNome(resultHome.team())
                    .fuoriNome(resultAway.team())
                    .scoreCasa(resultHome.teamScore())
                    .scoreFuori(resultAway.teamScore())
                    .build();
            log.info("calendarioDTO = " + calendarioDTO);
            ret.add(calendarioDTO);
        }
    }

    private void elaboraCalcioBasket(String sport, String campionato, int giornata, Map m, List<PartitaDTO> ret) {
        Map<String, Integer> contaPartiteSquadra=new HashMap<>();
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

                String homeCode = resultHome.teamCode;
                String awayCode = resultAway.teamCode;

                String aliasCasa="";
                String aliasFuori="";
                if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())){
                    contaPartiteSquadra.put(homeCode,contaPartiteSquadra.getOrDefault(homeCode, 0)+1);
                    contaPartiteSquadra.put(awayCode,contaPartiteSquadra.getOrDefault(awayCode, 0)+1);
                    aliasCasa="Settimana " + giornata + " - Partita "  + contaPartiteSquadra.get(homeCode);
                    aliasFuori="Settimana " + giornata + " - Partita "  + contaPartiteSquadra.get(awayCode);
                }


                PartitaDTO calendarioDTO = PartitaDTO.builder()
                        .sportId(sport)
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(statoPartita)
                        .casaSigla(homeCode)
                        .fuoriSigla(awayCode)
                        .casaNome(resultHome.team())
                        .fuoriNome(resultAway.team())
                        .scoreCasa(resultHome.teamScore())
                        .scoreFuori(resultAway.teamScore())
                        .aliasGiornataCasa(aliasCasa)
                        .aliasGiornataFuori(aliasFuori)
                        .build();
                log.info("calendarioDTO = " + calendarioDTO);
                ret.add(calendarioDTO);
            }
        }
    }

    private @NonNull Result getResult(Map<String, Object> match, String dove, Enumeratori.StatoPartita statoPartita) {
        Map team = (Map) match.get(dove.toLowerCase() + "Team");
        if (team == null) {
            team = (Map) match.get("team" + dove.substring(0, 1).toUpperCase() + dove.substring(1).toLowerCase());
        }
        String teamCode = team.get("teamCode").toString();
        String teamName;
        if (team.get("teamName") != null) {
            teamName = team.get("teamName").toString();
        } else{
            teamName = team.get("italianName").toString();
        }
        Integer teamScore;
        if (statoPartita == Enumeratori.StatoPartita.TERMINATA) {
            teamScore = (Integer) team.get("score");
            if (teamScore == null) {
                teamScore = Integer.parseInt(((Map) team.get("scores")).get("total").toString());
            }
        } else {
            teamScore = 0;
        }
        Result result = new Result(teamName, teamCode, teamScore);
        return result;
    }

    private @NonNull Result getResultTennis(Map<String, Object> match, String dove, Enumeratori.StatoPartita statoPartita) {
        Map team = (Map) match.get(dove.toLowerCase() + "Entry");
        if (team == null) {
            team = (Map) match.get("team" + dove.substring(0, 1).toUpperCase() + dove.substring(1).toLowerCase());
        }
        String teamCode = ((List<Map<String, Object>>) team.get("players")).get(0).get("playerId").toString();
        String teamName = ((List<Map<String, Object>>) team.get("players")).get(0).get("displayName").toString();
        Integer teamScore;
        if (statoPartita == Enumeratori.StatoPartita.TERMINATA) {
            teamScore = (Integer) team.get("score");
            if (teamScore == null) {
                teamScore = Integer.parseInt(((Map) team.get("scores")).get("total").toString());
            }
        } else {
            teamScore = 0;
        }
        Result result = new Result(teamName, teamCode, teamScore);
        return result;
    }

    private record Result(String team, String teamCode, Integer teamScore) {
    }

    private String calcolaGiornataNBA(String sport, String campionato, int giornata, String fase) {
        String urlResolved = String.format(urlInfo, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id);
        Map responseInfo = cacheableService.cacheUrl(urlResolved, Map.class);
        String startDate = ((Map) ((Map) ((Map) responseInfo.get("data")).get("phases")).get(fase)).get("startDate").toString();
        LocalDate ldStartDate = OffsetDateTime.parse(startDate).toLocalDate();
        ldStartDate = ldStartDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        ldStartDate = ldStartDate.plusDays(7 * (giornata - 1));
        return ldStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

}
