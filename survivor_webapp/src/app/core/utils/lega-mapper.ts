import { Lega, statoPartitaFromCodice, statoGiocatoreFromCodice } from '../models/interfaces.model';

export function mapLegaFromBE(lega: Lega): Lega {
  return {
    ...lega,
    statoGiornataCorrente: typeof lega.statoGiornataCorrente === 'string'
      ? statoPartitaFromCodice(lega.statoGiornataCorrente)
      : lega.statoGiornataCorrente,

      

      statiGiornate: lega.statiGiornate 
        ? Object.fromEntries(
            Object.entries(lega.statiGiornate).map(([legaId, stato]) => [
              legaId,
              typeof stato === 'string'
                ? statoPartitaFromCodice(stato as any)
                : stato
            ])
          )
        : lega.statiGiornate,



      giocatori: lega.giocatori?.map(g => ({
      ...g,
      statiPerLega: g.statiPerLega 
        ? Object.fromEntries(
            Object.entries(g.statiPerLega).map(([legaId, stato]) => [
              legaId,
              typeof stato === 'string'
                ? statoGiocatoreFromCodice(stato as any)
                : stato
            ])
          )
        : g.statiPerLega
    }))
  };
}
