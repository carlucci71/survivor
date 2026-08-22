-- Script per eliminare una lega duplicata creata per errore (es. "beta survivors edizione 2"),
-- mantenendo intatta "Survivors 26/27".
--
-- Cancellazione manuale a cascata: alcune tabelle collegate a lega NON hanno
-- ON DELETE CASCADE a livello di DB (lega_join_request e reaction_giocata sì, le altre no),
-- quindi vanno svuotate esplicitamente prima di cancellare la riga in lega.
--
-- USO:
-- 1. Esegui la SELECT qui sotto e individua l'ID esatto della lega sbagliata
--    (NON quello di "Survivors 26/27"!).
-- 2. Sostituisci :lega_id con quell'ID in TUTTE le query sotto.
-- 3. Esegui tutto dentro la transazione: se il conteggio finale non torna, fai ROLLBACK.

-- 1. Individua l'ID della lega da eliminare
SELECT id, name, edizione, stato, anno, pubblica, accesso_libero
FROM lega
WHERE name ILIKE '%survivor%'
ORDER BY id DESC;

-- 2. Sostituisci :lega_id con l'ID trovato sopra, poi esegui da qui in giù
BEGIN;

-- Storico vite perse
DELETE FROM vita_persa WHERE id_lega = :lega_id;

-- Pronostici vincitore (eliminati che indovinano chi vince)
DELETE FROM pronostico_vincitore WHERE id_lega = :lega_id;

-- Giornate sospese
DELETE FROM sospensione_lega WHERE id_lega = :lega_id;

-- Giocate (le reaction_giocata collegate vengono cancellate in automatico via ON DELETE CASCADE)
DELETE FROM giocata WHERE id_lega = :lega_id;

-- Partecipazioni (giocatore_lega) - NON tocca la tabella giocatore, solo l'appartenenza a questa lega
DELETE FROM giocatore_lega WHERE id_lega = :lega_id;

-- Notifiche che puntano a questa lega (colonna senza FK, pulizia opzionale ma consigliata)
DELETE FROM notification WHERE lega_id = :lega_id;

-- Richieste di ingresso (già in ON DELETE CASCADE, questa riga è ridondante ma innocua)
DELETE FROM lega_join_request WHERE lega_id = :lega_id;

-- Infine la lega stessa
DELETE FROM lega WHERE id = :lega_id;

-- Verifica: deve restituire 0 righe
SELECT * FROM lega WHERE id = :lega_id;

-- Se tutto ok:
COMMIT;
-- Se qualcosa non torna, invece di COMMIT esegui:
-- ROLLBACK;
