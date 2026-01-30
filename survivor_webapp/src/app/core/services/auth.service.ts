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
    this.getMyData().subscribe({
      next: (response: AuthResponse) => {
        if (!response) {
          // myData returned null, redirect to login
          this.currentUserSubject.next(null);
          this.router.navigate(['/login']);
          return;
        }
        // handle and store token + user via existing helper
        this.handleAuthResponse(response);
      },
      error: (error) => {
        console.error('Errore :', error);
        // failed to load user; ensure subject is null
        this.currentUserSubject.next(null);

        // If backend returned 503 or there was a network error (status 0),
        // show a friendly "service unavailable" page with a refresh option.
        const status = error && (error.status || (error.statusCode as any));
        if (status === 503 || status === 0 || !status) {
          this.router.navigate(['/service-unavailable']);
        } else {
          this.router.navigate(['/login']);
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
