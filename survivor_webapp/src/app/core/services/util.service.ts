import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private apiUrl = `${environment.apiUrl}/util`;

  constructor(private http: HttpClient) {}

  profilo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profilo`);
  }

  calendario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calendario`);
  }

  getTorneoLogo(campionatoId: string | null | undefined): string | null {
    const map: Record<string, string> = {
      'SERIE_A': 'assets/logos/calcio/tornei/serie_A.png',
      'SERIE_B': 'assets/logos/calcio/tornei/serie_b.png',
      'LIGA': 'assets/logos/calcio/tornei/liga.png',
      'PREMIER_LEAGUE': 'assets/logos/calcio/tornei/premier.png',
      'MONDIALI_2026': 'assets/logos/calcio/tornei/trofeo.svg',
      'CHAMPIONS_LEAGUE': 'assets/logos/calcio/champions/logo_champions.webp',
      'NBA_RS': 'assets/logos/basket/tornei/NBA.png',
      'AUS_OPEN': 'assets/logos/tennis/tornei/Australian Open.png',
      'ROLAND_GARROS': 'assets/logos/tennis/tornei/Roland Garros.png',
      'US_OPEN': 'assets/logos/tennis/tornei/US Open.png',
      'WIMBLEDON': 'assets/logos/tennis/tornei/wimbledon.png',
    };
    return (campionatoId && map[campionatoId]) || null;
  }

  getGiocaIcon(sportId: string): string {
    // Icona pallone calcio
    if (sportId === 'BASKET') return 'sports_basketball';
    if (sportId === 'CALCIO') return 'sports_soccer';
    if (sportId === 'TENNIS') return 'sports_tennis';
    return 'sports_esports';
  }


}
