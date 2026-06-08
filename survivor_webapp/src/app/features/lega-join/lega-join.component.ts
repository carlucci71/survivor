import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { Lega, LegaJoinRequest, StatoLega } from '../../core/models/interfaces.model';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LegaCardComponent } from '../../shared/components/lega-card/lega-card.component';
import { UtilService } from '../../core/services/util.service';
import { ConfermaJoinDialogComponent } from '../../shared/components/conferma-join-dialog.component';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { forkJoin } from 'rxjs';

type InvitedState = 'none' | 'pending' | 'approved' | 'rejected';

@Component({
  selector: 'app-lega-join',
  standalone: true,
  imports: [CommonModule, HeaderComponent, MatIconModule, MatCardModule, MatButtonModule, MatDialogModule, MatSnackBarModule, MatProgressSpinnerModule, LegaCardComponent, TranslateModule],
  templateUrl: './lega-join.component.html',
  styleUrls: ['./lega-join.component.scss'],
})
export class LegaJoinComponent implements OnInit, AfterViewInit, OnDestroy {
  leghe: Lega[] = [];
  invitedLega: Lega | null = null;
  invitedLegaLoading = false;
  pendingLegaIds = new Set<number>();
  invitedJoinState: InvitedState = 'none';
  invitedJoinRequest: LegaJoinRequest | null = null;

  private invitedPollInterval: ReturnType<typeof setInterval> | null = null;
  private readonly INVITED_POLL_MS = 20000;

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
    private route: ActivatedRoute,
    public router: Router,
    private authService: AuthService,
    private legaService: LegaService,
    private utilService: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    const legaIdStr = this.route.snapshot.queryParamMap.get('legaId');
    if (legaIdStr) {
      this.invitedLegaLoading = true;
      forkJoin({
        lega: this.legaService.getLegaById(Number(legaIdStr)),
        richieste: this.legaService.mieRichieste(),
        leghe: this.legaService.legheLibere(),
      }).subscribe({
        next: ({ lega, richieste, leghe }) => {
          richieste.filter(r => r.stato === 'PENDING').forEach(r => this.pendingLegaIds.add(r.legaId));
          this.leghe = leghe;
          if (lega.ruoloGiocatoreLega?.value !== 'NESSUNO') {
            this.snackBar.open(this.translate.instant('JOIN_LEAGUE.ALREADY_IN_LEGA'), '', { duration: 3000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--info'] });
            this.router.navigate(['/lega', lega.id]);
            return;
          }
          this.invitedLega = lega;
          this.invitedLegaLoading = false;
          const existing = richieste.find(r => r.legaId === lega.id);
          if (existing) {
            this.invitedJoinRequest = existing;
            this.invitedJoinState = this.mapStatoInvited(existing.stato);
            if (existing.stato === 'PENDING') this.startInvitedPolling(lega.id);
            if (existing.stato === 'APPROVED') this.router.navigate(['/lega', lega.id]);
          }
        },
        error: () => { this.invitedLegaLoading = false; }
      });
    } else {
      forkJoin({
        leghe: this.legaService.legheLibere(),
        richieste: this.legaService.mieRichieste(),
      }).subscribe({
        next: ({ leghe, richieste }) => {
          richieste.filter(r => r.stato === 'PENDING').forEach(r => this.pendingLegaIds.add(r.legaId));
          this.leghe = leghe;
        },
        error: (err) => console.error('Errore caricamento leghe libere', err),
      });
    }
  }

  ngAfterViewInit(): void {
    // Scrolla la pagina in alto all'apertura del componente
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  private mapStatoInvited(stato: string): InvitedState {
    if (stato === 'PENDING') return 'pending';
    if (stato === 'APPROVED') return 'approved';
    if (stato === 'REJECTED') return 'rejected';
    return 'none';
  }

  private startInvitedPolling(legaId: number): void {
    this.stopInvitedPolling();
    this.invitedPollInterval = setInterval(() => {
      this.legaService.mieRichieste().subscribe({
        next: (richieste) => {
          const req = richieste.find(r => r.legaId === legaId);
          if (req && req.stato !== 'PENDING') {
            this.invitedJoinRequest = req;
            this.invitedJoinState = this.mapStatoInvited(req.stato);
            this.stopInvitedPolling();
            if (req.stato === 'APPROVED') this.router.navigate(['/lega', legaId]);
          }
        }
      });
    }, this.INVITED_POLL_MS);
  }

  private stopInvitedPolling(): void {
    if (this.invitedPollInterval) {
      clearInterval(this.invitedPollInterval);
      this.invitedPollInterval = null;
    }
  }

  ngOnDestroy(): void {
    this.stopInvitedPolling();
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
      // Blocca re-submit se c'è già una richiesta pending
      if (this.pendingLegaIds.has(lega.id)) {
        this.snackBar.open(this.translate.instant('JOIN_REQUEST.ALREADY_PENDING'), '', { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--info'] });
        return;
      }
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
              this.pendingLegaIds.add(lega.id);
              if (this.invitedLega?.id === lega.id) {
                this.invitedJoinState = 'pending';
                this.startInvitedPolling(lega.id);
              } else {
                this.dialog.open(m.RichiediIngressoDialogComponent, {
                  width: '400px',
                  maxWidth: '95vw',
                  data: { lega, success: true },
                  autoFocus: false
                });
              }
            },
            error: (err) => {
              const code = err?.error?.message as string | undefined;
              let msg = this.translate.instant('COMMON.ERROR_GENERIC');
              if (code === 'LEGA_FULL') msg = this.translate.instant('JOIN_REQUEST.LEGA_FULL');
              else if (code === 'REQUEST_ALREADY_EXISTS') {
                this.pendingLegaIds.add(lega.id);
                if (this.invitedLega?.id === lega.id) {
                  this.invitedJoinState = 'pending';
                  this.startInvitedPolling(lega.id);
                  return;
                }
                msg = this.translate.instant('JOIN_REQUEST.ALREADY_PENDING');
              }
              this.snackBar.open(msg, '', { duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--error'] });
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
