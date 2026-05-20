import { Component, OnInit, AfterViewInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega, StatoLega } from '../../core/models/interfaces.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { LegaCardComponent } from '../../shared/components/lega-card/lega-card.component';
import { UtilService } from '../../core/services/util.service';
import { ConfermaJoinDialogComponent } from '../../shared/components/conferma-join-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lega-join',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule, MatCardModule, MatButtonModule, MatDialogModule, MatSnackBarModule, LegaCardComponent, TranslateModule],
  templateUrl: './lega-join.component.html',
  styleUrls: ['./lega-join.component.scss'],
})
export class LegaJoinComponent implements OnInit, AfterViewInit {
  leghe: Lega[] = [];

  filterSport = '';
  filterCampionato = '';
  filterStato = '';

  get sportsDisponibili(): { id: string; nome: string }[] {
    const seen = new Set<string>();
    const sports: { id: string; nome: string }[] = [];
    for (const l of this.leghe) {
      const s = l.campionato?.sport;
      if (s && !seen.has(s.id)) {
        seen.add(s.id);
        sports.push({ id: s.id, nome: s.nome });
      }
    }
    return sports;
  }

  get campionatiDisponibili(): { id: string; nome: string }[] {
    const seen = new Set<string>();
    const campionati: { id: string; nome: string }[] = [];
    const source = this.filterSport
      ? this.leghe.filter(l => l.campionato?.sport?.id === this.filterSport)
      : this.leghe;
    for (const l of source) {
      const c = l.campionato;
      if (c && !seen.has(c.id)) {
        seen.add(c.id);
        campionati.push({ id: c.id, nome: c.nome });
      }
    }
    return campionati;
  }

  get legheFiltrate(): Lega[] {
    return this.leghe.filter(l => {
      if (this.filterSport && l.campionato?.sport?.id !== this.filterSport) return false;
      if (this.filterCampionato && l.campionato?.id !== this.filterCampionato) return false;
      if (this.filterStato && (l.stato as StatoLega)?.value !== this.filterStato) return false;
      return true;
    });
  }

  setFilter(tipo: 'sport' | 'campionato' | 'stato', valore: string): void {
    if (tipo === 'sport') {
      this.filterSport = valore;
      this.filterCampionato = '';
    } else if (tipo === 'campionato') {
      this.filterCampionato = valore;
    } else {
      this.filterStato = valore;
    }
  }

  constructor(
    private router: Router,
    private authService: AuthService,
    private legaService: LegaService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
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

  clearFilters(): void {
    this.filterSport = '';
    this.filterCampionato = '';
    this.filterStato = '';
  }

  goCreLega(): void {
    this.router.navigate(['/creaLega']);
  }
  seleziona(lega: Lega | null): void {
    if (!lega) return;

    // Lega con accesso su approvazione (pubblica o privata) → mostra dialog di conferma
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
              this.snackBar.open(msg, '', { duration: 4000 });
            }
          });
        });
      });
      return;
    }

    const dialogRef = this.dialog.open(ConfermaJoinDialogComponent, {
      width: '380px',
      maxWidth: '95vw',
      maxHeight: '90vh',
      disableClose: true,
      data: { lega }
      // CENTRATO (nessun position)
    });

    dialogRef.afterClosed().subscribe((pwd: string | null) => {
      if (pwd === null) return; // utente ha annullato il dialog

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
              width: '380px',
              maxWidth: '95vw',
              data: { message: messaggio }
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
