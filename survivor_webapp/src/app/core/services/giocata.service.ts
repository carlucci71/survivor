import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Giocatore } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class GiocataService {
    salvaGiocata(giornata: number, giocatoreId: number, squadraSelezionata: string, legaId: number): Observable<Giocatore> {
    const body = {
      giornata: giornata,
      legaId: legaId,
      giocatoreId: giocatoreId,
      squadraId: squadraSelezionata,
    };

      return this.http.post<any>(`${environment.apiUrl}/api/survivorBe/giocate`, body);
    }
  constructor(private http: HttpClient) {}

  getGiocate(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/survivorBe/giocate`);
  }
}
