package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.util.Enumeratori;

public class EnumAPI2 {

    enum Campionato {
        SERIE_A(21),
        SERIE_B(105),
        LIGA(23),
        TENNIS_WIMBLEDON(11316),
        TENNIS_AO(10376),
        NBA_RS(3);
        int id;

        Campionato(int id) {
            this.id = id;
        }

        static Campionato fromId(int id) {
            Campionato ret = null;
            for (Campionato campionato : values()) {
                if (campionato.id == id) {
                    ret = campionato;
                }
            }
            return ret;
        }
    }


    enum Sport {
        CALCIO(1),
        BASKET(3),
        TENNIS(8);
        int id;

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
        FIXTURE(Enumeratori.StatoPartita.DA_GIOCARE);


        Enumeratori.StatoPartita statoPartita;

        StatoPartitaAP2(Enumeratori.StatoPartita statoPartita) {
            this.statoPartita = statoPartita;
        }
    }

    enum RoundTennis {
        //        FirstRoundQualifizioni("qualifying-1st-round"),
//        SecondRoundQualifizioni("qualifying-2nd-round"),
//        FinaleQualificazioni("qualifying-final"),
        Sessantaquattresimi("1-128-final","64-esimi"),
        Trentaduesimi("1-64-final","32-esimi"),
        Sedicesimi("1-32-final","16-esimi"),
        Ottavi("1-16-final","Ottavi"),
        Quarti("quarter-finals","Quarti"),
        Semifinali("semi-finals","Semifinali"),
        Finale("final","Finale");

        String key;
        String descrizione;

        RoundTennis(String key, String descrizione) {
            this.key = key;
            this.descrizione=descrizione;
        }

        static RoundTennis fromkey(String des) {
            RoundTennis ret = null;
            for (RoundTennis round : values()) {
                if (round.key == des) {
                    ret = round;
                }
            }
            return ret;
        }
    }

}
