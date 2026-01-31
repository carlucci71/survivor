-- ============================================
-- TEST QUERY PER SISTEMA TROFEI
-- ============================================

-- 1. VERIFICA CHE LA MIGRATION SIA STATA APPLICATA
-- Dovrebbe restituire 1 riga con column_name = 'posizione_finale'
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'giocatore_lega'
AND column_name = 'posizione_finale';


-- 2. VEDI TUTTE LE POSIZIONI FINALI ASSEGNATE
-- Mostra chi ha vinto cosa
SELECT
    g.nome AS giocatore,
    l.name AS lega,
    l.edizione,
    l.anno,
    gl.posizione_finale AS posizione,
    CASE
        WHEN gl.posizione_finale = 1 THEN '🥇 VINCITORE'
        WHEN gl.posizione_finale = 2 THEN '🥈 SECONDO'
        WHEN gl.posizione_finale = 3 THEN '🥉 TERZO'
        ELSE CAST(gl.posizione_finale AS TEXT) || '° posto'
    END AS medaglia
FROM giocatore_lega gl
JOIN giocatore g ON g.id = gl.id_giocatore
JOIN lega l ON l.id = gl.id_lega
WHERE gl.posizione_finale IS NOT NULL
ORDER BY l.anno DESC, l.edizione DESC, gl.posizione_finale ASC;


-- 3. CONTA I TROFEI PER GIOCATORE
-- Vedi chi ha vinto di più
SELECT
    g.nome AS giocatore,
    COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) AS vittorie,
    COUNT(CASE WHEN gl.posizione_finale <= 3 THEN 1 END) AS podi,
    COUNT(gl.posizione_finale) AS tornei_con_posizione
FROM giocatore g
LEFT JOIN giocatore_lega gl ON g.id = gl.id_giocatore
GROUP BY g.id, g.nome
HAVING COUNT(gl.posizione_finale) > 0
ORDER BY vittorie DESC, podi DESC;


-- 4. TROFEI DI UN GIOCATORE SPECIFICO
-- Sostituisci <GIOCATORE_ID> con l'ID del giocatore
SELECT
    l.name AS lega,
    l.edizione,
    l.anno,
    c.nome AS campionato,
    s.nome AS sport,
    gl.posizione_finale AS posizione,
    (SELECT COUNT(*)
     FROM giocata gio
     WHERE gio.id_giocatore = g.id
     AND gio.id_lega = l.id) AS giornate_giocate
FROM giocatore_lega gl
JOIN giocatore g ON g.id = gl.id_giocatore
JOIN lega l ON l.id = gl.id_lega
JOIN campionato c ON l.id_campionato = c.id
JOIN sport s ON c.id_sport = s.id
WHERE g.id = <GIOCATORE_ID>
AND gl.posizione_finale IS NOT NULL
ORDER BY l.anno DESC, l.edizione DESC;


-- 5. CLASSIFICA GLOBALE
-- I migliori giocatori dell'app
SELECT
    g.nome AS giocatore,
    COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) AS vittorie,
    COUNT(CASE WHEN gl.posizione_finale = 2 THEN 1 END) AS secondi_posti,
    COUNT(CASE WHEN gl.posizione_finale = 3 THEN 1 END) AS terzi_posti,
    COUNT(CASE WHEN gl.posizione_finale <= 3 THEN 1 END) AS podi_totali,
    COUNT(CASE WHEN gl.posizione_finale IS NOT NULL THEN 1 END) AS tornei_completati,
    ROUND(
        CAST(COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) AS DECIMAL) /
        NULLIF(COUNT(CASE WHEN gl.posizione_finale IS NOT NULL THEN 1 END), 0) * 100,
        1
    ) AS win_rate_percentuale
FROM giocatore g
LEFT JOIN giocatore_lega gl ON g.id = gl.id_giocatore
GROUP BY g.id, g.nome
HAVING COUNT(gl.posizione_finale) > 0
ORDER BY vittorie DESC, podi_totali DESC, win_rate_percentuale DESC;


-- 6. VERIFICA LEGHE TERMINATE SENZA POSIZIONI
-- Trova leghe terminate che potrebbero aver bisogno di essere ri-terminate
SELECT
    l.id,
    l.name,
    l.edizione,
    l.anno,
    l.stato,
    COUNT(gl.id_giocatore) AS num_giocatori,
    COUNT(gl.posizione_finale) AS giocatori_con_posizione
FROM lega l
JOIN giocatore_lega gl ON gl.id_lega = l.id
WHERE l.stato = 'T' -- T = TERMINATA
GROUP BY l.id, l.name, l.edizione, l.anno, l.stato
HAVING COUNT(gl.posizione_finale) = 0;


-- 7. ASSEGNA MANUALMENTE POSIZIONI A UNA LEGA (SE NECESSARIO)
-- ATTENZIONE: Usa solo se una vecchia lega terminata non ha posizioni!
-- Sostituisci <LEGA_ID> con l'ID della lega

/*
-- Prima vedi la classifica attuale
SELECT
    gl.id_giocatore,
    g.nome,
    gl.stato,
    COUNT(gio.id) AS giocate
FROM giocatore_lega gl
JOIN giocatore g ON g.id = gl.id_giocatore
LEFT JOIN giocata gio ON gio.id_giocatore = g.id AND gio.id_lega = gl.id_lega
WHERE gl.id_lega = <LEGA_ID>
GROUP BY gl.id_giocatore, g.nome, gl.stato
ORDER BY
    CASE gl.stato
        WHEN 'A' THEN 1  -- ATTIVO
        WHEN 'E' THEN 2  -- ELIMINATO
        ELSE 3
    END,
    COUNT(gio.id) DESC,
    g.nome;

-- Poi assegna manualmente le posizioni in base all'ordine sopra
-- UPDATE giocatore_lega
-- SET posizione_finale = 1
-- WHERE id_giocatore = <ID_VINCITORE> AND id_lega = <LEGA_ID>;
--
-- UPDATE giocatore_lega
-- SET posizione_finale = 2
-- WHERE id_giocatore = <ID_SECONDO> AND id_lega = <LEGA_ID>;
--
-- ... e così via
*/


-- 8. STATISTICHE GENERALI SISTEMA TROFEI
SELECT
    COUNT(DISTINCT l.id) AS leghe_terminate,
    COUNT(DISTINCT CASE WHEN gl.posizione_finale IS NOT NULL THEN l.id END) AS leghe_con_trofei,
    COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) AS vincitori_totali,
    COUNT(CASE WHEN gl.posizione_finale IS NOT NULL THEN 1 END) AS posizioni_assegnate
FROM lega l
LEFT JOIN giocatore_lega gl ON gl.id_lega = l.id
WHERE l.stato = 'T'; -- T = TERMINATA


-- 9. TROFEI PER SPORT
-- Vedi chi domina in ogni sport
SELECT
    s.nome AS sport,
    g.nome AS giocatore,
    COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) AS vittorie
FROM sport s
JOIN campionato c ON c.id_sport = s.id
JOIN lega l ON l.id_campionato = c.id
JOIN giocatore_lega gl ON gl.id_lega = l.id
JOIN giocatore g ON g.id = gl.id_giocatore
WHERE gl.posizione_finale = 1
GROUP BY s.nome, g.nome
HAVING COUNT(CASE WHEN gl.posizione_finale = 1 THEN 1 END) > 0
ORDER BY s.nome, vittorie DESC;


-- 10. CLEANUP (SOLO SE SERVE RESETTARE)
-- ATTENZIONE: Rimuove TUTTE le posizioni finali!
/*
UPDATE giocatore_lega
SET posizione_finale = NULL;
*/
