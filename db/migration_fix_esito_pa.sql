-- Fix retrocompatibilità: normalizza il valore "PA" (vecchia abbreviazione) in "PAREGGIO"
UPDATE giocata SET esito = 'PAREGGIO' WHERE esito = 'PA';
