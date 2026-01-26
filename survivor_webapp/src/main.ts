import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { App } from '@capacitor/app';
import { Router } from '@angular/router';

// Mark certain passive-friendly events as passive by default to avoid
// console warnings about non-passive wheel/touch listeners added by libraries.
// This shim wraps addEventListener and sets { passive: true } when the
// event is 'wheel', 'touchstart' or 'touchmove' and no options are provided.
;(function applyPassiveEventListenerShim() {
  try {
    if (typeof window === 'undefined' || !window.EventTarget) return;
    const origAddEvent = EventTarget.prototype.addEventListener;
    EventTarget.prototype.addEventListener = function (type: string, listener: any, options?: any) {
      if ((type === 'wheel' || type === 'touchstart' || type === 'touchmove') && (options === undefined || options === false)) {
        // default to passive: true to avoid blocking the main thread
        return origAddEvent.call(this, type, listener, { passive: true });
      }
      return origAddEvent.call(this, type, listener, options);
    };
  } catch (e) {
    // If anything goes wrong, silently ignore and continue bootstrapping.
    // We don't want this shim to break the app.
  }
})();

bootstrapApplication(AppComponent, appConfig)
  .then(appRef => {
    const router = appRef.injector.get(Router);

    // Handle deep links like survivor://auth/verify?... and route into the Angular app
    App.addListener('appUrlOpen', ({ url }: { url: string }) => {
      try {
        const parsed = new URL(url);
        const path = parsed.pathname.toLowerCase();
        const host = parsed.host.toLowerCase();
        //console.info('[DeepLink] appUrlOpen', { url, host, path });

        // For survivor://auth/verify?... the host is "auth" and the path is "/verify"
        const isVerify = (host === 'auth' && path.startsWith('/verify')) || path.startsWith('/auth/verify');

        if (isVerify) {
          const token = parsed.searchParams.get('token');
          const codiceTipoMagicLink = parsed.searchParams.get('codiceTipoMagicLink') || '';
          //console.info('[DeepLink] routing to /auth/verify', { token: !!token, codiceTipoMagicLink });
          router.navigate(['/auth/verify'], { queryParams: { token, codiceTipoMagicLink } });
        }
      } catch (e) {
        console.error('Failed to handle deep link', e);
      }
    });
  })
  .catch((err) => console.error(err));
