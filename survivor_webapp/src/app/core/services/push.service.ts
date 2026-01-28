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
    await PushNotifications.register();
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
      void this.sendTokenToBackend(token.value).catch((error) => {
        console.error('Errore invio token push al backend', error);
      });
    });

    PushNotifications.addListener('registrationError', (error) => {
      console.error('Errore registrazione push', error);
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

    await firstValueFrom(this.http.post(`${environment.apiUrl}/push/register`, payload));
  }
}
