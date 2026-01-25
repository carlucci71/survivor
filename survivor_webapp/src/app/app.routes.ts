import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
  {
    path: 'auth/login',
    loadComponent: () => import('./features/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'auth/verify',
    loadComponent: () => import('./features/auth/verify.component').then(m => m.VerifyComponent)
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/public/privacy.component').then(m => m.PrivacyComponent)
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/public/terms.component').then(m => m.TermsComponent)
  },
  {
    path: 'magic-redirect',
    loadComponent: () => import('./features/public/magic-redirect.component').then(m => m.MagicRedirectComponent)
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'lega/:id',
    loadComponent: () => import('./features/lega-dettaglio/lega-dettaglio.component').then(m => m.LegaDettaglioComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/admin.component').then(m => m.AdminComponent),
    canActivate: [authGuard, adminGuard]
  },
  {
    path: 'me',
    loadComponent: () => import('./features/me/me.component').then(m => m.MeComponent),
    canActivate: [authGuard]
  },
  {
    path: 'creaLega',
    loadComponent: () => import('./features/lega-nuova/lega-nuova.component').then(m => m.LegaNuovaComponent),
    canActivate: [authGuard]
  },
  {
    path: 'joinLega',
    loadComponent: () => import('./features/lega-join/lega-join.component').then(m => m.LegaJoinComponent),
    canActivate: [authGuard]
  },
  {
    path: 'join/:id',
    loadComponent: () => import('./features/lega-join-magic/lega-join-magic.component').then(m => m.LegaJoinMagicComponent),
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: '/home'
  }
];
