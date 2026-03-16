-- Migration: Aggiunge quote bookmaker alla tabella partita e punti alla giocata
-- Data: 2026-03-16
-- Descrizione: Supporto al sistema punti basato sulle quote (The Odds API).
--   - partita: quota casa/pareggio/trasferta scaricata da The Odds API
--   - giocata: quota_bloccata (bloccata al momento della giocata) e punti calcolati a fine giornata

-- Quote sulla partita (scaricate da The Odds API prima della giornata)
ALTER TABLE partita ADD COLUMN IF NOT EXISTS quota_casa       NUMERIC(6,2) DEFAULT NULL;
ALTER TABLE partita ADD COLUMN IF NOT EXISTS quota_pareggio   NUMERIC(6,2) DEFAULT NULL;
ALTER TABLE partita ADD COLUMN IF NOT EXISTS quota_trasferta  NUMERIC(6,2) DEFAULT NULL;

-- Quote e punti sulla giocata
ALTER TABLE giocata ADD COLUMN IF NOT EXISTS quota_bloccata   NUMERIC(6,2) DEFAULT NULL;
ALTER TABLE giocata ADD COLUMN IF NOT EXISTS punti            NUMERIC(8,2) DEFAULT NULL;
