import { MatDialog } from '@angular/material/dialog';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { map, filter, switchMap, take } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
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
import { GiocatoreService } from '../../core/services/giocatore.service';
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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CampionatoService } from '../../core/services/campionato.service';
import { UtilService } from '../../core/services/util.service';
import { SospensioniService } from '../../core/services/sospensioni.service';
import { MockService } from '../../core/services/mock.service';
import { SospensioniDialogComponent } from './sospensioni-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLeagueDataPipe } from '../../shared/pipes/translate-league-data.pipe';
import { PlayerHistoryDialogComponent } from '../../shared/components/player-history-dialog/player-history-dialog.component';

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
    MatSnackBarModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TranslateLeagueDataPipe,
  ],
  templateUrl: './lega-dettaglio.component.html',
  styleUrls: ['./lega-dettaglio.component.scss'],
  animations: [
    trigger('expandCollapse', [
      transition(':enter', [
        style({ height: 0, opacity: 0, overflow: 'hidden' }),
        animate('300ms ease-out', style({ height: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ height: '*', opacity: 1, overflow: 'hidden' }),
        animate('300ms ease-in', style({ height: 0, opacity: 0 }))
      ])
    ])
  ]
})
export class LegaDettaglioComponent implements OnDestroy {
  @ViewChild('tableWrapper') tableWrapper?: ElementRef<HTMLDivElement>;

  public StatoGiocatore = StatoGiocatore;
  public StatoPartita = StatoPartita;
  id: number = -1;
  lega: Lega | null = null;
  error: string | null = null;
  squadre: any[] = [];
  displayedColumns: string[] = [];
  isMock: boolean | null=null;
  beDataRiferimento: Date | null = null;

  giornataIndices: number[] = [];

  // Countdown timer
  countdown: string = '';
  countdownActive: boolean = false;
  countdownExpired: boolean = false;
  private countdownIntervalId: any;

  // Elimina lega
  showDeleteConfirm = false;
  isDeleting = false;

  // Messaggio di consolazione (salvato una sola volta)
  private savedConsolationMessage: string = '';

  // Percorso giocatori
  showPlayerJourneys = false;

  // FILTRI E RICERCA MOBILE
  searchText: string = '';
  playerFilter: 'all' | 'active' | 'eliminated' = 'all';
  expandedPlayers: { [key: number]: boolean } = {};

  // Giornate visibili
  MAX_VISIBLE_ROUNDS = 5; // Numero massimo di giornate visibili per default

  // Sottoscrizione agli aggiornamenti del profilo
  private giocatoreSubscription: any;

  constructor(
    private route: ActivatedRoute,
    private legaService: LegaService,
    private campionatoService: CampionatoService,
    private giocatoreService: GiocatoreService,
    private authService: AuthService,
    private squadraService: SquadraService,
    private utilService: UtilService,
    private router: Router,
    private giocataService: GiocataService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private sospensioniService: SospensioniService,
    private mockService: MockService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
  ) {

    // Sottoscrivi agli aggiornamenti del profilo
    this.giocatoreSubscription = this.giocatoreService.giocatoreAggiornato.subscribe(
      giocatore => {
        if (giocatore && this.id>0) {
          // Ricarica i dati della lega quando il profilo viene aggiornato
          this.loadLegaDetails();
        }
      }
    );

    // Carica profilo e lega in modo concatenato (evita subscription annidate)
    combineLatest([
      this.utilService.profilo().pipe(take(1)),
      this.route.paramMap.pipe(
        map(params => Number(params.get('id'))),
        filter(id => !!id),
        switchMap(id => this.legaService.getLegaById(id).pipe(take(1)))
      )
    ]).subscribe({
      next: ([profilo, lega]) => {
        try {
          const profilo1: string = profilo?.profilo || '';
          const array = profilo1.split(',').map((item: string) => item.trim());
          this.isMock = array.includes('CALENDARIO_MOCK');
        } catch (e) {
          this.isMock = false;
        }

        if (lega) {
          this.lega = lega;
          this.id=lega.id;
          this.caricaTabella();
          this.scrollTableToRight();
          this.startCountdown();
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo o della lega:', error);
      }
    });
  }

  /**
   * Ricarica i dettagli della lega dal backend
   */
  loadLegaDetails(): void {
    if (this.id) {
      this.legaService.getLegaById(this.id).subscribe({
        next: (lega) => {
          this.lega = lega;

          // Debug: verifica se le giocate hanno il campo forzatura
          console.log('🔍 Lega caricata, verifica giocate forzate:');
          this.lega.giocatori?.forEach((giocatore, index) => {
            const giocateForzate = giocatore.giocate?.filter(g => g.forzatura);
            if (giocateForzate && giocateForzate.length > 0) {
              console.log(`✅ Giocatore ${index} (${giocatore.nickname}) ha ${giocateForzate.length} giocate forzate:`, giocateForzate);
            }
          });

          this.caricaTabella();
        },
        error: (error) => {
          console.error('Errore nel ricaricamento della lega:', error);
        },
      });
    }
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

  /**
   * Versione abbreviata del titolo giornata per mobile
   * Es: "Giornata 26" → "Gio. 26"
   */
  getDesGiornataTitleMobile(index: number): string {
    const fullTitle = this.getDesGiornataTitle(index);
    if (!fullTitle) return '';

    // Se contiene "Giornata" lo abbrevia in "Gio."
    if (fullTitle.includes('Giornata')) {
      return fullTitle.replace('Giornata', 'Gio.');
    }

    // Se contiene solo un numero, ritorna così com'è
    if (/^\d+$/.test(fullTitle)) {
      return fullTitle;
    }

    // Per altri formati, prova a estrarre il numero e aggiungere "Gio."
    const numero = fullTitle.match(/\d+/);
    if (numero) {
      return `Gio. ${numero[0]}`;
    }

    // Fallback: ritorna il titolo completo
    return fullTitle;
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

    const isDesktop = window.innerWidth >= 768;
    const dialogConfig = {
      data: {
        giocatore: giocatore,
        giornata: giornata,
        statoGiornataCorrente: this.lega?.statoGiornataCorrente,
        squadreDisponibili: squadreDisponibili,
        squadraCorrenteId: squadraCorrenteId,
        lega: this.lega,
      },
      width: isDesktop ? '90vw' : '94vw',
      maxWidth: isDesktop ? '1100px' : '500px',
      maxHeight: '95vh',
      panelClass: ['seleziona-giocata-dialog', isDesktop ? 'desktop-dialog' : 'mobile-dialog'],
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop()
    };

    console.log('🔍 Dialog Config:', {
      isDesktop,
      width: dialogConfig.width,
      maxWidth: dialogConfig.maxWidth,
      panelClass: dialogConfig.panelClass,
      windowWidth: window.innerWidth
    });

    const dialogRef = this.dialog.open(SelezionaGiocataComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.squadraSelezionata) {
        this.salvaSquadra(giocatore, giornata, result.squadraSelezionata, result.pubblica);
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

  visualizzaGiocata(giornata: number, giocatore: Giocatore): string {
    const giornataIniziale = this.lega?.giornataIniziale || 0;
    const giornataCorrente = this.lega?.giornataCorrente ?? -1;
    const giocata = this.getGiocataByGiornata(giocatore, giornata);
    const esito = giocata == undefined ? '' : giocata.esito;

    // Controllo se è la giornata corrente
    if (giornata + giornataIniziale - 1 !== giornataCorrente) {
      return 'Non visualizzo perchè non è la giornata corrente';
    }

    // Controllo se il giocatore è eliminato
    if (giocatore.statiPerLega?.[this.lega?.id ?? 0]?.value === StatoGiocatore.ELIMINATO.value) {
      return 'Non visualizzo perchè il giocatore è eliminato';
    }

    // Se c'è già un esito (OK/KO), nessuno può modificare
    if (esito == 'OK' || esito == 'KO') {
      return 'Non visualizzo perchè è presente un esito';
    }

    // Se la giornata è sospesa, nessuno può giocare
    if (this.lega?.statoGiornataCorrente?.value === StatoPartita.SOSPESA.value) {
      return 'Non visualizzo perchè la giornata è sospesa';
    }

    // Se la lega è terminata, nessuno può giocare
    if (this.isTerminata()) {
      return 'Non visualizzo perchè la lega è terminata';
    }

    // Se è leader o admin, può sempre giocare/modificare (anche con tempo scaduto e anche se c'è già una giocata)
    if (this.isAdmin() || this.isLeaderLega()) {
      return ''; // Può giocare o modificare!
    }

    // Per gli utenti normali, possono giocare solo se:
    // 1. Sono loro stessi
    // 2. Non hanno ancora una giocata
    if (giocatore.user == null || giocatore.user.id !== this.authService.getCurrentUser()?.id) {
      return 'Non visualizzo perchè non sei leader e non sei tu';
    }

    // Se l'utente normale ha già giocato, non può modificare (solo leader/admin possono)
    if (giocata) {
      return 'Non visualizzo perchè hai già giocato';
    }

    return ''; // Può giocare
  }

  caricaTabella() {
    // Calcolo le colonne della tabella: includo SEMPRE la colonna della giornata corrente
    this.displayedColumns = ['nome'];
    const giornataIniziale = this.lega?.giornataIniziale || 0;
    let maxGiornata = this.lega?.giornataCalcolata
      ? this.lega?.giornataCalcolata + 1
      : giornataIniziale;
      if (this.lega?.giornataFinale){
        maxGiornata=this.lega?.giornataFinale;
      }
    const numGg = this.lega?.campionato?.numGiornate || 0;
    if (numGg < maxGiornata) {
      maxGiornata = numGg;
    }

    // Calcola le giornate da visualizzare (max 10, centrate sulla giornata corrente)
    const giornataCorrente = this.lega?.giornataCorrente || giornataIniziale;
    const maxGiornateVisibili = 10;
    let startGiornata = Math.max(giornataIniziale, giornataCorrente - Math.floor(maxGiornateVisibili / 2));
    let endGiornata = Math.min(maxGiornata, startGiornata + maxGiornateVisibili - 1);


    // Aggiusta se siamo vicini alla fine
    if (endGiornata - startGiornata + 1 < maxGiornateVisibili) {
      startGiornata = Math.max(giornataIniziale, endGiornata - maxGiornateVisibili + 1);
    }

    // Popola le colonne visibili
    for (let i = startGiornata; i <= endGiornata; i++) {
      this.displayedColumns.push('giocata' + (i - giornataIniziale));
    }

    // Popola giornataIndices solo con le giornate visibili
    this.giornataIndices = Array.from({ length: endGiornata - startGiornata + 1 }, (_, i) => startGiornata + i);

    if (this.lega?.campionato) {
      this.squadraService
        .getSquadreByCampionato(this.lega?.campionato?.id ?? '', this.lega.anno)
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
   * Restituisce le giornate visibili per un giocatore (max 5)
   */
  getVisibleGiornateForPlayer(giocatore: Giocatore): number[] {
    if (!this.giornataIndices || this.giornataIndices.length === 0) return [];

    // Se il giocatore è ELIMINATO, mostra solo le giornate fino all'ultima giocata
    if (this.lega && giocatore.statiPerLega?.[this.lega.id]?.value === StatoGiocatore.ELIMINATO.value) {
      const ultimaGiornataGiocata = this.getUltimaGiornataGiocata(giocatore);
      if (ultimaGiornataGiocata > 0) {
        // Filtra le giornate fino all'ultima giocata (compresa)
        const giornateElim = this.giornataIndices.filter(g => g <= ultimaGiornataGiocata);
        // Max 5 anche per eliminati
        return giornateElim.length > this.MAX_VISIBLE_ROUNDS
          ? giornateElim.slice(-this.MAX_VISIBLE_ROUNDS)
          : giornateElim;
      }
      // Se non ha giocate, non mostrare nulla
      return [];
    }

    // Mostra sempre max 5 giornate (le ultime)
    const totalRounds = this.giornataIndices.length;
    if (totalRounds <= this.MAX_VISIBLE_ROUNDS) {
      return this.giornataIndices;
    }

    // Prendi le ultime MAX_VISIBLE_ROUNDS giornate
    return this.giornataIndices.slice(-this.MAX_VISIBLE_ROUNDS);
  }

  /**
   * Restituisce l'ultima giornata assoluta in cui il giocatore ha effettuato una scelta
   */
  getUltimaGiornataGiocata(giocatore: Giocatore): number {
    if (!giocatore?.giocate || giocatore.giocate.length === 0) return 0;

    // Le giocate sono salvate con giornata RELATIVA (1, 2, 3...)
    // Trova la giornata relativa massima
    const giornataRelativaMax = Math.max(...giocatore.giocate.map((g: any) => Number(g?.giornata || 0)));

    // Converti in giornata assoluta
    const giornataIniziale = this.lega?.giornataIniziale || 1;
    return giornataIniziale + giornataRelativaMax - 1;
  }

  /**
   * Verifica se il giocatore ha più giocate del limite visibile
   */
  hasMoreRounds(giocatore: Giocatore): boolean {
    if (!giocatore?.giocate || !this.giornataIndices) return false;

    // Se il giocatore è ELIMINATO, mostra già tutto il suo storico, quindi non serve il pulsante
    if (this.lega && giocatore.statiPerLega?.[this.lega.id]?.value === StatoGiocatore.ELIMINATO.value) {
      return false;
    }


    // Mostra il pulsante solo se ha effettivamente più di 5 giocate
    return giocatore.giocate.length > this.MAX_VISIBLE_ROUNDS;
  }

  /**
   * Conta il numero totale di giocate del giocatore
   */
  getTotalRoundsCount(giocatore: Giocatore): number {
    if (!giocatore?.giocate) return 0;
    return giocatore.giocate.length;
  }

  /**
   * Apre dialog con storico completo per un giocatore
   */
  toggleFullHistory(giocatore: Giocatore, event?: Event): void {
    if (event) {
      event.stopPropagation();
    }

    // Apri dialog con lo storico completo
    this.openPlayerHistoryDialog(giocatore);
  }

  /**
   * Apre la dialog modale con lo storico completo del giocatore
   */
  openPlayerHistoryDialog(giocatore: Giocatore): void {
    const dialogRef = this.dialog.open(PlayerHistoryDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      data: {
        giocatore: giocatore,
        lega: this.lega,
        giornataIndices: this.giornataIndices,
        getGiocataByGiornataAssoluta: this.getGiocataByGiornataAssoluta.bind(this),
        getTeamLogo: this.getTeamLogo.bind(this),
        getSquadraNome: this.getSquadraNome.bind(this)
      },
      panelClass: 'player-history-dialog'
    });
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

  /**
   * Ottiene la giocata dato il numero di giornata assoluto (non relativo)
   */
  getGiocataByGiornataAssoluta(giocatore: Giocatore, giornataAssoluta: number): any {
    if (!giocatore?.giocate) return null;

    // Il backend salva le giocate con giornata RELATIVA (1, 2, 3...)
    // quando chiamiamo giocaGiornata viene passata la giornata relativa
    // Quindi dobbiamo convertire la giornataAssoluta in relativa per cercare
    const giornataRelativa = giornataAssoluta - (this.lega?.giornataIniziale || 1) + 1;

    // Cerca SOLO per giornata relativa (è così che viene salvata)
    return giocatore.giocate.find((g: any) => Number(g?.giornata) === giornataRelativa);
  }

  /**
   * Verifica se un giocatore è quello dell'utente corrente loggato
   */
  isCurrentUserGiocatore(giocatore: Giocatore): boolean {
    const currentUser = this.authService.getCurrentUser();
    return !!currentUser && giocatore.user?.id === currentUser.id;
  }

  /**
   * Verifica se un giocatore può giocare una determinata giornata assoluta
   */
  canPlayRound(giocatore: Giocatore, giornataAssoluta: number): boolean {
    if (!this.lega) return false;

    // Verifica che sia il giocatore dell'utente loggato
    const currentUser = this.authService.getCurrentUser();
    if (!currentUser || giocatore.user?.id !== currentUser.id) {
      return false;
    }

    // Verifica se il giocatore è eliminato
    if (giocatore.statiPerLega?.[this.lega.id]?.value === StatoGiocatore.ELIMINATO.value) {
      return false;
    }

    // Verifica se ha già una giocata per quella giornata
    const haGiocata = this.getGiocataByGiornataAssoluta(giocatore, giornataAssoluta) !== null;
    if (haGiocata) {
      return false;
    }

    // Verifica se la giornata è giocabile
    const giornataDaGiocare = this.lega.giornataDaGiocare || 0;
    const giornataCorrente = this.lega.giornataCorrente || 0;

    // Può giocare se la giornata è quella da giocare O quella corrente
    // E se la lega è in uno stato che permette il gioco
    const isPlayableRound = (giornataAssoluta === giornataDaGiocare || giornataAssoluta === giornataCorrente);
    const isLegaAvviata = this.isAvviata();

    return isPlayableRound && isLegaAvviata && !haGiocata;
  }

  /**
   * Gioca una giornata dato il numero assoluto
   */
  async giocaGiornataAssoluta(giocatore: Giocatore, giornataAssoluta: number): Promise<void> {
    const giornataRelativa = giornataAssoluta - (this.lega?.giornataIniziale || 1) + 1;
    await this.giocaGiornata(giocatore, giornataRelativa);
  }

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    // Usa squadraSigla invece di squadraId per il confronto corretto
    const giocateSigle = (giocatore.giocate || []).map((g: any) => g.squadraSigla);
    return this.squadre.filter((s) => !giocateSigle.includes(s.sigla));
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

  // ========== LOGHI E FOTO SQUADRE/TENNISTI ===
  // Mapping loghi calcio (Serie A + Serie B)
  private readonly logoFiles: { [key: string]: string } = {
    'LIGA_BAR': 'BARC.png',
    'LIGA_RMA': 'RMA.png',
    'LIGA_ATM': 'ATM.png',
    'LIGA_ATH': 'ATH.png',
    'LIGA_ALA': 'ALA.png',
    'LIGA_BET': 'BET.png',
    'LIGA_RSO': 'RSO.png',
    'LIGA_OVI': 'OVI.png',
    'LIGA_RAY': 'RAY.png',
    'LIGA_VIL': 'VIL.png',
    'LIGA_ESP': 'ESP.png',
    'LIGA_VIG': 'CEL.png',
    'LIGA_OSA': 'OSA.png',
    'LIGA_SEV': 'SIV.png',
    'LIGA_GIR': 'GIR.png',
    'LIGA_MLL': 'MAI.png',
    'LIGA_LEV': 'LEV.png',
    'LIGA_ELC': 'ELC.png',
    'LIGA_GET': 'GET.png',
    'LIGA_VAL': 'VAL.png',
    // SERIE A (20 squadre)
    'SERIE_A_ATA': 'ATA.png',       // Atalanta
    'SERIE_A_BOL': 'BOLO.png',      // Bologna
    'SERIE_A_CAG': 'CAGL.png',      // Cagliari
    'SERIE_A_COM': 'COMO.png',      // Como
    'SERIE_A_CRE': 'CREMON.png',    // Cremonese
    'SERIE_A_EMP': 'EMP.png',       // Empoli ✨ AGGIUNTO
    'SERIE_A_FIO': 'FIO.png',       // Fiorentina
    'SERIE_A_GEN': 'GENOA.png',     // Genoa
    'SERIE_A_INT': 'INT.png',       // Inter
    'SERIE_A_JUV': 'JUV.png',       // Juventus
    'SERIE_A_LAZ': 'LAZIO.png',     // Lazio
    'SERIE_A_LEC': 'LECCE.webp',    // Lecce (webp)
    'SERIE_A_MIL': 'MIL.png',       // Milan
    'SERIE_A_MON': 'MON.png',       // Monza
    'SERIE_A_NAP': 'NAP.png',       // Napoli
    'SERIE_A_PAR': 'PARMA.png',     // Parma
    'SERIE_A_PIS': 'PISA.png',      // Pisa
    'SERIE_A_ROM': 'ROMA.webp',     // Roma (webp)
    'SERIE_A_SAS': 'SASS.png',      // Sassuolo
    'SERIE_A_TOR': 'TORO.png',      // Torino
    'SERIE_A_UDI': 'UDI.png',       // Udinese ✨ AGGIUNTO
    'SERIE_A_VEN': 'VEN.png',       // Venezia
    'SERIE_A_VER': 'VER.png',       // Verona

    // SERIE B (18 squadre)
    'SERIE_B_AVE': 'AVE.png',       // Avellino ✨ AGGIUNTO
    'SERIE_B_BAR': 'BARI.png',      // Bari
    'SERIE_B_CAR': 'CARRARESE.png', // Carrarese
    'SERIE_B_CTZ': 'CATANZARO.png', // Catanzaro
    'SERIE_B_CES': 'CES.png',       // Cesena
    'SERIE_B_ENT': 'ENT.png',       // Entella
    'SERIE_B_JST': 'JUVE_STABIA.png', // Juve Stabia (sigla corretta)
    'SERIE_B_MAN': 'MANT.png',      // Mantova
    'SERIE_B_MOD': 'MOD.png',       // Modena
    'SERIE_B_PAD': 'PADOVA.png',    // Padova
    'SERIE_B_PAL': 'PAL.png',       // Palermo
    'SERIE_B_PES': 'PESC.png',      // Pescara
    'SERIE_B_REG': 'REGGIANA.png',  // Reggiana
    'SERIE_B_SAM': 'SAMP.png',      // Sampdoria ✨ AGGIUNTO
    'SERIE_B_SPE': 'SPEZIA.webp',   // Spezia
    'SERIE_B_STR': 'SUDTIROL.png',  // Sudtirol (sigla corretta) ✨ CORRETTO
    'SERIE_B_FRO': 'FRO.png',
    'SERIE_B_EMP': 'EMP.png',
    'SERIE_B_MON': 'MON.png',
    'SERIE_B_VEN': 'VEN.png',
  };

  // Mapping foto tennisti
  private readonly tennisPhotos: { [key: string]: string } = {
    'ALCARAZ': 'ALCARAZ.png', 'BUBLIK': 'BUBLIK.png', 'CERUNDOLO': 'CERUNDOLO.png',
    'DARDERI': 'DARDERI.png', 'DE_MINAUR': 'DE_MIINAUR.png', 'DE MINAUR': 'DE_MIINAUR.png',
    'DEMINAUR': 'DE_MIINAUR.png', 'DJOKOVIC': 'DJOKOVIC.png', 'FRITZ': 'FRITZ.png',
    'MEDVEDEV': 'MEDVEDEV.png', 'MENSIK': 'MENSIK.png', 'MUSETTI': 'MUSETTI.webp',
    'PAUL': 'PAUL.png', 'RUUD': 'RUUD.png', 'SHELTON': 'SHELTON.png',
    'SINNER': 'SINNER.png', 'TIEN': 'TIEN.png', 'ZVEREV': 'ZVEREV.webp',
  };

  // Mapping loghi NBA basket
  private readonly basketLogos: { [key: string]: string } = {
    'PHI': '76ERS.png', 'ATL': 'HAWKS.png', 'BOS': 'CELTICS.png', 'BKN': 'NETS.png',
    'CHA': 'HORNETS.png', 'CHI': 'BULLS.png', 'CLE': 'CAVALIERS.png', 'IND': 'PACERS.png',
    'MIA': 'HEAT.png', 'MIL': 'BUCKS.png', 'NYK': 'KNICKS.png', 'ORL': 'ORLANDO_MAGIC.png',
    'TOR': 'RAPTORS.png', 'WAS': 'WIZARDS.png', 'DET': 'PISTONS.png', 'DEN': 'NUGGETS.png',
    'SAS': 'SPURS.png', 'LAL': 'LAKERS.png', 'HOU': 'ROCKETS.png', 'MIN': 'TIMBERWOLVES.png',
    'PHX': 'SUNS.png', 'MEM': 'GRIZZLIES.png', 'GSW': 'WARRIORS.png', 'POR': 'BLAZERS.png',
    'DAL': 'MAVERICKS.png', 'UTA': 'UTAH.webp', 'LAC': 'CLIPPERS.png', 'SAC': 'SACRAMENTO.png',
    'NOP': 'PELICANS.png', 'OKC': 'THUNDER.png',
  };

  // Metodo per ottenere il logo/foto della squadra/tennista
  getTeamLogo(sigla: string | null | undefined): string | null {
    if (!sigla) return null;
    const sportId = this.lega?.campionato?.sport?.id;
    const legaId = this.lega?.campionato?.id;
    // Tennis - foto giocatore con matching avanzato
    if (sportId === 'TENNIS') {
      const original = sigla.toUpperCase().trim();
      const withUnderscore = original.replace(/\s+/g, '_');
      const withoutSpaces = original.replace(/\s+/g, '');

      // Prova matching esatto
      let photoFile = this.tennisPhotos[original] ||
                      this.tennisPhotos[withUnderscore] ||
                      this.tennisPhotos[withoutSpaces];

      // Se non trovato, prova a matchare solo il cognome
      if (!photoFile) {
        const parts = original.split(/[\s_]+/);
        const cognome = parts[parts.length - 1]; // Ultimo elemento = cognome

        // Cerca per cognome nelle chiavi
        const matchingKey = Object.keys(this.tennisPhotos).find(key =>
          key.includes(cognome) || cognome.includes(key)
        );

        if (matchingKey) {
          photoFile = this.tennisPhotos[matchingKey];
        }
      }

      if (photoFile) {
        return `assets/logos/tennis/${photoFile}`;
      }

      return 'assets/logos/tennis/placeholder.svg';
    }

    // Calcio - stemmi
    if (sportId === 'CALCIO' || sportId === 'SERIE_A' || sportId === 'SERIE_B') {
      const fileName = this.logoFiles[legaId+"_"+sigla];
      if (fileName) return `assets/logos/calcio/${fileName}`;
      return null;
    }

    // Basket - loghi NBA
    if (sportId === 'BASKET') {
      const logoFile = this.basketLogos[sigla];
      if (logoFile) return `assets/logos/basket/${logoFile}`;
      return null;
    }

    return null;
  }

  // Gestisce errore caricamento logo
  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.style.display = 'none';
    }
  }

  giornataDaGiocare(): boolean {
    if ((this.lega?.giornataCorrente || 0) <= 15) return true; //TODO PER TEST
    return (
      this.lega?.statoGiornataCorrente?.value == StatoPartita.DA_GIOCARE.value
    );
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }

  // Verifica se il giocatore corrente (utente loggato) è eliminato in questa lega
  isCurrentUserEliminato(): boolean {
    const currentUserId = this.authService.getCurrentUser()?.id;
    if (!currentUserId || !this.lega?.giocatori) return false;

    const giocatore = this.lega.giocatori.find(g => g.user?.id === currentUserId);
    if (!giocatore) return false;

    return giocatore.statiPerLega?.[this.lega.id ?? 0]?.value === StatoGiocatore.ELIMINATO.value;
  }

  // Ottiene il giocatore corrente (utente loggato)
  getCurrentGiocatore(): any | null {
    const currentUserId = this.authService.getCurrentUser()?.id;
    if (!currentUserId || !this.lega?.giocatori) return null;
    return this.lega.giocatori.find(g => g.user?.id === currentUserId) || null;
  }

  /**
   * Verifica se l'utente corrente ha già giocato nella giornata corrente
   */
  hasCurrentUserPlayedCurrentRound(): boolean {
    const currentGiocatore = this.getCurrentGiocatore();
    if (!currentGiocatore || !this.lega?.giornataCorrente || !this.lega?.giornataIniziale) {
      return false;
    }
    const giornataRelativa = this.lega.giornataCorrente - this.lega.giornataIniziale + 1;
    const giocata = this.getGiocataByGiornata(currentGiocatore, giornataRelativa);
    return giocata !== null;
  }

  /**
   * Verifica se la giornata corrente è in corso
   */
  isCurrentRoundInProgress(): boolean {
    return this.lega?.statoGiornataCorrente?.value === StatoPartita.IN_CORSO.value;
  }

  /**
   * Determina se il countdown scaduto deve essere visualizzato
   * Non mostra se: giornata in corso E utente ha già giocato
   */
  shouldShowExpiredCountdown(): boolean {
    if (!this.countdownExpired) {
      return false;
    }
    // Se la giornata è in corso e l'utente ha già giocato, nascondi il timeout
    if (this.isCurrentRoundInProgress() && this.hasCurrentUserPlayedCurrentRound()) {
      return false;
    }
    return true;
  }

  // Ottiene la squadra che ha fatto perdere il giocatore corrente
  getSquadraEliminazione(): { sigla: string; nome: string; giornata: number } | null {
    const giocatore = this.getCurrentGiocatore();
    if (!giocatore || !giocatore.giocate) return null;

    // Trova la giocata con esito KO
    const giocataKO = giocatore.giocate.find((g: any) => g.esito === 'KO');
    if (!giocataKO) return null;

    return {
      sigla: giocataKO.squadraSigla,
      nome: this.getSquadraNome(giocataKO.squadraSigla) || giocataKO.squadraSigla,
      giornata: giocataKO.giornata
    };
  }

  // Messaggi di consolazione simpatici per l'eliminazione
  // Array di chiavi di traduzione per i messaggi di consolazione
  private consolationMessageKeys = [
    'LEAGUE.CONSOLATION.1',
    'LEAGUE.CONSOLATION.2',
    'LEAGUE.CONSOLATION.3',
    'LEAGUE.CONSOLATION.4',
    'LEAGUE.CONSOLATION.5',
    'LEAGUE.CONSOLATION.6',
    'LEAGUE.CONSOLATION.7',
    'LEAGUE.CONSOLATION.8',
    'LEAGUE.CONSOLATION.9',
    'LEAGUE.CONSOLATION.10',
    'LEAGUE.CONSOLATION.11',
    'LEAGUE.CONSOLATION.12',
    'LEAGUE.CONSOLATION.13',
    'LEAGUE.CONSOLATION.14',
    'LEAGUE.CONSOLATION.15',
    'LEAGUE.CONSOLATION.16',
    'LEAGUE.CONSOLATION.17',
    'LEAGUE.CONSOLATION.18',
    'LEAGUE.CONSOLATION.19',
    'LEAGUE.CONSOLATION.20'
  ];

  // Ottiene un messaggio di consolazione casuale (solo la prima volta)
  getRandomConsolationMessage(): string {
    // Se non abbiamo ancora un messaggio salvato, scegline uno casuale
    if (!this.savedConsolationMessage) {
      const randomIndex = Math.floor(Math.random() * this.consolationMessageKeys.length);
      this.savedConsolationMessage = this.translate.instant(this.consolationMessageKeys[randomIndex]);
    }
    return this.savedConsolationMessage;
  }

  // Messaggi simpatici per l'eliminazione
  private eliminationMessages = [
    { emoji: '💀', message: 'Sei stato eliminato!' },
    { emoji: '☠️', message: 'Game Over, amico!' },
    { emoji: '😵', message: 'K.O. tecnico!' },
    { emoji: '🪦', message: 'R.I.P. alla tua avventura!' },
    { emoji: '💔', message: 'Il tuo cuore è spezzato!' },
    { emoji: '🎭', message: 'Tragedia greca!' },
    { emoji: '🌧️', message: 'Piove sul bagnato!' },
    { emoji: '🔥', message: 'Bruciato vivo!' },
    { emoji: '⚰️', message: 'Seppellito dalla sfortuna!' },
    { emoji: '🎲', message: 'I dadi non ti hanno favorito!' }
  ];

  getEliminationMessage(): { emoji: string; message: string } {
    const index = Math.floor(Math.random() * this.eliminationMessages.length);
    return this.eliminationMessages[index];
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
  contaAttivi(): number {
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
    squadraSelezionata: string,
    pubblica?: boolean
  ): void {
    if (!this.lega) {
      console.error('Nessuna lega caricata');
      return;
    }

    this.giocataService
      .salvaGiocata(giornata, giocatore.id, squadraSelezionata, this.lega.id, pubblica)
      .subscribe({
        next: (res: Giocatore) => {
          // Debug: verifica se il campo forzatura arriva dal backend
          console.log('🔍 Giocate ricevute:', res.giocate);
          res.giocate?.forEach((g, i) => {
            console.log(`Giocata ${i}:`, {
              giornata: g.giornata,
              squadra: g.squadraSigla,
              forzatura: g.forzatura,
              hasForzatura: !!g.forzatura
            });
          });

          // Aggiorna la lista delle giocate del giocatore con quella restituita dal servizio
          if (res && Array.isArray(res.giocate)) {
            giocatore.giocate = res.giocate;

            // Forza il refresh della vista per mostrare immediatamente la nuova giocata
            // Ricarica i dettagli della lega per aggiornare tutto
            this.loadLegaDetails();
          }
        },
        error: (err: any) => {
          console.error('Errore nel salvataggio della giocata', err);
        },
      });
  }

  /**
   * Controlla se il giocatore corrente può giocare/modificare la giornata corrente
   *
   * Logica:
   * 1. Leader/Admin possono SEMPRE giocare
   * 2. TUTTI possono giocare/modificare quando statoGiornataCorrente = DA_GIOCARE (timeout attivo)
   * 3. Quando la giornata è IN_CORSO o TERMINATA, solo chi NON ha ancora giocato può farlo
   */
  hasGiocataDisponibile(giocatore: Giocatore | null): boolean {
    if (!giocatore || !this.lega?.giornataCorrente) return false;

    // Lega terminata? Nessuno può giocare
    if (this.isTerminata()) return false;

    // Giocatore eliminato? Non può giocare
    if (giocatore.statiPerLega?.[this.lega.id ?? 0]?.value === StatoGiocatore.ELIMINATO.value) {
      return false;
    }

    // Giornata sospesa? Nessuno può giocare
    if (this.lega.statoGiornataCorrente?.value === StatoPartita.SOSPESA.value) {
      return false;
    }

    const giornataRelativa = this.lega.giornataCorrente - (this.lega.giornataIniziale || 1) + 1;
    const giocata = this.getGiocataByGiornata(giocatore, giornataRelativa);

    // Leader/Admin possono SEMPRE giocare/modificare
    if (this.isLeaderLega() || this.isAdmin()) {
      return true;
    }

    // Se la giornata è DA_GIOCARE (timeout attivo), TUTTI possono giocare/modificare
    if (this.lega.statoGiornataCorrente?.value === StatoPartita.DA_GIOCARE.value) {
      return true;
    }

    // Altrimenti, può giocare solo se NON ha ancora giocato
    return !giocata;
  }

  /**
   * Gioca la prima giornata disponibile
   */
  async giocaGiornataDisponibile(giocatore: Giocatore | null): Promise<void> {
    if (!giocatore || !this.lega?.giornataCorrente) return;

    const giornataRelativa = this.lega.giornataCorrente - (this.lega.giornataIniziale || 1) + 1;
    await this.giocaGiornata(giocatore, giornataRelativa);
  }

  // Mostra/nascondi conferma eliminazione
  toggleDeleteConfirm(): void {
    this.showDeleteConfirm = !this.showDeleteConfirm;
  }

  // Elimina la lega
  confirmEliminaLega(): void {
    if (!this.lega) return;

    this.isDeleting = true;
    this.showDeleteConfirm = false;

    this.legaService.eliminaLega(this.lega.id).subscribe({
      next: (response) => {
        this.isDeleting = false;
        this.router.navigate(['/home']);
      },
      error: (err) => {
        console.error('Errore durante l\'eliminazione della lega:', err);
        this.isDeleting = false;
        this.error = 'Errore durante l\'eliminazione della lega: ' + (err.error?.message || err.message);
      }
    });
  }

  getStatoGiornata(index: number): StatoPartita | null {
    if (!this.lega || !this.lega.statiGiornate) return null;
    return this.lega.statiGiornate[index] || null;
  }

  ngOnDestroy(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
    if (this.giocatoreSubscription) {
      this.giocatoreSubscription.unsubscribe();
    }
  }

  startCountdown(): void {
    if (!this.lega) {
      this.countdownActive = false;
      return;
    }
    // Prima di avviare il countdown, carichiamo la data di riferimento dal backend
    if (this.isMock){
      this.mockService.dataRiferimento().subscribe({
        next: (dataR) => {
          this.beDataRiferimento = this.parseBackendDate(String(dataR));
          this.goTimer();
        },
        error: (err) => {
          console.error('Errore caricamento data riferimento', err);
        }
      });
    } else {
        this.beDataRiferimento = new Date();
        this.goTimer();
    }
  }

  private goTimer(){
    if (this.beDataRiferimento){
          if (this.lega?.inizioProssimaGiornata) {
            this.startCountdownWithTime(this.beDataRiferimento, new Date(this.lega.inizioProssimaGiornata));
          } else {
            this.loadFirstMatchTimeAndStartCountdown(this.beDataRiferimento);
          }
        }
  }

  private loadFirstMatchTimeAndStartCountdown(beFrom?: Date): void {
    if (!this.lega || !this.lega.campionato?.id) return;

    this.campionatoService
      .calendario(
        this.lega.campionato.id,
        '',
        this.lega.anno,
        this.lega.giornataCorrente,
        true
      )
      .subscribe({
        next: (partite) => {
          if (partite && partite.length > 0) {
            const primaPartita = partite
              .filter(p => p.orario)
              .sort((a, b) => new Date(a.orario!).getTime() - new Date(b.orario!).getTime())[0];

            if (primaPartita && primaPartita.orario) {
              this.startCountdownWithTime(beFrom ?? new Date(), new Date(primaPartita.orario));
            } else {
              this.countdownActive = false;
            }
          } else {
            this.countdownActive = false;
          }
        },
        error: (error) => {
          console.error('Errore caricamento partite:', error);
          this.countdownActive = false;
        }
      });
  }

  private startCountdownWithTime(from: Date, matchTime: Date): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
      this.countdownIntervalId = null;
    }

    const targetTime = new Date(matchTime.getTime() - 5 * 60 * 1000);

    const retrievalLocalTime = Date.now();

    const updateCountdown = () => {
        const dataRifInizio = from.getTime() + (Date.now() - retrievalLocalTime);
        const countdownEndTime = targetTime.getTime();
        const distance = countdownEndTime - dataRifInizio;

        if (distance < 0) {
          this.countdown = '⏰ ' + this.translate.instant('LEAGUE.TIME_EXPIRED');
          this.countdownActive = true;
          this.countdownExpired = true;
          return;
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        if (days > 0) {
          this.countdown = `${days}g ${hours}h ${minutes}m`;
        } else if (hours > 0) {
          this.countdown = `${hours}h ${minutes}m ${seconds}s`;
        } else {
          this.countdown = `${minutes}m ${seconds}s`;
        }

        this.countdownActive = true;
    };

    updateCountdown();
    if (!this.isMock){
      this.countdownIntervalId = setInterval(updateCountdown, 1000);
    }

  }

  // Copia locale di parseBackendDate (stesso comportamento del mock.component)
  parseBackendDate(s: string | null | undefined): Date | null {
    if (!s) return null;
    let clean = String(s).trim();
    if ((clean.startsWith('"') && clean.endsWith('"')) || (clean.startsWith("'") && clean.endsWith("'"))) {
      clean = clean.slice(1, -1).trim();
    }
    if (/^\d{12}$/.test(clean)) {
      const y = Number(clean.substr(0,4));
      const M = Number(clean.substr(4,2));
      const D = Number(clean.substr(6,2));
      const h = Number(clean.substr(8,2));
      const m = Number(clean.substr(10,2));
      return new Date(y, M-1, D, h, m);
    }

    const tryParse = (str: string): Date | null => {
      const d = new Date(str);
      return isNaN(d.getTime()) ? null : d;
    };

    let parsed = tryParse(clean);
    if (parsed) return parsed;
    parsed = tryParse(clean.replace(' ', 'T'));
    if (parsed) return parsed;
    const withoutZone = clean.replace(/([+-]\d{2}:?\d{2})$/, '');
    parsed = tryParse(withoutZone);
    if (parsed) return parsed;
    return null;
  }

  togglePlayerJourneys(): void {
    this.showPlayerJourneys = !this.showPlayerJourneys;
  }

  // TrackBy functions per ottimizzare il rendering
  trackByGiocatoreId(index: number, giocatore: Giocatore): number {
    return giocatore.id;
  }

  // ===== FILTRI E RICERCA MOBILE =====

  setPlayerFilter(filter: 'all' | 'active' | 'eliminated'): void {
    this.playerFilter = filter;
  }

  clearSearch(): void {
    this.searchText = '';
  }

  onSearchChange(): void {
    // La ricerca è reattiva, non serve fare nulla qui
  }

  togglePlayerExpansion(giocatoreId: number): void {
    this.expandedPlayers[giocatoreId] = !this.expandedPlayers[giocatoreId];
  }

  getFilteredPlayers(): Giocatore[] {
    if (!this.lega?.giocatori) return [];

    let filtered = [...this.lega.giocatori];

    // Filtro per stato
    if (this.playerFilter === 'active') {
      filtered = filtered.filter(g =>
        g.statiPerLega?.[this.lega!.id]?.value !== StatoGiocatore.ELIMINATO.value
      );
    } else if (this.playerFilter === 'eliminated') {
      filtered = filtered.filter(g =>
        g.statiPerLega?.[this.lega!.id]?.value === StatoGiocatore.ELIMINATO.value
      );
    }

    // Filtro per ricerca testo
    if (this.searchText && this.searchText.trim()) {
      const searchLower = this.searchText.toLowerCase().trim();
      filtered = filtered.filter(g =>
        g.nickname?.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  }

  getTotalPlayersCount(): number {
    return this.lega?.giocatori?.length || 0;
  }

  getActivePlayersCount(): number {
    if (!this.lega?.giocatori) return 0;
    return this.lega.giocatori.filter(g =>
      g.statiPerLega?.[this.lega!.id]?.value !== StatoGiocatore.ELIMINATO.value
    ).length;
  }

  getEliminatedPlayersCount(): number {
    if (!this.lega?.giocatori) return 0;
    return this.lega.giocatori.filter(g =>
      g.statiPerLega?.[this.lega!.id]?.value === StatoGiocatore.ELIMINATO.value
    ).length;
  }

  getLastGiocata(giocatore: Giocatore): any {
    if (!giocatore.giocate || giocatore.giocate.length === 0) return null;

    // Ordina per giornata decrescente e prendi la prima
    const sorted = [...giocatore.giocate].sort((a: any, b: any) =>
      (b.giornata || 0) - (a.giornata || 0)
    );

    return sorted[0];
  }

  trackByGiornataIndex(index: number, giornata: number): number {
    return giornata;
  }

  /**
   * Verifica se una giocata deve essere nascosta (mostrare ***)
   * Una giocata è nascosta se:
   * - pubblica è false (esplicitamente privata)
   * - E la giornata non è ancora iniziata (giornata > giornataCorrente)
   */
  shouldHideGiocata(giocata: any, giornata: number): boolean {
    if (!giocata) return false;

    // Se la giocata è esplicitamente pubblica, mostrala sempre
    if (giocata.pubblica === true) return false;

    // Se la giornata è già iniziata o passata, mostra sempre la giocata
    if (giornata <= (this.lega?.giornataCorrente || 0)) return false;

    // Se pubblica è false (esplicitamente privata), nascondi
    if (giocata.pubblica === false) return true;

    return false;
  }

  /**
   * Ottiene il nome della squadra, badge "Voto Privato" o "-"
   * - Se giocata non esiste (null) → "-"
   * - Se giocata è privata (pubblica=false) e giornata futura → "🔒 Voto Privato"
   * - Se giocata è pubblica o giornata iniziata → Nome squadra
   */
  getDisplaySquadraNome(giocatore: Giocatore, giornata: number): string {
    const giocata = this.getGiocataByGiornataAssoluta(giocatore, giornata);

    // Caso 1: Nessun voto (giocata null)
    if (!giocata?.squadraSigla) {
      return '-';
    }

    // Caso 2: Voto privato (pubblica = false e giornata non iniziata)
    if (this.shouldHideGiocata(giocata, giornata)) {
      return '🔒 Privato';
    }

    // Caso 3: Voto pubblico (mostra squadra)
    return this.getSquadraNome(giocata.squadraSigla) || giocata.squadraSigla;
  }

  getGiocaIcon(): string {
    return this.utilService.getGiocaIcon(this.lega!.campionato!.sport!.id);
  }

  getCountdownTargetDate(): any {
    if (!this.lega || !this.lega.campionato || !this.lega.campionato.iniziGiornate) {
      return null;
    }
    const index = this.lega.giornataDaGiocare;
    return this.lega.campionato.iniziGiornate[index] || null;
  }
}
