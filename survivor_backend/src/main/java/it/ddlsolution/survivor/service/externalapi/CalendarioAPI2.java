package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.dto.PartitaDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import static it.ddlsolution.survivor.util.Constant.CALENDARIO_API2;
import static it.ddlsolution.survivor.util.Constant.SSL_DISABLED_RESTTEMPLATE;

@Service
@Profile(CALENDARIO_API2)
@Slf4j
public class CalendarioAPI2 implements ICalendario {

    private final RestTemplate restTemplate;

    @Value("${external-api.calendario.implementation.API2.url}")
    String url;

    public CalendarioAPI2(@Qualifier(SSL_DISABLED_RESTTEMPLATE) RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }
    @Override
    public List<PartitaDTO> partite(String sport, String campionato, int giornata) {
        return getPartite(sport, campionato, giornata);
    }

    @Override
    public List<PartitaDTO> partite(String sport, String campionato) {
        List<PartitaDTO> ret = new ArrayList<>();
        for (int giornata = 1; giornata <= EnumAPI2.MAX_GIORNATA; giornata++) {
            List<PartitaDTO> calendarioGiornata = getPartite(sport, campionato, giornata);
            ret.addAll(calendarioGiornata);
        }
        return ret;
    }

    private List<PartitaDTO> getPartite(String sport, String campionato, int giornata) {
        List<PartitaDTO> ret=new ArrayList<>();
        String urlDay = String.format(url, EnumAPI2.Sport.valueOf(sport).id, EnumAPI2.Campionato.valueOf(campionato).id, giornata);
        ResponseEntity<Map> map = restTemplate.getForEntity(urlDay, Map.class);
        Map response = map.getBody();
        Map m = (Map) response.get("data");
        List<Map<String, Object>> games = (List<Map<String, Object>>) m.get("games");
        for (Map<String, Object> game : games) {
            List<Map<String, Object>> matches = (List<Map<String, Object>>) game.get("matches");
            for (Map<String, Object> match : matches) {
                OffsetDateTime odt = OffsetDateTime.parse(match.get("date").toString());
                LocalDateTime romaTime = odt.atZoneSameInstant(ZoneId.of("Europe/Rome")).toLocalDateTime();
                String status = ((Map)match.get("timing")).get("tag").toString();
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
