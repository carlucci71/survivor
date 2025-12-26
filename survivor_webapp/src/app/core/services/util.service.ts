import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private apiUrl = `${environment.apiUrl}/util`;

  constructor(private http: HttpClient) {}

  profilo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profilo`);
  }

  calendario(): Observable<any> {
    return this.http.get(`${this.apiUrl}/calendario`);
  }


}
