import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Giocatore } from '../models/interfaces.model';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiocatoreService {

  private apiUrl = `${environment.apiUrl}/giocatore`;

    constructor(private http: HttpClient) {}

    me(): Observable<Giocatore> {

      return this.http.get<any>(`${this.apiUrl}/me`);
    }

    aggiornaMe(giocatore: Giocatore): Observable<Giocatore> {
      return this.http.put<Giocatore>(`${this.apiUrl}/me`, giocatore);
    }



}
