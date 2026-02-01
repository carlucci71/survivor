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

  getGiocaIcon(sportId: string): string {
    // Icona pallone calcio
    if (sportId === 'BASKET') return 'sports_basketball';
    if (sportId === 'CALCIO') return 'sports_soccer';
    if (sportId === 'TENNIS') return 'sports_tennis';
    return 'sports_esports';
  }


}
