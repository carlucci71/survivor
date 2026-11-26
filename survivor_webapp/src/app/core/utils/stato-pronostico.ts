import { Lega } from '../models/interfaces.model';

/**
 * Stato del MIO pronostico in una lega per il turno corrente (usato dalla hero e dalla lista della home).
 * - fatto: c'e' una scelta per la giornata da giocare (miaGiocataCorrente; NON la scelta del turno prima)
 * - da-votare: nessuna scelta e il turno e' aperto (da giocare o gia' iniziato: chi non sceglie viene eliminato)
 * - attesa: nessun turno su cui votare adesso (giornata finita in attesa del calcolo, sospesa, calendario assente)
 */
export type StatoPronostico = 'da-votare' | 'fatto' | 'attesa';

export function statoPronostico(lega: Lega): StatoPronostico {
  if (lega.miaGiocataCorrente) return 'fatto';
  const stato = lega.statoGiornataCorrente?.value;
  if ((lega.giornataDaGiocare ?? 0) > 0 && (stato === 'DA_GIOCARE' || stato === 'IN_CORSO')) return 'da-votare';
  return 'attesa';
}

/** Inizio della prima partita della giornata corrente (dopo si puo' ancora scegliere chi non ha giocato). */
export function inizioGiornata(lega: Lega): number | null {
  if (!lega.inizioProssimaGiornata) return null;
  const t = new Date(lega.inizioProssimaGiornata).getTime();
  return isNaN(t) ? null : t;
}

/**
 * Le scelte si chiudono 5 minuti prima della prima partita della giornata (come il countdown di
 * lega-dettaglio, che allo scadere nasconde il pulsante per scegliere). Il server per ora blocca
 * solo all'inizio vero: questo margine vale solo per quello che mostra l'app.
 */
export const MARGINE_CHIUSURA_MS = 5 * 60 * 1000;

/** Quando si chiudono le scelte della giornata corrente (inizio meno 5 minuti), null se manca l'orario. */
export function chiusuraScelte(lega: Lega): number | null {
  const inizio = inizioGiornata(lega);
  return inizio == null ? null : inizio - MARGINE_CHIUSURA_MS;
}

/** Ordine "piu' urgente prima": inizio giornata piu' vicino, poi quelle senza orario. */
export function perUrgenza(a: Lega, b: Lega): number {
  const ta = inizioGiornata(a) ?? Number.MAX_SAFE_INTEGER;
  const tb = inizioGiornata(b) ?? Number.MAX_SAFE_INTEGER;
  return ta - tb;
}

/**
 * Tempo mancante alla chiusura delle scelte (inizio giornata meno 5 minuti) come chiave i18n +
 * parametri (PRONOSTICI.DURATION_*), null se gia' chiuse o se l'orario non c'e'.
 */
export function durataAllInizio(lega: Lega, adesso: number): { key: string; params: Record<string, number> } | null {
  const inizio = chiusuraScelte(lega);
  if (inizio == null || inizio <= adesso) return null;
  const minuti = Math.max(1, Math.floor((inizio - adesso) / 60000));
  const giorni = Math.floor(minuti / 1440);
  const ore = Math.floor((minuti % 1440) / 60);
  const min = minuti % 60;
  if (giorni > 0) return { key: 'PRONOSTICI.DURATION_DH', params: { d: giorni, h: ore } };
  if (ore > 0) return { key: 'PRONOSTICI.DURATION_HM', params: { h: ore, m: min } };
  return { key: 'PRONOSTICI.DURATION_M', params: { m: min } };
}

/** La giornata e' gia' iniziata (orario passato): si puo' ancora votare chi non ha giocato, ma e' urgente. */
export function giornataIniziata(lega: Lega, adesso: number): boolean {
  const inizio = inizioGiornata(lega);
  return lega.statoGiornataCorrente?.value === 'IN_CORSO' || (inizio != null && inizio <= adesso);
}
