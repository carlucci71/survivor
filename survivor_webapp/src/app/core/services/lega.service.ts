import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega } from '../models/interfaces.model';


@Injectable({
  providedIn: 'root'
})
export class LegaService {
  private apiUrl = '/api/survivorBe/lega';

  constructor(private http: HttpClient) {}

  mieLeghe(): Observable<Lega[]> {
    return this.http.get<Lega[]>(`${this.apiUrl}/mieLeghe`);
  }

  getLegaById(id: number): Observable<Lega> {
    return this.http.get<Lega>(`${this.apiUrl}/${id}`);
  }


}
