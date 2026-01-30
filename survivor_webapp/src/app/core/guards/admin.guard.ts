import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Prefer token-based role check (server-signed)
  if (authService.isAdmin()) return true;

  // Fallback: ask the server for the current user's role
  try {
    // use skip flag so the interceptor won't auto-redirect; handle service-unavailable here
    const me = await firstValueFrom(authService.getMyData(true));
    if (me && me.role === 'ADMIN') {
      return true;
    }
  } catch (e) {
    console.log('ERRORE: ' + e);
    const err: any = e as any;
    const status = err?.status ?? (err?.statusCode as any) ?? 0;
    if (status === 503 || status === 0 || !status) {
      try {
        router.navigate(['/service-unavailable']);
      } catch (err2) {}
      return false;
    }
    // otherwise fall through to redirect to home
  }
  router.navigate(['/home']);
  return false;
};
