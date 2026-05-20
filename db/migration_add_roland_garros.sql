-- Migration: Roland Garros 2026 Survivor
-- Aggiunge il campionato Roland Garros (tennis)

INSERT INTO campionato (id, id_sport, nome, num_giornate, anno_corrente)
VALUES ('ROLAND_GARROS', 'TENNIS', 'Roland Garros', 7, 2026)
ON CONFLICT (id) DO NOTHING;
