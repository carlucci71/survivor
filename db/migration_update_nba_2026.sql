-- Migration: avanzamento dell'NBA alla stagione 2026/27
-- Gazzetta ha pubblicato il calendario (regular season dal 20/10/2026). EnumAPI2.NBA_RS ha gia'
-- l'anno 2026. Dopo l'esecuzione riavviare il backend (o svuotare la cache dei campionati)
-- per ricaricare il calendario.
--
-- Senza questo update la "settimana 1" legge dal DB le partite TERMINATE della stagione 2025/26
-- e non riscarica nulla dal web: il campionato risulta "Schedule not available yet".
-- Le squadre NBA non vanno toccate: se per l'anno nuovo non ci sono ancora partite il backend
-- usa tutte le squadre registrate (SquadraService.getSquadreByCampionatoId).

-- 1. Anno corrente alla stagione 2026/27
update campionato set anno_corrente = 2026 where id = 'NBA_RS';

-- 2. Pulizia delle partite NBA salvate con anno 2026 PRIMA dell'inizio della stagione.
-- In test erano finite sotto il 2026 le partite della stagione 2025/26 (copie di quelle gia'
-- presenti con anno 2025, tutte TERMINATE) piu' qualche settimana della nuova stagione.
-- Le TERMINATE non vengono mai riscaricate da Gazzetta (PartitaService.aggiornaPartitaSuDB e
-- UtilCalendarioService.partiteCampionatoDellaGiornataWithRefreshFromWeb), quindi le settimane
-- 1-26 del 2026 restavano quelle vecchie e la creazione di leghe NBA era bloccata.
-- Le partite si riscaricano da sole al primo caricamento dei campionati. Non toccare le righe
-- con anno 2025 (storico) ne' quelle CALENDARIO_MOCK.
--
-- ATTENZIONE: prima di eseguirla controllare che non ci siano leghe NBA con anno 2026 gia' avviate:
--   select id, name, anno, stato, giornata_iniziale from lega where id_campionato = 'NBA_RS' and anno = 2026;
-- Una lega non ancora avviata (stato 'D') non perde nulla, ma se ha giornata_iniziale fuori dal
-- calendario va sistemata a parte.
delete from partita
where id_campionato = 'NBA_RS'
  and anno = 2026
  and implementation_external_api = 'CALENDARIO_API2';
