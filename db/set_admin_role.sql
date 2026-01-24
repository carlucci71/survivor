-- Script per impostare un utente come ADMIN
-- Sostituisci 'tua-email@example.com' con la tua email

-- 1. Verifica lo stato attuale degli utenti
SELECT id, email, name, role, enabled
FROM users
ORDER BY id;

-- 2. Imposta come ADMIN l'utente con email specifica
-- IMPORTANTE: Sostituisci con la tua email!
UPDATE users
SET role = 'ADMIN'
WHERE email = 'ddario90@live.it';  -- <-- MODIFICA QUI CON LA TUA EMAIL

-- 3. Verifica che il ruolo sia stato aggiornato
SELECT id, email, name, role, enabled
FROM users
WHERE role = 'ADMIN';

-- Alternative: imposta ADMIN per ID utente
-- UPDATE users SET role = 'ADMIN' WHERE id = 1;

-- Verifica finale di tutti gli utenti
SELECT id, email, name, role, enabled
FROM users
ORDER BY id;

