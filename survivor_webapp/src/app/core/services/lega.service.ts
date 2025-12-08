import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega } from '../models/lega.model';

@Injectable({
  providedIn: 'root'
})
export class LegaService {
  private apiUrl = '';

  constructor(private http: HttpClient) {}

  getLeghe(): Observable<Lega[]> {
    return this.http.get<Lega[]>(`${this.apiUrl}/first`);
  }
}
