-- Migration: Aggiungi campi profilo utente alla tabella giocatore
-- Data: 2026-01-26
-- Descrizione: Aggiunge nickname e squadra_cuore_id per il profilo utente

-- Aggiungi colonna nickname (opzionale, può essere diverso dal nome)
ALTER TABLE giocatore
ADD COLUMN nickname VARCHAR(100) NULL;

-- Aggiungi colonna squadra_cuore_id (riferimento alla squadra preferita)
ALTER TABLE giocatore
ADD COLUMN squadra_cuore_id INTEGER NULL;

-- Aggiungi foreign key per squadra_cuore_id
ALTER TABLE giocatore
ADD CONSTRAINT fk_giocatore_squadra_cuore
FOREIGN KEY (squadra_cuore_id) REFERENCES squadra(id)
ON DELETE SET NULL;

-- Crea indice per performance
CREATE INDEX idx_giocatore_squadra_cuore ON giocatore(squadra_cuore_id);

-- Commenti per documentazione
COMMENT ON COLUMN giocatore.nickname IS 'Nickname personalizzato del giocatore (opzionale)';
COMMENT ON COLUMN giocatore.squadra_cuore_id IS 'ID della squadra del cuore del giocatore (opzionale)';
