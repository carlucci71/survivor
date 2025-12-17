import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Giocatore } from '../models/interfaces.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GiocatoreService {

  private apiUrl = '/api/survivorBe/giocatore';

    constructor(private http: HttpClient) {}

    me(): Observable<Giocatore> {

      return this.http.get<any>(`${this.apiUrl}/me`);
    }

    aggiornaMe(giocatore: Giocatore): Observable<Giocatore> {
      return this.http.put<Giocatore>(`${this.apiUrl}/me`, giocatore);
    }



}
