import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
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
        Authorization: `Bearer ${token}`
      }
    });
  }

  // Show loading overlay for every outgoing request
  try { loading.show(true); } catch (e) { /* noop if injection fails */ }

  return next(authReq).pipe(
    catchError((error: any) => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Usa direttamente il token JWT attuale (anche se scaduto) come refresh token
        const expiredToken = authService.getToken();
        if (expiredToken) {
          console.log("Refresh token: " + error.message);
          return authService.refreshToken(expiredToken).pipe(
            switchMap(() => {
              const newToken = authService.getToken();
              if (newToken) {
                const retryReq = req.clone({
                  setHeaders: {
                    Authorization: `Bearer ${newToken}`
                  }
                });
                console.log("Token refresh ok!!");
                return next(retryReq);
              }
              console.log("Forzo logout per authService.getToken() null " + + error.message);
              authService.logout();
              return throwError(() => error);
            }),
            catchError(refreshError => {
              console.log("Forzo logout per refreshError: " + refreshError + "---" + + error.message);
              authService.logout();
              return throwError(() => refreshError);
            })
          );
        } else {
          console.log("Forzo logout senza expiredToken: " + error.message)
          authService.logout();
        }
      } else{
        let fullMessage = '';

        if (!fullMessage) {
          const msgParts = [] as string[];
          if (error?.message) { msgParts.push(error.message); } else { msgParts.push('An error occurred'); }
          if (error?.error?.id) { msgParts.push(String(error.error.id)); }
          if (error?.error?.message) { msgParts.push(String(error.error.message)); }
          fullMessage = msgParts.join('\n');
        }

        snackBar.openFromComponent(SnackMessageComponent, { data: fullMessage, duration: 5000, panelClass: 'multi-line-snackbar' });
      }
      return throwError(() => error);
    }),
    finalize(() => {
      try { loading.hide(); } catch (e) { }
    })
  );
};
