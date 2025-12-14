// Funzione centralizzata per mappare una Lega dal BE
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega, statoPartitaFromCodice, statoGiocatoreFromCodice } from '../models/interfaces.model';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class LegaService {
  private apiUrl = '/api/survivorBe/lega';

  constructor(private http: HttpClient) {}

  mieLeghe(): Observable<Lega[]> {
    return this.http.get<Lega[]>(`${this.apiUrl}/mieLeghe`).pipe(
      map(leghe => leghe.map(mapLegaFromBE))
    );
  }

  getLegaById(id: number): Observable<Lega> {
    return this.http.get<Lega>(`${this.apiUrl}/${id}`).pipe(
      map(mapLegaFromBE)
    );
  }


}
function mapLegaFromBE(lega: Lega): Lega {
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
