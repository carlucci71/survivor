-- Pronostico degli eliminati su chi vincerà la lega (una sola pick, aggiornabile finché la lega non termina).
-- Un giocatore eliminato può pronosticare un solo vincitore per lega; il pronostico si aggiorna in caso di
-- ripetuta chiamata (upsert), non si accumula uno storico.

CREATE TABLE IF NOT EXISTS pronostico_vincitore (
    id                       BIGSERIAL PRIMARY KEY,
    id_lega                  BIGINT NOT NULL REFERENCES lega(id),
    id_giocatore             BIGINT NOT NULL REFERENCES giocatore(id),
    id_giocatore_pronosticato BIGINT NOT NULL REFERENCES giocatore(id),
    created_at               TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_pronostico_lega_giocatore UNIQUE (id_lega, id_giocatore)
);

CREATE INDEX IF NOT EXISTS idx_pronostico_vincitore_giocatore ON pronostico_vincitore(id_giocatore);
CREATE INDEX IF NOT EXISTS idx_pronostico_vincitore_lega ON pronostico_vincitore(id_lega);
