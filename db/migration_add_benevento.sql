-- Migration: Aggiunta Benevento in Serie B
-- Data: 2026-05-05
-- Descrizione: Aggiunge il Benevento tra le squadre di Serie B (promosso per la stagione 2026/2027)

INSERT INTO squadra(sigla, nome, id_campionato)
SELECT 'BEN', 'Benevento', 'SERIE_B'
WHERE NOT EXISTS (
    SELECT 1 FROM squadra WHERE sigla = 'BEN' AND id_campionato = 'SERIE_B'
);
