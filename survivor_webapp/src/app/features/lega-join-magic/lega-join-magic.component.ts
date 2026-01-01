import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/interfaces.model';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilService } from '../../core/services/util.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-lega-join-magic',
  imports: [
    CommonModule,
    HeaderComponent,
    MatIcon,
    MatButtonModule,
    MatCardModule,
    MatProgressSpinnerModule,
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    const legaId = this.route.snapshot.paramMap.get('id');
    if (!legaId) {
      this.error = 'ID lega non valido';
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
        this.error = 'Impossibile caricare i dati della lega';
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

  confermaJoin(): void {
    if (!this.lega) return;
      const tokenOriginal = localStorage.getItem('magicTokenSurvivor') || '';
      this.legaService.join(this.lega!.id!, '',tokenOriginal).subscribe({
        next: (updated) => {
          localStorage.removeItem('magicTokenSurvivor');
          this.router.navigate(['/lega', updated.id]);
        },
        error: (err) => {
          if (err && err.status === 499) {
            let messaggio = '';
            if (err?.error?.message) {
              messaggio = String(err.error.message);
            } else {
              messaggio = err.message;
            }
            this.dialog.open(ErrorDialogComponent, {
              data: { message: messaggio },
            });
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
