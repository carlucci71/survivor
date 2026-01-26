import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Giocatore, Lega, Partita } from '../models/interfaces.model';
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
    name: string,
    sport: string,
    campionato: string,
    giornataIniziale: number,
    pwd: string | null
  ): Observable<Lega> {
    const body = {
      name: name,
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

  invitaUtenti(idLega: number, emails: string[], mobile: boolean): Observable<any> {
    const body = { emails: emails, mobile: mobile };
    return this.http.post(`${this.apiUrl}/invita/${idLega}`, body);
  }

  calcola(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/calcola/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  undoCalcola(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/undoCalcola/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  termina(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/termina/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  riapri(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/riapri/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  secondaOccasione(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/secondaOccasione/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  nuovaEdizione(idLega: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/nuovaEdizione/${idLega}`, {})
      .pipe(map(mapLegaFromBE));
  }
  cancellaGiocatoreDaLega(idLega: number, giocatore: Giocatore): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/cancellaGiocatoreDaLega/${idLega}/${giocatore.id}`, {})
      .pipe(map(mapLegaFromBE));
  }

  eliminaLega(idLega: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${idLega}`);
  }

}
