import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StatisticheTrofei, Trofeo } from '../models/trofei.model';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class TrofeiService {
  private apiUrl = `${environment.apiUrl}/trofei`;

  constructor(
    private http: HttpClient,
    private translate: TranslateService
  ) {}

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
      case 1: return this.translate.instant('TROPHIES.WINNER');
      case 2: return this.translate.instant('TROPHIES.SECOND_PLACE');
      case 3: return this.translate.instant('TROPHIES.THIRD_PLACE');
      default: return this.translate.instant('TROPHIES.NTH_PLACE', { position: posizione });
    }
  }
}
