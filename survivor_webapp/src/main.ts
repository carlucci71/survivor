import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

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
  .catch((err) => console.error(err));
