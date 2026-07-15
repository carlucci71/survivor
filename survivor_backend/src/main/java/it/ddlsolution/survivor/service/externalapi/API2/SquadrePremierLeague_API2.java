package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

//NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
//CENSIRE TUTTE LE SQUADRE CHE HANNO GIOCATO IN PREMIER_LEAGUE
enum SquadrePremierLeague_API2 implements IEnumSquadre {
        ARS("ARS"),
        AST("AST"),
        AFC("AFC"),
        BRE("BRE"),
        BHA("BHA"),
        BNY("BNY"),
        CHL("CHL"),
        COV("COV"),
        CPL("CPL"),
        HUL("HUL"),
        IPS("IPS"),
        EVT("EVT"),
        FUL("FUL"),
        LDS("LDS"),
        LIV("LIV"),
        MNC("MNC"),
        MNU("MNU"),
        NEW("NEW"),
        NOF("NOF"),
        SUN("SUN"),
        TOT("TOT"),
        WHU("WHU"),
        WOL("WOL");

        final String siglaEsterna;

        SquadrePremierLeague_API2(String siglaEsterna) {
            this.siglaEsterna = siglaEsterna;
        }

        @Override
        public String getSiglaEsterna() {
            return siglaEsterna;
        }
    }
