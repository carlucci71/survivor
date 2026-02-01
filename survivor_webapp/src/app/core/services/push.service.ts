import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class PushService {
  private lastRegisteredToken: string | null = null;


  constructor(private readonly http: HttpClient, private readonly injector: Injector) {}

  /**
   * Initializes push registration on supported platforms (iOS/Android native).
   * No-ops on web/desktop.
   */
  async initPush(): Promise<void> {
    if (!this.isNativeMobile()) {
      return;
    }

    const permissionGranted = await this.ensurePermission();
    if (!permissionGranted) {
      return;
    }

    // Se la route corrente è la pagina di login, rimandiamo la registrazione
    // finché l'utente non completa il login con magic link. Questo evita che
    // il device venga registrato automaticamente quando l'app apre la schermata
    // di login.
    const router = this.injector.get(Router);
    const authService = this.injector.get(AuthService);
    const onLoginRoute = router && typeof router.url === 'string' && router.url.includes('/login');

    // Se l'utente è già autenticato (e non siamo sulla pagina di login), procediamo subito.
    // Altrimenti rimandiamo la registrazione finché `AuthService.currentUser$`
    // non emette un utente non-null (avvenuto login in handleAuthResponse()).
    if (!onLoginRoute && authService && typeof authService.getCurrentUser === 'function' && authService.getCurrentUser()) {
      this.registerListeners();
      try {
        await PushNotifications.register();
      } catch (error) {
        console.error('Errore registrazione push notifications - Firebase non configurato?', error);
      }
      return;
    }

    // Non c'è user: registriamo i listener (così salviamo pendingToken), ma
    // non chiamiamo ancora `PushNotifications.register()` fino al login.
    this.registerListeners();

    // Subscribe to auth changes and register when user logs in (or when we
    // leave the login route and a user is present).
    let sub: Subscription | null = null;
    try {
      sub = authService.currentUser$.subscribe(async (user) => {
        // If we receive a user, register the device.
        if (user) {
          try {
            await PushNotifications.register();
          } catch (error) {
            console.error('Errore registrazione push notifications dopo login:', error);
          }
          if (sub) {
            sub.unsubscribe();
          }
          return;
        }

        // If we are on the login route but user still null, wait.
        // If we leave the login route (user might still be null), attempt
        // registration only if a user becomes available later.
      });
    } catch (err) {
      console.warn('Impossibile sottoscrivere a currentUser$ per registrazione push differita', err);
      // In caso di problemi, non blocchiamo l'app; non registriamo il device.
    }
  }

  private isNativeMobile(): boolean {
    const platform = Capacitor.getPlatform();
    return environment.mobile && platform !== 'web';
  }

  private async ensurePermission(): Promise<boolean> {
    const status = await PushNotifications.checkPermissions();
    if (status.receive === 'granted') {
      return true;
    }

    const requestStatus = await PushNotifications.requestPermissions();
    return requestStatus.receive === 'granted';
  }

  private registerListeners(): void {
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push notification token registrato:', token.value);

      // Invia il token solo se l'utente è già autenticato. Usiamo l'injector
      // per risolvere `AuthService` al momento dell'evento e evitare problemi
      // di dipendenze circolari con l'iniezione diretta.
      try {
        const authService = this.injector.get(AuthService);
        // Preferiamo verificare che l'utente sia effettivamente caricato (non solo
        // che sia presente un token in localStorage) per evitare chiamate al backend
        // senza user. `getCurrentUser()` ritorna `User | null`.
        if (authService && typeof authService.getCurrentUser === 'function' && authService.getCurrentUser()) {
          void this.sendTokenToBackend(token.value).catch((error) => {
            console.warn('Impossibile inviare token push ora:', error);
          });
        } else {
          console.log('Utente non autenticato: token push salvato in attesa di login');
        }
      } catch (err) {
        console.log('AuthService non disponibile al momento; token push salvato in attesa di login', err);
      }
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Errore registrazione push - Firebase potrebbe non essere configurato', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (_notification: PushNotificationSchema) => {
      // Already shown by the OS; keep listener to avoid silent failures.
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (_action: ActionPerformed) => {
      // TODO: handle deep-link navigation if needed (e.g., apri lega specifica).
    });
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    if (!token || token === this.lastRegisteredToken) {
      return;
    }

    this.lastRegisteredToken = token;

    const payload = {
      token,
      platform: Capacitor.getPlatform(),
    };

    const url = `${environment.apiUrl}/push/register`;
    console.log('Invio token push al backend:', url, payload);

    try {
      await firstValueFrom(this.http.post(url, payload));
      console.log('Token push inviato con successo al backend');
    } catch (error) {
      console.error('Errore invio token push al backend - URL:', url, 'Error:', error);
      throw error;
    }
  }

  /**
   * (Deprecated) previously used to send a token cached before login. Device
   * registration is now started from `HomeComponent` after authentication,
   * so this helper is no longer necessary.
   */
  // sendPendingToken removed — registration happens after login in HomeComponent
}
