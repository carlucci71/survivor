package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.externalapi.ICalendario;
import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.Utility;
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
import java.util.Objects;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
@RequiredArgsConstructor
public class CalendarioAPI2 implements ICalendario {

    private final Utility utility;
    private final CampionatoService campionatoService;

    @Value("${external-api.calendario.implementation.API2.url-calendar}")
    String urlCalendar;

    @Value("${external-api.calendario.implementation.API2.url-info}")
    String urlInfo;

    @Value("${external-api.calendario.implementation.API2.url-calendar-mondiali}")
    String urlCalendarMondiali;

    @Value("${external-api.calendario.implementation.API2.url-calendar-roland-garros}")
    String urlCalendarRolandGarros;


    private String faseFromCampionato(EnumAPI2.Campionato campionato) {
        String fase = null;
        if (campionato == EnumAPI2.Campionato.NBA_RS) {
            fase = "regularSeason";
        } else if (campionato == EnumAPI2.Campionato.SERIE_B) {
            fase = "regularSeason";
        }
        return fase;
    }

    @Override
    public List<PartitaDTO> getPartite(CampionatoDTO campionatoDTO, int giornata, short anno) {
        String campionato=campionatoDTO.getId();
        // Branch dedicato per i Mondiali: struttura URL e risposta API differente
        if (campionato.equals(EnumAPI2.Campionato.MONDIALI_2026.name())) {
            return getPartiteMondiali(campionatoDTO, giornata, anno);
        }
        // Branch dedicato per il Roland Garros: tabellone via endpoint separato
        if (campionato.equals(EnumAPI2.Campionato.ROLAND_GARROS.name())) {
            return getPartiteRolandGarros(campionatoDTO, giornata, anno);
        }
        List<SquadraDTO> squadre=campionatoDTO.getSquadre();
        String sport = campionatoDTO.getSport().getId();
        List<PartitaDTO> ret = new ArrayList<>();
        EnumAPI2.Campionato enumCampionato = EnumAPI2.Campionato.valueOf(campionato);
        String giornataPerUrl = Integer.toString(giornata);
        String attUrlCalendar;
        if (campionato.equals(EnumAPI2.Campionato.NBA_RS.name())) {
            attUrlCalendar = urlCalendar + "&phase=" + faseFromCampionato(enumCampionato);
            giornataPerUrl = calcolaGiornataNBA(enumCampionato, giornata, anno);
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_B.name())) {
            attUrlCalendar = urlCalendar + "&phase=" + faseFromCampionato(enumCampionato);
        } else if (campionato.equals(EnumAPI2.Campionato.TENNIS_AO.name()) || campionato.equals(EnumAPI2.Campionato.TENNIS_W.name())) {
            attUrlCalendar = urlCalendar;
        } else if (campionato.equals(EnumAPI2.Campionato.SERIE_A.name()) || campionato.equals(EnumAPI2.Campionato.LIGA.name())) {
            attUrlCalendar = urlCalendar;
        } else {
            throw new RuntimeException("Campionato da configurare: " + campionato);
        }
        String urlResolved = String.format(attUrlCalendar
                , EnumAPI2.Sport.valueOf(sport).id
                , enumCampionato.id.get(Integer.valueOf(anno))
                , giornataPerUrl
                , anno
        );
        urlResolved = urlResolved.replaceAll("&seasonId=" + campionatoDTO.getAnnoCorrente(), "");
        Map response = utility.callUrl(urlResolved, Map.class);
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
    public IEnumSquadre[] getSquadre(String idCampionato, List<SquadraDTO> squadreDTO) {
        return EnumAPI2.Campionato.valueOf(idCampionato).getSquadre();
    }

    // -------------------------------------------------------------------------
    // MONDIALI 2026 - logica dedicata
    // L'API Gazzetta usa phase/subphase invece di day/seasonId
    // -------------------------------------------------------------------------

    private List<PartitaDTO> getPartiteMondiali(CampionatoDTO campionatoDTO, int giornata, short anno) {
        List<PartitaDTO> ret = new ArrayList<>();
        List<SquadraDTO> squadre = campionatoDTO.getSquadre();
        EnumAPI2.RoundMondiali round = EnumAPI2.RoundMondiali.fromGiornata(giornata);
        int competitionId = EnumAPI2.Campionato.MONDIALI_2026.id.get(Integer.valueOf(anno));
        String urlResolved = String.format(urlCalendarMondiali,
                EnumAPI2.Sport.CALCIO.id,
                competitionId,
                round.phase,
                round.subphase);
        log.info("Mondiali getPartite giornata={} url={}", giornata, urlResolved);
        Map response = utility.callUrl(urlResolved, Map.class);
        Map m = (Map) response.get("data");
        elaboraMondiali(campionatoDTO.getId(), giornata, m, ret, squadre, anno);
        return ret;
    }

    @SuppressWarnings("unchecked")
    private void elaboraMondiali(String campionato, int giornata, Map m, List<PartitaDTO> ret,
                                  List<SquadraDTO> squadreCampionato, short anno) {
        Object gamesObj = m.get("games");
        if (!(gamesObj instanceof List)) return;
        List<Map<String, Object>> games = (List<Map<String, Object>>) gamesObj;

        for (Map<String, Object> game : games) {
            Object matchesObj = game.get("matches");
            if (!(matchesObj instanceof List)) continue;
            List<Object> matchesList = (List<Object>) matchesObj;

            for (Object matchesEntry : matchesList) {
                if (matchesEntry instanceof Map) {
                    Map<String, Object> matchesMap = (Map<String, Object>) matchesEntry;
                    // La risposta dei gironi raggruppa le partite per lettera di gruppo (A, B, ..., L)
                    // La risposta del knockout potrebbe non avere chiavi di gruppo
                    for (Map.Entry<String, Object> entry : matchesMap.entrySet()) {
                        List<Map<String, Object>> matchList = toMatchList(entry.getValue());
                        for (Map<String, Object> match : matchList) {
                            PartitaDTO dto = buildPartitaMondiali(campionato, giornata, match, squadreCampionato, anno);
                            if (dto != null) ret.add(dto);
                        }
                    }
                }
            }
        }
    }

    @SuppressWarnings("unchecked")
    private List<Map<String, Object>> toMatchList(Object value) {
        if (value instanceof List) {
            return (List<Map<String, Object>>) value;
        } else if (value instanceof Map) {
            return List.of((Map<String, Object>) value);
        }
        return List.of();
    }

    private PartitaDTO buildPartitaMondiali(String campionato, int giornata, Map<String, Object> match,
                                             List<SquadraDTO> squadreCampionato, short anno) {
        try {
            String status;
            try {
                status = ((Map<?, ?>) match.get("timing")).get("tag").toString();
            } catch (Exception e) {
                status = match.get("status").toString();
            }
            Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;

            Result resultHome = getResult(match, "home", statoPartita);
            Result resultAway = getResult(match, "away", statoPartita);

            OffsetDateTime odt = OffsetDateTime.parse(match.get("utcDate").toString());
            LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();

            return PartitaDTO.builder()
                    .sportId(EnumAPI2.Sport.CALCIO.name())
                    .campionatoId(campionato)
                    .giornata(giornata)
                    .orario(romaTime)
                    .stato(statoPartita)
                    .casaSigla(getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato).getSigla())
                    .casaNome(resultHome.team())
                    .fuoriSigla(getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato).getSigla())
                    .fuoriNome(resultAway.team())
                    .scoreCasa(resultHome.teamScore())
                    .scoreFuori(resultAway.teamScore())
                    .anno(anno)
                    .build();
        } catch (Exception e) {
            log.warn("Errore elaborazione partita Mondiali: {}", e.getMessage());
            return null;
        }
    }

    // -------------------------------------------------------------------------
    // ROLAND GARROS - tabellone via endpoint dedicato Gazzetta
    // -------------------------------------------------------------------------

    @SuppressWarnings("unchecked")
    private List<PartitaDTO> getPartiteRolandGarros(CampionatoDTO campionatoDTO, int giornata, short anno) {
        List<PartitaDTO> ret = new ArrayList<>();
        log.info("Roland Garros getPartite giornata={} url={}", giornata, urlCalendarRolandGarros);
        Map<String, Object> response = utility.callUrl(urlCalendarRolandGarros, Map.class);
        Map<String, Object> data = (Map<String, Object>) response.get("data");
        elaboraRolandGarros(campionatoDTO.getId(), giornata, data, ret, anno);
        return ret;
    }

    @SuppressWarnings("unchecked")
    private void elaboraRolandGarros(String campionato, int giornata, Map<String, Object> data,
                                     List<PartitaDTO> ret, short anno) {
        String roundName = EnumAPI2.RoundTennis.values()[giornata - 1].key;
        List<Map<String, Object>> cr = (List<Map<String, Object>>) data.get("competitionRounds");
        if (cr == null) {
            log.warn("Roland Garros: competitionRounds non trovato nella risposta API");
            return;
        }
        List<Map<String, Object>> matches = cr.stream()
                .filter(map -> roundName.equals(map.get("name")))
                .map(map -> (List<Map<String, Object>>) map.get("match"))
                .filter(Objects::nonNull)
                .findFirst()
                .orElseGet(ArrayList::new);

        for (Map<String, Object> match : matches) {
            try {
                String dateStr = match.get("date") != null
                        ? match.get("date").toString()
                        : match.get("utcDate").toString();
                OffsetDateTime odt = OffsetDateTime.parse(dateStr);
                LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
                String status = match.get("status").toString();
                Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;
                Result resultHome = getResultTennis(match, "first", statoPartita);
                Result resultAway = getResultTennis(match, "second", statoPartita);
                PartitaDTO dto = PartitaDTO.builder()
                        .sportId(EnumAPI2.Sport.TENNIS.name())
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(statoPartita)
                        .casaSigla(toTennisSigla(resultHome.team()))
                        .casaNome(resultHome.team())
                        .fuoriSigla(toTennisSigla(resultAway.team()))
                        .fuoriNome(resultAway.team())
                        .scoreCasa(resultHome.teamScore())
                        .scoreFuori(resultAway.teamScore())
                        .anno(anno)
                        .build();
                log.debug("Roland Garros partita: {} vs {}", dto.getCasaNome(), dto.getFuoriNome());
                ret.add(dto);
            } catch (Exception e) {
                log.warn("Errore elaborazione partita Roland Garros giornata {}: {}", giornata, e.getMessage());
            }
        }
    }

    /** Converte il displayName del tennista in sigla uppercase con underscore: "Jannik Sinner" → "JANNIK_SINNER" */
    private static String toTennisSigla(String displayName) {
        if (displayName == null) return "";
        return displayName.toUpperCase().replace(' ', '_').replace('-', '_');
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
                    || match.get("matchId").toString().equals("414228")
            ) {
                status = EnumAPI2.StatoPartitaAP2.FINISHED.name();
            }

            if (!status.equals("FINISHED")) {
                System.out.println(match.get("matchId").toString());
                System.out.println();
            }

            Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;

            Result resultHome = getResultTennis(match, "first", statoPartita);
            Result resultAway = getResultTennis(match, "second", statoPartita);

            if (match.get("matchId").toString().equals("414341")){
                resultAway=new Result(resultAway.team, resultAway.teamCode, 3);
            }

            PartitaDTO calendarioDTO = PartitaDTO.builder()
                    .sportId(sport)
                    .campionatoId(campionato)
                    .giornata(giornata)
                    .orario(romaTime)
                    .stato(statoPartita)
                    //.casaSigla(resultHome.teamCode())
                    .casaSigla(getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato).getSigla())
                    .casaNome(getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato).getNome())
//                    .fuoriSigla(resultAway.teamCode())
                    .fuoriSigla(getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato).getSigla())
                    .fuoriNome(getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato).getNome())
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
                        .casaSigla(getSquadraDTO(homeCode, campionato, squadreCampionato).getSigla())
                        .casaNome(getSquadraDTO(homeCode, campionato, squadreCampionato).getNome())
//                        .fuoriSigla(awayCode)
                        .fuoriSigla(getSquadraDTO(awayCode, campionato, squadreCampionato).getSigla())
                        .fuoriNome(getSquadraDTO(awayCode, campionato, squadreCampionato).getNome())
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


    private String calcolaGiornataNBA(EnumAPI2.Campionato campionato, int giornata, short anno) {
        LocalDate ldStartDate = startDateFase(campionato, anno);
        ldStartDate = ldStartDate.with(TemporalAdjusters.previousOrSame(DayOfWeek.MONDAY));
        ldStartDate = ldStartDate.plusDays(7 * (giornata - 1));
        return ldStartDate.format(DateTimeFormatter.ISO_LOCAL_DATE);
    }

    private final ConcurrentHashMap<EnumAPI2.Campionato, CompletableFuture<LocalDate>> startDateFutures = new ConcurrentHashMap<>();


    private LocalDate startDateFase(EnumAPI2.Campionato campionato, short anno) {
        try {
            return startDateFutures
                    .computeIfAbsent(campionato, c ->
                            CompletableFuture.supplyAsync(() -> {
                                String urlResolved = String.format(urlInfo, EnumAPI2.Sport.valueOf(Enumeratori.SportDisponibili.BASKET.name()).id, c.id.get(Integer.valueOf(anno)));
                                Map responseInfo = utility.callUrl(urlResolved, Map.class);
                                String startDateFase = ((Map) ((Map) ((Map) responseInfo.get("data")).get("phases")).get(faseFromCampionato(c))).get("startDate").toString();
                                return OffsetDateTime.parse(startDateFase).toLocalDate();
                            })
                    ).get();
        } catch (Exception e) {
            startDateFutures.remove(campionato); // pulizia su errore
            throw new RuntimeException(e);
        }
    }
}
