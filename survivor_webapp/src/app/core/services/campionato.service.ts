import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campionato } from '../models/interfaces.model';

@Injectable({ providedIn: 'root' })
export class CampionatoService {
  private apiUrl = `${environment.apiUrl}/campionato`;

  constructor(private http: HttpClient) {}

  getCampionatoBySport(idSport: String): Observable<Campionato[]> {
    return this.http.get<Campionato[]>(`${this.apiUrl}/${idSport}`);
  }

  getDesGiornate(idSport: String): Observable<any[]> {
    return this.http.get<Campionato[]>(`${this.apiUrl}/desGiornate/${idSport}`);
  }


}
