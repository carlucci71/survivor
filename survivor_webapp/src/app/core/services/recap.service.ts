import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RecapGiornata } from '../models/interfaces.model';
import { environment } from '../../../environments/environment';

const SEEN_KEY = 'recap_seen';

@Injectable({ providedIn: 'root' })
export class RecapService {
  private apiUrl = `${environment.apiUrl}/lega`;

  constructor(private http: HttpClient) {}

  getRecap(legaId: number, giornata: number): Observable<RecapGiornata> {
    return this.http.get<RecapGiornata>(`${this.apiUrl}/${legaId}/recap/${giornata}`);
  }

  /** Segna come vista la recap di una specifica lega+giornata */
  markAsSeen(legaId: number, giornata: number): void {
    const seen = this.getSeenSet();
    seen.add(`${legaId}_${giornata}`);
    localStorage.setItem(SEEN_KEY, JSON.stringify([...seen]));
  }

  isSeen(legaId: number, giornata: number): boolean {
    return this.getSeenSet().has(`${legaId}_${giornata}`);
  }

  private getSeenSet(): Set<string> {
    try {
      const raw = localStorage.getItem(SEEN_KEY);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  }
}
