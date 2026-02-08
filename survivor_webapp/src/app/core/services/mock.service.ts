import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PartitaMock } from '../models/interfaces.model';

@Injectable({ providedIn: 'root' })
export class MockService {
  private apiUrl = `${environment.apiUrl}/mock`;

  constructor(private http: HttpClient) {}

  reset(idCampionato: string, anno: number, implementazioneApiFrom: string): Observable<string> {
    const url = `${this.apiUrl}/reset/${idCampionato}/${anno}/${implementazioneApiFrom}`;
    return this.http.put(url, null, { responseType: 'text' });
  }

  updateMock(
    idCampionato: string,
    anno: number,
    giornata: number,
    dataRif?: string,
    casaSigla?: string,
    fuoriSigla?: string,
    scoreCasa?: number,
    scoreFuori?: number,
    orarioPartita?: string
  ): Observable<string> {
    const url = `${this.apiUrl}/updateMock/${idCampionato}/${anno}/${giornata}`;
    let params = new HttpParams();
    if (dataRif != null) { params = params.set('dataRif', dataRif); }
    if (casaSigla != null) { params = params.set('casaSigla', casaSigla); }
    if (fuoriSigla != null) { params = params.set('fuoriSigla', fuoriSigla); }
    if (scoreCasa != null) { params = params.set('scoreCasa', String(scoreCasa)); }
    if (scoreFuori != null) { params = params.set('scoreFuori', String(scoreFuori)); }
    if (orarioPartita != null) { params = params.set('orarioPartita', orarioPartita); }

    return this.http.put(url, null, { params, responseType: 'text' });
  }

  getPartite(idCampionato: string, anno: number, giornata: number): Observable<PartitaMock[]> {
    const url = `${this.apiUrl}/partite/${idCampionato}/${anno}/${giornata}`;
    return this.http.get<PartitaMock[]>(url);
  }

  dataRiferimento(): Observable<string> {
    const url = `${this.apiUrl}/dataRiferimento`;
    return this.http.get(url, { responseType: 'text' });
  }

}
