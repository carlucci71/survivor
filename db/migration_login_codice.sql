-- Login con codice a 6 cifre (MagicLinkService.verificaCodice, POST /auth/verify-code).
-- Da eseguire PRIMA del deploy del backend che contiene la funzione (ddl-auto: none).
-- Le righe esistenti restano valide: codice_hash NULL = token senza codice (solo link).

ALTER TABLE magic_link_tokens ADD COLUMN IF NOT EXISTS codice_hash VARCHAR(100);
ALTER TABLE magic_link_tokens ADD COLUMN IF NOT EXISTS tentativi_codice INTEGER NOT NULL DEFAULT 0;
