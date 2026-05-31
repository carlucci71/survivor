-- Migration: allineamento sigla tennisti alla convenzione standard
-- Problema: alcune costanti di SquadreTennis_API2 usavano la rimozione del trattino
-- (es. FELIX_AUGERALIASSIME) invece del rimpiazzo con underscore (FELIX_AUGER_ALIASSIME)
-- che è la convenzione usata da toTennisSigla().
-- Questa migration aggiorna le sigla nel DB per i 2 casi non allineati.
--
-- ATTENZIONE: questa migration è necessaria SOLO per le leghe che usavano elaboraTennis
-- (es. TENNIS_W, TENNIS_AO) con questi giocatori. Per Roland Garros 2026 le sigla
-- sono già corrette (FELIX_AUGER_ALIASSIME) perché derivate da toTennisSigla al momento
-- della creazione della giocata.

-- Felix Auger-Aliassime: FELIX_AUGERALIASSIME → FELIX_AUGER_ALIASSIME
UPDATE squadra
SET sigla = 'FELIX_AUGER_ALIASSIME'
WHERE sigla = 'FELIX_AUGERALIASSIME';

-- Jan-Lennard Struff: JANLENNARD_STRUFF → JAN_LENNARD_STRUFF
UPDATE squadra
SET sigla = 'JAN_LENNARD_STRUFF'
WHERE sigla = 'JANLENNARD_STRUFF';

-- Aggiorna anche le eventuali giocate che referenziano queste squadre tramite snapshot
-- (se presente la colonna squadra_sigla nella tabella giocata_snapshot o simili)
-- Verificare se esistono tabelle di audit/snapshot che contengono la sigla come stringa
-- e aggiornare di conseguenza.
