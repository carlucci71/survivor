import { Lega, statoPartitaFromCodice, statoGiocatoreFromCodice } from '../models/interfaces.model';

export function mapLegaFromBE(lega: Lega): Lega {
  return {
    ...lega,
    statoGiornataCorrente: typeof lega.statoGiornataCorrente === 'string'
      ? statoPartitaFromCodice(lega.statoGiornataCorrente)
      : lega.statoGiornataCorrente,
    giocatori: lega.giocatori?.map(g => ({
      ...g,
      stato: typeof g.stato === 'string' ? statoGiocatoreFromCodice(g.stato) : g.stato
    }))
  };
}
