-- Lingua preferita dell'utente (it | en | es), usata per tradurre le notifiche push
-- inviate dal backend (finora erano tutte hardcoded in italiano).
ALTER TABLE users ADD COLUMN IF NOT EXISTS lingua VARCHAR(2) NOT NULL DEFAULT 'it';
