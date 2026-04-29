-- Fix: rende id_squadra nullable nella tabella giocata
-- Necessario per supportare l'inserimento automatico di giocate senza squadra
-- (giocatori senza pick in modalità Campionato/Survivor — auto-KO al calcolo)

ALTER TABLE giocata ALTER COLUMN id_squadra DROP NOT NULL;
