-- Migration: email unique constraint case-insensitive
-- Problema: il vincolo UNIQUE standard di PostgreSQL è case-sensitive,
-- permettendo duplicati come "Mario@mail.com" e "mario@mail.com".
-- Soluzione: sostituire con un indice unique su lower(email).

-- 1. Prima normalizza tutte le email esistenti in lowercase (sicurezza)
UPDATE users SET email = lower(email) WHERE email != lower(email);

-- 2. Rimuovi il vecchio constraint unique (se presente come named constraint)
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_email_unique;

-- 3. Rimuovi il vecchio indice semplice sull'email (se presente)
DROP INDEX IF EXISTS idx_users_email;

-- 4. Crea il nuovo indice unique case-insensitive
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_lower ON users (lower(email));
