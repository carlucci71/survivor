import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SospensioniService {
  private apiUrl = `${environment.apiUrl}/sospensioniLega`;

  constructor(private http: HttpClient) {}

  getSospensioniLega(idLega: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${idLega}`);
  }

  updateSospensioni(payload: { verso: string; idLega: number; giornata: number }): Observable<any> {
    return this.http.put(`${this.apiUrl}`, payload); 
  }
}
