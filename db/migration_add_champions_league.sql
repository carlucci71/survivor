-- Migration: UEFA Champions League 2026/27 — torneo completo, 17 giornate
-- (8 fase a campionato + 9 fase a eliminazione diretta: playoff, ottavi, quarti, semifinali,
-- finale, ognuna andata/ritorno tranne la finale). Vedi EnumAPI2.RoundChampionsLeague lato
-- backend — i dati delle giornate 9-17 non sono ancora pubblicati da Gazzetta, arriveranno
-- più avanti nella stagione.

-- 1. Nazione dedicata alle competizioni UEFA per club (evita collisioni sigla+nazione con le
--    squadre già censite negli altri campionati nazionali, es. sigla 'INT' già usata da Serie A)
INSERT INTO nazione (codice) VALUES ('UEFA')
ON CONFLICT (codice) DO NOTHING;

-- 2. Campionato Champions League (competitionId Gazzetta = 5, stesso id per qualificazioni e
--    fase a campionato: cambia solo phase/subphase nella chiamata)
INSERT INTO campionato (id, id_sport, nome, nazione, num_giornate, anno_corrente)
VALUES ('CHAMPIONS_LEAGUE', 'CALCIO', 'UEFA Champions League', 'UEFA', 17, 2026)
ON CONFLICT (id) DO NOTHING;

-- 3. 36 squadre della fase a campionato 2026/27 (sigla = nome enum SquadreChampionsLeague_API2)
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ARS', 'Arsenal',              'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('AST', 'Aston Villa',          'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ATM', 'Atletico Madrid',      'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BAR', 'Barcellona',           'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BET', 'Real Betis',           'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('VIL', 'Villarreal',           'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('RMA', 'Real Madrid',          'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('INT', 'Inter',                'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('NAP', 'Napoli',               'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ROM', 'Roma',                 'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('COM', 'Como',                 'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('LIV', 'Liverpool',            'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('MNC', 'Manchester City',      'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('MNU', 'Manchester United',    'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;

-- Nuovi (nessun logo ancora presente in TeamLogoService — vedi frontend)
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('AEK', 'AEK Atene',            'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BMU', 'Bayern Monaco',        'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BOD', 'Bodo/Glimt',           'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BDO', 'Borussia Dortmund',    'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BRU', 'Bruges',               'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('FEN', 'Fenerbahce',           'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('FEY', 'Feyenoord',            'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('GAL', 'Galatasaray',          'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('LIZ', 'LASK',                 'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('LEN', 'Lens',                 'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('LIL', 'Lille',                'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('LEI', 'Lipsia',               'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('PSG', 'Paris Saint-Germain',  'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('PTO', 'Porto',                'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('PSV', 'PSV Eindhoven',        'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SAB', 'Sabah',                'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SDK', 'Shakhtar Donetsk',     'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SLP', 'Slavia Praga',         'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BRT', 'Slovan Bratislava',    'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SCP', 'Sporting Lisbona',     'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('STO', 'Stoccarda',            'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('VIS', 'Viking',               'UEFA', 'CHAMPIONS_LEAGUE') ON CONFLICT (sigla, nazione) DO NOTHING;
