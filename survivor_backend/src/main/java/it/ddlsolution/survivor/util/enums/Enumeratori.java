package it.ddlsolution.survivor.util.enums;

public class Enumeratori {

    public enum Role {
        STANDARD,
        ADMIN
    }

    public enum EsitoGiocata {
        OK, KO
    }

    public enum TipoMagicToken {
        JOIN("J"), LOG("L");
        private final String codice;

        TipoMagicToken(String codice) {
            this.codice = codice;
        }

        public String getCodice() {
            return codice;
        }


    }

    public enum StatoGiocatore {
        ATTIVO("A"), PENDING("P"), ELIMINATO("E");

        private final String codice;

        StatoGiocatore(String codice) {
            this.codice = codice;
        }

        public String getCodice() {
            return codice;
        }

        public static StatoGiocatore fromCodice(String codice) {
            if (codice == null) {
                return null;
            }
            for (StatoGiocatore stato : StatoGiocatore.values()) {
                if (stato.codice.equals(codice)) {
                    return stato;
                }
            }
            throw new IllegalArgumentException("Codice stato giocatore non valido: " + codice);
        }

    }

    public enum RuoloGiocatoreLega {
        LEADER("L"), GIOCATORE("G"), NESSUNO("N");

        private final String codice;

        RuoloGiocatoreLega(String codice) {
            this.codice = codice;
        }

        public String getCodice() {
            return codice;
        }

        public static RuoloGiocatoreLega fromCodice(String codice) {
            if (codice == null) {
                return null;
            }
            for (RuoloGiocatoreLega stato : RuoloGiocatoreLega.values()) {
                if (stato.codice.equals(codice)) {
                    return stato;
                }
            }
            throw new IllegalArgumentException("RuoloGiocatoreLega non valido: " + codice);
        }

    }

    public enum StatoPartita {
        DA_GIOCARE("Da giocare"),
        SOSPESA ("Sospesa"),
        TERMINATA ("Terminata"),
        IN_CORSO ("In corso");

        private final String descrizione;

        StatoPartita(String descrizione){
            this.descrizione=descrizione;
        }

        public String getDescrizione() {
            return descrizione;
        }
    }

    public enum StatoLega {
        DA_AVVIARE("D"), AVVIATA("A"), TERMINATA("T"), ERRORE("E");

        private final String codice;

        StatoLega(String codice) {
            this.codice = codice;
        }

        public String getCodice() {
            return codice;
        }

        public static StatoLega fromCodice(String codice) {
            if (codice == null) {
                return null;
            }
            for (StatoLega stato : StatoLega.values()) {
                if (stato.codice.equals(codice)) {
                    return stato;
                }
            }
            throw new IllegalArgumentException("StatoLega non valido: " + codice);
        }

    }

    public enum SportDisponibili {
        CALCIO, BASKET, TENNIS
    }

    public enum CampionatiDisponibili {
        SERIE_A,
        SERIE_B,
        LIGA,
        TENNIS_W,
        TENNIS_AO,
        NBA_RS;
    }

    public enum DesRoundTennis {
        Sessantaquattresimi("64-esimi"),
        Trentaduesimi("32-esimi"),
        Sedicesimi("16-esimi"),
        Ottavi("Ottavi"),
        Quarti("Quarti"),
        Semifinali("Semifinali"),
        Finale("Finale");
        String descrizione;
        DesRoundTennis(String descrizione){
            this.descrizione=descrizione;
        }
        public String getDescrizione(){
            return descrizione;
        }
    }

    public enum CodiciParametri {MOCK_LOCALDATE_RIF}

    public enum TipoNotifica {INIZIO_PARTITA("Inizio partita");
        String descrizione;
        TipoNotifica(String descrizione){
            this.descrizione=descrizione;
        }

        public String getDescrizione() {
            return descrizione;
        }
    }


}



