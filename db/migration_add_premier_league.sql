-- Migration: aggiungi Premier League (English Premier League) come campionato

insert into campionato(id, id_sport, nome, num_giornate, nazione, anno_corrente) values ('PREMIER_LEAGUE', 'CALCIO', 'Premier League', 38, 'EN', 2026);

-- Squadre storiche 2025/26 e promosse 2026/27 (competitionId=8 API Gazzetta)
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('ARS',  'Arsenal',            'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('AST',  'Aston Villa',         'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('AFC',  'Bournemouth',         'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('BRE',  'Brentford',           'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('BHA',  'Brighton',            'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('BNY',  'Burnley',             'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('CHL',  'Chelsea',             'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('COV',  'Coventry City',       'PREMIER_LEAGUE', 'EN', 2026);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('CPL',  'Crystal Palace',      'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('EVT',  'Everton',             'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('FUL',  'Fulham',              'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('HUL',  'Hull City',           'PREMIER_LEAGUE', 'EN', 2026);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('IPS',  'Ipswich Town',        'PREMIER_LEAGUE', 'EN', 2026);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('LDS',  'Leeds United',        'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('LIV',  'Liverpool',           'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('MNC',  'Manchester City',     'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('MNU',  'Manchester United',   'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('NEW',  'Newcastle United',    'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('NOF',  'Nottingham Forest',   'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('SUN',  'Sunderland',          'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('TOT',  'Tottenham Hotspur',   'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('WHU',  'West Ham United',     'PREMIER_LEAGUE', 'EN', 2025);
insert into squadra(sigla, nome, id_campionato, nazione, anno) values ('WOL',  'Wolverhampton',       'PREMIER_LEAGUE', 'EN', 2025);
