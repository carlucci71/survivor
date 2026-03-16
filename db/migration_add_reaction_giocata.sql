-- Migration: Aggiunge la tabella reaction_giocata
-- Data: 2026-03-16
-- Descrizione: Permette ai giocatori di reagire alle giocate degli altri
--              con una emoji. Una sola reaction per giocatore per giocata.

CREATE TABLE IF NOT EXISTS reaction_giocata (
    id BIGSERIAL PRIMARY KEY,
    giocata_id BIGINT NOT NULL REFERENCES giocata(id) ON DELETE CASCADE,
    giocatore_id BIGINT NOT NULL REFERENCES giocatore(id) ON DELETE CASCADE,
    emoji VARCHAR(10) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT uq_reaction_giocata_giocatore UNIQUE (giocata_id, giocatore_id)
);

CREATE INDEX IF NOT EXISTS idx_reaction_giocata ON reaction_giocata(giocata_id);
CREATE INDEX IF NOT EXISTS idx_reaction_giocatore ON reaction_giocata(giocatore_id);

COMMENT ON TABLE reaction_giocata IS 'Reactions emoji dei giocatori sulle giocate degli altri';
COMMENT ON COLUMN reaction_giocata.emoji IS 'Emoji della reaction: 👏, 😱, 🔥, 😂';
