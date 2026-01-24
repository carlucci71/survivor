package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

//NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
//CENSIRE TUTTE LE SQUADRE CHE HANNO GIOCATO IN LIGA
enum SquadreLiga_API2 implements IEnumSquadre {
        RAY("RAY"),
        GIR("GIR"),
        OVI("OVI"),
        VIL("VIL"),
        BAR("BAR"),
        MLL("MLL"),
        LEV("LEV"),
        ALA("ALA"),
        RSO("RSO"),
        VAL("VAL"),
        GET("GET"),
        VIG("VIG"),
        SEV("SEV"),
        ATH("ATH"),
        ATM("ATM"),
        ESP("ESP"),
        BET("BET"),
        ELC("ELC"),
        OSA("OSA"),
        RMA("RMA");
        final String siglaEsterna;

        SquadreLiga_API2(String siglaEsterna) {
            this.siglaEsterna = siglaEsterna;
        }

        @Override
        public String getSiglaEsterna() {
            return siglaEsterna;
        }
    }

