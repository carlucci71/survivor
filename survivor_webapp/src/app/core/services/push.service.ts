import { Injectable } from '@angular/core';
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

@Injectable({ providedIn: 'root' })
export class PushService {
  private lastRegisteredToken: string | null = null;
  private pendingToken: string | null = null;

  constructor(private http: HttpClient) {}

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

    this.registerListeners();
    
    try {
      await PushNotifications.register();
    } catch (error) {
      console.error('Errore registrazione push notifications - Firebase non configurato?', error);
      // L'app continua a funzionare anche senza notifiche push
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
      this.pendingToken = token.value;
      void this.sendTokenToBackend(token.value).catch((error) => {
        console.warn('Impossibile inviare token push ora (probabilmente utente non autenticato):', error);
      });
    });

    PushNotifications.addListener('registrationError', (error) => {
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
   * Chiamare questo metodo dopo il login per inviare il token push al backend
   */
  async sendPendingToken(): Promise<void> {
    if (this.pendingToken) {
      try {
        await this.sendTokenToBackend(this.pendingToken);
        this.pendingToken = null;
      } catch (error) {
        console.error('Errore invio token push dopo login:', error);
      }
    }
  }
}
