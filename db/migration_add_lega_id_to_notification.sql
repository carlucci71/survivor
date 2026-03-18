-- Migration: aggiunge lega_id alla tabella notification
-- Permette al frontend di navigare alla lega corretta quando si clicca una notifica JOIN_REQUEST

ALTER TABLE notification
    ADD COLUMN IF NOT EXISTS lega_id BIGINT NULL;
