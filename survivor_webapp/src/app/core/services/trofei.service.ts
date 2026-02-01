import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticheTrofei, Trofeo } from '../models/trofei.model';

@Injectable({
  providedIn: 'root'
})
export class TrofeiService {
  private apiUrl = `${environment.apiUrl}/trofei`;

  constructor(private http: HttpClient) {}

  /**
   * Ottiene le statistiche complete dei trofei dell'utente loggato
   */
  getMieiTrofei(): Observable<StatisticheTrofei> {
    return this.http.get<StatisticheTrofei>(`${this.apiUrl}/me`);
  }

  /**
   * Ottiene solo le vittorie (primi posti) dell'utente loggato
   */
  getMieVittorie(): Observable<Trofeo[]> {
    return this.http.get<Trofeo[]>(`${this.apiUrl}/me/vittorie`);
  }

  /**
   * Ottiene i podi (primi 3 posti) dell'utente loggato
   */
  getMieiPodi(): Observable<Trofeo[]> {
    return this.http.get<Trofeo[]>(`${this.apiUrl}/me/podi`);
  }

  /**
   * Ottiene le statistiche dei trofei di un giocatore specifico
   */
  getTrofeiGiocatore(giocatoreId: number): Observable<StatisticheTrofei> {
    return this.http.get<StatisticheTrofei>(`${this.apiUrl}/giocatore/${giocatoreId}`);
  }

  /**
   * Helper per ottenere l'emoji in base alla posizione
   */
  getPosizioneEmoji(posizione: number): string {
    switch (posizione) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `${posizione}°`;
    }
  }

  /**
   * Helper per ottenere la descrizione della posizione
   */
  getPosizioneLabel(posizione: number): string {
    switch (posizione) {
      case 1: return 'Vincitore';
      case 2: return 'Secondo Posto';
      case 3: return 'Terzo Posto';
      default: return `${posizione}° Posto`;
    }
  }
}
