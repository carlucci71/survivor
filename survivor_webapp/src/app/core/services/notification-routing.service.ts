import { Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { AuthService } from './auth.service';

/**
 * Unica regola "notifica → pagina", usata sia dal tocco sulla notifica push del telefono
 * (PushService) sia dalla campanella dentro l'app (NotificationBellComponent).
 */
@Injectable({ providedIn: 'root' })
export class NotificationRoutingService {
  constructor(
    private readonly router: Router,
    private readonly zone: NgZone,
    private readonly authService: AuthService,
  ) {}

  /** Pagina di destinazione per tipo di notifica; null = nessuna navigazione. */
  destinazione(tipo: string, legaId?: string | number | null, giornata?: string | number | null): unknown[] | null {
    const lega = legaId != null && legaId !== '' ? String(legaId) : null;
    switch (tipo) {
      case 'JOIN_REQUEST_RICEVUTA':
        // il leader va dove si approvano le richieste
        return ['/richieste'];
      case 'RECAP_GIORNATA':
        if (!lega) return null;
        return giornata != null && giornata !== '' ? ['/recap', lega, String(giornata)] : ['/lega', lega];
      case 'INIZIO_PARTITA':
      case 'REMINDER_GIORNATA':
        // il backend mette la lega solo se il promemoria riguarda una lega sola; con piu' leghe si va in home
        return lega ? ['/lega', lega] : ['/home'];
      case 'JOIN_REQUEST_APPROVATA':
      case 'JOIN_REQUEST_RIFIUTATA':
      case 'SFIDA_LAMPO_ACCETTATA':
      case 'LEADER_TRANSFER':
      default:
        return lega ? ['/lega', lega] : null;
    }
  }

  /**
   * Apre la pagina della notifica. Aspetta che l'utente sia caricato (all'avvio a freddo il tocco
   * arriva prima dell'accesso) e naviga DENTRO la zona di Angular: le callback dei plugin Capacitor
   * girano fuori zona e una navigazione da li' cambia la rotta senza aggiornare lo schermo
   * (sintomo: si resta sulla home).
   */
  apri(tipo: string, legaId?: string | number | null, giornata?: string | number | null): void {
    const dest = this.destinazione(tipo, legaId, giornata);
    if (!dest) return;
    this.authService.userLoaded$.pipe(filter(Boolean), take(1)).subscribe(() => {
      this.zone.run(() => {
        void this.router.navigate(dest);
      });
    });
  }
}
