import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

export const adminGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);

  // Prefer token-based role check (server-signed)
  if (authService.isAdmin()) return true;

  // Fallback: ask the server for the current user's role
  try {
    const me = await firstValueFrom(authService.getMyData());



    if (me && me.role === 'ADMIN') {
      return true;
    }
  } catch (e) {
    console.log('ERRORE: ' + e);
    // ignore and redirect
  }

  router.navigate(['/home']);
  return false;
};
