-- Migration: Rinomina campionato Mondiali 2026 → World Tournament 2026
-- Motivo: compliance Apple App Store (rimozione riferimenti a trademark FIFA)

UPDATE campionato
SET nome = 'World Tournament 2026'
WHERE id = 'MONDIALI_2026';
