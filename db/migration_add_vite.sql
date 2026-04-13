-- Aggiunge il sistema delle vite al survivor
-- vite_iniziali: numero di vite assegnato alla lega al momento della creazione
-- giocatore_lega.vite_correnti: vite rimaste per ogni giocatore nella lega
-- vita_persa: storico di ogni vita persa (giocatore, lega, giornata, timestamp)

-- 1. Vite iniziali sulla lega (default 1 = comportamento attuale)
ALTER TABLE lega
    ADD COLUMN IF NOT EXISTS vite_iniziali SMALLINT NOT NULL DEFAULT 1;

-- 2. Vite correnti sul giocatore nella lega (copiate da vite_iniziali al join)
ALTER TABLE giocatore_lega
    ADD COLUMN IF NOT EXISTS vite_correnti SMALLINT NOT NULL DEFAULT 1;

-- 3. Storico vite perse
CREATE TABLE IF NOT EXISTS vita_persa (
    id          BIGSERIAL PRIMARY KEY,
    id_giocatore BIGINT NOT NULL REFERENCES giocatore(id),
    id_lega      BIGINT NOT NULL REFERENCES lega(id),
    giornata     INTEGER NOT NULL,
    persa_at     TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_vita_persa_giocatore_lega ON vita_persa(id_giocatore, id_lega);
