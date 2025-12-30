drop table if exists giocata;
drop table if exists giocatore_lega;
drop table if exists sospensione_lega;
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
	ruolo char(1) not null,
    PRIMARY KEY (id_giocatore, id_lega)
);
CREATE TABLE sospensione_lega (
    id_lega integer NOT NULL,
	giornata  integer NOT NULL,
    PRIMARY KEY (id_lega, giornata)
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
	sigla varchar(10),
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

alter TABLE sospensione_lega 
ADD CONSTRAINT fk_sospensione_lega FOREIGN KEY (id_lega) REFERENCES lega(id);

ALTER TABLE log_dispositiva
ADD CONSTRAINT fk_log_dispositiva_users
FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE param_log_dispositiva
ADD CONSTRAINT fk_param_log_dispositiva_log_dispositiva
FOREIGN KEY (id_log_dispositiva) REFERENCES log_dispositiva(id);

insert into sport(id,nome) values('CALCIO','Calcio');
insert into sport(id,nome) values('BASKET','Basket');
insert into sport(id,nome) values('TENNIS','Tennis');
insert into campionato(id,id_sport,nome, num_giornate) values('SERIE_A','CALCIO','Serie A',38);
insert into campionato(id,id_sport,nome, num_giornate) values('SERIE_B','CALCIO','Serie B',38);
insert into campionato(id,id_sport,nome, num_giornate) values('LIGA','CALCIO','Liga',38);
insert into campionato(id,id_sport,nome, num_giornate) values('NBA_RS','BASKET','NBA Regular Season',38);
insert into campionato(id,id_sport,nome, num_giornate) values('TENNIS_AO','TENNIS','Australian Open',38);
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
insert into squadra(sigla,nome,id_campionato) values('DET','Detroit Pistons','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('NYK','New York Knicks','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('TOR','Toronto Raptors','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('BOS','Boston Celtics','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('PHI','Philadelphia 76ers','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('ORL','Orlando Magic','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('MIA','Miami Heat','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('CLE','Cleveland Cavaliers','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('ATL','Atlanta Hawks','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('CHI','Chicago Bulls','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('MIL','Milwaukee Bucks','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('CHA','Charlotte Hornets','NBA_RS');
insert into squadra(sigla, nome,id_campionato) values('BKN','Brooklyn Nets','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('IND','Indiana Pacers','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('WAS','Washington Wizards','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('OKC','Oklahoma City Thunder','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('DEN','Denver Nuggets','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('SAS','San Antonio Spurs','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('LAL','Los Angeles Lakers','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('HOU','Houston Rockets','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('MIN','Minnesota Timberwolves','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('PHX','Phoenix Suns','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('MEM','Memphis Grizzlies','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('GSW','Golden State Warriors','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('POR','Portland Trail Blazers','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('DAL','Dallas Mavericks','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('UTA','Utah Jazz','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('LAC','Los Angeles Clippers','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('SAC','Sacramento Kings','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('NOP','New Orleans Pelicans','NBA_RS');
insert into squadra(sigla,nome,id_campionato) values('CTZ','Catanzaro','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('BAR','Bari','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('JST','Juve Stabia','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('CES','Cesena','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('SPE','Spezia','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('FRO','Frosinone','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('VEN','Venezia','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('MOD','Modena','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('CAR','Carrarese','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('MONZ','Monza','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('SAM','Sampdoria','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('PAD','Padova','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('PAL','Palermo','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('AVE','Avellino','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('REG','Reggiana','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('PES','Pescara','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('STR','Südtirol','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('ENT','Virtus Entella','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('EMP','Empoli','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('MAN','Mantova','SERIE_B');
insert into squadra(sigla,nome,id_campionato) values('RAY','Rayo Vallecano','LIGA');
insert into squadra(sigla,nome,id_campionato) values('GIR','Girona','LIGA');
insert into squadra(sigla,nome,id_campionato) values('OVI','Real Oviedo','LIGA');
insert into squadra(sigla,nome,id_campionato) values('VIL','Villarreal','LIGA');
insert into squadra(sigla,nome,id_campionato) values('BAR','Barcellona','LIGA');
insert into squadra(sigla,nome,id_campionato) values('MLL','Mallorca','LIGA');
insert into squadra(sigla,nome,id_campionato) values('LEV','Levante','LIGA');
insert into squadra(sigla,nome,id_campionato) values('ALA','Alavés','LIGA');
insert into squadra(sigla,nome,id_campionato) values('RSO','Real Sociedad','LIGA');
insert into squadra(sigla,nome,id_campionato) values('VAL','Valencia','LIGA');
insert into squadra(sigla,nome,id_campionato) values('GET','Getafe','LIGA');
insert into squadra(sigla,nome,id_campionato) values('VIG','Celta Vigo','LIGA');
insert into squadra(sigla,nome,id_campionato) values('SEV','Siviglia','LIGA');
insert into squadra(sigla,nome,id_campionato) values('ATH','Athletic Bilbao','LIGA');
insert into squadra(sigla,nome,id_campionato) values('ATM','Atlético Madrid','LIGA');
insert into squadra(sigla,nome,id_campionato) values('ESP','Espanyol','LIGA');
insert into squadra(sigla,nome,id_campionato) values('BET','Real Betis','LIGA');
insert into squadra(sigla,nome,id_campionato) values('ELC','Elche','LIGA');
insert into squadra(sigla,nome,id_campionato) values('OSA','Osasuna','LIGA');
insert into squadra(sigla,nome,id_campionato) values('RMA','Real Madrid','LIGA');
insert into squadra(sigla,nome,id_campionato) values('33848','Jannik Sinner','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29837','Nicolas Jarry','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34338','Tristan Schoolkate','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('5455','Taro Daniel','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('8607','Marcos Giron','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('9680','Yannick Hanfmann','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34035','Tomas Martin Etcheverry','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34169','Flavio Cobolli','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29376','Hubert Hurkacz','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31966','Tallon Griekspoor','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33224','Miomir Kecmanovic','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('13121','Dusan Lajovic','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31813','Matteo Berrettini','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29786','Cameron Norrie','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29594','Zhizhen Zhang','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34196','Holger Rune','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31957','Stefanos Tsitsipas','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35417','Alex Michelsen','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35051','James McCabe','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35967','Martin Landaluce','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34210','Gabriel Diallo','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34403','Luca Nardi','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('14688','Adrian Mannarino','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30390','Karen Khachanov','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32953','Francisco Cerundolo','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31683','Alexander Bublik','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34056','Facundo Diaz Acosta','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32314','Zizou Bergs','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('4976','Federico Coria','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33698','Tristan Boyer','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32176','Botic Van De Zandschulp','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32547','Alex De Minaur','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31441','Taylor Fritz','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32934','Jenson Brooksby','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('28204','Borna Coric','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29149','Cristian Garin','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34929','Francisco Comesana','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30260','Daniel Altmaier','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('16145','Gael Monfils','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34455','Giovanni Mpetshi Perricard','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34742','Ben Shelton','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32964','Brandon Nakashima','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('3925','Pablo Carreno Busta','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30171','Kamil Majchrzak','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('1969','Roberto Bautista Agut','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32179','Denis Shapovalov','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34141','Matteo Arnaldi','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34114','Lorenzo Musetti','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30452','Andrey Rublev','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35033','Joao Fonseca','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31557','Lorenzo Sonego','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('25912','Stan Wawrinka','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32064','Thiago Seyboth Wild','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33166','Fabian Marozsan','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('27879','Arthur Rinderknech','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31333','Frances Tiafoe','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32548','Alexei Popyrin','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31583','Corentin Moutet','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33142','Rinky Hijikata','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('12795','Mitchell Krueger','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32966','Camilo Ugo Carabelli','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35209','Learner Tien','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33588','Kasidit Samrej','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30453','Daniil Medvedev','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('6194','Novak Djokovic','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35349','Nishesh Basavareddy','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33593','Pavel Kotov','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34597','Jaime Faria','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31621','Reilly Opelka','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32929','Gauthier Onclin','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30678','Sumit Nagal','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34159','Tomas Machac','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33284','Jiri Lehecka','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30726','Li Tu','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33666','Hugo Gaston','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29831','Omar Jasika','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('8691','David Goffin','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30039','Benjamin Bonzi','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33337','Francesco Passaro','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('6137','Grigor Dimitrov','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33804','Jack Draper','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34930','Mariano Navone','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('28054','Thanasi Kokkinakis','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31889','Roman Safiullin','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('6582','Damir Dzumhur','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29857','Aleksandar Vukic','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33247','Sebastian Korda','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32415','Lukas Klein','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29788','Jordan Thompson','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('27932','Dominik Koepfer','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32251','Alexandre Muller','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33981','Nuno Borges','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29147','Yoshihito Nishioka','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('30502','Aziz Dougaz','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34744','Alexander Shevchenko','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34132','Carlos Alcaraz','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32607','Casper Ruud','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32038','Jaume Munar','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34661','Jakub Mensik','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('1885','Nikoloz Basilashvili','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34585','Juncheng Shang','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33251','Alejandro Davidovich Fokina','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('23433','Jan-Lennard Struff','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32005','Felix Auger-Aliassime','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32740','Alejandro Tabilo','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('3824','Roberto Carballes Baena','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('6452','James Duckworth','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34551','Dominic Stricker','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('17205','Kei Nishikori','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('16186','Thiago Monteiro','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29084','Christopher O''Connell','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('31625','Tommy Paul','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32587','Ugo Humbert','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34407','Matteo Gigante','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('35270','Yunchaokete Bu','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33567','Hady Habib','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32542','Adam Walton','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29844','Quentin Halys','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33901','Otto Virtanen','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34645','Arthur Fils','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33499','Sebastian Baez','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34404','Arthur Cazaux','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('33761','Jacob Fearnley','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('29072','Nick Kyrgios','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('32372','Pedro Martinez Portero','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('34453','Luciano Darderi','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('19248','Lucas Pouille','TENNIS_AO');
insert into squadra(sigla,nome,id_campionato) values('28728','Alexander Zverev','TENNIS_AO');


INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (1,13,16,'DDL','SERIE_A');
INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (2,1,null,'DDL NBA RS','NBA_RS');
INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (3,13,16,'DDL B','SERIE_B');
INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (4,13,16,'DDL LIGA','LIGA');
INSERT INTO lega (id,giornata_iniziale,giornata_calcolata,nome,id_campionato) VALUES (5,13,16,'DDL AO','TENNIS_AO');


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
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (1,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (2,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (3,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (4,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (5,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (6,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (7,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (8,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (9,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (10,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (11,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (12,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (13,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (14,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (15,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (16,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (17,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (18,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (19,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (20,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (21,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (22,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (23,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (24,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (25,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (26,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (27,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (28,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (29,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (30,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (31,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (32,1,'A','G');
insert into giocatore_lega(id_giocatore,id_lega,stato,ruolo) values (33,1,'A','G');

insert into giocatore_lega (id_giocatore, id_lega, stato) select  id,2,'A','L' from giocatore where nome = 'DANIELE CARLUCCI';
insert into giocatore_lega (id_giocatore, id_lega, stato) select  id,3,'A','L' from giocatore where nome = 'DANIELE CARLUCCI';
insert into giocatore_lega (id_giocatore, id_lega, stato) select  id,4,'A','L' from giocatore where nome = 'DANIELE CARLUCCI';
insert into giocatore_lega (id_giocatore, id_lega, stato) select  id,5,'A','L' from giocatore where nome = 'DANIELE CARLUCCI';

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

insert into sospensione_lega(id_lega,giornata) values (1,16);

delete from users where id=0;
INSERT INTO users (id,email,"name",enabled,created_at,"role") VALUES (0,'fantasurvivorddl@gmail.com','SYSTEM',true,CURRENT_TIMESTAMP,'ADMIN');


SELECT setval('giocata_id_seq', (SELECT MAX(id) FROM giocata));

