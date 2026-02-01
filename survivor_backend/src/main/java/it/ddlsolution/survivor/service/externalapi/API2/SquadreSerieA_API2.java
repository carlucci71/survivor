package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

//NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
//CENSIRE TUTTE LE SQUADRE CHE HANNO GIOCATO IN SERIE_A
enum SquadreSerieA_API2 implements IEnumSquadre {
        ATA("ATA"),
        BOL("BOL"),
        CAG("CAG"),
        COM("COM"),
        CRE("CRE"),
        FIO("FIO"),
        GEN("GEN"),
        INT("INT"),
        JUV("JUV"),
        LAZ("LAZ"),
        LEC("LEC"),
        MIL("MIL"),
        NAP("NAP"),
        PAR("PAR"),
        PIS("PIS"),
        ROM("ROM"),
        SAS("SAS"),
        TOR("TOR"),
        UDI("UDI"),
        EMP("EMP"),
        VEN("VEN"),
        VER("VER"),
        MON("MONZ");
        final String siglaEsterna;

        SquadreSerieA_API2(String siglaEsterna) {
            this.siglaEsterna = siglaEsterna;
        }

        @Override
        public String getSiglaEsterna() {
            return siglaEsterna;
        }
    }
