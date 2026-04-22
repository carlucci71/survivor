-- Modalità Campionato: aggiunge il tipo di gioco alla lega,
-- i punti per singola giocata e il totale punti del giocatore nella lega.

ALTER TABLE lega
    ADD COLUMN IF NOT EXISTS modalita VARCHAR(20) NOT NULL DEFAULT 'SURVIVOR';

ALTER TABLE giocata
    ADD COLUMN IF NOT EXISTS punti SMALLINT NULL;

-- Tabella audit Envers: deve rispecchiare le colonne della tabella principale
ALTER TABLE giocata_aud
    ADD COLUMN IF NOT EXISTS punti SMALLINT NULL;

ALTER TABLE giocatore_lega
    ADD COLUMN IF NOT EXISTS punti_totali INTEGER NOT NULL DEFAULT 0;
