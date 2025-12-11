import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GiocataService {
    salvaGiocata(body: any): Observable<any> {
      return this.http.post<any>(`${environment.apiUrl}/api/survivorBe/giocate`, body);
    }
  constructor(private http: HttpClient) {}

  getGiocate(): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}/api/survivorBe/giocate`);
  }
}
