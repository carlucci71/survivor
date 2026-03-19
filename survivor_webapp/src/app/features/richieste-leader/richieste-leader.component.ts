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
        this.groups = this.raggruppa(richieste);
        this.isLoading = false;
      },
      error: () => { this.isLoading = false; }
    });
  }

  private raggruppa(richieste: LegaJoinRequest[]): RichiestaGroup[] {
    const map = new Map<number, RichiestaGroup>();
    for (const r of richieste) {
      if (!map.has(r.legaId)) {
        map.set(r.legaId, { legaId: r.legaId, legaName: r.legaName, pending: [], resolved: [] });
      }
      const g = map.get(r.legaId)!;
      if (r.stato === 'PENDING') g.pending.push(r);
      else g.resolved.push(r);
    }
    // Ordina: leghe con pending prima
    return [...map.values()].sort((a, b) => b.pending.length - a.pending.length);
  }

  get totalPending(): number {
    return this.groups.reduce((sum, g) => sum + g.pending.length, 0);
  }

  approva(req: LegaJoinRequest): void {
    this.legaService.approvaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.APPROVED_OK'), '', { duration: 3000 });
        this.carica();
      },
      error: (err) => {
        const msg = err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC');
        this.snackBar.open(msg, '', { duration: 4000 });
      }
    });
  }

  rifiuta(req: LegaJoinRequest): void {
    this.legaService.rifiutaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.REJECTED_OK'), '', { duration: 3000 });
        this.carica();
      },
      error: (err) => {
        const msg = err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC');
        this.snackBar.open(msg, '', { duration: 4000 });
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
