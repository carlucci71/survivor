import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Giocatore } from '../models/interfaces.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LanguageService } from './language.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class GiocatoreService {

  private apiUrl = `${environment.apiUrl}/giocatore`;

  // Subject per notificare le modifiche al profilo
  private giocatoreAggiornato$ = new BehaviorSubject<Giocatore | null>(null);

  // Observable pubblico per sottoscriversi agli aggiornamenti
  public giocatoreAggiornato = this.giocatoreAggiornato$.asObservable();

    constructor(
      private http: HttpClient,
      private languageService: LanguageService,
      private authService: AuthService
    ) {
      // Ogni volta che la lingua dell'app cambia (o appena l'utente risulta autenticato),
      // sincronizza la preferenza sul backend: serve per tradurre le notifiche push,
      // finora sempre e solo in italiano perché il backend non sapeva la lingua dell'utente.
      this.languageService.currentLang$.subscribe(lang => {
        if (this.authService.isAuthenticated()) {
          this.aggiornaLingua(lang).subscribe({ error: () => {} });
        }
      });
    }

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

    aggiornaLingua(lingua: string): Observable<void> {
      return this.http.put<void>(`${this.apiUrl}/lingua`, { lingua }).pipe(
        catchError(() => of(void 0))
      );
    }

}
