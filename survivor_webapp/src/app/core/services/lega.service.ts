import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega, Partita } from '../models/interfaces.model'; 
import { map } from 'rxjs/operators';
import { mapLegaFromBE } from '../utils/lega-mapper';


@Injectable({
  providedIn: 'root'
})
export class LegaService {
  private apiUrl = '/api/survivorBe/lega';

  constructor(private http: HttpClient) {}

  mieLeghe(): Observable<Lega[]> {
    return this.http.get<Lega[]>(`${this.apiUrl}/mieLeghe`).pipe(
      map(leghe => leghe.map(mapLegaFromBE))
    );
  }

  getLegaById(id: number): Observable<Lega> {
    return this.http.get<Lega>(`${this.apiUrl}/${id}`).pipe(
      map(mapLegaFromBE)
    );
  }

  ultimiRisultati(sportId: string,campionatoId: string, squadraId: string, giornata: number): Observable<Partita[]> {
      return this.http.get<any>(`${this.apiUrl}/ultimiRisultati/${sportId}/${campionatoId}/${squadraId}/${giornata}`);
  }

}

