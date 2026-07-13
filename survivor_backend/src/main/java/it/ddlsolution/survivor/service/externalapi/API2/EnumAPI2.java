package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.Enumeratori;

import java.util.Map;

class EnumAPI2 {

    public enum Campionato {
        SERIE_A(Map.of(2024, 21, 2025, 21, 2026, 21), SquadreSerieA_API2.values()),
        SERIE_B(Map.of(2025, 105), SquadreSerieB_API2.values()),
        LIGA(Map.of(2025, 23, 2026, 23), SquadreLiga_API2.values()),
        PREMIER_LEAGUE(Map.of(2025, 8, 2026, 8), SquadrePremierLeague_API2.values()),
        TENNIS_W(Map.of(2025, 11316), SquadreTennis_API2.values()),
        TENNIS_AO(Map.of(2025, 10376, 2026, 12389), SquadreTennis_API2.values()),
        ROLAND_GARROS(Map.of(2026, 12394), SquadreTennis_API2.values()),
        NBA_RS(Map.of(2025, 3), SquadreNBA_API2.values()),
        MONDIALI_2026(Map.of(2026, 4), SquadreNazionali_API2.values());

        final Map<Integer, Integer> id;
        final IEnumSquadre[] squadre;

        Campionato(Map<Integer, Integer> id, IEnumSquadre[] squadre) {
            this.id = id;
            this.squadre = squadre;
        }

        public IEnumSquadre[] getSquadre() {
            return squadre;
        }

        public Campionato valori(String name) {
            return valueOf(name);
        }

        static Campionato fromId(int anno, int id) {
            Campionato ret = null;
            for (Campionato campionato : values()) {
                if (campionato.id.get(anno) != null && campionato.id.get(anno) == id) {
                    ret = campionato;
                }
            }
            return ret;
        }
    }

    public enum Sport {
        CALCIO(1),
        BASKET(3),
        TENNIS(8);
        final int id;

        Sport(int id) {
            this.id = id;
        }

        static Sport fromId(int id) {
            Sport ret = null;
            for (Sport sport : values()) {
                if (sport.id == id) {
                    ret = sport;
                }
            }
            return ret;
        }
    }

    enum StatoPartitaAP2 {
        PreMatch(Enumeratori.StatoPartita.DA_GIOCARE),
        Postponed(Enumeratori.StatoPartita.DA_GIOCARE),
        POSTPONED(Enumeratori.StatoPartita.DA_GIOCARE),
        WALKOVER(Enumeratori.StatoPartita.TERMINATA),
        Cancelled(Enumeratori.StatoPartita.DA_GIOCARE),
        Walkover(Enumeratori.StatoPartita.TERMINATA),
        FirstHalf(Enumeratori.StatoPartita.IN_CORSO),
        HalfTime(Enumeratori.StatoPartita.IN_CORSO),
        SecondHalf(Enumeratori.StatoPartita.IN_CORSO),
        FullTime(Enumeratori.StatoPartita.TERMINATA),
        PLAYED(Enumeratori.StatoPartita.TERMINATA),
        FINISHED(Enumeratori.StatoPartita.TERMINATA),
        INPLAY(Enumeratori.StatoPartita.IN_CORSO),
        RETIRED(Enumeratori.StatoPartita.TERMINATA),
        FIXTURE(Enumeratori.StatoPartita.DA_GIOCARE),
        PLAYING(Enumeratori.StatoPartita.DA_GIOCARE),
        NOTSTARTED(Enumeratori.StatoPartita.DA_GIOCARE),
        SUSPENDED(Enumeratori.StatoPartita.DA_GIOCARE),
        PREMATCH(Enumeratori.StatoPartita.DA_GIOCARE);


        final Enumeratori.StatoPartita statoPartita;

        StatoPartitaAP2(Enumeratori.StatoPartita statoPartita) {
            this.statoPartita = statoPartita;
        }
    }

    enum RoundTennis {
        //        FirstRoundQualifizioni("qualifying-1st-round"),
//        SecondRoundQualifizioni("qualifying-2nd-round"),
//        FinaleQualificazioni("qualifying-final"),
        Sessantaquattresimi("1-128-final"),
        Trentaduesimi("1-64-final"),
        Sedicesimi("1-32-final"),
        Ottavi("1-16-final"),
        Quarti("quarter-finals"),
        Semifinali("semi-finals"),
        Finale("final");

        final String key;

        RoundTennis(String key) {
            this.key = key;
        }
    }

    // Mapping giornata (1-based) → phase + subphase della Gazzetta API per i Mondiali 2026
    // Valori confermati: G1-G3 (gironi), R32 (trentaduesimi), R16 (ottavi).
    // QF/SF/F: subphase inferita dal pattern camelCase dell'API — verificare al primo utilizzo.
    enum RoundMondiali {
        G1("groups", "1"),              // Giornata 1 gironi
        G2("groups", "2"),              // Giornata 2 gironi
        G3("groups", "3"),              // Giornata 3 gironi
        R32("playoffs", "round-of-32"), // Trentaduesimi di finale ✓ confermato
        R16("playoffs", "roundOf16"),   // Ottavi di finale ✓ confermato
        QF("playoffs", "quarterFinals"),// Quarti di finale (da verificare al primo utilizzo)
        SF("playoffs", "semiFinals"),   // Semifinali (da verificare al primo utilizzo)
        F("playoffs", "final");         // Finale (da verificare al primo utilizzo)

        final String phase;
        final String subphase;

        RoundMondiali(String phase, String subphase) {
            this.phase = phase;
            this.subphase = subphase;
        }

        // Numero di giornata del girone in cui termina il group stage
        static final int GIRONI_END = 3;

        static RoundMondiali fromGiornata(int giornata) {
            RoundMondiali[] values = values();
            if (giornata < 1 || giornata > values.length) {
                throw new IllegalArgumentException("Giornata Mondiali non valida: " + giornata);
            }
            return values[giornata - 1];
        }

        // True se il round usa il nuovo URL mc-public-api.gazzetta.it
        boolean usaUrlKnockout() {
            return this.ordinal() >= R16.ordinal();
        }
    }

}
