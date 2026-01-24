package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

//NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
//CENSIRE TUTTE LE SQUADRE CHE HANNO GIOCATO IN SERIE_B
enum SquadreSerieB_API2 implements IEnumSquadre {
        CTZ("CTZ"),
        BAR("BAR"),
        JST("JST"),
        CES("CES"),
        SPE("SPE"),
        FRO("FRO"),
        VEN("VEN"),
        MOD("MOD"),
        CAR("CAR"),
        MON("MONZ"),
        SAM("SAM"),
        PAD("PAD"),
        PAL("PAL"),
        AVE("AVE"),
        REG("REG"),
        PES("PES"),
        STR("STR"),
        ENT("ENT"),
        EMP("EMP"),
        MAN("MAN");
        final String siglaEsterna;

        SquadreSerieB_API2(String siglaEsterna) {
            this.siglaEsterna = siglaEsterna;
        }

        @Override
        public String getSiglaEsterna() {
            return siglaEsterna;
        }
    }
