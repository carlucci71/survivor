-- Migration: avanzamento della Serie B alla stagione 2026/27
-- Eseguire DOPO migration_update_anno_2026.sql. Dopo l'esecuzione riavviare il backend
-- (o svuotare la cache dei campionati) per ricaricare il calendario.

-- 1. Anno corrente alla stagione 2026/27
update campionato set anno_corrente = 2026 where id = 'SERIE_B';

-- 2. Squadre della Serie B 2026/27 non ancora censite.
-- La ricerca delle squadre e' per sigla e nazione: se la sigla esiste gia' per l'Italia
-- (es. CRE, PIS, VER presenti come Serie A, BEN gia' in Serie B) non si inserisce nulla.
insert into squadra(sigla, nome, id_campionato, nazione, anno)
select v.sigla, v.nome, 'SERIE_B', 'IT', 2026
from (values
    ('ARE', 'Arezzo'),
    ('ASC', 'Ascoli'),
    ('BEN', 'Benevento'),
    ('CRE', 'Cremonese'),
    ('PIS', 'Pisa'),
    ('VER', 'Verona'),
    ('VIC', 'Vicenza')
) as v(sigla, nome)
where not exists (
    select 1 from squadra s where s.sigla = v.sigla and s.nazione = 'IT'
);
