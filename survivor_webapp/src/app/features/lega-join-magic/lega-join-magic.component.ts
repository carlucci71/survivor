import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/interfaces.model';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LegaCardComponent } from '../../shared/components/lega-card/lega-card.component';
import { UtilService } from '../../core/services/util.service';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    LegaCardComponent,
    TranslateModule,
  ],
  templateUrl: './lega-join-magic.component.html',
  styleUrls: ['./lega-join-magic.component.scss'],
})
export class LegaJoinMagicComponent implements OnInit {
  lega: Lega | null = null;
  isLoading = true;
  error: string | null = null;

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
      this.isLoading = false;
      return;
    }

    this.loadLega(Number(legaId));
  }

  private loadLega(id: number): void {
    this.legaService.getLegaById(id).subscribe({
      next: (lega) => {
        this.lega = lega;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento lega', err);
        this.error = this.translate.instant('JOIN_LEAGUE.ERROR_LOAD');
        this.isLoading = false;
      },
    });
  }

  getGiocaIcon(idSport: string): string {
    return this.utilService.getGiocaIcon(idSport);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  confermaJoin(lega: Lega): void {
    if (!lega) return;

    // Lega con accesso su approvazione → flusso richiesta ingresso
    if (!lega.accessoLibero) {
      import('../../shared/components/richiedi-ingresso-dialog.component').then(m => {
        const ref = this.dialog.open(m.RichiediIngressoDialogComponent, {
          width: '400px',
          maxWidth: '95vw',
          data: { lega },
          autoFocus: false
        });
        ref.afterClosed().subscribe((confirmed: boolean) => {
          if (!confirmed) return;
          this.legaService.richiediIngresso(lega.id).subscribe({
            next: () => {
              this.dialog.open(m.RichiediIngressoDialogComponent, {
                width: '400px',
                maxWidth: '95vw',
                data: { lega, success: true },
                autoFocus: false
              });
            },
            error: (err) => {
              const code = err?.error?.message as string | undefined;
              let msg = this.translate.instant('COMMON.ERROR_GENERIC');
              if (code === 'LEGA_FULL') msg = this.translate.instant('JOIN_REQUEST.LEGA_FULL');
              else if (code === 'REQUEST_ALREADY_EXISTS') msg = this.translate.instant('JOIN_REQUEST.ALREADY_PENDING');
              this.dialog.open(ErrorDialogComponent, { data: { message: msg } });
            }
          });
        });
      });
      return;
    }

    // Lega ad accesso libero → join diretto con magic token
    const tokenOriginal = localStorage.getItem('magicTokenSurvivor') || '';
    this.legaService.join(lega.id!, '', tokenOriginal).subscribe({
      next: (updated) => {
        localStorage.removeItem('magicTokenSurvivor');
        this.router.navigate(['/lega', updated.id]);
      },
      error: (err) => {
        if (err && err.status === 499) {
          let messaggio = err?.error?.message ? String(err.error.message) : err.message;
          this.dialog.open(ErrorDialogComponent, { data: { message: messaggio } });
        }
        console.error('Errore join lega', err);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
