import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReactionService {
  private apiUrl = `${environment.apiUrl}/reaction`;

  constructor(private http: HttpClient) {}

  reagisci(giocataId: number, emoji: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${giocataId}`, { emoji });
  }

  rimuovi(giocataId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${giocataId}`);
  }
}
