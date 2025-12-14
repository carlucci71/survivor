import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lega } from '../models/interfaces.model';
import { map } from 'rxjs/operators';
import { mapLegaFromBE } from '../utils/lega-mapper';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = '/api/survivorBe/admin';

  constructor(private http: HttpClient) {}

  calcola(id: number, giornata: number): Observable<Lega> {
    return this.http.put<Lega>(`${this.apiUrl}/calcola/${id}?giornata=${giornata}`, {})
      .pipe(map(mapLegaFromBE));
  }

}
