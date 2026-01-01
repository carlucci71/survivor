import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/interfaces.model';
import { MatIcon } from '@angular/material/icon';
import { UtilService } from '../../core/services/util.service';
import { MatDialog } from '@angular/material/dialog';
import { ConfermaJoinDialogComponent } from '../../shared/components/conferma-join-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';

@Component({
  selector: 'app-lega-join',
  imports: [CommonModule, HeaderComponent, MatIcon],
  templateUrl: './lega-join.component.html',
  styleUrls: ['./lega-join.component.scss'],
})
export class LegaJoinComponent implements OnInit {
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
  seleziona(lega: Lega): void {
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
