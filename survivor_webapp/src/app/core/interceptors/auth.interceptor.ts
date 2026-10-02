import { HttpInterceptorFn, HttpErrorResponse, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SnackMessageComponent } from '../../shared/components/snack-message/snack-message.component';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { catchError, switchMap, throwError, finalize } from 'rxjs';

/**
 * Richieste "silenziose": niente overlay di caricamento, niente redirect a service-unavailable, niente snackbar
 * di errore. Servono alle chiamate di sottofondo che possono fallire senza che all'utente importi (es. scaricare
 * l'avatar di ogni giocatore di una lega: decine di richieste, e un 204/errore e' un caso normale).
 * Uso: `http.get(url, { context: new HttpContext().set(SILENT_REQUEST, true) })`.
 */
export const SILENT_REQUEST = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const snackBar = inject(MatSnackBar);
  const loading = inject(LoadingService);
  const translate = inject(TranslateService);
  const silent = req.context.get(SILENT_REQUEST);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Allow certain requests (probe) to opt-out of global service-unavailable redirect and snackbars
  const skipServiceUnavailable = authReq && authReq.headers && authReq.headers.get
    ? authReq.headers.get('X-Skip-ServiceUnavailable')
    : null;

  // Show loading overlay for every outgoing request
  try {
    if (!silent) { loading.show(true); }
  } catch (e) {
    /* noop if injection fails */
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      // If backend is down or network error, redirect to friendly page (unless skip header present)
      try {
        if (!silent && !skipServiceUnavailable && error instanceof HttpErrorResponse && (error.status === 503 || error.status === 0)) {
          try {
            const router = inject(Router);
            // avoid redirect loop
            const current = router?.url || '';
            if (current !== '/service-unavailable') {
              router.navigate(['/service-unavailable']);
            }
          } catch (e) {
            /* noop */
          }
          try {
            const loading = inject(LoadingService);
            if (!silent) { loading.reset(); }
          } catch (e) {}
          return throwError(() => error);
        }
      } catch (e) {
        // ignore header read errors and continue
      }

      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Use current JWT as a refresh token attempt
        const expiredToken = authService.getToken();
        if (expiredToken) {
          return authService.refreshToken(expiredToken).pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                return next(retryReq);
              }
              try {
                if (!silent) { loading.reset(); }
              } catch (e) {}
              authService.logout();
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              try {
                if (!silent) { loading.reset(); }
              } catch (e) {}
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          try {
            if (!silent) { loading.reset(); }
          } catch (e) {}
          authService.logout();
        }
      } else {
        if (error.status != 499 && !silent) {
          // Messaggio pensato per l'utente: solo quello del backend se presente,
          // niente URL/status code tecnici (quelli restano nella console per il debug).
          const backendMessage = error?.error?.message ? String(error.error.message) : '';
          const fullMessage = backendMessage || translate.instant('COMMON.ERROR_GENERIC');

          if (!skipServiceUnavailable) {
            snackBar.openFromComponent(SnackMessageComponent, {
              data: fullMessage,
              duration: 5000,
              panelClass: 'app-error-snackbar',
            });
          }
        }
      }
      try {
        if (!silent) { loading.reset(); }
      } catch (e) {}
      return throwError(() => error);
    }),
    finalize(() => {
      try {
        if (!silent) { loading.hide(); }
      } catch (e) {}
    })
  );
};
