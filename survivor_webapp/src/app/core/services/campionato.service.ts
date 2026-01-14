import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campionato, Partita } from '../models/interfaces.model';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class CampionatoService {
  private apiUrl = `${environment.apiUrl}/campionato`;
  private desGiornate: Record<string, string[]> | null = null;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService
  ) {
    this.getDesGiornate();
  }

  getCampionatoBySport(idSport: String): Observable<Campionato[]> {
    return this.http.get<Campionato[]>(`${this.apiUrl}/${idSport}`);
  }

  private getDesGiornate() {
    this.http
      .get<Record<string, string[]>>(`${this.apiUrl}/desGiornate`)
      .subscribe({
        next: (des) => {
          this.desGiornate = des;
        },
        error: (error) => {
          console.error('Errore nel caricamento delle leghe:', error);
          try {
            this.loadingService.reset();
          } catch (e) {}
        },
      });
  }
  getDesGiornataNoAlias(campionato: string, index: number): string {
    return this.getDesGiornata(campionato, index, '');
  }

  getDesGiornata(campionato: string, index: number, alias: string): string {
    if (alias) {
      return alias;
    } else if (
      this.desGiornate &&
      this.desGiornate[campionato] &&
      this.desGiornate[campionato][index]
    ) {
      return this.desGiornate[campionato][index];
    } else {
      return 'Giornata ' + index;
    }
  }

  calendario(
    campionatoId: string,
    squadraId: string,
    anno: number,
    giornata: number,
    prossimi: boolean
  ): Observable<Partita[]> {
    return this.http.get<any>(
      `${this.apiUrl}/calendario/${campionatoId}/${anno}/${squadraId}/${giornata}?prossimi=${prossimi}`
    );
  }

}
