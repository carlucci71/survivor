-- Migration: Aggiunge il campo 'pubblica' alla tabella giocata
-- Data: 2026-02-05
-- Descrizione: Permette agli utenti di scegliere se rendere pubblica la loro giocata
--              o mantenerla nascosta fino all'inizio della giornata

-- Aggiunge la colonna pubblica (default FALSE = nascosta)
ALTER TABLE giocata
ADD COLUMN IF NOT EXISTS pubblica BOOLEAN DEFAULT FALSE;

-- Aggiorna le giocate esistenti: se la giornata è già passata o in corso, rendile pubbliche
UPDATE giocata g
SET pubblica = TRUE
FROM lega l
WHERE g.id_lega = l.id
  AND g.giornata <= (l.giornata_corrente - COALESCE(l.giornata_iniziale, 1) + 1);

-- Commento sulla colonna
COMMENT ON COLUMN giocata.pubblica IS 'Se TRUE, la giocata è visibile a tutti; se FALSE/NULL, è nascosta fino all''inizio della giornata';
