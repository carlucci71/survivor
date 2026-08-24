import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PartitaLive } from '../models/interfaces.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiveScoreService {
  private apiUrl = `${environment.apiUrl}/live`;

  constructor(private http: HttpClient) {}

  /**
   * Partite della giornata Serie A corrente, incluse quelle già terminate (es. i risultati di
   * stasera) e quelle ancora da giocare (vuoto se l'utente non ha una lega Serie A attiva).
   * Il dato è comunque cachato lato server per ~50s: nessun problema a richiamarlo spesso.
   */
  partiteGiornataSerieA(): Observable<PartitaLive[]> {
    return this.http.get<PartitaLive[]>(`${this.apiUrl}/serieA`);
  }
}
