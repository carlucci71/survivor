import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackMessageComponent } from '../../shared/components/snack-message/snack-message.component';
import { AuthService } from '../services/auth.service';
import { LoadingService } from '../services/loading.service';
import { catchError, switchMap, throwError, finalize } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();
  const snackBar = inject(MatSnackBar);
  const loading = inject(LoadingService);

  let authReq = req;
  if (token) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  // Show loading overlay for every outgoing request
  try {
    loading.show(true);
  } catch (e) {
    /* noop if injection fails */
  }

  return next(authReq).pipe(
    catchError((error: any) => {
      // If backend is down or network error, redirect to friendly page
      try {
        const skipHeader = authReq && authReq.headers && authReq.headers.get
          ? authReq.headers.get('X-Skip-ServiceUnavailable')
          : null;
        if (!skipHeader && error instanceof HttpErrorResponse && (error.status === 503 || error.status === 0)) {
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
            loading.reset();
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
          console.log('Refresh token: ' + error.message);
          return authService.refreshToken(expiredToken).pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`,
                  },
                });
                console.log('Token refresh ok!!');
                return next(retryReq);
              }
              console.log('Forzo logout per authService.getToken() null ' + error.message);
              try {
                loading.reset();
              } catch (e) {}
              authService.logout();
              return throwError(() => error);
            }),
            catchError((refreshError) => {
              console.log('Forzo logout per refreshError: ' + refreshError + ' --- ' + error.message);
              try {
                loading.reset();
              } catch (e) {}
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          console.log('Forzo logout senza expiredToken: ' + error.message);
          try {
            loading.reset();
          } catch (e) {}
          authService.logout();
        }
      } else {
        let fullMessage = '';

        if (error.status != 499) {
          if (!fullMessage) {
            const msgParts = [] as string[];
            if (error?.message) {
              msgParts.push('Chiamata in errore: ' + error.url + ' [' + error.status + ']');
            } else {
              msgParts.push('An error occurred');
            }
            if (error?.error?.message) {
              msgParts.push(String(error.error.message));
            }
            if (error?.error?.id) {
              msgParts.push(String(error.error.id));
            }
            fullMessage = msgParts.join('\n');
          }

          snackBar.openFromComponent(SnackMessageComponent, {
            data: fullMessage,
            duration: 5000,
            panelClass: 'multi-line-snackbar',
          });
        }
      }
      try {
        loading.reset();
      } catch (e) {}
      return throwError(() => error);
    }),
    finalize(() => {
      try {
        loading.hide();
      } catch (e) {}
    })
  );
};
