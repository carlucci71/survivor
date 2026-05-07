import { Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Capacitor } from '@capacitor/core';
import { Device } from '@capacitor/device';
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

  /**
   * Check for FCM token in iOS UserDefaults (set by Firebase MessagingDelegate)
   */
  private async checkFCMTokenFromUserDefaults(): Promise<void> {
    try {
      // Use native code to read from UserDefaults
      const token = await this.getFCMTokenFromNative();
      
      if (token && token !== this.lastRegisteredToken) {
        const authService = this.injector.get(AuthService);
        if (authService?.getCurrentUser()) {
          await this.sendTokenToBackend(token);
          // Cancella il token da localStorage dopo averlo inviato con successo
          // così alla prossima apertura Firebase fornirà il token aggiornato
          localStorage.removeItem('FCMToken');
        }
      }
    } catch (err) {
      // Impossibile recuperare FCM token da UserDefaults
    }
  }

  /**
   * Get FCM token from iOS UserDefaults using native bridge
   */
  private async getFCMTokenFromNative(): Promise<string | null> {
    // Simple approach: execute JS to access localStorage where we'll sync from UserDefaults
    // Or use a native plugin - for now we'll use a workaround via evaluating native code
    return new Promise((resolve) => {
      // Check if running on iOS
      if (Capacitor.getPlatform() !== 'ios') {
        resolve(null);
        return;
      }
      
      // Try to get from localStorage as fallback (we can sync UserDefaults to localStorage)
      const stored = localStorage.getItem('FCMToken');
      resolve(stored);
    });
  }

  /**
   * Get Persistent Device ID from iOS UserDefaults (set by AppDelegate at startup)
   */
  private async getPersistentDeviceIdFromNative(): Promise<string | null> {
    return new Promise((resolve) => {
      if (Capacitor.getPlatform() !== 'ios') {
        resolve(null);
        return;
      }
      
      const stored = localStorage.getItem('PersistentDeviceId');
      resolve(stored);
    });
  }

  private registerListeners(): void {
    PushNotifications.addListener('registration', (token: Token) => {
      const platform = Capacitor.getPlatform();

      // Invia il token solo se l'utente è già autenticato
      try {
        const authService = this.injector.get(AuthService);
        if (authService && typeof authService.getCurrentUser === 'function' && authService.getCurrentUser()) {
          void this.sendTokenToBackend(token.value).catch(() => {
            // Invio token push fallito, verrà ritentato al prossimo avvio
          });
        }
      } catch (err) {
        // AuthService non disponibile, token push verrà registrato dopo il login
      }
    });

    // On iOS, check for FCM token in UserDefaults after app loads
    if (Capacitor.getPlatform() === 'ios') {
      // Aspetta 6 secondi per dare tempo a:
      // 1. Firebase di generare e salvare il token FCM
      // 2. AppDelegate di salvare il Persistent Device ID
      setTimeout(() => {
        this.checkFCMTokenFromUserDefaults();
      }, 6000);
    }

    PushNotifications.addListener('registrationError', (error: any) => {
      console.error('Errore registrazione push - Firebase potrebbe non essere configurato', error);
    });

    PushNotifications.addListener('pushNotificationReceived', (_notification: PushNotificationSchema) => {
      // Already shown by the OS; keep listener to avoid silent failures.
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action: ActionPerformed) => {
      const data = action.notification.data ?? {};
      const tipoNotifica: string = data['tipoNotifica'] ?? data['type'] ?? '';
      const legaId: string | undefined = data['legaId'] ?? data['legaid'];

      if (!legaId) return;

      const router = this.injector.get(Router);

      if (tipoNotifica === 'RECAP_GIORNATA') {
        const giornata: string | undefined = data['giornata'];
        if (giornata) {
          router.navigate(['/recap', legaId, giornata]);
        } else {
          router.navigate(['/lega', legaId]);
        }
      } else {
        router.navigate(['/lega', legaId]);
      }
    });
  }

  private async sendTokenToBackend(token: string): Promise<void> {
    if (!token || token === this.lastRegisteredToken) {
      return;
    }

    this.lastRegisteredToken = token;

    // Ottieni il device ID (persistente su iOS via Keychain/UserDefaults)
    const platform = Capacitor.getPlatform();
    let deviceId: string;
    
    if (platform === 'ios') {
      // Su iOS prova a leggere il device ID persistente da UserDefaults
      const persistentId = await this.getPersistentDeviceIdFromNative();
      
      if (persistentId) {
        deviceId = persistentId;
      } else {
        const deviceInfo = await Device.getId();
        deviceId = deviceInfo.identifier;
      }
    } else {
      // Su Android usa il device ID standard
      const deviceInfo = await Device.getId();
      deviceId = deviceInfo.identifier;
    }
    
    const payload = {
      token,
      platform,
      deviceId,
    };

    const url = `${environment.apiUrl}/push/register`;

    try {
      await firstValueFrom(this.http.post(url, payload));
    } catch (error) {
      console.error('Errore invio token push al backend:', error);
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
