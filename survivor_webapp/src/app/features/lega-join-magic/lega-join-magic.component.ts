import { Component, OnInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega, LegaJoinRequest } from '../../core/models/interfaces.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { UtilService } from '../../core/services/util.service';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

type JoinState = 'loading' | 'join' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-lega-join-magic',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    TranslateModule,
  ],
  templateUrl: './lega-join-magic.component.html',
  styleUrls: ['./lega-join-magic.component.scss'],
})
export class LegaJoinMagicComponent implements OnInit, OnDestroy {
  lega: Lega | null = null;
  joinState: JoinState = 'loading';
  joinRequest: LegaJoinRequest | null = null;
  isSubmitting = false;
  error: string | null = null;

  private pollInterval: ReturnType<typeof setInterval> | null = null;
  private readonly POLL_MS = 20000;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private legaService: LegaService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const legaId = this.route.snapshot.paramMap.get('id');
    if (!legaId) {
      this.error = this.translate.instant('JOIN_LEAGUE.ERROR_INVALID_ID');
      this.joinState = 'join';
      return;
    }
    this.init(Number(legaId));
  }

  private init(legaId: number): void {
    forkJoin({
      lega: this.legaService.getLegaById(legaId),
      richieste: this.legaService.mieRichieste(),
    }).subscribe({
      next: ({ lega, richieste }) => {
        this.lega = lega;
        // Già dentro la lega → redirect diretto
        if (lega.ruoloGiocatoreLega?.value !== 'NESSUNO') {
          this.router.navigate(['/lega', lega.id]);
          return;
        }
        // Lega ad accesso libero → join diretto, saltiamo il flusso richiesta
        if (lega.accessoLibero) {
          this.joinState = 'join';
          return;
        }
        // Controlla se esiste già una richiesta per questa lega
        const existing = richieste.find(r => r.legaId === lega.id);
        if (existing) {
          this.joinRequest = existing;
          this.joinState = this.statoToState(existing.stato);
          if (existing.stato === 'PENDING') this.startPolling(lega.id);
        } else {
          this.joinState = 'join';
        }
      },
      error: () => {
        this.error = this.translate.instant('JOIN_LEAGUE.ERROR_LOAD');
        this.joinState = 'join';
      },
    });
  }

  private statoToState(stato: string): JoinState {
    if (stato === 'APPROVED') return 'approved';
    if (stato === 'REJECTED') return 'rejected';
    return 'pending';
  }

  sendRequest(): void {
    if (!this.lega || this.isSubmitting) return;
    this.isSubmitting = true;
    this.legaService.richiediIngresso(this.lega.id).subscribe({
      next: (req) => {
        this.joinRequest = req;
        this.joinState = 'pending';
        this.isSubmitting = false;
        this.startPolling(this.lega!.id);
      },
      error: (err) => {
        this.isSubmitting = false;
        const code = err?.error?.message as string | undefined;
        if (code === 'REQUEST_ALREADY_EXISTS') {
          // Richiesta già esistente: la carichiamo e mostriamo stato pending
          this.legaService.mieRichieste().subscribe({
            next: (richieste) => {
              const existing = richieste.find(r => r.legaId === this.lega!.id);
              if (existing) {
                this.joinRequest = existing;
                this.joinState = this.statoToState(existing.stato);
                if (existing.stato === 'PENDING') this.startPolling(this.lega!.id);
              }
            }
          });
        } else {
          const msg = code === 'LEGA_FULL'
            ? this.translate.instant('JOIN_REQUEST.LEGA_FULL')
            : this.translate.instant('COMMON.ERROR_GENERIC');
          this.dialog.open(ErrorDialogComponent, { width: '380px', maxWidth: '95vw', data: { message: msg } });
        }
      },
    });
  }

  // Accesso libero: join diretto con magic token
  confermaJoinLibero(): void {
    if (!this.lega) return;
    const token = localStorage.getItem('magicTokenSurvivor') || '';
    this.legaService.join(this.lega.id!, '', token).subscribe({
      next: (updated) => {
        localStorage.removeItem('magicTokenSurvivor');
        this.router.navigate(['/lega', updated.id]);
      },
      error: (err) => {
        if (err?.status === 499) {
          const msg = err?.error?.message ? String(err.error.message) : err.message;
          this.dialog.open(ErrorDialogComponent, { width: '380px', maxWidth: '95vw', data: { message: msg } });
        }
      },
    });
  }

  private startPolling(legaId: number): void {
    this.stopPolling();
    this.pollInterval = setInterval(() => {
      this.legaService.mieRichieste().subscribe({
        next: (richieste) => {
          const req = richieste.find(r => r.legaId === legaId);
          if (req && req.stato !== 'PENDING') {
            this.joinRequest = req;
            this.joinState = this.statoToState(req.stato);
            this.stopPolling();
          }
        },
      });
    }, this.POLL_MS);
  }

  private stopPolling(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
      this.pollInterval = null;
    }
  }

  goToLega(): void {
    if (this.lega) this.router.navigate(['/lega', this.lega.id]);
  }

  getGiocaIcon(idSport: string): string {
    return this.utilService.getGiocaIcon(idSport);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}

