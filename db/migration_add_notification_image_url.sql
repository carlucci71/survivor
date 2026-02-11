-- Migration: Aggiunge campo image_url alla tabella notification
-- Data: 2026-02-11
-- Descrizione: Il campo image_url permette di associare un'immagine alle notifiche

-- Aggiungi colonna image_url
ALTER TABLE notification ADD COLUMN IF NOT EXISTS image_url VARCHAR(255);

-- Commento per documentazione
COMMENT ON COLUMN notification.image_url IS 'URL immagine associata alla notifica (opzionale)';

