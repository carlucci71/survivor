import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UtilService } from '../../core/services/util.service';
import { LegaService } from '../../core/services/lega.service';
import { LegaJoinRequest } from '../../core/models/interfaces.model';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface RichiestaGroup {
  legaId: number;
  legaName: string;
  pending: LegaJoinRequest[];
  resolved: LegaJoinRequest[];
}

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatIconModule, MatSnackBarModule, HeaderComponent, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  profilo: string | null = null;
  profiloFe  = environment.ambiente + ' - ' + environment.mobile;
  calendario: {} = {};
  canAccessMock = false;

  groups: RichiestaGroup[] = [];
  isLoadingRichieste = true;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private legaService: LegaService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProfilo();
    this.getCalendario();
    this.caricaRichieste();

    // Scroll alla sezione richieste se arrivato da notifica
    setTimeout(() => {
      const hash = window.location.hash;
      if (hash === '#richieste') {
        document.getElementById('richieste')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 600);
  }

  getProfilo(): void {
    this.utilService.profilo().subscribe({
      next: (profilo) => {
        this.profilo = profilo.profilo;
        if (this.profilo) {
          const array = this.profilo.split(',').map(item => item.trim());
          this.canAccessMock = array.includes('CALENDARIO_MOCK');
        }
      },
      error: (error) => console.error('Errore nel caricamento del profilo:', error)
    });
  }

  getCalendario(): void {
    this.utilService.calendario().subscribe({
      next: (calendario) => { this.calendario = calendario.url; },
      error: (error) => console.error('Errore nel caricamento del calendario:', error)
    });
  }

  caricaRichieste(): void {
    this.isLoadingRichieste = true;
    this.legaService.mieRichieste().subscribe({
      next: (richieste) => {
        this.groups = this.raggruppa(richieste);
        this.isLoadingRichieste = false;
      },
      error: () => { this.isLoadingRichieste = false; }
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
    return [...map.values()].sort((a, b) => b.pending.length - a.pending.length);
  }

  get totalPending(): number {
    return this.groups.reduce((sum, g) => sum + g.pending.length, 0);
  }

  approva(req: LegaJoinRequest): void {
    this.legaService.approvaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.APPROVED_OK'), '', { duration: 3000 });
        this.caricaRichieste();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC'), '', { duration: 4000 });
      }
    });
  }

  rifiuta(req: LegaJoinRequest): void {
    this.legaService.rifiutaRichiesta(req.legaId, req.id).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.REJECTED_OK'), '', { duration: 3000 });
        this.caricaRichieste();
      },
      error: (err) => {
        this.snackBar.open(err?.error?.message ?? this.translate.instant('COMMON.ERROR_GENERIC'), '', { duration: 4000 });
      }
    });
  }

  goToLega(legaId: number): void {
    this.router.navigate(['/lega', legaId]);
  }

  goToMock(): void {
    this.router.navigate(['/mock']);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}

