package it.ddlsolution.survivor.service.externalapi.API2;

import it.ddlsolution.survivor.service.externalapi.IEnumSquadre;

//NEL NAME VA IL NOME DB E IN SIGLAESTERNA QUELLO DELL'API.
//CENSIRE TUTTE LE SQUADRE CHE HANNO GIOCATO IN NBA
public enum SquadreNBA_API2 implements IEnumSquadre {
        DET("DET"),
        NYK("NYK"),
        TOR("TOR"),
        BOS("BOS"),
        PHI("PHI"),
        ORL("ORL"),
        MIA("MIA"),
        CLE("CLE"),
        ATL("ATL"),
        CHI("CHI"),
        MIL("MIL"),
        CHA("CHA"),
        BKN("BKN"),
        IND("IND"),
        WAS("WAS"),
        OKC("OKC"),
        DEN("DEN"),
        SAS("SAS"),
        LAL("LAL"),
        HOU("HOU"),
        MIN("MIN"),
        PHX("PHX"),
        MEM("MEM"),
        GSW("GSW"),
        POR("POR"),
        DAL("DAL"),
        UTA("UTA"),
        LAC("LAC"),
        SAC("SAC"),
        NOP("NOP");
        final String siglaEsterna;

        SquadreNBA_API2(String siglaEsterna) {
            this.siglaEsterna = siglaEsterna;
        }

        @Override
        public String getSiglaEsterna() {
            return siglaEsterna;
        }
    }
