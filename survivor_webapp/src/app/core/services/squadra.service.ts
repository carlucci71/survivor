import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { Squadra } from '../models/interfaces.model';

@Injectable({ providedIn: 'root' })
export class SquadraService {
  private apiUrl = `${environment.apiUrl}/squadre`;

    private cache: Map<string, any[]> = new Map();

  constructor(private http: HttpClient) {}

  getSquadreByCampionato(campionatoId: string): Observable<any[]> {
    if (this.cache.has(campionatoId)) {
      return of(this.cache.get(campionatoId)!);
    }
    return this.http.get<any[]>(`${this.apiUrl}/campionato/${campionatoId}`).pipe(
      tap(squadre => {
        this.cache.set(campionatoId, squadre);
  })
    );
  }

  getSquadraNomeBySigla(squadraSigla: string|null, campionatoId: string): string|null {
    const squadre = this.cache.get(campionatoId);
    if (squadre) {
      const squadra = squadre.find(s => s.sigla === squadraSigla);
      return squadra ? squadra.nome : squadraSigla;
    }
    return squadraSigla;
  }

  getSquadreByCampionatoAndGiornata(campionatoId: string, giornata: number): Observable<string[]> {
    return this.http.get<any[]>(`${this.apiUrl}/calendario/${campionatoId}/squadreDisponibili/${giornata}`);
  }


}
