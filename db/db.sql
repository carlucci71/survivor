drop table if exists giocata;
drop table if exists giocatore_lega;
drop table if exists giocatore;
drop table if exists lega;
drop table if exists squadra;
drop table if exists campionato;
drop table if exists sport;
DROP TABLE if exists param_log_dispositiva;
DROP TABLE if exists log_dispositiva;

create table lega(
	id serial primary key,
	giornata_iniziale  integer NOT NULL,
	giornata_calcolata  integer NULL,
	nome varchar(100) not null,
	id_campionato varchar(20) not null
);
create table giocatore(
	id serial primary key,
	nome varchar(100) not null,
    user_id BIGINT NULL
);
CREATE TABLE giocatore_lega (
    id_giocatore integer NOT NULL,
    id_lega integer NOT NULL,
	stato char(1) not null,
    PRIMARY KEY (id_giocatore, id_lega)
);
create table sport(
	id varchar(20) primary key,
	nome varchar(100) not null
);
create table campionato(
	id varchar(20) primary key,
	id_sport varchar(20) not null,
	nome varchar(100) not null,
	num_giornate integer not null
);
create table squadra(
	id serial primary key,
	sigla char(3),
	nome varchar(100) not null,
	id_campionato varchar(20) not null
);
create table giocata(
	id serial primary key,
	giornata integer not null,
	id_giocatore integer not null,
	id_lega integer not null,
	id_squadra integer not null,
	esito char(2)
);
CREATE TABLE log_dispositiva (
	id serial primary key,
    tipologia VARCHAR(100) NOT NULL,
    esito VARCHAR(100) NOT null,
    timestamp timestamp,
    messaggio varchar(1000),
    id_errore BIGINT,
    user_id BIGINT NOT NULL
);

CREATE TABLE param_log_dispositiva (
	id serial primary key,
    nome VARCHAR(100) NOT NULL,
    valore VARCHAR(100) NOT NULL,
    class_name VARCHAR(1000) NOT NULL,
    id_log_dispositiva INTEGER NOT NULL
);

ALTER TABLE lega
ADD CONSTRAINT fk_lega_campionato
FOREIGN KEY (id_campionato) REFERENCES campionato(id);
ALTER TABLE campionato
ADD CONSTRAINT fk_campionato_sport
FOREIGN KEY (id_sport) REFERENCES sport(id);
ALTER TABLE squadra
ADD CONSTRAINT fk_squadra_campionato
FOREIGN KEY (id_campionato) REFERENCES campionato(id);
ALTER TABLE giocata
ADD CONSTRAINT fk_giocata_giocatore
FOREIGN KEY (id_giocatore) REFERENCES giocatore(id);
ALTER TABLE giocata
ADD CONSTRAINT fk_giocata_squadra
FOREIGN KEY (id_squadra) REFERENCES squadra(id);
ALTER TABLE giocatore
ADD CONSTRAINT fk_giocatore_user
FOREIGN KEY (user_id) REFERENCES users(id);

alter TABLE giocatore_lega 
ADD CONSTRAINT fk_giocatore FOREIGN KEY (id_giocatore) REFERENCES giocatore(id);

alter TABLE giocatore_lega 
ADD CONSTRAINT fk_lega FOREIGN KEY (id_lega) REFERENCES lega(id);

ALTER TABLE log_dispositiva
ADD CONSTRAINT fk_log_dispositiva_users
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE param_log_dispositiva
ADD CONSTRAINT fk_param_log_dispositiva_log_dispositiva
FOREIGN KEY (id_log_dispositiva) REFERENCES log_dispositiva(id);

insert into sport(id,nome) values('CALCIO','Calcio');
insert into sport(id,nome) values('BASKET','Basket');
insert into campionato(id,id_sport,nome, num_giornate) values('SERIE_A','CALCIO','Serie A',38);
insert into campionato(id,id_sport,nome, num_giornate) values('NBA','BASKET','NBA',38);
insert into squadra(sigla,nome,id_campionato) values('ATA','Atalanta','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('BOL','Bologna','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('CAG','Cagliari','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('COM','Como','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('CRE','Cremonese','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('FIO','Fiorentina','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('GEN','Genoa','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('INT','Inter','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('JUV','Juventus','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('LAZ','Lazio','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('LEC','Lecce','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('MIL','Milan','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('NAP','Napoli','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('PAR','Parma','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('PIS','Pisa','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('ROM','Roma','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('SAS','Sassuolo','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('TOR','Torino','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('UDI','Udinese','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('VER','Verona','SERIE_A');
insert into squadra(sigla,nome,id_campionato) values('DET','Detroit Pistons','NBA');
insert into squadra(sigla, nome,id_campionato) values('NYK','New York Knicks','NBA');
insert into squadra(sigla, nome,id_campionato) values('TOR','Toronto Raptors','NBA');
insert into squadra(sigla, nome,id_campionato) values('BOS','Boston Celtics','NBA');
insert into squadra(sigla, nome,id_campionato) values('PHI','Philadelphia 76ers','NBA');
insert into squadra(sigla, nome,id_campionato) values('ORL','Orlando Magic','NBA');
insert into squadra(sigla, nome,id_campionato) values('MIA','Miami Heat','NBA');
insert into squadra(sigla, nome,id_campionato) values('CLE','Cleveland Cavaliers','NBA');
insert into squadra(sigla, nome,id_campionato) values('ATL','Atlanta Hawks','NBA');
insert into squadra(sigla, nome,id_campionato) values('CHI','Chicago Bulls','NBA');
insert into squadra(sigla, nome,id_campionato) values('MIL','Milwaukee Bucks','NBA');
insert into squadra(sigla, nome,id_campionato) values('CHA','Charlotte Hornets','NBA');
insert into squadra(sigla, nome,id_campionato) values('BKN','Brooklyn Nets','NBA');
insert into squadra(sigla,nome,id_campionato) values('IND','Indiana Pacers','NBA');
insert into squadra(sigla,nome,id_campionato) values('WAS','Washington Wizards','NBA');
insert into squadra(sigla,nome,id_campionato) values('OKC','Oklahoma City Thunder','NBA');
insert into squadra(sigla,nome,id_campionato) values('DEN','Denver Nuggets','NBA');
insert into squadra(sigla,nome,id_campionato) values('SAS','San Antonio Spurs','NBA');
insert into squadra(sigla,nome,id_campionato) values('LAL','Los Angeles Lakers','NBA');
insert into squadra(sigla,nome,id_campionato) values('HOU','Houston Rockets','NBA');
insert into squadra(sigla,nome,id_campionato) values('MIN','Minnesota Timberwolves','NBA');
insert into squadra(sigla,nome,id_campionato) values('PHX','Phoenix Suns','NBA');
insert into squadra(sigla,nome,id_campionato) values('MEM','Memphis Grizzlies','NBA');
insert into squadra(sigla,nome,id_campionato) values('GSW','Golden State Warriors','NBA');
insert into squadra(sigla,nome,id_campionato) values('POR','Portland Trail Blazers','NBA');
insert into squadra(sigla,nome,id_campionato) values('DAL','Dallas Mavericks','NBA');
insert into squadra(sigla,nome,id_campionato) values('UTA','Utah Jazz','NBA');
insert into squadra(sigla,nome,id_campionato) values('LAC','Los Angeles Clippers','NBA');
insert into squadra(sigla,nome,id_campionato) values('SAC','Sacramento Kings','NBA');
insert into squadra(sigla,nome,id_campionato) values('NOP','New Orleans Pelicans','NBA');


INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (1,13,16,'DDL','SERIE_A');


insert into giocatore(nome,user_id) values('ALESSANDRO TOTO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANDREA MOSCHELLA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANGELO MEZZA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANTONIO POSSEMATO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANTONIO POSSEMATO JR',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANTONIO TOTO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('ANTONIO VISCOSI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('CARMINE ROSIELLO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('DANIELE CARLUCCI',
(select id from users where email = 'carlucci.daniele@gmail.com'));
insert into giocatore(nome,user_id) values('DARIO D''ABBIERO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('EMILIO CUCCINIELLO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('FEDERICO CIAUDELLI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('GAETANO TURCO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('GEPPY MEZZA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('GIUSEPPE DELLA VALLE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('GIUSEPPE RAINONE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('GIUSEPPE SILVESTRE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('IGNAZIO GUELI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('IORIS BENENATI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('LEONARDO GALIETTA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('LUIGI CERAVOLO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('LUIGI MATTEI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('MARCO BROVERO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('MARCO MEOLA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('MARCO SACCONE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('MICHELE DI LUISE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('MICHELE GRASSO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('NARDUCCIO VISCOSI',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('SALVATORE GALIETTA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('UMBERTO CIROTA',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('VALERIO LEONE',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('VINCENZO D''ABBIERO',
(select id from users where email = ''));
insert into giocatore(nome,user_id) values('VINCENZO RUSSO',
(select id from users where email = ''));
insert into giocatore_lega(id_giocatore,id_lega,stato) values (1,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (2,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (3,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (4,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (5,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (6,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (7,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (8,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (9,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (10,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (11,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (12,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (13,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (14,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (15,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (16,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (17,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (18,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (19,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (20,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (21,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (22,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (23,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (24,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (25,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (26,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (27,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (28,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (29,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (30,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (31,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (32,1,'A');
insert into giocatore_lega(id_giocatore,id_lega,stato) values (33,1,'A');

--GIORNATA 1
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (1,1,1,(select id from squadra where sigla = 'GEN' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (2,1,2,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (3,1,3,(select id from squadra where sigla = 'BOL' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (4,1,4,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (5,1,5,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (6,1,6,(select id from squadra where sigla = 'MIL' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (7,1,7,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (8,1,8,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (9,1,9,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (10,1,10,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (11,1,11,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (12,1,12,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (13,1,13,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (14,1,14,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (15,1,15,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (16,1,16,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (17,1,17,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (18,1,18,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (19,1,19,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (20,1,20,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (21,1,21,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (22,1,22,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (23,1,23,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (24,1,24,(select id from squadra where sigla = 'BOL' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (25,1,25,(select id from squadra where sigla = 'BOL' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (26,1,26,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (27,1,27,(select id from squadra where sigla = 'BOL' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (28,1,28,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (29,1,29,(select id from squadra where sigla = 'JUV' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (30,1,30,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (31,1,31,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (32,1,32,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (33,1,33,(select id from squadra where sigla = 'COM' and id_campionato = 'SERIE_A'),null,1);
--GIORNATA 2
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (65,2,1,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (66,2,2,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (67,2,4,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (68,2,5,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (69,2,6,(select id from squadra where sigla = 'NAP' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (70,2,7,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (71,2,8,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (72,2,9,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (73,2,10,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (74,2,11,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (75,2,12,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (76,2,13,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (77,2,14,(select id from squadra where sigla = 'UDI' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (78,2,15,(select id from squadra where sigla = 'UDI' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (79,2,16,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (80,2,17,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (81,2,18,(select id from squadra where sigla = 'MIL' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (82,2,19,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (83,2,20,(select id from squadra where sigla = 'FIO' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (84,2,21,(select id from squadra where sigla = 'MIL' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (85,2,22,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (86,2,23,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (87,2,26,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (88,2,28,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (89,2,29,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (90,2,30,(select id from squadra where sigla = 'ROM' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (91,2,31,(select id from squadra where sigla = 'INT' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (92,2,32,(select id from squadra where sigla = 'PIS' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (93,2,33,(select id from squadra where sigla = 'FIO' and id_campionato = 'SERIE_A'),NULL,1);
--GIORNATA 3
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (94,3,18,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (95,3,19,(select id from squadra where sigla = 'TOR' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (99,3,6,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (100,3,12,(select id from squadra where sigla = 'ATA' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (101,3,31,(select id from squadra where sigla = 'MIL' and id_campionato = 'SERIE_A'),NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (102,3,21,(select id from squadra where sigla = 'TOR' and id_campionato = 'SERIE_A'),NULL,1);



SELECT setval('giocata_id_seq', (SELECT MAX(id) FROM giocata));

