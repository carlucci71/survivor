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

  legheLibere(): Observable<Lega[]> {
    return this.http
      .get<Lega[]>(`${this.apiUrl}/legheLibere`)
      .pipe(map((leghe) => leghe.map(mapLegaFromBE)));
  }

  getLegaById(id: number): Observable<Lega> {
    return this.http.get<Lega>(`${this.apiUrl}/${id}`).pipe(map(mapLegaFromBE));
  }

  inserisciLega(
    nome: string,
    sport: string,
    campionato: string,
    giornataIniziale: number,
    pwd: string | null
  ): Observable<Lega> {
    const body = {
      nome: nome,
      sport: sport,
      campionato: campionato,
      giornataIniziale: giornataIniziale,
      pwd: pwd
    };

    return this.http.post<Lega>(`${this.apiUrl}`, body);
  }

  join(id: number, pwd: string | null, tokenOriginal: string): Observable<Lega> {
    const body = { pwd: pwd, tokenOriginal: tokenOriginal };
    return this.http.put<Lega>(`${this.apiUrl}/join/${id}`, body).pipe(map(mapLegaFromBE));
  }

  invitaUtenti(legaId: number, emails: string[]): Observable<any> {
    const body = { emails: emails };
    return this.http.post(`${this.apiUrl}/invita/${legaId}`, body);
  }

  calcola(id: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/calcola/${id}`, {})
      .pipe(map(mapLegaFromBE));
  }
  undoCalcola(id: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/undoCalcola/${id}`, {})
      .pipe(map(mapLegaFromBE));
  }

}
