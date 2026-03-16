-- Aggiunge max_partecipanti e accesso_libero alla lega
ALTER TABLE lega ADD COLUMN IF NOT EXISTS max_partecipanti INTEGER DEFAULT NULL;
ALTER TABLE lega ADD COLUMN IF NOT EXISTS accesso_libero BOOLEAN NOT NULL DEFAULT FALSE;

-- Tabella richieste di ingresso in una lega pubblica
CREATE TABLE IF NOT EXISTS lega_join_request (
    id                BIGSERIAL PRIMARY KEY,
    lega_id           BIGINT NOT NULL REFERENCES lega(id) ON DELETE CASCADE,
    giocatore_id      BIGINT NOT NULL REFERENCES giocatore(id) ON DELETE CASCADE,
    stato             VARCHAR(10) NOT NULL DEFAULT 'PENDING',  -- PENDING | APPROVED | REJECTED
    created_at        TIMESTAMP NOT NULL DEFAULT NOW(),
    resolved_at       TIMESTAMP,
    CONSTRAINT uq_lega_giocatore_request UNIQUE (lega_id, giocatore_id)
);

CREATE INDEX IF NOT EXISTS idx_ljr_lega_stato ON lega_join_request(lega_id, stato);
CREATE INDEX IF NOT EXISTS idx_ljr_giocatore ON lega_join_request(giocatore_id);
