import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import {
  MagicLinkRequest,
  MagicLinkResponse,
  AuthResponse,
  User
} from '../models/auth.model';
import { environment } from '../../../environments/environment';
import { PushService } from './push.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private userLoadedSubject = new BehaviorSubject<boolean>(false);
  public userLoaded$ = this.userLoadedSubject.asObservable();

  constructor(private injector: Injector) {
    // Defer loading user until after DI finishes to avoid circular DI (interceptor -> AuthService -> HttpClient)
    Promise.resolve().then(() => this.loadUserFromBE());
  }

  private get http(): HttpClient {
    return this.injector.get(HttpClient);
  }

  private get router(): Router {
    return this.injector.get(Router);
  }

  requestMagicLink(email: string, mobile: boolean): Observable<MagicLinkResponse> {
    const request: MagicLinkRequest = { email, mobile };
    return this.http.post<MagicLinkResponse>(
      `${this.apiUrl}/request-magic-link`,
      request
    );
  }

  verifyMagicLink(token: string,codiceTipoMagicLink :string): Observable<AuthResponse> {
    return this.http.get<AuthResponse>(`${this.apiUrl}/verify`, {
      params: { token,codiceTipoMagicLink }
    }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  private handleAuthResponse(response: AuthResponse): void {
    localStorage.setItem('tokenSurvivor', response.token);
    const user: User = {
      id: response.id,
      email: response.email,
      name: response.name,
      role: response.role
    };
    this.currentUserSubject.next(user);

    // Push registration is now started from `HomeComponent` after login,
    // so no need to send a cached token here.
  }

  refreshToken(refreshToken: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/refresh-token`, { refreshToken }).pipe(
      tap(response => this.handleAuthResponse(response))
    );
  }

  getMyData(skipServiceUnavailableRedirect = false): Observable<AuthResponse> {
    const options: { headers?: HttpHeaders } = {};
    if (skipServiceUnavailableRedirect) {
      options.headers = new HttpHeaders({ 'X-Skip-ServiceUnavailable': '1' });
    }
    return this.http.post<AuthResponse>(`${this.apiUrl}/myData`, {}, options);
  }

  // Probe endpoint and update local auth state if successful.
  probeMyData(skipServiceUnavailableRedirect = false): Observable<AuthResponse> {
    return this.getMyData(skipServiceUnavailableRedirect).pipe(
      tap((response: AuthResponse) => {
        if (response) {
          this.handleAuthResponse(response);
        }
      })
    );
  }


  private loadUserFromBE(): void {
    const token = this.getToken();

    // Se non c'è token, non fare la chiamata
    if (!token) {
      this.currentUserSubject.next(null);
      this.userLoadedSubject.next(true);
      return;
    }

    this.getMyData().subscribe({
      next: (response: AuthResponse) => {
        if (!response) {
          // myData returned null, logout e redirect to login
          this.logout();
          this.userLoadedSubject.next(true);
          this.router.navigate(['/auth/login']);
          return;
        }
        // handle and store token + user via existing helper
        this.handleAuthResponse(response);
        this.userLoadedSubject.next(true);
      },
      error: (error) => {
        console.error('Errore nel caricamento utente:', error);

        // Se errore 401/403, il token non è più valido → logout
        const status = error && (error.status || (error.statusCode as any));
        if (status === 401 || status === 403) {
          this.logout();
          this.userLoadedSubject.next(true);
          this.router.navigate(['/auth/login']);
          return;
        }

        // failed to load user; ensure subject is null
        this.currentUserSubject.next(null);
        this.userLoadedSubject.next(true);

        // If backend returned 503 or there was a network error (status 0),
        // show a friendly "service unavailable" page with a refresh option.
        if (status === 503 || status === 0 || !status) {
          this.router.navigate(['/service-unavailable']);
        } else {
          this.logout();
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  getToken(): string | null {
    return localStorage.getItem('tokenSurvivor');
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

  isUserLoaded(): boolean {
    return this.userLoadedSubject.value;
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return !!user && user.role === 'ADMIN';
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  logout(): void {
    localStorage.removeItem('tokenSurvivor');
    this.currentUserSubject.next(null);
  }

  deleteAccount(): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/delete-account`).pipe(
      tap(() => {
        // Dopo la cancellazione, effettua il logout
        this.logout();
      })
    );
  }
}
