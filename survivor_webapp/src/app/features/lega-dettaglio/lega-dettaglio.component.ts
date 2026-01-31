import { MatDialog } from '@angular/material/dialog';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';

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
    TranslateModule,
  ],
  templateUrl: './lega-dettaglio.component.html',
  styleUrls: ['./lega-dettaglio.component.scss'],
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
    private overlay: Overlay,
    private sospensioniService: SospensioniService,
    private translate: TranslateService,
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.legaService.getLegaById(this.id).subscribe({
          next: (lega) => {
            this.lega = lega;
            this.caricaTabella();
            this.scrollTableToRight();
            this.startCountdown();
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
      maxHeight: '95vh',
      panelClass: 'seleziona-giocata-dialog',
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      scrollStrategy: this.overlay.scrollStrategies.noop()
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

  visualizzaGiocata(giornata: number, giocatore: Giocatore): string {
    const giornataIniziale = this.lega?.giornataIniziale || 0;
    const giornataCorrente = this.lega?.giornataCorrente ?? -1;
    const giocata = this.getGiocataByGiornata(giocatore, giornata);
    const esito = giocata == undefined ? '' : giocata.esito;
    let ret = '';
    if (giornata + giornataIniziale - 1 !== giornataCorrente) {
      ret = 'Non visualizzo perchè non è la giornata corrente';
    }
    if (
      giocatore.statiPerLega?.[this.lega?.id ?? 0]?.value ===
      StatoGiocatore.ELIMINATO.value
    ) {
      ret = 'Non visualizzo perchè il giocatore è eliminato';
    }
    if (esito == 'OK' || esito == 'KO') {
      ret = 'Non visualizzo perchè è presente un esito';
    }
    if (
      !this.isAdmin() &&
      !this.isLeaderLega() &&
      (giocatore.user == null ||
        giocatore.user.id !== this.authService.getCurrentUser()?.id)
    ) {
      ret = 'Non visualizzo perchè non sei leader e non sei tu';
    }
    if (
      !this.isAdmin() &&
      !this.isLeaderLega() &&
      this.lega?.statoGiornataCorrente.value !== StatoPartita.DA_GIOCARE.value
    ) {
      ret = 'Non visualizzo perchè la giornata corrente non è da giocare';
    }
    if (this.lega?.statoGiornataCorrente.value === StatoPartita.SOSPESA.value) {
      ret = 'Non visualizzo perchè la giornata è sospesa';
    }
    if (this.isTerminata()) {
      ret = 'Non visualizzo perchè la lega è terminata';
    }
    if (this.lega?.giornataDaGiocare && (this.lega.giornataDaGiocare < this.lega.giornataCorrente)) {
    //  ret = 'Non visualizzo perchè la giornata da giocare ' + this.lega.giornataDaGiocare + ' è inferiore alla corrente ' + this.lega.giornataCorrente;
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
      if (this.lega?.giornataFinale){
        maxGiornata=this.lega?.giornataFinale;
      }
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

  hasGiocataDisponibile(giocatore: Giocatore): boolean {
    // Verifica se esiste almeno una giornata giocabile per questo giocatore
    if (!this.lega || !this.lega.giornataIniziale || !this.lega.statiGiornate) {
      return false;
    }

    for (let i = 0; i < this.giornataIndices.length; i++) {
      const giornataAssoluta = this.giornataIndices[i] + this.lega.giornataIniziale - 1;
      if (this.visualizzaGiocata(giornataAssoluta, giocatore)) {
        return true;
      }
    }
    return false;
  }

  giocaGiornataDisponibile(giocatore: Giocatore): void {
    // Trova la prima giornata disponibile e apri il popup
    if (!this.lega || !this.lega.giornataIniziale || !this.lega.statiGiornate) {
      return;
    }

    for (let i = 0; i < this.giornataIndices.length; i++) {
      const giornataAssoluta = this.giornataIndices[i] + this.lega.giornataIniziale - 1;
      if (this.visualizzaGiocata(giornataAssoluta, giocatore)) {
        this.giocaGiornata(giocatore, giornataAssoluta);
        return;
      }
    }
  }

  // Mostra/nascondi conferma eliminazione
  toggleDeleteConfirm(): void {
    this.showDeleteConfirm = !this.showDeleteConfirm;
  }

  // Elimina la lega
  confirmEliminaLega(): void {
    if (!this.lega) return;

    console.log('Eliminazione lega in corso...', this.lega.id);
    this.isDeleting = true;
    this.showDeleteConfirm = false; // Chiudi il dialog subito

    this.legaService.eliminaLega(this.lega.id).subscribe({
      next: (response) => {
        console.log('Lega eliminata con successo:', response);
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

  getStatoGiornataValue(index: number): string {
    if (!this.lega || !this.lega.statiGiornate) return '';
    return this.lega.statiGiornate[index]?.value || '';
  }

  ngOnDestroy(): void {
    if (this.countdownIntervalId) {
      clearInterval(this.countdownIntervalId);
    }
  }

  startCountdown(): void {
    console.log('🕐 startCountdown chiamato per:', this.lega?.campionato?.sport?.id);
    console.log('📅 inizioProssimaGiornata:', this.lega?.inizioProssimaGiornata);

    if (!this.lega) {
      console.warn('⚠️ Countdown non attivo - lega non caricata');
      this.countdownActive = false;
      return;
    }

    if (this.lega.inizioProssimaGiornata) {
      // CASO 1: inizioProssimaGiornata è disponibile (dovrebbe funzionare per tutti gli sport)
      this.startCountdownWithTime(new Date(this.lega.inizioProssimaGiornata));
    } else {
      // CASO 2: FALLBACK - carica le partite della giornata e trova la prima
      console.warn('⚠️ inizioProssimaGiornata non disponibile, carico le partite...');
      this.loadFirstMatchTimeAndStartCountdown();
    }
  }

  private loadFirstMatchTimeAndStartCountdown(): void {
    if (!this.lega || !this.lega.campionato?.id) return;

    // Carica TUTTE le partite della giornata passando stringa vuota come squadraId
    this.campionatoService
      .calendario(
        this.lega.campionato.id,
        '', // Stringa vuota = recupera tutte le partite della giornata
        this.lega.anno,
        this.lega.giornataCorrente,
        true
      )
      .subscribe({
        next: (partite) => {
          if (partite && partite.length > 0) {
            // Trova la prima partita ordinando per orario
            const primaPartita = partite
              .filter(p => p.orario)
              .sort((a, b) => new Date(a.orario!).getTime() - new Date(b.orario!).getTime())[0];

            if (primaPartita && primaPartita.orario) {
              console.log('✅ Prima partita trovata:', primaPartita.orario);
              this.startCountdownWithTime(new Date(primaPartita.orario));
            }
            else {
              console.warn('⚠️ Nessuna partita con orario trovata');
              this.countdownActive = false;
            }
          } else {
            console.warn('⚠️ Nessuna partita trovata per la giornata');
            this.countdownActive = false;
          }
        },
        error: (error) => {
          console.error('❌ Errore caricamento partite:', error);
          this.countdownActive = false;
        }
      });
  }

  private startCountdownWithTime(matchTime: Date): void {
    // Sottrai 5 minuti (5 * 60 * 1000 millisecondi)
    const targetTime = new Date(matchTime.getTime() - 5 * 60 * 1000);

    console.log('⏰ Match time:', matchTime);
    console.log('🎯 Target time (5min prima):', targetTime);

    const updateCountdown = () => {
        const now = new Date().getTime();
        const countdownEndTime = targetTime.getTime();
        const distance = countdownEndTime - now;

        if (distance < 0) {
          // Tempo scaduto - mostra messaggio ma mantieni il countdown attivo per visualizzarlo
          this.countdown = '⏰ ' + this.translate.instant('LEAGUE.TIME_EXPIRED');
          this.countdownActive = true; // Mantieni attivo per mostrare il messaggio
          this.countdownExpired = true; // Flag per applicare lo stile rosso
          // Non fermare l'interval, continua ad aggiornare per mostrare "Tempo scaduto"
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
    this.countdownIntervalId = setInterval(updateCountdown, 1000);
  }
}
