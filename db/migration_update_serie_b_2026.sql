-- Migration: avanzamento della Serie B alla stagione 2026/27
-- Eseguire DOPO migration_update_anno_2026.sql. Dopo l'esecuzione riavviare il backend
-- (o svuotare la cache dei campionati) per ricaricare il calendario.

-- 1. Anno corrente alla stagione 2026/27
update campionato set anno_corrente = 2026 where id = 'SERIE_B';

-- 2. CRE e VER: righe storiche di Serie A (anno vecchio/inerte) diventano le squadre di
-- Serie B 2026/27. La condizione "not exists" e' una sicurezza in piu': se su un ambiente
-- quelle righe fossero invece gia' collegate a giocate reali, l'update le salta e va gestito
-- come il caso PIS sotto (verificare con una query sulla tabella giocata prima di eseguire
-- questa migration su un nuovo ambiente).
update squadra set id_campionato = 'SERIE_B', anno = 2026
where nazione = 'IT' and sigla in ('CRE', 'VER')
  and not exists (select 1 from giocata g where g.id_squadra = squadra.id);

-- 3. PIS: la riga storica di Serie A NON si tocca, ha giocate reali collegate (es. lega "DDL").
-- La Pisa di Serie B usa la sigla interna PISB, per non collidere con quella di Serie A:
-- l'API esterna continua a restituire "PIS" (vedi SquadreSerieB_API2.PISB).

-- 4. Squadre della Serie B 2026/27 non ancora censite.
insert into squadra(sigla, nome, id_campionato, nazione, anno)
select v.sigla, v.nome, 'SERIE_B', 'IT', 2026
from (values
    ('ARE', 'Arezzo'),
    ('ASC', 'Ascoli'),
    ('BEN', 'Benevento'),
    ('PISB', 'Pisa'),
    ('VIC', 'Vicenza')
) as v(sigla, nome)
where not exists (
    select 1 from squadra s where s.sigla = v.sigla and s.nazione = 'IT'
);
