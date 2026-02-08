-- Migration: Aggiunge il campo 'pubblica' alla tabella giocata e giocata_aud
-- Data: 2026-02-05
-- Descrizione: Permette agli utenti di scegliere se rendere pubblica la loro giocata
--              o mantenerla nascosta fino all'inizio della giornata

-- Aggiunge la colonna pubblica alla tabella principale (default FALSE = nascosta)
ALTER TABLE giocata
ADD COLUMN IF NOT EXISTS pubblica BOOLEAN DEFAULT FALSE;

-- Aggiunge la colonna pubblica alla tabella di audit
ALTER TABLE giocata_aud
ADD COLUMN IF NOT EXISTS pubblica BOOLEAN;

-- Aggiorna le giocate esistenti: se la giornata è già passata o in corso, rendile pubbliche
UPDATE giocata g
SET pubblica = TRUE
FROM lega l
WHERE g.id_lega = l.id
  AND g.giornata <= (l.giornata_corrente - COALESCE(l.giornata_iniziale, 1) + 1);

-- Commento sulla colonna
COMMENT ON COLUMN giocata.pubblica IS 'Se TRUE, la giocata è visibile a tutti; se FALSE/NULL, è nascosta fino all''inizio della giornata';
COMMENT ON COLUMN giocata_aud.pubblica IS 'Campo audit per pubblica';
