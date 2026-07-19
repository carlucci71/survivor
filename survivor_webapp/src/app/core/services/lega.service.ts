import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Giocatore, Lega, LegaJoinRequest, Partita, PronosticoVincitore, VotoPronostico } from '../models/interfaces.model';
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
    giornataFinale: number | null,
    pwd: string | null,
    pubblica: boolean = false,
    accessoLibero: boolean = false,
    maxPartecipanti: number | null = null,
    modalita: string = 'SURVIVOR',
    viteIniziali: number = 1
  ): Observable<Lega> {
    const body: any = {
      name: name,
      sport: sport,
      campionato: campionato,
      giornataIniziale: giornataIniziale,
      pwd: pwd,
      pubblica: pubblica,
      accessoLibero: accessoLibero,
      modalita: modalita,
      viteIniziali: viteIniziali
    };
    if (giornataFinale !== null) {
      body['giornataFinale'] = giornataFinale;
    }
    if (maxPartecipanti !== null) {
      body['maxPartecipanti'] = maxPartecipanti;
    }
    return this.http.post<Lega>(`${this.apiUrl}`, body);
  }

  aggiornVite(idLega: number, idGiocatore: number, vite: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/${idLega}/vite`, { idGiocatore, vite }).pipe(map(mapLegaFromBE));
  }

  storicoVite(idLega: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/${idLega}/vite/storico`);
  }

  salvaPronosticoVincitore(idLega: number, giocatorePronosticatoId: number): Observable<PronosticoVincitore> {
    return this.http.post<PronosticoVincitore>(`${this.apiUrl}/${idLega}/pronostico`, { giocatorePronosticatoId });
  }

  getMioPronostico(idLega: number): Observable<PronosticoVincitore | null> {
    return this.http.get<PronosticoVincitore | null>(`${this.apiUrl}/${idLega}/pronostico`);
  }

  getClassificaPronostici(idLega: number): Observable<VotoPronostico[]> {
    return this.http.get<VotoPronostico[]>(`${this.apiUrl}/${idLega}/pronostici/classifica`);
  }

  join(id: number, pwd: string | null, tokenOriginal: string): Observable<Lega> {
    const body = { pwd: pwd, tokenOriginal: tokenOriginal };
    return this.http.put<Lega>(`${this.apiUrl}/join/${id}`, body).pipe(map(mapLegaFromBE));
  }

  invitaUtenti(idLega: number, emails: string[]): Observable<any> {
    const body = { emails: emails, mobile: true }; 
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

  rinominaLega(idLega: number, nome: string): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/rinomina/${idLega}`, { nome })
      .pipe(map(mapLegaFromBE));
  }

  // ─── Join Requests ────────────────────────────────────────────────────────

  richiediIngresso(idLega: number): Observable<LegaJoinRequest> {
    return this.http.post<LegaJoinRequest>(`${this.apiUrl}/richieste/${idLega}`, {});
  }

  mieRichieste(): Observable<LegaJoinRequest[]> {
    return this.http.get<LegaJoinRequest[]>(`${this.apiUrl}/richieste/mie`);
  }

  richiestePendenti(idLega: number): Observable<LegaJoinRequest[]> {
    return this.http.get<LegaJoinRequest[]>(`${this.apiUrl}/richieste/${idLega}`);
  }

  approvaRichiesta(idLega: number, requestId: number): Observable<LegaJoinRequest> {
    return this.http.post<LegaJoinRequest>(`${this.apiUrl}/richieste/${idLega}/approva/${requestId}`, {});
  }

  rifiutaRichiesta(idLega: number, requestId: number): Observable<LegaJoinRequest> {
    return this.http.post<LegaJoinRequest>(`${this.apiUrl}/richieste/${idLega}/rifiuta/${requestId}`, {});
  }

  annullaRichiesta(idLega: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/richieste/${idLega}`);
  }

}
