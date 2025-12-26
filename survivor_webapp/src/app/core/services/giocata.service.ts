import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Giocatore } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root',
})
export class GiocataService {

  private apiUrl = `${environment.apiUrl}/giocate`;

    constructor(private http: HttpClient) {}

    salvaGiocata(giornata: number, giocatoreId: number, squadraSelezionata: string, legaId: number): Observable<Giocatore> {
    const body = {
      giornata: giornata,
      legaId: legaId,
      giocatoreId: giocatoreId,
      squadraSigla: squadraSelezionata,
    };

      return this.http.post<any>(`${this.apiUrl}`, body);
    }

}
