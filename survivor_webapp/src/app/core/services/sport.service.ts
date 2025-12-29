import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sport } from '../models/interfaces.model';

@Injectable({
  providedIn: 'root'
})
export class SportService {
  private apiUrl = `${environment.apiUrl}/sport`;

  constructor(private http: HttpClient) { }

  getSport(): Observable<Sport[]> {
    return this.http.get<Sport[]>(`${this.apiUrl}`);
  }
}
