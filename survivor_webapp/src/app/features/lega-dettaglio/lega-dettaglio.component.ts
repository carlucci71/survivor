import { MatDialog } from '@angular/material/dialog';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import {
  Giocata,
  Giocatore,
  Lega,
  RuoloGiocatore,
  StatoGiocatore,
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
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { GiocataService } from '../../core/services/giocata.service';
import { AdminService } from '../../core/services/admin.service';
import { LoadingService } from '../../core/services/loading.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CampionatoService } from '../../core/services/campionato.service';
import { UtilService } from '../../core/services/util.service';

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
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lega-dettaglio.component.html',
  styleUrls: ['./lega-dettaglio.component.scss'],
})
export class LegaDettaglioComponent {
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
    private adminService: AdminService,
    private authService: AuthService,
    private squadraService: SquadraService,
    private utilService: UtilService,
    private router: Router,
    private giocataService: GiocataService,
    private dialog: MatDialog,
    private loadingService: LoadingService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.legaService.getLegaById(this.id).subscribe({
          next: (lega) => {
            this.lega = lega;
            this.caricaTabella();
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
          },
        });
      }
    });
  }

  getDesGiornataTitle(index: number): string {
    if (!this.lega || !this.lega?.campionato || !this.lega?.campionato.sport|| !this.lega?.campionato.sport.id){
      return "";
    }
    return this.campionatoService.getDesGiornataNoAlias(this.lega?.campionato?.id,index);
  }

  get maxGiornata(): number {
    if (!this.lega || !this.lega.giocatori) return 0;
    let max = 0;
    for (const g of this.lega.giocatori) {
      if (!g.giocate) continue;
      for (const gg of g.giocate) {
        const n = Number(gg?.giornata);
        if (!isNaN(n) && n > max) max = n;
      }
    }
    return max;
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
    if (giocatore.id===9){
      //console.log(giocatore.nome + "-" + giocata?.squadraSigla + "-" + giornata+ "-" + ret)
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

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    const giocateIds = (giocatore.giocate || []).map((g: any) => g.squadraId);
    return this.squadre.filter((s) => !giocateIds.includes(s.sigla));
  }

  // Restituisce la giocata corrispondente alla giornata (1-based) se presente
  getGiocataByGiornata(giocatore: Giocatore, giornata: number): Giocata | null {

    if (!giocatore || !giocatore.giocate) return null;
    const giocata = (giocatore.giocate.find((g: Giocata) => Number(g?.giornata) === giornata) ||null);
    if (giocatore.id===9){
     // console.log(giocatore.nome + "-" + (giocata?.squadraSigla?giocata?.squadraSigla:'N/D') + "-" + giornata)
  }
  return giocata;
  }

  track(index: number, item: any) {
    return index;
  }

  getSquadraNome(squadraSigla: string|null): string|null {
    if (!this.lega?.campionato?.id) return squadraSigla;
    return this.squadraService.getSquadraNomeBySigla(
      squadraSigla,
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
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  undoCalcolaGiornata() {
    this.adminService.undoCalcola(Number(this.id)).subscribe({
      next: (lega: Lega) => {
        this.lega = lega;
        this.caricaTabella();
      },
      error: (err: any) => {
        this.error = 'Errore nel caricamento della lega';
      },
    });
  }
  calcolaGiornata() {
    this.adminService
      .calcola(Number(this.id), this.lega?.giornataCorrente || 0)
      .subscribe({
        next: (lega: Lega) => {
          this.lega = lega;
          this.caricaTabella();
        },
        error: (err: any) => {
          this.error = 'Errore nel caricamento della lega';
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
