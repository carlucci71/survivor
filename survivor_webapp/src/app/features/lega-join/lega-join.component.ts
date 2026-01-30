import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/interfaces.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { LegaCardComponent } from '../../shared/components/lega-card/lega-card.component';
import { UtilService } from '../../core/services/util.service';
import { ConfermaJoinDialogComponent } from '../../shared/components/conferma-join-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-lega-join',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule, MatCardModule, MatButtonModule, MatDialogModule, LegaCardComponent],
  templateUrl: './lega-join.component.html',
  styleUrls: ['./lega-join.component.scss'],
})
export class LegaJoinComponent implements OnInit, AfterViewInit {
  leghe: Lega[] = [];

  constructor(
    private router: Router,
    private authService: AuthService,
    private legaService: LegaService,
    private utilService: UtilService
    , private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadLegheLibere();
  }

  ngAfterViewInit(): void {
    // Scrolla la pagina in alto all'apertura del componente
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  private loadLegheLibere(): void {
    this.legaService.legheLibere().subscribe({
      next: (leghe) => (this.leghe = leghe),
      error: (err) => console.error('Errore caricamento leghe libere', err),
    });
  }
  getGiocaIcon(idSport: string): string {
    return this.utilService.getGiocaIcon(idSport);
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
  seleziona(lega: Lega | null): void {
    if (!lega) return;
    const dialogRef = this.dialog.open(ConfermaJoinDialogComponent, {
      width: '420px',
      disableClose: true,
      data: { lega },
    });

    dialogRef.afterClosed().subscribe((pwd: string | null) => {

      this.legaService.join(lega.id!, pwd,'').subscribe({
        next: (updated) => {
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
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
