-- Migration: fix nazione NULL per Premier League.
-- 'EN' non era presente nella tabella lookup "nazione" (fk_campionato_nazione/fk_squadra_nazione),
-- quindi gli insert originali con nazione='EN' fallivano. E' stata tolta la colonna nazione
-- dagli insert per farli passare, ma sul DB live la colonna non ha applicato il default 'IT'
-- (schema live divergente da db.sql, niente Flyway/Liquibase) ed è rimasta NULL.
-- Risultato: le query che confrontano squadra.nazione = campionato.nazione fallivano sempre,
-- perché in SQL NULL = NULL non è mai true.

insert into nazione(codice) values ('EN') on conflict do nothing;

update campionato set nazione = 'EN' where id = 'PREMIER_LEAGUE' and nazione is null;

update squadra set nazione = 'EN' where id_campionato = 'PREMIER_LEAGUE' and nazione is null;
