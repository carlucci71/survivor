-- Migration: avanzamento alla stagione 2026/27 per Serie A, Liga e Premier League
-- Eseguire DOPO migration_add_premier_league.sql

-- 1. Aggiorna anno corrente alla stagione 2026/27
update campionato set anno_corrente = 2026 where id in ('SERIE_A', 'LIGA', 'PREMIER_LEAGUE');

-- 2. Nuove squadre Serie A 2026/27 (promosse dalla Serie B)
-- Frosinone promosso (FRO già presente in SERIE_B, aggiungiamo per SERIE_A)
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('FRO', 'Frosinone', 'SERIE_A', 'IT', 2026)
  on conflict do nothing;

-- 3. Nuove squadre Liga 2026/27 (promosse / nuovi ingressi)
-- Barcelona cambia codice API da BAR a FCB: già gestito nell'enum (BAR → siglaEsterna FCB)
-- Nuove promosse
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('CEL', 'Celta de Vigo',       'LIGA', 'ES', 2026) on conflict do nothing;
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('DEP', 'Deportivo Coruña',    'LIGA', 'ES', 2026) on conflict do nothing;
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('MAL', 'Málaga',              'LIGA', 'ES', 2026) on conflict do nothing;
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('RAC', 'Racing Santander',    'LIGA', 'ES', 2026) on conflict do nothing;
