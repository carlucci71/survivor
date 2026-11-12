import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { LegaService } from '../../core/services/lega.service';
import { LegaJoinRequest } from '../../core/models/interfaces.model';
import { AuthService } from '../../core/services/auth.service';

interface RichiestaGroup {
  legaId: number;
  legaName: string;
  pending: LegaJoinRequest[];
  resolved: LegaJoinRequest[];
  /** Lega conclusa: le richieste restano visibili ma non si approvano piu' */
  terminata: boolean;
  /** Accordion della lega aperto/chiuso */
  open: boolean;
  /** Storico (approvate/rifiutate) aperto/chiuso */
  storicoOpen: boolean;
}

@Component({
  selector: 'app-richieste-leader',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    TranslateModule,
  ],
  templateUrl: './richieste-leader.component.html',
  styleUrls: ['./richieste-leader.component.scss'],
})
export class RichiesteLeaderComponent implements OnInit {
  groups: RichiestaGroup[] = [];
  isLoading = true;
  /** Sezione "Leghe concluse": chiusa di default */
  concluseOpen = false;

  constructor(
    private legaService: LegaService,
    private authService: AuthService,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.carica();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  carica(): void {
    this.isLoading = true;
    this.legaService.mieRichieste().subscribe({
      next: (richieste) => {
        this.groups = this.raggruppa(richieste, this.groups);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private raggruppa(richieste: LegaJoinRequest[], precedenti: RichiestaGroup[]): RichiestaGroup[] {
    // Dopo approva/rifiuta la lista si ricarica: si conserva lo stato aperto/chiuso scelto dall'utente
    const prima = new Map(precedenti.map(g => [g.legaId, g]));
    const map = new Map<number, RichiestaGroup>();
    for (const r of richieste) {
      if (!map.has(r.legaId)) {
        const terminata = r.legaStato === 'TERMINATA';
        const vecchio = prima.get(r.legaId);
        map.set(r.legaId, {
          legaId: r.legaId, legaName: r.legaName, pending: [], resolved: [], terminata,
          open: vecchio ? vecchio.open : false,
          // nelle leghe concluse, una volta aperta la lega si vede subito tutto
          storicoOpen: vecchio ? vecchio.storicoOpen : terminata,
        });
      }
      const g = map.get(r.legaId)!;
      if (r.stato === 'PENDING') g.pending.push(r);
      else g.resolved.push(r);
    }
    const lista = [...map.values()];
    // Alla prima apertura: restano aperte solo le leghe attive con richieste da gestire
    for (const g of lista) {
      if (!prima.has(g.legaId)) g.open = !g.terminata && g.pending.length > 0;
    }
    // Ordina: leghe con pending prima
    return lista.sort((a, b) => b.pending.length - a.pending.length);
  }

  get attive(): RichiestaGroup[] {
    return this.groups.filter(g => !g.terminata);
  }

  get concluse(): RichiestaGroup[] {
    return this.groups.filter(g => g.terminata);
  }

  /** Solo le richieste delle leghe attive: quelle delle leghe concluse non si possono piu' gestire */
  get totalPending(): number {
    return this.attive.reduce((sum, g) => sum + g.pending.length, 0);
  }

  approva(req: LegaJoinRequest): void {
    this.legaService.approvaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.APPROVED_OK'), '', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--success'] });
        this.carica();
      },
      error: (err) => {
        const msg = err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC');
        this.snackBar.open(msg, '', { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--error'] });
      }
    });
  }

  rifiuta(req: LegaJoinRequest): void {
    this.legaService.rifiutaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.REJECTED_OK'), '', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--info'] });
        this.carica();
      },
      error: (err) => {
        const msg = err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC');
        this.snackBar.open(msg, '', { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--error'] });
      }
    });
  }

  goToLega(legaId: number): void {
    this.router.navigate(['/lega', legaId]);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
