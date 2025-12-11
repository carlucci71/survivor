package it.ddlsolution.survivor.service.externalapi;

import it.ddlsolution.survivor.entity.Campionato;

public class EnumAPI2 {

    final static int MAX_GIORNATA=38;

    enum Campionato {
        SERIE_A(21);
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
        CALCIO(1);
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

    enum Squadre {
        BOL(123),
        INT(127),
        CRE(2174),
        COM(1065),
        FIO(125),
        ATA(456),
        VER(126),
        ROM(121),
        LAZ(129),
        PIS(2170),
        LEC(130),
        GEN(990),
        MIL(120),
        CAG(124),
        NAP(459),
        UDI(136),
        PAR(131),
        SAS(2182),
        TOR(135),
        JUV(128);
        int id;

        Squadre(int id) {
            this.id = id;
        }

        static Squadre fromId(int id) {
            Squadre ret = null;
            for (Squadre squadra : values()) {
                if (squadra.id == id) {
                    ret = squadra;
                }
            }
            return ret;
        }
    }
}
