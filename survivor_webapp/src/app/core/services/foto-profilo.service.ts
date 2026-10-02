import { Injectable } from '@angular/core';
import { HttpClient, HttpContext, HttpResponse } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SILENT_REQUEST } from '../interceptors/auth.interceptor';

/** Riga della lista admin: foto segnalate, nascoste in automatico o con caricamento bloccato. */
export interface FotoSegnalata {
  giocatoreId: number;
  nickname: string;
  numSegnalazioni: number;
  nascosta: boolean;
  bloccata: boolean;
  haFoto: boolean;
}

/**
 * Foto profilo. Il file non si puo' mettere in un `<img src>` diretto: l'endpoint e' protetto dal JWT (serve solo a
 * chi condivide una lega col giocatore) e un tag img non manda l'header Authorization. Quindi si scarica come blob via
 * HttpClient e si mostra un URL oggetto, in cache per (giocatore, versione) cosi' ogni foto si scarica una volta sola
 * anche se compare in decine di righe. Le richieste sono "silenziose": niente overlay di caricamento ne' snackbar.
 */
@Injectable({ providedIn: 'root' })
export class FotoProfiloService {
  private apiUrl = `${environment.apiUrl}/giocatore`;
  private adminUrl = `${environment.apiUrl}/admin/foto`;

  private cache = new Map<string, Observable<string | null>>();
  /** Foto che ho segnalato in questa sessione: da subito non le mostro piu' (il backend lo fa comunque). */
  private nascosteDaMe = new Set<number>();

  /** Nuova versione della MIA foto (null = rimossa): home e profilo si aggiornano senza ricaricare. */
  readonly miaFotoCambiata$ = new Subject<number | null>();

  constructor(private http: HttpClient) {}

  private silent(): HttpContext {
    return new HttpContext().set(SILENT_REQUEST, true);
  }

  /** URL (blob:) della foto, o null se non c'e', non e' visibile o e' stata segnalata da me. */
  getUrl(giocatoreId: number | null | undefined, version: number | null | undefined): Observable<string | null> {
    if (!giocatoreId || !version || this.nascosteDaMe.has(giocatoreId)) return of(null);
    const key = `${giocatoreId}:${version}`;
    let obs = this.cache.get(key);
    if (!obs) {
      obs = this.http
        .get(`${this.apiUrl}/${giocatoreId}/foto`, {
          params: { v: String(version) },
          responseType: 'blob',
          observe: 'response',
          context: this.silent(),
        })
        .pipe(
          // 204 = nessuna foto visibile (caso normale, resta in cache fino al cambio di versione)
          map((res: HttpResponse<Blob>) => (res.status === 200 && res.body && res.body.size > 0 ? URL.createObjectURL(res.body) : null)),
          catchError(() => {
            this.cache.delete(key); // errore di rete: al prossimo tentativo si riprova
            return of(null);
          }),
          shareReplay(1)
        );
      this.cache.set(key, obs);
    }
    return obs;
  }

  /** Per l'admin: scarica la foto anche se nascosta o senza versione pubblica (nessuna cache). */
  getUrlAdmin(giocatoreId: number): Observable<string | null> {
    return this.http
      .get(`${this.apiUrl}/${giocatoreId}/foto`, {
        params: { v: `admin${Date.now()}` },
        responseType: 'blob',
        observe: 'response',
        context: this.silent(),
      })
      .pipe(
        map((res: HttpResponse<Blob>) => (res.status === 200 && res.body && res.body.size > 0 ? URL.createObjectURL(res.body) : null)),
        catchError(() => of(null))
      );
  }

  /** Carica la mia foto (gia' ritagliata dal client). Errori gestiti: leggere `err.error.errorCode`. */
  carica(blob: Blob): Observable<number> {
    const fd = new FormData();
    fd.append('file', blob, 'foto.jpg');
    return this.http.put<{ fotoVersion: number }>(`${this.apiUrl}/me/foto`, fd).pipe(
      map((r) => r.fotoVersion),
      tap((v) => this.miaFotoCambiata$.next(v))
    );
  }

  rimuovi(): Observable<unknown> {
    return this.http.delete(`${this.apiUrl}/me/foto`).pipe(tap(() => this.miaFotoCambiata$.next(null)));
  }

  /** Segnala la foto di un altro giocatore; da subito non la mostro piu'. */
  segnala(giocatoreId: number): Observable<unknown> {
    return this.http.post(`${this.apiUrl}/${giocatoreId}/foto/segnala`, {}).pipe(
      tap(() => {
        this.nascosteDaMe.add(giocatoreId);
        for (const k of [...this.cache.keys()]) {
          if (k.startsWith(`${giocatoreId}:`)) this.cache.delete(k);
        }
      })
    );
  }

  // ── Admin ──
  segnalate(): Observable<FotoSegnalata[]> {
    return this.http.get<FotoSegnalata[]>(`${this.adminUrl}/segnalate`);
  }

  adminRimuovi(giocatoreId: number, blocca: boolean): Observable<unknown> {
    return this.http.post(`${this.adminUrl}/${giocatoreId}/rimuovi`, {}, { params: { blocca: String(blocca) } });
  }

  adminRipristina(giocatoreId: number): Observable<unknown> {
    return this.http.post(`${this.adminUrl}/${giocatoreId}/ripristina`, {});
  }

  adminSblocca(giocatoreId: number): Observable<unknown> {
    return this.http.post(`${this.adminUrl}/${giocatoreId}/sblocca`, {});
  }
}
