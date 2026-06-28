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
import java.text.Normalizer;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;

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
            if (giornata == 4){
                List<Object> matchesList = (List<Object>) game.get("firstLeg");
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
            else {
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

            String casaSigla = getSquadraDTO(resultHome.teamCode(), campionato, squadreCampionato).getSigla();
            String fuoriSigla = getSquadraDTO(resultAway.teamCode(), campionato, squadreCampionato).getSigla();

            OffsetDateTime odt = OffsetDateTime.parse(match.get("utcDate").toString());
            LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();

            // Fase knockout (giornata > gironi): determina il vincitore anche in caso di parità
            // (supplementari/rigori), così l'esito non viene mai calcolato come PAREGGIO
            String vincitoreSigla = null;
            if (giornata > EnumAPI2.RoundMondiali.GIRONI_END
                    && statoPartita == Enumeratori.StatoPartita.TERMINATA) {
                vincitoreSigla = detectKnockoutWinner(match, casaSigla, fuoriSigla,
                        resultHome.teamScore(), resultAway.teamScore());
            }

            return PartitaDTO.builder()
                    .sportId(EnumAPI2.Sport.CALCIO.name())
                    .campionatoId(campionato)
                    .giornata(giornata)
                    .orario(romaTime)
                    .stato(statoPartita)
                    .casaSigla(casaSigla)
                    .casaNome(resultHome.team())
                    .fuoriSigla(fuoriSigla)
                    .fuoriNome(resultAway.team())
                    .scoreCasa(resultHome.teamScore())
                    .scoreFuori(resultAway.teamScore())
                    .vincitoreSigla(vincitoreSigla)
                    .anno(anno)
                    .build();
        } catch (Exception e) {
            log.warn("Errore elaborazione partita Mondiali: {}", e.getMessage());
            return null;
        }
    }

    /**
     * Per le fasi knockout dei Mondiali, determina la sigla del vincitore anche in caso di
     * parità nel punteggio (supplementari o rigori).
     * Strategia a cascata:
     *  1. Se i punteggi sono già diversi, il vincitore è determinato dal punteggio normale.
     *  2. Campo matchWinner / winner a livello partita (valore "homeTeam"/"awayTeam" o "1"/"2").
     *  3. homeTeam.scores.penalties vs awayTeam.scores.penalties.
     * Restituisce null se il vincitore non è determinabile (es. partita non ancora terminata).
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    private String detectKnockoutWinner(Map<String, Object> match,
                                        String casaSigla, String fuoriSigla,
                                        Integer scoreCasa, Integer scoreFuori) {
        // 1. Punteggi già diversi: vince chi ha segnato di più (include i gol nei supplementari)
        if (scoreCasa != null && scoreFuori != null && !scoreCasa.equals(scoreFuori)) {
            return scoreCasa > scoreFuori ? casaSigla : fuoriSigla;
        }

        // 2. Campo matchWinner / winner a livello match
        for (String key : new String[]{"matchWinner", "winner", "matchResult"}) {
            Object val = match.get(key);
            if (val instanceof String) {
                String w = val.toString().toLowerCase();
                if (w.contains("home") || w.equals("1")) return casaSigla;
                if (w.contains("away") || w.equals("2")) return fuoriSigla;
            } else if (val instanceof Map) {
                // es. "winner": {"side": "home"}
                Object side = ((Map) val).get("side");
                if (side == null) side = ((Map) val).get("teamSide");
                if (side != null) {
                    String s = side.toString().toLowerCase();
                    if (s.contains("home") || s.equals("1")) return casaSigla;
                    if (s.contains("away") || s.equals("2")) return fuoriSigla;
                }
            }
        }

        // 3. homeTeam.scores.penalties vs awayTeam.scores.penalties
        try {
            Map homeTeam = (Map) match.get("homeTeam");
            if (homeTeam == null) homeTeam = (Map) match.get("teamHome");
            Map awayTeam = (Map) match.get("awayTeam");
            if (awayTeam == null) awayTeam = (Map) match.get("teamAway");
            if (homeTeam != null && awayTeam != null) {
                Map homeScores = (Map) homeTeam.get("scores");
                Map awayScores = (Map) awayTeam.get("scores");
                if (homeScores != null && awayScores != null) {
                    Object hPen = homeScores.get("penalties");
                    Object aPen = awayScores.get("penalties");
                    if (hPen != null && aPen != null) {
                        int hp = Integer.parseInt(hPen.toString());
                        int ap = Integer.parseInt(aPen.toString());
                        if (hp != ap) return hp > ap ? casaSigla : fuoriSigla;
                    }
                }
            }
        } catch (Exception e) {
            log.warn("detectKnockoutWinner: errore lettura rigori per {} vs {}: {}",
                    casaSigla, fuoriSigla, e.getMessage());
        }

        return null;
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

        // Ricerca con il nome primario. Per i round finali (QF/SF/F) l'API potrebbe usare
        // la notazione "1-X-final" invece di "quarter-finals"/"semi-finals"/"final":
        //   giornata 5 (QF) → "1-8-final" oppure "quarter-finals"
        //   giornata 6 (SF) → "1-4-final" oppure "semi-finals"
        //   giornata 7 (F)  → "1-2-final" oppure "final"
        List<String> candidateNames = new ArrayList<>();
        candidateNames.add(roundName);
        int playersLeft = (int) Math.pow(2, EnumAPI2.RoundTennis.values().length - giornata + 1);
        String altName = "1-" + playersLeft + "-final";
        if (!altName.equals(roundName)) {
            candidateNames.add(altName);
        }

        List<Map<String, Object>> matches = cr.stream()
                .filter(map -> candidateNames.stream().anyMatch(n -> n.equals(map.get("name"))))
                .map(map -> (List<Map<String, Object>>) map.get("match"))
                .filter(Objects::nonNull)
                .findFirst()
                .orElseGet(ArrayList::new);

        if (matches.isEmpty()) {
            List<String> available = cr.stream()
                    .map(map -> String.valueOf(map.get("name")))
                    .collect(Collectors.toList());
            log.warn("Roland Garros giornata {}: round '{}' (alias {}) non trovato nei competitionRounds. " +
                     "Rounds disponibili nell'API: {}. Aggiornare RoundTennis enum se necessario.",
                     giornata, roundName, altName, available);
            return;
        }

        for (Map<String, Object> match : matches) {
            try {
                // Salta i match di doppio: nel singolare ciascuna entry ha esattamente 1 giocatore.
                // Nel doppio firstEntry.players ha 2 elementi → nomi abbreviati diversi dal singolare
                // produrrebbero sigle duplicate (es. "C._ALCARAZ" vs "CARLOS_ALCARAZ").
                Map<?, ?> firstEntryCheck = (Map<?, ?>) match.get("firstEntry");
                if (firstEntryCheck == null) {
                    log.debug("Roland Garros giornata {}: skip match senza firstEntry", giornata);
                    continue;
                }
                List<?> firstPlayers = (List<?>) firstEntryCheck.get("players");
                if (firstPlayers == null || firstPlayers.size() != 1) {
                    log.debug("Roland Garros giornata {}: skip match non-singolo (players={})",
                            giornata, firstPlayers == null ? "null" : firstPlayers.size());
                    continue;
                }

                // Data: fallback a now() se né "date" né "utcDate" sono presenti
                LocalDateTime romaTime;
                Object dateObj = match.get("date") != null ? match.get("date") : match.get("utcDate");
                if (dateObj != null) {
                    OffsetDateTime odt = OffsetDateTime.parse(dateObj.toString());
                    romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
                } else {
                    log.warn("Roland Garros giornata {}: data assente nel match, uso now() come fallback", giornata);
                    romaTime = LocalDateTime.now(ZoneId.of("Europe/Rome"));
                }

                // Status: gestione robusta di valori sconosciuti
                Object statusObj = match.get("status");
                if (statusObj == null) {
                    log.warn("Roland Garros giornata {}: status null nel match, salto", giornata);
                    continue;
                }
                String status = statusObj.toString();
                Enumeratori.StatoPartita statoPartita;
                try {
                    statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;
                } catch (IllegalArgumentException iae) {
                    log.warn("Roland Garros giornata {}: status '{}' non mappato in StatoPartitaAP2, " +
                             "trattato come DA_GIOCARE. Aggiungere all'enum se necessario.", giornata, status);
                    statoPartita = Enumeratori.StatoPartita.DA_GIOCARE;
                }

                Result resultHome = getResultTennis(match, "first", statoPartita);
                Result resultAway = getResultTennis(match, "second", statoPartita);
                PartitaDTO dto = PartitaDTO.builder()
                        .sportId(EnumAPI2.Sport.TENNIS.name())
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(statoPartita)
                        .casaSigla(siglaDaPlayerId(resultHome.teamCode(), resultHome.team()))
                        .casaNome(resultHome.team())
                        .fuoriSigla(siglaDaPlayerId(resultAway.teamCode(), resultAway.team()))
                        .fuoriNome(resultAway.team())
                        .scoreCasa(resultHome.teamScore())
                        .scoreFuori(resultAway.teamScore())
                        .anno(anno)
                        .build();
                log.info("Roland Garros g{} partita: {} ({}) vs {} ({}) stato={} score={}-{}",
                        giornata, dto.getCasaNome(), dto.getCasaSigla(), dto.getFuoriNome(), dto.getFuoriSigla(),
                        dto.getStato(), dto.getScoreCasa(), dto.getScoreFuori());
                ret.add(dto);
            } catch (Exception e) {
                log.warn("Errore elaborazione partita Roland Garros giornata {} (match={}): {}",
                         giornata, match.get("id"), e.getMessage());
            }
        }
    }

    /**
     * Converte il displayName del tennista nella sigla DB.
     * Convenzione: UPPERCASE, spazi→'_', trattini→'_', accenti rimossi.
     * Esempi:
     *   "Jannik Sinner"           → "JANNIK_SINNER"
     *   "Felix Auger-Aliassime"   → "FELIX_AUGER_ALIASSIME"
     *   "Félix Auger-Aliassime"   → "FELIX_AUGER_ALIASSIME"  (accento normalizzato)
     *   "Gaël Monfils"            → "GAEL_MONFILS"           (accento normalizzato)
     *   "Jan-Lennard Struff"      → "JAN_LENNARD_STRUFF"
     *
     * IMPORTANTE: questa funzione è la fonte di verità per la sigla dei tennisti nel progetto.
     * Quando aggiungi un nuovo tennista al DB/enum, usa sempre questa funzione per derivare la sigla.
     */
    static String toTennisSigla(String displayName) {
        if (displayName == null) return "";
        // 1. Decomposizione NFD: separa il carattere base dal suo segno diacritico
        //    es. "é" → "e" + combining-accent
        // 2. Rimuove tutti i combining diacritical marks (classe Unicode InCombiningDiacriticalMarks)
        String withoutAccents = Normalizer.normalize(displayName, Normalizer.Form.NFD)
                .replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return withoutAccents.toUpperCase().replace('-', '_').replace(' ', '_');
    }

    /**
     * Ritorna la sigla DB di un tennista per il Roland Garros cercando prima nell'enum
     * SquadreTennis_API2 tramite playerId (stabile, non cambia mai) e ricadendo su
     * toTennisSigla(displayName) se il giocatore non è ancora censito nell'enum.
     *
     * Il lookup per playerId è preferibile perché il displayName dell'API esterna può variare
     * (es. "Felix" vs "Félix", abbreviazioni, diversi formati per giocatori con doppio cognome).
     *
     * NOTA: le costanti di SquadreTennis_API2 DEVONO avere lo stesso nome che toTennisSigla
     * produrrebbe per quel giocatore (es. FELIX_AUGER_ALIASSIME, non FELIX_AUGERALIASSIME).
     */
    private static String siglaDaPlayerId(String playerId, String displayName) {
        for (SquadreTennis_API2 player : SquadreTennis_API2.values()) {
            if (player.getSiglaEsterna().equals(playerId)) {
                return player.name();
            }
        }
        // Fallback: giocatore non censito nell'enum → deriva la sigla dal displayName normalizzato.
        // Aggiungere il giocatore a SquadreTennis_API2 per garantire la sigla corretta nel tempo.
        String siglaFallback = toTennisSigla(displayName);
        log.warn("Roland Garros: playerId {} ('{}') non trovato in SquadreTennis_API2 → sigla fallback '{}'." +
                " Aggiungere ASAP all'enum.", playerId, displayName, siglaFallback);
        return siglaFallback;
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

            Enumeratori.StatoPartita statoPartita = EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita;

            Result resultHome = getResultTennis(match, "first", statoPartita);
            Result resultAway = getResultTennis(match, "second", statoPartita);

            PartitaDTO calendarioDTO = PartitaDTO.builder()
                    .sportId(sport)
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
            log.debug("elaboraTennis calendarioDTO={}", calendarioDTO);
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
