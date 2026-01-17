package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.Enumeratori;
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
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
@RequiredArgsConstructor
public class CalendarioAPI2 implements ICalendario {

    private final CacheableService cacheableService;

    @Value("${external-api.calendario.implementation.API2.url-calendar}")
    String urlCalendar;

    @Value("${external-api.calendario.implementation.API2.url-info}")
    String urlInfo;

    @Value("${anno-default}")
    short annoDefault;

    private String fromCampionato(EnumAPI2.Campionato campionato) {
        String fase = null;
        if (campionato == EnumAPI2.Campionato.NBA_RS) {
            fase = "regularSeason";
        } else if (campionato == EnumAPI2.Campionato.SERIE_B) {
            fase = "regularSeason";
        }
        return fase;
    }

    @Override
    public List<PartitaDTO> getPartite(String sport, String campionato, int giornata, List<SquadraDTO> squadre, short anno) {
        List<PartitaDTO> ret = new ArrayList<>();
        EnumAPI2.Campionato enumCampionato = EnumAPI2.Campionato.valueOf(campionato);
        String urlGiornata = Integer.toString(giornata);
        String attUrlCalendar;
        if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())) {
            attUrlCalendar = urlCalendar + "&phase=" + fromCampionato(enumCampionato);
            urlGiornata = calcolaGiornataNBA(enumCampionato, giornata);
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_B.name())) {
            attUrlCalendar = urlCalendar + "&phase=" + fromCampionato(enumCampionato);
        } else if (campionato.equals(EnumAPI2.Campionato.TENNIS_AO.name()) || campionato.equals(EnumAPI2.Campionato.TENNIS_W.name())) {
            attUrlCalendar = urlCalendar;
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_A.name()) || campionato.equals(EnumAPI2.Campionato.LIGA.name())) {
            attUrlCalendar = urlCalendar;
        } else {
            throw new RuntimeException("Campionato da configurare: " + campionato);
        }
        String urlResolved = String.format(attUrlCalendar, EnumAPI2.Sport.valueOf(sport).id, enumCampionato.id, urlGiornata, anno);
        urlResolved = urlResolved.replaceAll("&seasonId=" + annoDefault, "");
        Map response = cacheableService.cacheUrl(urlResolved, Map.class);
        Map m = (Map) response.get("data");
        if (sport.equals(EnumAPI2.Sport.CALCIO.name()) || sport.equals(EnumAPI2.Sport.BASKET.name())) {
            elaboraCalcioBasket(sport, campionato, giornata, m, ret, squadre, anno);
        } else if (sport.equals(EnumAPI2.Sport.TENNIS.name())) {
            elaboraTennis(sport, campionato, giornata, m, ret, squadre, anno);
        } else {
            throw new RuntimeException("Sport non configurato: " + sport);
        }
        return ret;
    }

    @Override
    public IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO, short anno) {
        /*
        List<IEnumSquadre> squadreNonSovrascritte = new ArrayList<>(
                squadreDTO
                        .stream()
                        .filter(s -> s.getAnno() == anno)
                        .filter(s -> isPresent(EnumAPI2.Campionato.valueOf(idCampionato).getSquadre(), s.getNome()))
                        .map(m -> new IEnumSquadre() {
                            @Override
                            public String getSiglaEsterna() {
                                return (m.getSigla());
                            }

                            @Override
                            public String name() {
                                return m.getNome();
                            }
                        })
                        .toList()
        );
        Arrays.stream(EnumAPI2.Campionato.valueOf(idCampionato).getSquadre())
                .forEach(e -> squadreNonSovrascritte.add(e));

        return squadreNonSovrascritte.toArray(IEnumSquadre[]::new);

         */
        return EnumAPI2.Campionato.valueOf(idCampionato).getSquadre();
    }

    private boolean isPresent(IEnumSquadre[] squadre, String nome) {
        return true;

    }

    private void elaboraTennis(String sport, String campionato, int giornata, Map m, List<PartitaDTO> ret, List<SquadraDTO> squadreCampionato, short anno) {
        String round = EnumAPI2.RoundTennis.values()[giornata - 1].key;
        List<Map<String, Object>> cr = (List<Map<String, Object>>) m.get("competitionRounds");
        List<Map<String, Object>> matches = cr.stream()
                .filter(map -> round.equals(map.get("name")))
                .map(map -> (List<Map<String, Object>>) map.get("match"))
                .findFirst()
                .orElseGet(() -> new ArrayList<>());

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
                    || match.get("matchId").toString().equals("396552")
                    || match.get("matchId").toString().equals("396556")
            ) {//TODO GESTIRE FORZATURE
                status = EnumAPI2.StatoPartitaAP2.FINISHED.name();
            }

            if (!status.equals("FINISHED")) {
                System.out.println(match.get("matchId").toString());
                System.out.println();
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
                    //.casaSigla(resultHome.teamCode())
                    .casaSigla(getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato, anno).getSigla())
                    .casaNome(getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato, anno).getNome())
//                    .fuoriSigla(resultAway.teamCode())
                    .fuoriSigla(getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato, anno).getSigla())
                    .fuoriNome(getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato, anno).getNome())
                    .casaNome(resultHome.team())
                    .fuoriNome(resultAway.team())
                    .scoreCasa(resultHome.teamScore())
                    .scoreFuori(resultAway.teamScore())
                    .anno(anno)
                    .build();
            log.info("calendarioDTO = " + calendarioDTO);
            ret.add(calendarioDTO);
        }
    }

    private void elaboraCalcioBasket(String sport, String campionato, int giornata, Map m, List<PartitaDTO> ret, List<SquadraDTO> squadreCampionato, short anno) {
        Map<String, Integer> contaPartiteSquadra = new HashMap<>();
        if (m.get("games") instanceof Map) {
            return;
        }
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

                String aliasCasa = "";
                String aliasFuori = "";
                if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())) {
                    contaPartiteSquadra.put(homeCode, contaPartiteSquadra.getOrDefault(homeCode, 0) + 1);
                    contaPartiteSquadra.put(awayCode, contaPartiteSquadra.getOrDefault(awayCode, 0) + 1);
                    aliasCasa = "Settimana " + giornata + " - Partita " + contaPartiteSquadra.get(homeCode);
                    aliasFuori = "Settimana " + giornata + " - Partita " + contaPartiteSquadra.get(awayCode);
                }

                PartitaDTO calendarioDTO = PartitaDTO.builder()
                        .sportId(sport)
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(statoPartita)
//                        .casaSigla(homeCode)
                        .casaSigla(getSquadraDTO(homeCode, campionato, squadreCampionato, anno).getSigla())
                        .casaNome(getSquadraDTO(homeCode, campionato, squadreCampionato, anno).getNome())
//                        .fuoriSigla(awayCode)
                        .fuoriSigla(getSquadraDTO(awayCode, campionato, squadreCampionato, anno).getSigla())
                        .fuoriNome(getSquadraDTO(awayCode, campionato, squadreCampionato, anno).getNome())
                        .casaNome(resultHome.team())
                        .fuoriNome(resultAway.team())
                        .scoreCasa(resultHome.teamScore())
                        .scoreFuori(resultAway.teamScore())
                        .aliasGiornataCasa(aliasCasa)
                        .aliasGiornataFuori(aliasFuori)
                        .anno(anno)
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
        } else {
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


    private String calcolaGiornataNBA(EnumAPI2.Campionato campionato, int giornata) {
        LocalDate ldStartDate = startDateFase(campionato);
        ldStartDate = ldStartDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        ldStartDate = ldStartDate.plusDays(7 * (giornata - 1));
        return ldStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private final ConcurrentHashMap<EnumAPI2.Campionato, CompletableFuture<LocalDate>> startDateFutures = new ConcurrentHashMap<>();


    private LocalDate startDateFase(EnumAPI2.Campionato campionato) {
        try {
            return startDateFutures
                    .computeIfAbsent(campionato, c ->
                            CompletableFuture.supplyAsync(() -> {
                                String urlResolved = String.format(urlInfo, EnumAPI2.Sport.valueOf(Enumeratori.SportDisponibili.BASKET.name()).id, c.id);
                                Map responseInfo = cacheableService.cacheUrl(urlResolved, Map.class);
                                String startDateFase = ((Map) ((Map) ((Map) responseInfo.get("data")).get("phases")).get(fromCampionato(c))).get("startDate").toString();
                                return OffsetDateTime.parse(startDateFase).toLocalDate();
                            })
                    ).get();
        } catch (Exception e) {
            startDateFutures.remove(campionato); // pulizia su errore
            throw new RuntimeException(e);
        }
    }
}
