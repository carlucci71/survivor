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
    user_id BIGINT NULL,
	stato char(1) not null
);
CREATE TABLE giocatore_lega (
    id_giocatore integer NOT NULL,
    id_lega integer NOT NULL,
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
	id char(3) primary key,
	nome varchar(100) not null,
	id_campionato varchar(20) not null
);
create table giocata(
	id serial primary key,
	giornata integer not null,
	id_giocatore integer not null,
	id_lega integer not null,
	id_squadra char(3) not null,
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
insert into campionato(id,id_sport,nome, num_giornate) values('SERIE_A','CALCIO','Serie A',38);
insert into squadra(id,nome,id_campionato) values('ATA','Atalanta','SERIE_A');
insert into squadra(id,nome,id_campionato) values('BOL','Bologna','SERIE_A');
insert into squadra(id,nome,id_campionato) values('CAG','Cagliari','SERIE_A');
insert into squadra(id,nome,id_campionato) values('COM','Como','SERIE_A');
insert into squadra(id,nome,id_campionato) values('CRE','Cremonese','SERIE_A');
insert into squadra(id,nome,id_campionato) values('FIO','Fiorentina','SERIE_A');
insert into squadra(id,nome,id_campionato) values('GEN','Genoa','SERIE_A');
insert into squadra(id,nome,id_campionato) values('INT','Inter','SERIE_A');
insert into squadra(id,nome,id_campionato) values('JUV','Juventus','SERIE_A');
insert into squadra(id,nome,id_campionato) values('LAZ','Lazio','SERIE_A');
insert into squadra(id,nome,id_campionato) values('LEC','Lecce','SERIE_A');
insert into squadra(id,nome,id_campionato) values('MIL','Milan','SERIE_A');
insert into squadra(id,nome,id_campionato) values('NAP','Napoli','SERIE_A');
insert into squadra(id,nome,id_campionato) values('PAR','Parma','SERIE_A');
insert into squadra(id,nome,id_campionato) values('PIS','Pisa','SERIE_A');
insert into squadra(id,nome,id_campionato) values('ROM','Roma','SERIE_A');
insert into squadra(id,nome,id_campionato) values('SAS','Sassuolo','SERIE_A');
insert into squadra(id,nome,id_campionato) values('TOR','Torino','SERIE_A');
insert into squadra(id,nome,id_campionato) values('UDI','Udinese','SERIE_A');
insert into squadra(id,nome,id_campionato) values('VER','Verona','SERIE_A');
insert into lega(id,nome,id_campionato,giornata_iniziale) values(1,'DDL','SERIE_A',13);
insert into giocatore(nome,stato,user_id) values('ALESSANDRO TOTO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANDREA MOSCHELLA','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANGELO MEZZA','E',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANTONIO POSSEMATO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANTONIO POSSEMATO JR','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANTONIO TOTO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('ANTONIO VISCOSI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('CARMINE ROSIELLO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('DANIELE CARLUCCI','A',
(select id from users where email = 'carlucci.daniele@gmail.com'));
insert into giocatore(nome,stato,user_id) values('DARIO D''ABBIERO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('EMILIO CUCCINIELLO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('FEDERICO CIAUDELLI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('GAETANO TURCO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('GEPPY MEZZA','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('GIUSEPPE DELLA VALLE','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('GIUSEPPE RAINONE','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('GIUSEPPE SILVESTRE','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('IGNAZIO GUELI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('IORIS BENENATI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('LEONARDO GALIETTA','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('LUIGI CERAVOLO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('LUIGI MATTEI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('MARCO BROVERO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('MARCO MEOLA','E',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('MARCO SACCONE','E',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('MICHELE DI LUISE','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('MICHELE GRASSO','E',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('NARDUCCIO VISCOSI','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('SALVATORE GALIETTA','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('UMBERTO CIROTA','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('VALERIO LEONE','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('VINCENZO D''ABBIERO','A',
(select id from users where email = ''));
insert into giocatore(nome,stato,user_id) values('VINCENZO RUSSO','A',
(select id from users where email = ''));
insert into giocatore_lega(id_giocatore,id_lega) values (1,1);
insert into giocatore_lega(id_giocatore,id_lega) values (2,1);
insert into giocatore_lega(id_giocatore,id_lega) values (3,1);
insert into giocatore_lega(id_giocatore,id_lega) values (4,1);
insert into giocatore_lega(id_giocatore,id_lega) values (5,1);
insert into giocatore_lega(id_giocatore,id_lega) values (6,1);
insert into giocatore_lega(id_giocatore,id_lega) values (7,1);
insert into giocatore_lega(id_giocatore,id_lega) values (8,1);
insert into giocatore_lega(id_giocatore,id_lega) values (9,1);
insert into giocatore_lega(id_giocatore,id_lega) values (10,1);
insert into giocatore_lega(id_giocatore,id_lega) values (11,1);
insert into giocatore_lega(id_giocatore,id_lega) values (12,1);
insert into giocatore_lega(id_giocatore,id_lega) values (13,1);
insert into giocatore_lega(id_giocatore,id_lega) values (14,1);
insert into giocatore_lega(id_giocatore,id_lega) values (15,1);
insert into giocatore_lega(id_giocatore,id_lega) values (16,1);
insert into giocatore_lega(id_giocatore,id_lega) values (17,1);
insert into giocatore_lega(id_giocatore,id_lega) values (18,1);
insert into giocatore_lega(id_giocatore,id_lega) values (19,1);
insert into giocatore_lega(id_giocatore,id_lega) values (20,1);
insert into giocatore_lega(id_giocatore,id_lega) values (21,1);
insert into giocatore_lega(id_giocatore,id_lega) values (22,1);
insert into giocatore_lega(id_giocatore,id_lega) values (23,1);
insert into giocatore_lega(id_giocatore,id_lega) values (24,1);
insert into giocatore_lega(id_giocatore,id_lega) values (25,1);
insert into giocatore_lega(id_giocatore,id_lega) values (26,1);
insert into giocatore_lega(id_giocatore,id_lega) values (27,1);
insert into giocatore_lega(id_giocatore,id_lega) values (28,1);
insert into giocatore_lega(id_giocatore,id_lega) values (29,1);
insert into giocatore_lega(id_giocatore,id_lega) values (30,1);
insert into giocatore_lega(id_giocatore,id_lega) values (31,1);
insert into giocatore_lega(id_giocatore,id_lega) values (32,1);
insert into giocatore_lega(id_giocatore,id_lega) values (33,1);
--GIORNATA 1
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (1,1,1,'GEN',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (2,1,2,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (3,1,3,'BOL',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (4,1,4,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (5,1,5,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (6,1,6,'MIL',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (7,1,7,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (8,1,8,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (9,1,9,'COM',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (10,1,10,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (11,1,11,'COM',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (12,1,12,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (13,1,13,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (14,1,14,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (15,1,15,'COM',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (16,1,16,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (17,1,17,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (18,1,18,'COM',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (19,1,19,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (20,1,20,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (21,1,21,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (22,1,22,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (23,1,23,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (24,1,24,'BOL',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (25,1,25,'BOL',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (26,1,26,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (27,1,27,'BOL',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (28,1,28,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (29,1,29,'JUV',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (30,1,30,'INT',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (31,1,31,'ATA',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (32,1,32,'COM',null,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (33,1,33,'COM',null,1);
--GIORNATA 2
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (65,2,1,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (66,2,2,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (67,2,4,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (68,2,5,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (69,2,6,'NAP',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (70,2,7,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (71,2,8,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (72,2,9,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (73,2,10,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (74,2,11,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (75,2,12,'INT',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (76,2,13,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (77,2,14,'UDI',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (78,2,15,'UDI',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (79,2,16,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (80,2,17,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (81,2,18,'MIL',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (82,2,19,'INT',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (83,2,20,'FIO',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (84,2,21,'MIL',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (85,2,22,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (86,2,23,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (87,2,26,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (88,2,28,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (89,2,29,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (90,2,30,'ROM',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (91,2,31,'INT',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (92,2,32,'PIS',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (93,2,33,'FIO',NULL,1);
--GIORNATA 3
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (94,3,18,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (95,3,19,'TOR',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (99,3,6,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (100,3,12,'ATA',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (101,3,31,'MIL',NULL,1);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito, id_lega) VALUES (102,3,21,'TOR',NULL,1);



SELECT setval('giocata_id_seq', (SELECT MAX(id) FROM giocata));






