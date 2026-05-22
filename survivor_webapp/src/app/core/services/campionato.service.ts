import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campionato, ClassificaRow, Partita } from '../models/interfaces.model';
import { LoadingService } from './loading.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({ providedIn: 'root' })
export class CampionatoService {
  private apiUrl = `${environment.apiUrl}/campionato`;
  private desGiornate: Record<string, string[]> | null = null;

  constructor(
    private http: HttpClient,
    private loadingService: LoadingService,
    private translate: TranslateService
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
      const label = this.desGiornate[campionato][index];
      const mondialiMap: { [key: string]: string } = {
        // Mondiali / Calcio
        'Girone - Giornata 1': this.translate.instant('LEAGUE.ROUND_LABELS.GROUP_ROUND') + ' 1',
        'Girone - Giornata 2': this.translate.instant('LEAGUE.ROUND_LABELS.GROUP_ROUND') + ' 2',
        'Girone - Giornata 3': this.translate.instant('LEAGUE.ROUND_LABELS.GROUP_ROUND') + ' 3',
        'Ottavi di finale':    this.translate.instant('LEAGUE.ROUND_LABELS.ROUND_OF_32'),
        'Sedicesimi di finale':this.translate.instant('LEAGUE.ROUND_LABELS.ROUND_OF_16'),
        'Quarti di finale':    this.translate.instant('LEAGUE.ROUND_LABELS.QUARTERFINALS'),
        'Semifinali':          this.translate.instant('LEAGUE.ROUND_LABELS.SEMIFINALS'),
        'Finale':              this.translate.instant('LEAGUE.ROUND_LABELS.FINAL'),
        // Tennis
        '64-esimi':  this.translate.instant('LEAGUE.ROUND_LABELS.TENNIS.ROUND_OF_128'),
        '32-esimi':  this.translate.instant('LEAGUE.ROUND_LABELS.TENNIS.ROUND_OF_64'),
        '16-esimi':  this.translate.instant('LEAGUE.ROUND_LABELS.TENNIS.ROUND_OF_32'),
        'Ottavi':    this.translate.instant('LEAGUE.ROUND_LABELS.TENNIS.ROUND_OF_16'),
        'Quarti':    this.translate.instant('LEAGUE.ROUND_LABELS.TENNIS.QUARTERFINALS'),
      };
      if (mondialiMap[label]) return mondialiMap[label];
      return label
        .replace(/^Giornata\s/, this.translate.instant('LEAGUE.ROUND') + ' ')
        .replace(/^Settimana\s/, this.translate.instant('LEAGUE.WEEK') + ' ');
    } else {
      return this.translate.instant('LEAGUE.ROUND') + ' ' + index;
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

  partiteDellaGiornata(
    campionatoId: string,
    anno: number,
    giornata: number
  ): Observable<Partita[]> {
    return this.http.get<any>(
      `${this.apiUrl}/partiteDellaGiornata/${campionatoId}/${anno}/${giornata}`
    );
  }

  classificaCampionato(campionatoId: string, anno: number): Observable<ClassificaRow[]> {
    return this.http.get<ClassificaRow[]>(`${this.apiUrl}/classifica/${campionatoId}/${anno}`);
  }

}
