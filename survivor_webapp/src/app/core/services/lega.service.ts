import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega, Partita } from '../models/interfaces.model';
import { map } from 'rxjs/operators';
import { mapLegaFromBE } from '../utils/lega-mapper';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LegaService {
  private apiUrl = `${environment.apiUrl}/lega`;

  constructor(private http: HttpClient) {}

  mieLeghe(): Observable<Lega[]> {
    return this.http
      .get<Lega[]>(`${this.apiUrl}/mieLeghe`)
      .pipe(map((leghe) => leghe.map(mapLegaFromBE)));
  }

  getLegaById(id: number): Observable<Lega> {
    return this.http.get<Lega>(`${this.apiUrl}/${id}`).pipe(map(mapLegaFromBE));
  }

  calendario(
    sportId: string,
    campionatoId: string,
    squadraId: string,
    giornata: number,
    prossimi: boolean
  ): Observable<Partita[]> {
    return this.http.get<any>(
      `${this.apiUrl}/calendario/${sportId}/${campionatoId}/${squadraId}/${giornata}?prossimi=${prossimi}`
    );
  }

  inserisciLega(
    nome: string,
    sport: string,
    campionato: string,
    giornataIniziale: number
  ): Observable<Lega> {
    const body = {
      nome: nome,
      sport: sport,
      campionato: campionato,
      giornataIniziale: giornataIniziale,
    };

    return this.http.post<Lega>(`${this.apiUrl}`, body);
  }
}
