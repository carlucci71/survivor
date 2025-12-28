package it.ddlsolution.survivor.util;

public class Enumeratori {

    public enum Role {
        STANDARD,
        ADMIN
    }

    public enum EsitoGiocata {
        OK, KO
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
        LEADER("L"), GIOCATORE("G");

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
        DA_GIOCARE,
        SOSPESA,
        TERMINATA,
        IN_CORSO
    }

}
