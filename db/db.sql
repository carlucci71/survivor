drop table if exists giocata;
drop table if exists giocatore_lega;
drop table if exists giocatore;
drop table if exists lega;
drop table if exists squadra;
drop table if exists campionato;
drop table if exists sport;

create table lega(
	id serial primary key,
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
	nome varchar(100) not null
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
	id_squadra char(3) not null,
	esito char(2)
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


insert into sport(id,nome) values('CALCIO','Calcio');
insert into campionato(id,id_sport,nome) values('SERIE_A','CALCIO','Serie A');
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
insert into lega(id,nome,id_campionato) values(1,'DDL','SERIE_A');
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
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (1,1,1,'GEN','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (2,1,2,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (3,1,3,'BOL','KO');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (4,1,4,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (5,1,5,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (6,1,6,'MIL','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (7,1,7,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (8,1,8,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (9,1,9,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (10,1,10,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (11,1,11,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (12,1,12,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (13,1,13,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (14,1,14,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (15,1,15,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (16,1,16,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (17,1,17,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (18,1,18,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (19,1,19,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (20,1,20,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (21,1,21,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (22,1,22,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (23,1,23,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (24,1,24,'BOL','KO');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (25,1,25,'BOL','KO');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (26,1,26,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (27,1,27,'BOL','KO');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (28,1,28,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (29,1,29,'JUV','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (30,1,30,'INT','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (31,1,31,'ATA','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (32,1,32,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (33,1,33,'COM','OK');
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (65,2,1,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (66,2,2,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (67,2,4,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (68,2,5,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (69,2,6,'NAP',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (70,2,7,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (71,2,8,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (72,2,9,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (73,2,10,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (74,2,11,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (75,2,12,'INT',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (76,2,13,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (77,2,14,'UDI',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (78,2,15,'UDI',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (79,2,16,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (80,2,17,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (81,2,18,'MIL',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (82,2,19,'INT',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (83,2,20,'FIO',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (84,2,21,'MIL',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (85,2,22,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (86,2,23,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (87,2,26,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (88,2,28,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (89,2,29,'ATA',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (90,2,30,'ROM',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (91,2,31,'INT',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (92,2,32,'PIS',NULL);
INSERT INTO giocata (id,giornata,id_giocatore,id_squadra,esito) VALUES (93,2,33,'FIO',NULL);
