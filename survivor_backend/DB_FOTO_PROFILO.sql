-- ============================================================================
-- FOTO PROFILO GIOCATORE
-- Da eseguire a mano su OGNI database (test, prod) PRIMA di avviare il backend nuovo:
-- lo schema non e' gestito da Hibernate (ddl-auto: none) e l'entity Giocatore ora legge
-- la colonna foto_version, quindi senza questo script ogni query sui giocatori va in errore.
-- Lo script e' idempotente (si puo' rieseguire senza danni).
-- ============================================================================

-- 1) Versione della foto: timestamp (ms) dell'ultimo caricamento, NULL se il giocatore non ha una foto
--    visibile. Viaggia nei DTO dei giocatori (liste leghe, profilo) e serve a sapere se mostrare la foto
--    e a invalidare la cache del client quando cambia. Il file vero sta in giocatore_foto.
ALTER TABLE giocatore ADD COLUMN IF NOT EXISTS foto_version BIGINT;

-- 2) Il file (JPEG 256x256, ~20-40 KB) in una tabella a parte, cosi' non viene mai caricato insieme al Giocatore.
--    nascosta : nascosta in automatico dopo N segnalazioni (vedi FotoProfiloService.SOGLIA_AUTO_NASCONDI), in attesa
--               che un admin decida; l'admin la vede comunque.
--    bloccata : l'admin ha rimosso la foto e vietato nuovi caricamenti a quel giocatore.
CREATE TABLE IF NOT EXISTS giocatore_foto (
    giocatore_id BIGINT PRIMARY KEY REFERENCES giocatore (id) ON DELETE CASCADE,
    data         BYTEA,
    updated_at   TIMESTAMP NOT NULL DEFAULT now(),
    nascosta     BOOLEAN   NOT NULL DEFAULT FALSE,
    bloccata     BOOLEAN   NOT NULL DEFAULT FALSE
);

-- 3) Segnalazioni: un giocatore puo' segnalare la foto di un altro una volta sola. Chi segnala smette subito
--    di vedere quella foto (e' il suo "blocco" personale).
CREATE TABLE IF NOT EXISTS foto_segnalazione (
    id             BIGSERIAL PRIMARY KEY,
    giocatore_id   BIGINT    NOT NULL REFERENCES giocatore (id) ON DELETE CASCADE,
    segnalatore_id BIGINT    NOT NULL REFERENCES giocatore (id) ON DELETE CASCADE,
    created_at     TIMESTAMP NOT NULL DEFAULT now(),
    CONSTRAINT uq_foto_segnalazione UNIQUE (giocatore_id, segnalatore_id)
);

CREATE INDEX IF NOT EXISTS idx_foto_segnalazione_giocatore ON foto_segnalazione (giocatore_id);
