import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take, filter } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Attendi che l'utente sia stato caricato (o il tentativo completato)
  return authService.userLoaded$.pipe(
    filter(loaded => loaded === true), // Attendi che sia true
    take(1), // Prendi solo il primo valore
    map(() => {
      // Verifica che ci sia sia il token che un user valido
      if (authService.isAuthenticated() && authService.getCurrentUser()) {
        return true;
      }

      // Se non autenticato o user non valido, pulisci e vai al login
      if (!authService.getCurrentUser()) {
        authService.logout();
      }

      router.navigate(['/auth/login']);
      return false;
    })
  );
};
