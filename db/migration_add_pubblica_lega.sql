-- Migration: Aggiunge il campo 'pubblica' alla tabella lega
-- Data: 2026-06-01
-- Descrizione: Permette al leader di scegliere se rendere la lega visibile
--              nella lista pubblica ("Scopri leghe"), oppure tenerla privata
--              (accessibile solo tramite link di invito).
--              Default FALSE = privata, visibile solo tramite link invito.

ALTER TABLE lega
ADD COLUMN IF NOT EXISTS pubblica BOOLEAN NOT NULL DEFAULT FALSE;

COMMENT ON COLUMN lega.pubblica IS 'Se TRUE, la lega appare nella lista pubblica "Scopri leghe" e chiunque può unirsi. Se FALSE (default), è accessibile solo tramite link di invito.';
