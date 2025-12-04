
drop table if exists giocatore;
drop table if exists squadra;
drop table if exists giocata;
create table giocatore(
	id serial primary key,
	nome varchar(100),
	stato char(1)
);
create table squadra(
	id char(3) primary key,
	nome varchar(100)
);
create table giocata(
	id serial primary key,
	giornata integer,
	id_giocatore integer,
	id_squadra char(3)
);
insert into squadra(id,nome) values('ATA','Atalanta');
insert into squadra(id,nome) values('BOL','Bologna');
insert into squadra(id,nome) values('CAG','Cagliari');
insert into squadra(id,nome) values('COM','Como');
insert into squadra(id,nome) values('CRE','Cremonese');
insert into squadra(id,nome) values('FIO','Fiorentina');
insert into squadra(id,nome) values('GEN','Genoa');
insert into squadra(id,nome) values('INT','Inter');
insert into squadra(id,nome) values('JUV','Juventus');
insert into squadra(id,nome) values('LAZ','Lazio');
insert into squadra(id,nome) values('LEC','Lecce');
insert into squadra(id,nome) values('MIL','Milan');
insert into squadra(id,nome) values('NAP','Napoli');
insert into squadra(id,nome) values('PAR','Parma');
insert into squadra(id,nome) values('PIS','Pisa');
insert into squadra(id,nome) values('ROM','Roma');
insert into squadra(id,nome) values('SAS','Sassuolo');
insert into squadra(id,nome) values('TOR','Torino');
insert into squadra(id,nome) values('UDI','Udinese');
insert into squadra(id,nome) values('VER','Verona');

