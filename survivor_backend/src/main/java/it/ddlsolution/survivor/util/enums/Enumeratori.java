package it.ddlsolution.survivor.util.enums;

public class Enumeratori {

    public enum Role {
        STANDARD,
        ADMIN
    }

    public enum EsitoGiocata {
        OK, KO, PAREGGIO
    }

    public enum ModalitaLega {
        SURVIVOR, CAMPIONATO
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
        PREMIER_LEAGUE,
        TENNIS_W,
        TENNIS_AO,
        ROLAND_GARROS,
        NBA_RS,
        MONDIALI_2026;
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

    public enum DesRoundMondiali {
        GIRONI_1("Girone - Giornata 1"),
        GIRONI_2("Girone - Giornata 2"),
        GIRONI_3("Girone - Giornata 3"),
        SEDICESIMI("Sedicesimi di finale"),    // Round of 32 (giornata 4) - 32 squadre avanzano dai gironi → 16
        OTTAVI("Ottavi di finale"),                 // Round of 16 (giornata 5) - 16 squadre → 8
        QUARTI("Quarti di finale"),
        SEMIFINALI("Semifinali"),
        FINALE("Finale");

        private final String descrizione;

        DesRoundMondiali(String descrizione) {
            this.descrizione = descrizione;
        }

        public String getDescrizione() {
            return descrizione;
        }
    }

    public enum CodiciParametri {MOCK_LOCALDATE_RIF}

    public enum TipoNotifica {
        INIZIO_PARTITA("Inizio partita"),
        REMINDER_GIORNATA("Promemoria giornata"),
        JOIN_REQUEST_RICEVUTA("Richiesta di ingresso"),
        JOIN_REQUEST_APPROVATA("Richiesta approvata"),
        JOIN_REQUEST_RIFIUTATA("Richiesta rifiutata"),
        RECAP_GIORNATA("Recap giornata");

        String descrizione;
        TipoNotifica(String descrizione){
            this.descrizione=descrizione;
        }

        public String getDescrizione() {
            return descrizione;
        }
    }

    public enum StatoRichiesta {
        PENDING, APPROVED, REJECTED
    }

}



