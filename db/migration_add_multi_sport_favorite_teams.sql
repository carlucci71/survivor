-- Migration: Aggiunta squadre preferite per basket e tennis
-- Data: 2026-02-10
-- Descrizione: Aggiunge le colonne squadra_basket_cuore_id e tennista_cuore_id alla tabella giocatore

-- Aggiungi colonna per squadra basket preferita
ALTER TABLE giocatore
ADD COLUMN squadra_basket_cuore_id BIGINT;

-- Aggiungi colonna per tennista preferito
ALTER TABLE giocatore
ADD COLUMN tennista_cuore_id BIGINT;

-- Aggiungi foreign key per squadra basket
ALTER TABLE giocatore
ADD CONSTRAINT fk_giocatore_squadra_basket_cuore
FOREIGN KEY (squadra_basket_cuore_id)
REFERENCES squadra(id)
ON DELETE SET NULL;

-- Aggiungi foreign key per tennista
ALTER TABLE giocatore
ADD CONSTRAINT fk_giocatore_tennista_cuore
FOREIGN KEY (tennista_cuore_id)
REFERENCES squadra(id)
ON DELETE SET NULL;

-- Aggiungi commenti alle colonne
COMMENT ON COLUMN giocatore.squadra_cuore_id IS 'Squadra di calcio preferita del giocatore';
COMMENT ON COLUMN giocatore.squadra_basket_cuore_id IS 'Squadra di basket preferita del giocatore';
COMMENT ON COLUMN giocatore.tennista_cuore_id IS 'Tennista preferito del giocatore';

