-- ============================================================
-- ESEMPI QUERY PER SCHEDULER NOTIFICHE PUSH
-- ============================================================
-- Inserisci queste query nel tuo PartitaRepository/LegaRepository
-- e poi usa i metodi nello ScheduledPushNotifications.java
-- ============================================================

-- ------------------------------------------------------------
-- 1. TROVA PARTITE IN ARRIVO (T-1h) CON LEGHE ATTIVE
-- ------------------------------------------------------------
-- Aggiungi questo metodo in PartitaRepository.java:
/*
@Query("SELECT p FROM Partita p " +
       "WHERE p.orario BETWEEN :start AND :end " +
       "AND p.stato = 'DA_GIOCARE' " +
       "AND EXISTS (" +
       "  SELECT l FROM Lega l " +
       "  WHERE l.campionato.id = p.campionato.id " +
       "  AND l.stato IN ('DA_AVVIARE', 'AVVIATA')" +
       ")")
List<Partita> findUpcomingMatchesWithActiveLeagues(
    @Param("start") LocalDateTime start,
    @Param("end") LocalDateTime end
);
*/

-- Oppure con SQL nativo:
/*
SELECT p.*
FROM partita p
WHERE p.orario BETWEEN :start AND :end
  AND p.stato = 'Da giocare'
  AND EXISTS (
    SELECT 1
    FROM lega l
    WHERE l.id_campionato = p.id_campionato
      AND l.stato IN ('D', 'A')  -- DA_AVVIARE, AVVIATA
  );
*/


-- ------------------------------------------------------------
-- 2. TROVA UTENTI DA NOTIFICARE PER UNA PARTITA
-- ------------------------------------------------------------

-- STRATEGIA A: Tutti i membri ATTIVI delle leghe del campionato
/*
@Query("SELECT DISTINCT gl.giocatore.user.id FROM GiocatoreLega gl " +
       "WHERE gl.lega.campionato.id = :campionatoId " +
       "AND gl.stato = 'ATTIVO' " +
       "AND gl.lega.stato IN ('DA_AVVIARE', 'AVVIATA')")
List<Long> findUserIdsByCampionatoAndActive(@Param("campionatoId") String campionatoId);
*/

-- SQL nativo:
/*
SELECT DISTINCT g.user_id
FROM giocatore_lega gl
  INNER JOIN giocatore g ON g.id = gl.id_giocatore
  INNER JOIN lega l ON l.id = gl.id_lega
WHERE l.id_campionato = :campionatoId
  AND gl.stato = 'A'  -- ATTIVO
  AND l.stato IN ('D', 'A')  -- DA_AVVIARE, AVVIATA
  AND g.user_id IS NOT NULL;
*/


-- STRATEGIA B: Solo utenti che NON hanno ancora giocato la giornata corrente
/*
@Query("SELECT DISTINCT gl.giocatore.user.id FROM GiocatoreLega gl " +
       "WHERE gl.lega.campionato.id = :campionatoId " +
       "AND gl.stato = 'ATTIVO' " +
       "AND gl.lega.stato IN ('DA_AVVIARE', 'AVVIATA') " +
       "AND NOT EXISTS (" +
       "  SELECT g FROM Giocata g " +
       "  WHERE g.giocatore.id = gl.giocatore.id " +
       "  AND g.lega.id = gl.lega.id " +
       "  AND g.giornata = :giornata" +
       ")")
List<Long> findUserIdsWithoutPlayForRound(
    @Param("campionatoId") String campionatoId,
    @Param("giornata") int giornata
);
*/


-- STRATEGIA C: Solo leader delle leghe (per notifiche admin)
/*
@Query("SELECT DISTINCT gl.giocatore.user.id FROM GiocatoreLega gl " +
       "WHERE gl.lega.campionato.id = :campionatoId " +
       "AND gl.ruolo = 'LEADER' " +
       "AND gl.lega.stato IN ('DA_AVVIARE', 'AVVIATA')")
List<Long> findLeaderUserIdsByCampionato(@Param("campionatoId") String campionatoId);
*/


-- ------------------------------------------------------------
-- 3. EVITARE NOTIFICHE DUPLICATE (opzionale)
-- ------------------------------------------------------------
-- Se vuoi evitare di inviare più volte la stessa notifica,
-- aggiungi una colonna alla tabella partita:

/*
ALTER TABLE partita ADD COLUMN notification_sent BOOLEAN DEFAULT FALSE;

-- Poi nella query:
SELECT p.*
FROM partita p
WHERE p.orario BETWEEN :start AND :end
  AND p.stato = 'Da giocare'
  AND p.notification_sent = FALSE
  AND EXISTS (
    SELECT 1 FROM lega l
    WHERE l.id_campionato = p.id_campionato
    AND l.stato IN ('D', 'A')
  );

-- E dopo aver inviato la notifica:
UPDATE partita SET notification_sent = TRUE WHERE id = :partitaId;
*/


-- ------------------------------------------------------------
-- 4. TROVA GIORNATA CORRENTE DI UNA LEGA
-- ------------------------------------------------------------
-- Se hai bisogno di sapere quale giornata sta giocando una lega:

/*
SELECT
  CASE
    WHEN l.giornata_calcolata IS NULL THEN l.giornata_iniziale
    ELSE l.giornata_calcolata + 1
  END as giornata_corrente
FROM lega l
WHERE l.id = :legaId;
*/


-- ------------------------------------------------------------
-- 5. ESEMPIO COMPLETO: TROVA PARTITE E UTENTI IN UN COLPO SOLO
-- ------------------------------------------------------------
-- Query complessa che restituisce partite + count utenti da notificare:

/*
SELECT
  p.id,
  p.orario,
  p.casa_nome,
  p.fuori_nome,
  p.id_campionato,
  COUNT(DISTINCT g.user_id) as utenti_da_notificare
FROM partita p
  INNER JOIN lega l ON l.id_campionato = p.id_campionato
  INNER JOIN giocatore_lega gl ON gl.id_lega = l.id
  INNER JOIN giocatore g ON g.id = gl.id_giocatore
WHERE p.orario BETWEEN :start AND :end
  AND p.stato = 'Da giocare'
  AND l.stato IN ('D', 'A')
  AND gl.stato = 'A'
  AND g.user_id IS NOT NULL
GROUP BY p.id, p.orario, p.casa_nome, p.fuori_nome, p.id_campionato
HAVING COUNT(DISTINCT g.user_id) > 0
ORDER BY p.orario ASC;
*/


-- ------------------------------------------------------------
-- 6. TEST QUERY: Controlla token push attivi per utente
-- ------------------------------------------------------------
-- Per verificare che la registrazione funzioni:

/*
SELECT u.id, u.email, u.name, pt.token, pt.platform, pt.active, pt.last_used_at
FROM users u
  INNER JOIN push_token pt ON pt.user_id = u.id
WHERE u.id = :userId
  AND pt.active = true
ORDER BY pt.last_used_at DESC;
*/


-- ============================================================
-- SUGGERIMENTI IMPLEMENTAZIONE
-- ============================================================

-- 1. Nel tuo PartitaRepository.java aggiungi:
--    - findUpcomingMatchesWithActiveLeagues(start, end)
--
-- 2. Crea un nuovo repository o metodo custom per:
--    - findUserIdsByCampionatoAndActive(campionatoId)
--
-- 3. Nello ScheduledPushNotifications.java:
--    - Chiama il primo metodo per trovare le partite
--    - Per ogni partita, chiama il secondo metodo per trovare gli utenti
--    - Usa pushNotificationService.sendNotificationToUsers(userIds, notification)
--
-- 4. Testa con query manuali prima di attivare lo scheduler:
--    - Verifica che le partite vengano trovate
--    - Verifica che gli utenti vengano trovati
--    - Verifica che i token push siano registrati

-- ============================================================
