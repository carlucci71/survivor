import { MatDialog } from '@angular/material/dialog';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import {
  Giocata,
  Giocatore,
  Lega,
  RuoloGiocatore,
  StatoGiocatore,
  StatoLega,
  StatoPartita,
} from '../../core/models/interfaces.model';
import { SquadraService } from '../../core/services/squadra.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { GiocataService } from '../../core/services/giocata.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CampionatoService } from '../../core/services/campionato.service';
import { UtilService } from '../../core/services/util.service';
import { SospensioniService } from '../../core/services/sospensioni.service';
import { SospensioniDialogComponent } from './sospensioni-dialog.component';

@Component({
  selector: 'app-lega-dettaglio',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    HeaderComponent,
    MatChipsModule,
    MatTooltipModule,
    MatDialogModule,
    MatListModule,
    MatInputModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lega-dettaglio.component.html',
  styleUrls: ['./lega-dettaglio.component.scss'],
})
export class LegaDettaglioComponent {
  @ViewChild('tableWrapper') tableWrapper?: ElementRef<HTMLDivElement>;

  public StatoGiocatore = StatoGiocatore;
  public StatoPartita = StatoPartita;
  id: number = -1;
  lega: Lega | null = null;
  error: string | null = null;
  squadre: any[] = [];
  displayedColumns: string[] = [];

  giornataIndices: number[] = [];

  constructor(
    private route: ActivatedRoute,
    private legaService: LegaService,
    private campionatoService: CampionatoService,
    private authService: AuthService,
    private squadraService: SquadraService,
    private utilService: UtilService,
    private router: Router,
    private giocataService: GiocataService,
    private dialog: MatDialog,
    private sospensioniService: SospensioniService,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.legaService.getLegaById(this.id).subscribe({
          next: (lega) => {
            this.lega = lega;
            this.caricaTabella();
            this.scrollTableToRight();
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
          },
        });
      }
    });
  }

  getDesGiornataTitle(index: number): string {
    if (
      !this.lega ||
      !this.lega?.campionato ||
      !this.lega?.campionato.sport ||
      !this.lega?.campionato.sport.id
    ) {
      return '';
    }
    return this.campionatoService.getDesGiornataNoAlias(
      this.lega?.campionato?.id,
      index
    );
  }

  // Gestisce il click sull'icona gioca accanto al badge squadra
  async giocaGiornata(giocatore: Giocatore, giornata: number): Promise<void> {
    // Trova la giocata corrente (se esiste)
    const giocataCorrente = (giocatore.giocate || []).find(
      (g: any) => Number(g?.giornata) === giornata
    );
    const squadraCorrenteId = giocataCorrente?.squadraSigla || null;
    // Escludi tutte le squadre già giocate, tranne quella corrente
    const giocateIds = (giocatore.giocate || [])
      .filter((g: any) => Number(g?.giornata) !== giornata)
      .map((g: any) => g.squadraSigla);
    const squadreDisponibili = this.squadre.filter(
      (s: any) => !giocateIds.includes(s.sigla) || s.sigla === squadraCorrenteId
    );

    const { SelezionaGiocataComponent } = await import(
      '../seleziona-giocata/seleziona-giocata.component'
    );
    const dialogRef = this.dialog.open(SelezionaGiocataComponent, {
      data: {
        giocatore: giocatore,
        giornata: giornata,
        statoGiornataCorrente: this.lega?.statoGiornataCorrente,
        squadreDisponibili: squadreDisponibili,
        squadraCorrenteId: squadraCorrenteId,
        lega: this.lega,
      },
      width: '820px',
      maxWidth: '90vw',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.squadraSelezionata) {
        this.salvaSquadra(giocatore, giornata, result.squadraSelezionata);
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

  visualizzaGiocata(giornata: number, giocatore: Giocatore) {
    const giornataIniziale = this.lega?.giornataIniziale || 0;
    const giornataCorrente = this.lega?.giornataCorrente ?? -1;
    const giocata = this.getGiocataByGiornata(giocatore, giornata);
    const esito = giocata == undefined ? '' : giocata.esito;
    let ret = true;
    if (giornata + giornataIniziale - 1 !== giornataCorrente) {
      ret = false;
    }
    if (
      giocatore.statiPerLega?.[this.lega?.id ?? 0]?.value ===
      StatoGiocatore.ELIMINATO.value
    ) {
      ret = false;
    }
    if (esito == 'OK' || esito == 'KO') {
      ret = false;
    }
    if (
      !this.isAdmin() &&
      !this.isLeaderLega() &&
      (giocatore.user == null ||
        giocatore.user.id !== this.authService.getCurrentUser()?.id)
    ) {
      ret = false;
    }
    if (
      !this.isAdmin() &&
      !this.isLeaderLega() &&
      this.lega?.statoGiornataCorrente.value !== StatoPartita.DA_GIOCARE.value
    ) {
      ret = false;
    }
    if (this.lega?.statoGiornataCorrente.value === StatoPartita.SOSPESA.value) {
      ret = false;
    }
    if (this.lega?.stato.value === StatoLega.TERMINATA.value) {
      ret = false;
    }
    if (this.lega!.giornataDaGiocare < this.lega!.giornataCorrente) {
      ret = false;
    }
    return ret;
  }

  caricaTabella() {
    // Calcolo le colonne della tabella: includo SEMPRE la colonna della giornata corrente
    this.displayedColumns = ['nome'];
    const giornataIniziale = this.lega?.giornataIniziale || 0;
    let maxGiornata = this.lega?.giornataCalcolata
      ? this.lega?.giornataCalcolata + 1
      : giornataIniziale;

    const numGg = this.lega?.campionato?.numGiornate || 0;
    if (numGg < maxGiornata) {
      maxGiornata = numGg;
    } else if (this.lega?.stato.value === StatoLega.TERMINATA.value && this.lega.statoGiornataCorrente != StatoPartita.IN_CORSO) {
      maxGiornata--;
    }
    //const giornataCorrente = this.lega?.giornataCorrente || 0;
    for (let i = 0; i <= maxGiornata - giornataIniziale; i++) {
      this.displayedColumns.push('giocata' + i);
    }
    // populate giornata indices 1..maxGiornata

    this.giornataIndices = Array.from({ length: maxGiornata }, (_, i) => i + 1);

    if (this.lega?.campionato) {
      this.squadraService
        .getSquadreByCampionato(this.lega?.campionato?.id ?? '')
        .subscribe({
          next: (squadre: any[]) => {
            this.squadre = squadre;
          },
          error: () => {
            this.squadre = [];
          },
        });
    }
  }

  /**
   * Returns the subset of giornata indices that are currently displayed
   * in the desktop table. This ensures mobile stacked view shows the
   * same set of giornate.
   */
  mobileGiornateIndices(): number[] {
    const numCols = Math.max(0, this.displayedColumns.length - 1); // exclude 'nome'
    if (!this.giornataIndices || numCols <= 0) return [];
    return this.giornataIndices.slice(0, numCols);
  }

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    const giocateIds = (giocatore.giocate || []).map((g: any) => g.squadraId);
    return this.squadre.filter((s) => !giocateIds.includes(s.sigla));
  }

  // Restituisce la giocata corrispondente alla giornata (1-based) se presente
  getGiocataByGiornata(giocatore: Giocatore, giornata: number): Giocata | null {
    if (!giocatore || !giocatore.giocate) return null;
    const giocata =
      giocatore.giocate.find(
        (g: Giocata) => Number(g?.giornata) === giornata
      ) || null;
    if (giocatore.id === 9) {
      // console.log(giocatore.nome + "-" + (giocata?.squadraSigla?giocata?.squadraSigla:'N/D') + "-" + giornata)
    }
    return giocata;
  }

  track(index: number, item: any) {
    return index;
  }

  getSquadraNome(squadraSigla: string | null | undefined): string | null {
    const sigla = squadraSigla ?? null;
    if (!this.lega?.campionato?.id) return sigla;
    return this.squadraService.getSquadraNomeBySigla(
      sigla,
      this.lega?.campionato?.id
    );
  }

  giornataDaGiocare(): boolean {
    if ((this.lega?.giornataCorrente || 0) <= 15) return true; //TODO PER TEST
    return (
      this.lega?.statoGiornataCorrente.value == StatoPartita.DA_GIOCARE.value
    );
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  isLeaderLega(): boolean {
    const ruolo = this.lega?.ruoloGiocatoreLega;
    return !!ruolo && ruolo.value === RuoloGiocatore.LEADER.value;
  }
 isInLega(): boolean {
    const ruolo = this.lega?.ruoloGiocatoreLega;
    return !!ruolo && ruolo.value != RuoloGiocatore.NESSUNO.value;
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  isChiudibile(): boolean {
    return this.contaAttivi() <= 3;
  }
  contaAttivi():number{
    let contaAttivi = 0;
    let giocatori = this.lega!.giocatori;
    if (giocatori && giocatori[0]) {
      for (const giocatore of giocatori) {
        if (
          giocatore.statiPerLega?.[this.lega?.id ?? 0]?.value ===
          StatoGiocatore.ATTIVO.value
        ) {
          contaAttivi++;
        }
      }
    }
    return contaAttivi;
  }

  termina() {
    this.legaService.termina(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore nel termina della lega';
      },
    });
  }
  riapri() {
    this.legaService.riapri(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore nel riapri della lega';
      },
    });
  }

  secondaOccasione() {
    this.legaService.secondaOccasione(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore in seconda occasione della lega';
      },
    });
  }

  isAvviata(): boolean {
    return this.lega!.stato.value === StatoLega.AVVIATA.value;
  }

  isDaAvviare(): boolean {
    return this.lega!.stato.value === StatoLega.DA_AVVIARE.value;
  }

  isTerminata(): boolean {
    return this.lega!.stato.value === StatoLega.TERMINATA.value;
  }

  notExistsNuovaEdizione(): boolean {
    return (
      this.lega!.edizione ===
      this.lega?.edizioni[this.lega?.edizioni.length - 1]
    );
  }
  cancellaGiocatore(giocatore: Giocatore) {
    this.legaService.cancellaGiocatoreDaLega(Number(this.id), giocatore).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore nel termina della lega';
      },
    });

  }

  sospensioni() {
    if (!this.lega || !this.lega.id) return;
    this.sospensioniService.getSospensioniLega(this.lega.id).subscribe({
      next: (res: any) => {
        let data = { idLega: this.lega!.id, giornate: [] as number[] };
        if (Array.isArray(res) && res.length > 0) {
          data.giornate = res[0].giornate || [];
        }
        const dialogRef = this.dialog.open(SospensioniDialogComponent, {
          width: '420px',
          data: data,
        });
        dialogRef.afterClosed().subscribe(() => {
          this.legaService.getLegaById(this.id).subscribe({
            next: (lega) => {
              this.lega = lega;
              this.caricaTabella();
              this.scrollTableToRight();
            },
            error: (err) => {
              console.error(
                'Errore nel ricaricamento della lega dopo chiusura modale:',
                err
              );
            },
          });
        });
      },
      error: (err) => {
        console.error('Errore caricamento sospensioni', err);
      },
    });
  }
  calcolaGiornata() {
    this.legaService.calcola(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
        this.scrollTableToRight();
      },
      error: (err: any) => {
        this.error = 'Errore in calcola della lega';
      },
    });
  }

  private scrollTableToRight(): void {
    setTimeout(() => {
      if (this.tableWrapper?.nativeElement) {
        const element = this.tableWrapper.nativeElement;
        element.scrollLeft = element.scrollWidth;
      }
    }, 100);
  }
  undoCalcolaGiornata() {
    this.legaService.undoCalcola(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore in undocalcola della lega';
      },
    });
  }
  salvaSquadra(
    giocatore: Giocatore,
    giornata: number,
    squadraSelezionata: string
  ): void {
    if (!this.lega) {
      console.error('Nessuna lega caricata');
      return;
    }

    this.giocataService
      .salvaGiocata(giornata, giocatore.id, squadraSelezionata, this.lega.id)
      .subscribe({
        next: (res: Giocatore) => {
          // Aggiorna la lista delle giocate del giocatore con quella restituita dal servizio
          if (res && Array.isArray(res.giocate)) {
            giocatore.giocate = res.giocate;
          }
        },
        error: (err: any) => {
          console.error('Errore nel salvataggio della giocata', err);
        },
      });
  }

  getGiocaIcon(): string {
    return this.utilService.getGiocaIcon(this.lega!.campionato!.sport!.id);
  }
}
