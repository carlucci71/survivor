package it.ddlsolution.survivor.service;

import it.ddlsolution.survivor.entity.Partita;
import it.ddlsolution.survivor.repository.PartitaRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

/**
 * Recupera le quote bookmaker da The Odds API e le salva sulla tabella partita.
 * La quota viene bloccata al momento della giocata in GiocataService.
 *
 * Mappatura campionato → sport key The Odds API:
 *   SERIE_A   → soccer_italy_serie_a
 *   SERIE_B   → soccer_italy_serie_b
 *   LIGA      → soccer_spain_la_liga
 *   NBA_RS    → basketball_nba
 *   TENNIS_AO → tennis_atp_aus_open
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class OddsService {

    private static final String BASE_URL = "https://api.the-odds-api.com/v4/sports/%s/odds";
    private static final String BOOKMAKER = "pinnacle"; // bookmaker con le quote più reali; fallback su primo disponibile

    @Value("${external-api.odds.api-key:}")
    private String apiKey;

    private final RestTemplate restTemplate;
    private final PartitaRepository partitaRepository;

    // Mappa campionatoId (nostro) → sport key The Odds API
    private static final Map<String, String> CAMPIONATO_TO_SPORT_KEY = Map.of(
            "SERIE_A",   "soccer_italy_serie_a",
            "SERIE_B",   "soccer_italy_serie_b",
            "LIGA",      "soccer_spain_la_liga",
            "NBA_RS",    "basketball_nba",
            "TENNIS_AO", "tennis_atp_aus_open"
    );

    /**
     * Scarica le quote per tutte le partite di un campionato/anno/giornata
     * e le persiste su DB. Invocato dopo il calcolo risultati della giornata precedente.
     */
    @Transactional
    public void aggiornaQuoteGiornata(String campionatoId, short anno, int giornata, String implApi) {
        if (apiKey == null || apiKey.isBlank()) {
            log.warn("[OddsService] API key non configurata, salto fetch quote per {}/gio{}", campionatoId, giornata);
            return;
        }
        String sportKey = CAMPIONATO_TO_SPORT_KEY.get(campionatoId);
        if (sportKey == null) {
            log.info("[OddsService] Campionato {} non mappato su The Odds API, salto", campionatoId);
            return;
        }

        try {
            String url = UriComponentsBuilder
                    .fromHttpUrl(String.format(BASE_URL, sportKey))
                    .queryParam("apiKey", apiKey)
                    .queryParam("regions", "eu")
                    .queryParam("markets", "h2h")
                    .queryParam("oddsFormat", "decimal")
                    .toUriString();

            @SuppressWarnings("unchecked")
            List<Map<String, Object>> events = restTemplate.getForObject(url, List.class);
            if (events == null || events.isEmpty()) {
                log.info("[OddsService] Nessun evento restituito da The Odds API per {}", sportKey);
                return;
            }

            List<Partita> partite = partitaRepository
                    .findByCampionato_IdAndImplementationExternalApiAndAnno(campionatoId, implApi, anno)
                    .stream()
                    .filter(p -> p.getGiornata() == giornata)
                    .toList();

            int aggiornate = 0;
            for (Partita partita : partite) {
                for (Map<String, Object> event : events) {
                    if (matchaPartita(partita, event)) {
                        applicaQuote(partita, event);
                        partitaRepository.save(partita);
                        aggiornate++;
                        break;
                    }
                }
            }
            log.info("[OddsService] Quote aggiornate: {}/{} partite per {}/gio{}", aggiornate, partite.size(), campionatoId, giornata);
        } catch (Exception e) {
            log.error("[OddsService] Errore fetch quote per {}: {}", campionatoId, e.getMessage(), e);
        }
    }

    /**
     * Ritorna la quota della squadra (sigla) per una partita specifica.
     * Usato da GiocataService al momento del salvataggio della giocata.
     */
    public BigDecimal getQuotaForSquadra(Partita partita, String squadraSigla) {
        if (squadraSigla == null || partita == null) return null;
        String sigla = squadraSigla.toUpperCase();
        if (sigla.equals(normalizza(partita.getCasaSigla()))) {
            return partita.getQuotaCasa();
        }
        if (sigla.equals(normalizza(partita.getFuoriSigla()))) {
            return partita.getQuotaTrasf();
        }
        return null;
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    /**
     * Verifica se un evento Odds API corrisponde alla partita.
     * Confronto fuzzy: controlla se la sigla/nome delle squadre è contenuto
     * nei nomi home_team/away_team dell'API (case-insensitive).
     */
    private boolean matchaPartita(Partita partita, Map<String, Object> event) {
        String homeTeam = normalizza((String) event.get("home_team"));
        String awayTeam = normalizza((String) event.get("away_team"));
        String casaNome  = normalizza(partita.getCasaNome());
        String fuoriNome = normalizza(partita.getFuoriNome());
        String casaSigla  = normalizza(partita.getCasaSigla());
        String fuoriSigla = normalizza(partita.getFuoriSigla());

        boolean casaMatch  = homeTeam.contains(casaNome)  || casaNome.contains(homeTeam)
                          || homeTeam.contains(casaSigla) || casaSigla.contains(homeTeam);
        boolean fuoriMatch = awayTeam.contains(fuoriNome)  || fuoriNome.contains(awayTeam)
                          || awayTeam.contains(fuoriSigla) || fuoriSigla.contains(awayTeam);
        return casaMatch && fuoriMatch;
    }

    @SuppressWarnings("unchecked")
    private void applicaQuote(Partita partita, Map<String, Object> event) {
        List<Map<String, Object>> bookmakers = (List<Map<String, Object>>) event.get("bookmakers");
        if (bookmakers == null || bookmakers.isEmpty()) return;

        // Prova prima il bookmaker preferito, altrimenti usa il primo disponibile
        Map<String, Object> bm = bookmakers.stream()
                .filter(b -> BOOKMAKER.equals(b.get("key")))
                .findFirst()
                .orElse(bookmakers.get(0));

        List<Map<String, Object>> markets = (List<Map<String, Object>>) bm.get("markets");
        if (markets == null || markets.isEmpty()) return;

        Map<String, Object> h2h = markets.stream()
                .filter(m -> "h2h".equals(m.get("key")))
                .findFirst().orElse(null);
        if (h2h == null) return;

        List<Map<String, Object>> outcomes = (List<Map<String, Object>>) h2h.get("outcomes");
        if (outcomes == null) return;

        String homeTeam = normalizza((String) event.get("home_team"));
        String awayTeam = normalizza((String) event.get("away_team"));

        for (Map<String, Object> outcome : outcomes) {
            String name  = normalizza((String) outcome.get("name"));
            BigDecimal price = toBigDecimal(outcome.get("price"));
            if (name.equals(homeTeam) || name.contains(normalizza(partita.getCasaNome()))) {
                partita.setQuotaCasa(price);
            } else if (name.equals(awayTeam) || name.contains(normalizza(partita.getFuoriNome()))) {
                partita.setQuotaTrasf(price);
            } else if (name.equalsIgnoreCase("draw") || name.equalsIgnoreCase("pareggio")) {
                partita.setQuotaPareggio(price);
            }
        }
    }

    private String normalizza(String s) {
        return s == null ? "" : s.trim().toLowerCase();
    }

    private BigDecimal toBigDecimal(Object val) {
        if (val == null) return null;
        if (val instanceof Number) return BigDecimal.valueOf(((Number) val).doubleValue());
        try { return new BigDecimal(val.toString()); } catch (Exception e) { return null; }
    }
}
