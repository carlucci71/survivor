package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;
import it.ddlsolution.survivor.util.enums.Enumeratori;

import java.util.Map;

class EnumAPI2 {

    public enum Campionato {
        SERIE_A(Map.of(2025, 21), SquadreSerieA_API2.values()),
        SERIE_B(Map.of(2025, 105), SquadreSerieB_API2.values()),
        LIGA(Map.of(2025, 23), SquadreLiga_API2.values()),
        TENNIS_W(Map.of(2025, 11316), SquadreTennis_API2.values()),
        TENNIS_AO(Map.of(2025, 10376, 2026, 12389), SquadreTennis_API2.values()),
        NBA_RS(Map.of(2025, 3), SquadreNBA_API2.values());

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
        SUSPENDED(Enumeratori.StatoPartita.DA_GIOCARE);


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

}
