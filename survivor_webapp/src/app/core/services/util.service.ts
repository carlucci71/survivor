import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Lega } from '../models/lega.model';

@Injectable({
  providedIn: 'root'
})
export class UtilService {
  private apiUrl = '/api/survivorBe/util';

  constructor(private http: HttpClient) {}

  profilo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/profilo`);
  }
}
