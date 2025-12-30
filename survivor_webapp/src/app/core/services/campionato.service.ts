import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campionato } from '../models/interfaces.model';
import { LoadingService } from './loading.service';

@Injectable({ providedIn: 'root' })
export class CampionatoService {
  private apiUrl = `${environment.apiUrl}/campionato`;
  private desGiornate: Record<string, string[]> | null = null;


  constructor(private http: HttpClient,private loadingService: LoadingService) {
    console.debug('CREATO');
    this.getDesGiornate();
  }



  getCampionatoBySport(idSport: String): Observable<Campionato[]> {
    return this.http.get<Campionato[]>(`${this.apiUrl}/${idSport}`);
  }


  
  private getDesGiornate() {
      this.http.get<Record<string, string[]>>(`${this.apiUrl}/desGiornate`).subscribe({
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

  getDesGiornata(sport: string, index: number): string {
    if (this.desGiornate && this.desGiornate[sport] && this.desGiornate[sport][index]) {
      return this.desGiornate[sport][index];
    } else {
      return 'Giornata ' + index;
    }
  }


}
