import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Giocatore } from '../models/interfaces.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GiocatoreService {

  private apiUrl = `${environment.apiUrl}/giocatore`;

  // Subject per notificare le modifiche al profilo
  private giocatoreAggiornato$ = new BehaviorSubject<Giocatore | null>(null);

  // Observable pubblico per sottoscriversi agli aggiornamenti
  public giocatoreAggiornato = this.giocatoreAggiornato$.asObservable();

    constructor(private http: HttpClient) {}

    me(): Observable<Giocatore> {
      return this.http.get<any>(`${this.apiUrl}/me`).pipe(
        tap(giocatore => this.giocatoreAggiornato$.next(giocatore))
      );
    }

    aggiornaMe(giocatore: Giocatore): Observable<Giocatore> {
      return this.http.put<Giocatore>(`${this.apiUrl}/me`, giocatore).pipe(
        tap(giocatoreAggiornato => this.giocatoreAggiornato$.next(giocatoreAggiornato))
      );
    }



}
