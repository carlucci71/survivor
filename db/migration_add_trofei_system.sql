-- Migration: Aggiungi sistema trofei
-- Aggiunge la colonna posizione_finale alla tabella giocatore_lega per tracciare i vincitori

-- Aggiungi colonna posizione_finale
ALTER TABLE giocatore_lega
ADD COLUMN posizione_finale INTEGER NULL;

-- Commento sulla colonna
COMMENT ON COLUMN giocatore_lega.posizione_finale IS 'Posizione finale nella lega: 1=vincitore, 2=secondo posto, etc. NULL se lega non terminata o giocatore eliminato senza posizione';

-- Indice per query veloci sui vincitori
CREATE INDEX idx_giocatore_lega_posizione ON giocatore_lega(posizione_finale) WHERE posizione_finale IS NOT NULL;

-- Query di esempio per trovare tutti i trofei di un giocatore
-- SELECT gl.id_lega, l.name, l.anno, l.edizione, gl.posizione_finale, c.nome as campionato, s.nome as sport
-- FROM giocatore_lega gl
-- JOIN lega l ON gl.id_lega = l.id
-- JOIN campionato c ON l.id_campionato = c.id
-- JOIN sport s ON c.id_sport = s.id
-- WHERE gl.id_giocatore = ? AND gl.posizione_finale = 1
-- ORDER BY l.anno DESC, l.edizione DESC;
