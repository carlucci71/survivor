package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.util.Enumeratori;

public class EnumAPI2 {

    enum Campionato {
        SERIE_A(21),
        SERIE_B(105),
        LIGA(23),
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
        BASKET(3);
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

    /*
        enum Squadre {
            BOL("BOL"),
            INT("INT"),
            CRE("CRE"),
            COM("COM"),
            FIO("FIO"),
            ATA("ATA"),
            VER("VER"),
            ROM("ROM"),
            LAZ("LAZ"),
            PIS("PIS"),
            LEC("LEC"),
            GEN("GEN"),
            MIL("MIL"),
            CAG("CAG"),
            NAP("NAP"),
            UDI("UDI"),
            PAR("PAR"),
            SAS("SAS"),
            TOR("TOR"),
            TOR("TOR"),
            OKC("OKC");
            String code;

            Squadre(String code) {
                this.code = code;
            }

            static Squadre fromCode(String code) {
                Squadre ret = null;
                for (Squadre squadra : values()) {
                    if (squadra.code.equals(code)) {
                        ret = squadra;
                    }
                }
                return ret;
            }
        }
    */
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
        FIXTURE(Enumeratori.StatoPartita.DA_GIOCARE);


        Enumeratori.StatoPartita statoPartita;

        StatoPartitaAP2(Enumeratori.StatoPartita statoPartita) {
            this.statoPartita = statoPartita;
        }
    }

}
