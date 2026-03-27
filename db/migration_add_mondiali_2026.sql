-- Migration: Mondiali 2026 Survivor
-- Aggiunge campionato, nazione e 48 squadre nazionali

-- 1. Nuova nazione per competizioni internazionali
INSERT INTO nazione (codice) VALUES ('MONDO')
ON CONFLICT (codice) DO NOTHING;

-- 2. Campionato Mondiali 2026 (8 giornate: 3 gironi + 5 knockout)
INSERT INTO campionato (id, id_sport, nome, nazione, num_giornate, anno_corrente)
VALUES ('MONDIALI_2026', 'CALCIO', 'FIFA World Cup 2026', 'MONDO', 8, 2026)
ON CONFLICT (id) DO NOTHING;

-- 3. 48 squadre nazionali (sigla = codice API Gazzetta)
-- Girone A
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('MES',   'Messico',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SAF',   'Sudafrica',                        'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('COR',   'Corea del Sud',                    'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('UEFAD', 'Vincitrice Spareggio UEFA D',       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone B
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('CAN',   'Canada',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('UEFAA', 'Vincitrice Spareggio UEFA A',       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('QAT',   'Qatar',                            'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SVI',   'Svizzera',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone C
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BRA',   'Brasile',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('MAR',   'Marocco',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SCO',   'Scozia',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('HAI',   'Haiti',                            'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone D
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('USA',   'Stati Uniti',                      'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('PAR',   'Paraguay',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('AUS',   'Australia',                        'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('UEFAC', 'Vincitrice Spareggio UEFA C',       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone E
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('GER',   'Germania',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('CUR',   'Curaçao',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('CIV',   'Costa d''Avorio',                  'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ECU',   'Ecuador',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone F
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('OLA',   'Olanda',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('JAP',   'Giappone',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('UEFAB', 'Vincitrice Spareggio UEFA B',       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('TUN',   'Tunisia',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone G
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('BEL',   'Belgio',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('EGI',   'Egitto',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('IRA',   'Iran',                             'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('NZE',   'Nuova Zelanda',                    'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone H
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SPA',   'Spagna',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('CPV',   'Capo Verde',                       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('URU',   'Uruguay',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SAU',   'Arabia Saudita',                   'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone I
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('FRA',   'Francia',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('SEN',   'Senegal',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('INT2',  'Sp. Intercontinentale 2',           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('NOR',   'Norvegia',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone J
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ARG',   'Argentina',                        'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ALG',   'Algeria',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('AUT',   'Austria',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('GIO',   'Giordania',                        'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone K
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('POR',   'Portogallo',                       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('INT1',  'Sp. Intercontinentale 1',           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('COL',   'Colombia',                         'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('UZB',   'Uzbekistan',                       'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
-- Girone L
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('ING',   'Inghilterra',                      'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('CRO',   'Croazia',                          'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('GHA',   'Ghana',                            'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
INSERT INTO squadra (sigla, nome, nazione, id_campionato) VALUES ('PAN',   'Panama',                           'MONDO', 'MONDIALI_2026') ON CONFLICT (sigla, nazione) DO NOTHING;
