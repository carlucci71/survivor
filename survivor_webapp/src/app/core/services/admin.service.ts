import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lega } from '../models/interfaces.model';
import { map } from 'rxjs/operators';
import { mapLegaFromBE } from '../utils/lega-mapper';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  aggiornaForzataPartita(
    idLega: number,
    campionatoId: string,
    anno: number,
    giornata: number,
    casaSigla: string,
    fuoriSigla: string,
    forzata: boolean
  ): Observable<any> {
    const params = {
      campionatoId,
      anno: anno.toString(),
      giornata: giornata.toString(),
      casaSigla,
      fuoriSigla,
      forzata: forzata.toString()
    };

    return this.http.put(`${this.apiUrl}/partita/forzata/${idLega}`, null, { params });
  }

}
