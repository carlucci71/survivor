package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.CampionatoDTO;
import it.ddlsolution.survivor.dto.PartitaDTO;
import it.ddlsolution.survivor.dto.SquadraDTO;
import it.ddlsolution.survivor.service.CacheableService;
import it.ddlsolution.survivor.service.CampionatoService;
import it.ddlsolution.survivor.service.SquadraService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
public class CalendarioAPI2 implements ICalendario {

    private final CampionatoService campionatoService;
    private final CacheableService campionatoCacheableService;
    private final SquadraService squadraService;

    @Value("${external-api.calendario.implementation.API2.url}")
    String url;

    public CalendarioAPI2(CampionatoService campionatoService, CacheableService campionatoCacheableService, SquadraService squadraService) {
        this.campionatoService = campionatoService;
        this.campionatoCacheableService = campionatoCacheableService;
        this.squadraService = squadraService;
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
                PartitaDTO partita = partite(sport, campionato, g)
                        .stream()
                        .filter(p -> p.getCasa().equals(squadra) || p.getFuori().equals(squadra))
                        .findFirst()
                        .orElseThrow(()->new RuntimeException("Partita non trovata! " + squadra + " - " + campionato));
                partite.add(partita);
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
        String urlDay = String.format(url, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id, giornata);
        Map response = campionatoCacheableService.cacheUrl(urlDay, Map.class);
        Map m = (Map) response.get("data");

        List<Map<String, Object>> games = (List<Map<String, Object>>) m.get("games");
        for (Map<String, Object> game : games) {
            List<Map<String, Object>> matches = (List<Map<String, Object>>) game.get("matches");
            for (Map<String, Object> match : matches) {
                OffsetDateTime odt = OffsetDateTime.parse(match.get("date").toString());
                LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
                String status = ((Map) match.get("timing")).get("tag").toString();
                Map homeTeam = (Map) match.get("homeTeam");
                Integer homeTeamId = Integer.parseInt(homeTeam.get("teamId").toString());
                Integer homeTeamScore = (Integer) homeTeam.get("score");
                Map awayTeam = (Map) match.get("awayTeam");
                Integer awayTeamId = Integer.parseInt(awayTeam.get("teamId").toString());
                Integer awayTeamScore = (Integer) awayTeam.get("score");
                PartitaDTO calendarioDTO = PartitaDTO.builder()
                        .sportId(sport)
                        .campionatoId(campionato)
                        .giornata(giornata)
                        .orario(romaTime)
                        .stato(EnumAPI2.StatoPartitaAP2.valueOf(status).statoPartita)
                        .casa(EnumAPI2.Squadre.fromId(homeTeamId).name())
                        .fuori(EnumAPI2.Squadre.fromId(awayTeamId).name())
                        .golCasa(homeTeamScore)
                        .golFuori(awayTeamScore)
                        .build();
                log.info("calendarioDTO = " + calendarioDTO);
                ret.add(calendarioDTO);
            }
        }
        return ret;
    }
}
