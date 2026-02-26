-- Migration: Aggiunge il campo 'forzata' alla tabella partita
-- Data: 2026-02-26
-- Descrizione: Permette al leader/admin di forzare una partita come vincente
--              per tutti i giocatori che l'hanno scelta in quella giornata

-- Aggiunge la colonna forzata alla tabella partita (default NULL = non forzata)
ALTER TABLE partita
ADD COLUMN IF NOT EXISTS forzata BOOLEAN DEFAULT NULL;

-- Commento sulla colonna
COMMENT ON COLUMN partita.forzata IS 'Se TRUE, la partita è forzata come vincente per tutti i giocatori che l''hanno scelta';

