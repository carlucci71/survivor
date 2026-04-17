import { MatDialog } from '@angular/material/dialog';
import { Overlay, ScrollStrategyOptions } from '@angular/cdk/overlay';
import { Component, ViewChild, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, forkJoin, of } from 'rxjs';
import { map, filter, switchMap, take, catchError } from 'rxjs/operators';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { LegaService } from '../../core/services/lega.service';
import {
  ClassificaRow,
  Giocata,
  Giocatore,
  Lega,
  Partita,
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
import { ReactionService } from '../../core/services/reaction.service';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CampionatoService } from '../../core/services/campionato.service';
import { UtilService } from '../../core/services/util.service';
import { SospensioniService } from '../../core/services/sospensioni.service';
import { MockService } from '../../core/services/mock.service';
import { SospensioniDialogComponent } from './sospensioni-dialog.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateLeagueDataPipe } from '../../shared/pipes/translate-league-data.pipe';
import { environment } from '../../../environments/environment';
import { PlayerHistoryDialogComponent } from '../../shared/components/player-history-dialog/player-history-dialog.component';
import { RoundResultsDialogComponent } from '../../shared/components/round-results-dialog/round-results-dialog.component';
import { SamePickDialogComponent } from '../../shared/components/same-pick-dialog/same-pick-dialog.component';
import { RecapService } from '../../core/services/recap.service';
import { VincitoriDialogComponent } from '../../shared/components/vincitori-dialog/vincitori-dialog.component';
import { LeaderTutorialComponent } from '../../shared/components/leader-tutorial/leader-tutorial.component';
import { PlayerTutorialComponent } from '../../shared/components/player-tutorial/player-tutorial.component';
import { StudioGiocataDialogComponent } from './studio-giocata-dialog.component';
import { GestisciViteDialogComponent } from './gestisci-vite-dialog.component';

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
    LeaderTutorialComponent,
    PlayerTutorialComponent,
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
  @ViewChild('excelTableScroll') excelTableScroll?: ElementRef<HTMLDivElement>;

  /**
   * 🧪 MODALITÀ TEST per testare il dialog dello storico
   *
   * Imposta a true per:
   * - Forzare la visualizzazione dell'icona storico per TUTTI i giocatori
   * - Permettere di testare il dialog dello storico anche con poche giocate
   * - Aggiungere 10 giornate mock a tutti i giocatori
   *
  /**
   * 🧪 MOCK PER TESTING ICONA STORICO - DISABILITATO ✅
   *
   * ⚠️ ATTENZIONE: Il mock è DISABILITATO per produzione!
   *
   * 📋 Uso:
   * - true: Attiva mock con 10 giornate per testare layout compatto (5 visibili + dialog storico)
   * - false: Modalità normale produzione (✅ ATTUALE)
   *
   * ⚠️ IMPORTANTE: Rimettere a false prima di commit/push per produzione!
   */
  private readonly TEST_MODE_FORCE_HISTORY_ICON = false; // ✅ PRODUZIONE - Mock DISABILITATO

  readonly REACTION_EMOJIS = ['👏', '😱', '🔥', '🤬', '💀', '🤡', '😤', '🤦', '💩', '🤘', '🥶', '🤌', '😵', '😈', '💪', '❤️'];

  activeReactionKey: string | null = null;
  activeGiocata: Giocata | null = null;
  reactionPopupStyle: { top: string; left: string } = { top: '0px', left: '0px' };
  reactionPickerBelow = false;
  // chiave univoca del badge di cui mostrare gli autori: "giocataId_emoji"
  activeBadgeAutoriKey: string | null = null;
  activeBadgeAutoriNomi: string = '';
  activeBadgeAutoriNomiAll: string = '';
  activeBadgeAutoriHasMore: boolean = false;
  activeBadgeAutoriExpanded: boolean = false;
  activeBadgeAutoriEmoji: string = '';
  badgeAutoriStyle: { top: string; left: string } = { top: '0px', left: '0px' };
  private badgeAutoriTimer: any = null;
  private pickerAutoCloseTimer: any = null;
  private longPressTimer: any = null;
  private closePopupTimer: any = null;
  private popupJustOpened = false;
  // Tiene traccia di reaction ottimistiche ancora in volo (giocataId → emoji o null se rimossa)
  private pendingReactions = new Map<number, string | null>();

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

  // ─── Recap CTA ────────────────────────────────────────────────────────────
  /** Giornata relativa dell'ultimo recap disponibile (null se nessuna calcolata). */
  get recapGiornataRelativa(): number | null {
    if (!this.lega?.giornataCalcolata) return null;
    return this.lega.giornataCalcolata - this.lega.giornataIniziale + 1;
  }

  /** True se il recap per l'ultima giornata calcolata non è ancora stato visto. */
  get recapNonVisto(): boolean {
    const g = this.recapGiornataRelativa;
    if (!this.lega || g === null) return false;
    return !this.recapService.isSeen(this.lega.id, g);
  }

  goToRecap(): void {
    const g = this.recapGiornataRelativa;
    if (this.lega && g !== null) {
      this.router.navigate(['/recap', this.lega.id, g]);
    }
  }

  // Tutorial
  showLeaderTutorial = false;
  showPlayerTutorial = false;

  // Elimina lega
  showDeleteConfirm = false;
  isDeleting = false;

  // Messaggio di consolazione (salvato una sola volta)
  private savedConsolationMessage: string = '';

  // Percorso giocatori
  showPlayerJourneys = false;

  // FILTRI E RICERCA MOBILE
  searchText: string = '';
  playerFilter: 'all' | 'active' | 'eliminated' = 'active';
  expandedPlayers: { [key: number]: boolean } = {};

  // Giornate visibili
  MAX_VISIBLE_ROUNDS = 5; // Numero massimo di giornate visibili per default

  // ─── Voti per squadra (chips mobile) ─────────────────────────────────────
  votiSheet: { nome: string; sigla: string; nicknames: string[] } | null = null;

  // Mappa delle partite forzate {giornata_squadraSigla: boolean}
  partiteForzate: Map<string, boolean> = new Map();

  // Partite della prossima giornata per il ticker del widget campionato
  tickerPartite: { casa: string; fuori: string; orario: Date | null }[] = [];

  // Studio: calendario + classifica della giornata corrente
  studioAperto = false;
  studioTab: 'calendario' | 'classifica' = 'calendario';
  studioPartite: Partita[] = [];
  studioClassifica: ClassificaRow[] = [];
  studioCaricato = false;
  studioLoading = false;

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
    private reactionService: ReactionService,
    private router: Router,
    private giocataService: GiocataService,
    private dialog: MatDialog,
    private overlay: Overlay,
    private sospensioniService: SospensioniService,
    private mockService: MockService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private recapService: RecapService,
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

          // 🧪 MOCK PER TESTARE TABELLA CON PIÙ GIORNATE
          // Questo mock crea 10 giornate fittizie per testare:
          // - Layout compatto con solo 5 giornate visibili
          // - Dialog storico completo con tutte le 10 giocate
          // - Icona storico accanto al nome utente
          // - NO scroll orizzontale su desktop/tablet
          if (this.TEST_MODE_FORCE_HISTORY_ICON && this.lega) {
            console.log('🧪 MOCK MODE ATTIVO: Generazione 10 giornate fittizie');

            // Forzo giornataIniziale e giornataFinale per avere 10 giornate
            this.lega.giornataIniziale = 1;
            this.lega.giornataFinale = 10;
            this.lega.giornataCorrente = 8; // Simulo che siamo alla giornata 8

            // Mock squadre Serie A per le giocate
            const mockSquadre = ['INT', 'MIL', 'JUV', 'NAP', 'ROM', 'ATA', 'LAZ', 'FIO', 'BOL', 'TOR'];
            const mockEsiti = ['OK', 'OK', 'KO', 'OK', 'OK', 'OK', 'KO', 'OK', null, null];

            // Aggiungi giocate mock a TUTTI i giocatori
            this.lega.giocatori?.forEach((giocatore) => {
              giocatore.giocate = [];

              for (let i = 0; i < 10; i++) {
                giocatore.giocate.push({
                  giornata: i + 1,
                  squadraSigla: mockSquadre[i],
                  esito: mockEsiti[i] as any,
                  forzatura: i === 4 ? 'admin' : undefined, // Giornata 5 forzata
                  pubblica: true
                });
              }
            });
          }

          this.caricaTabella();
          this.scrollTableToRight();
          this.startCountdown();
          if (this.isCampionato()) this.caricaTickerPartite();
          if (this.isTerminata()) {
            setTimeout(() => this.maybeOpenVincitoriDialog(), 600);
          }
          this.maybeTriggerTutorial();
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo o della lega:', error);
      }
    });
  }

  private maybeOpenVincitoriDialog(): void {
    const vincitori = this.lega!.giocatori?.filter(
      g => g.statiPerLega?.[this.lega!.id]?.value !== StatoGiocatore.ELIMINATO.value
    ) ?? [];

    this.dialog.open(VincitoriDialogComponent, {
      width: '92vw',
      maxWidth: '440px',
      maxHeight: '92dvh',
      panelClass: 'vincitori-dialog-panel',
      autoFocus: false,
      disableClose: false,
      data: { lega: this.lega, vincitori }
    });
  }

  /**
   * Ricarica i dettagli della lega dal backend
   */
  loadLegaDetails(): void {
    if (this.id) {
      this.legaService.getLegaById(this.id).subscribe({
        next: (lega) => {
          // Se ci sono reaction ottimistiche ancora in volo, le re-applica sul nuovo lega
          // per evitare che un reload intermedio le faccia sparire prima del salvataggio
          if (this.pendingReactions.size > 0) {
            lega.giocatori?.forEach(giocatore => {
              giocatore.giocate?.forEach(giocata => {
                if (giocata.id != null && this.pendingReactions.has(giocata.id)) {
                  const pendingEmoji = this.pendingReactions.get(giocata.id);
                  if (pendingEmoji === null) {
                    // reaction rimossa in modo ottimistico: cancella dal reload
                    if (giocata.reactions) {
                      const oldEmoji = giocata.miaReaction;
                      if (oldEmoji) {
                        giocata.reactions = { ...giocata.reactions };
                        (giocata.reactions[oldEmoji] as number)--;
                        if ((giocata.reactions[oldEmoji] as number) <= 0) {
                          delete giocata.reactions[oldEmoji];
                        }
                      }
                    }
                    giocata.miaReaction = null;
                  } else {
                    // reaction aggiunta/cambiata in modo ottimistico
                    // pendingEmoji è string (non null/undefined) in questo ramo: il caso null
                    // è già gestito nel ramo if sopra, e Map.get restituisce undefined solo
                    // se la chiave non esiste (ma qui la chiave esiste dato l'has())
                    const emoji = pendingEmoji as string;
                    const newReactions: Record<string, number> = { ...(giocata.reactions ?? {}) };
                    const oldEmoji = giocata.miaReaction;
                    if (oldEmoji && oldEmoji !== emoji) {
                      newReactions[oldEmoji] = Math.max(0, (newReactions[oldEmoji] ?? 1) - 1);
                      if (newReactions[oldEmoji] <= 0) delete newReactions[oldEmoji];
                    }
                    if (!oldEmoji || oldEmoji !== emoji) {
                      newReactions[emoji] = (newReactions[emoji] ?? 0) + 1;
                    }
                    giocata.reactions = newReactions;
                    giocata.miaReaction = emoji;
                  }
                }
              });
            });
          }

          const prevGiornataCorrente = this.lega?.giornataCorrente;
          this.lega = lega;

          // Se è avanzata la giornata corrente (es. dopo un calcolo esterno),
          // resetta il countdown scaduto e riavvialo per la nuova giornata.
          if (this.countdownExpired && lega.giornataCorrente !== prevGiornataCorrente) {
            this.countdownExpired = false;
            this.startCountdown();
          }

          // 🧪 MOCK PER TESTARE TABELLA CON PIÙ GIORNATE
          if (this.TEST_MODE_FORCE_HISTORY_ICON && this.lega) {
            // Forzo giornataIniziale e giornataFinale per avere 10 giornate
            this.lega.giornataIniziale = 1;
            this.lega.giornataFinale = 10;

            // Mock squadre Serie A
            const mockSquadre = ['INT', 'MIL', 'JUV', 'NAP', 'ROM', 'ATA', 'LAZ', 'FIO', 'BOL', 'TOR'];
            const mockEsiti = ['OK', 'OK', 'KO', 'OK', 'OK', 'OK', 'KO', 'OK', null, null];

            // Aggiungi giocate mock a TUTTI i giocatori
            this.lega.giocatori?.forEach((giocatore) => {
              giocatore.giocate = [];

              for (let i = 0; i < 10; i++) {
                giocatore.giocate.push({
                  giornata: i + 1,
                  squadraSigla: mockSquadre[i],
                  esito: mockEsiti[i] as any,
                  forzatura: i === 4 ? 'admin' : undefined, // Giornata 5 forzata
                  pubblica: true
                });
              }
            });
          }

          this.caricaTabella();
          this.caricaPartiteForzate();
        },
        error: (error) => {
          console.error('Errore nel ricaricamento della lega:', error);
        },
      });
    }
  }

  caricaTickerPartite(): void {
    if (!this.lega?.campionato?.id || !this.lega.anno) return;
    const giornata = this.lega.giornataDaGiocare || this.lega.giornataCorrente;
    if (!giornata) return;
    this.campionatoService.partiteDellaGiornata(
      this.lega.campionato.id!,
      this.lega.anno,
      giornata
    ).subscribe({
      next: (partite: any[]) => {
        this.tickerPartite = (partite || [])
          .sort((a, b) => new Date(a.orario).getTime() - new Date(b.orario).getTime())
          .map(p => ({
            casa: p.casaSigla || p.casaNome || '?',
            fuori: p.fuoriSigla || p.fuoriNome || '?',
            orario: p.orario ? new Date(p.orario) : null,
          }));
      },
      error: () => {}
    });
  }

  apriStudio(): void {
    if (!this.lega?.campionato?.id || !this.lega.anno) return;
    if (!this.studioCaricato) {
      this.studioLoading = true;
      this.caricaStudio();
    }
    const giornata = this.lega.giornataDaGiocare || this.lega.giornataCorrente;
    const label = this.campionatoService.getDesGiornata(
      this.lega.campionato.id!,
      giornata ?? 1,
      ''
    );
    // Se i dati sono già pronti apre subito, altrimenti aspetta il caricamento
    if (this.studioCaricato) {
      this.dialog.open(StudioGiocataDialogComponent, {
        data: { partite: this.studioPartite, classifica: this.studioClassifica, giornataLabel: label },
        panelClass: 'studio-dialog-panel',
        maxWidth: '520px',
        width: '96vw',
      });
    } else {
      const sub = this.campionatoService.partiteDellaGiornata(this.lega.campionato.id!, this.lega.anno, giornata!)
        .pipe(catchError(() => of([])))
        .subscribe(() => {
          // caricaStudio() gestisce già il completamento; al prossimo click sarà pronto
          sub.unsubscribe();
        });
      // Apri il dialog appena caricaStudio finisce
      const waitOpen = setInterval(() => {
        if (this.studioCaricato) {
          clearInterval(waitOpen);
          this.dialog.open(StudioGiocataDialogComponent, {
            data: { partite: this.studioPartite, classifica: this.studioClassifica, giornataLabel: label },
            panelClass: 'studio-dialog-panel',
            maxWidth: '520px',
            width: '96vw',
          });
        }
      }, 100);
      // Fallback after 8s
      setTimeout(() => clearInterval(waitOpen), 8000);
    }
  }

  caricaStudio(): void {
    if (!this.lega?.campionato?.id || !this.lega.anno) return;
    const giornata = this.lega.giornataDaGiocare || this.lega.giornataCorrente;
    if (!giornata) return;
    this.studioLoading = true;
    const campId = this.lega.campionato.id!;
    const anno = this.lega.anno;
    forkJoin({
      partite: this.campionatoService.partiteDellaGiornata(campId, anno, giornata).pipe(catchError(() => of([]))),
      classifica: this.campionatoService.classificaCampionato(campId, anno).pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ partite, classifica }) => {
        this.studioPartite = [...(partite as any[])].sort(
          (a, b) => new Date(a.orario).getTime() - new Date(b.orario).getTime()
        ) as Partita[];
        this.studioClassifica = classifica;
        this.studioCaricato = true;
        this.studioLoading = false;
      },
      error: () => { this.studioLoading = false; }
    });
  }

  caricaPartiteForzate(): void {
    if (!this.lega?.campionato?.id || !this.lega.anno) return;

    const giornataIniziale = this.lega.giornataIniziale || 0;
    const giornataCorrente = this.lega.giornataCorrente || giornataIniziale;
    const maxGiornateVisibili = 5;
    const startGiornata = Math.max(giornataIniziale, giornataCorrente - Math.floor(maxGiornateVisibili / 2));
    const endGiornata = Math.min(
      this.lega.giornataFinale || giornataCorrente,
      startGiornata + maxGiornateVisibili - 1
    );

    for (let g = startGiornata; g <= endGiornata; g++) {
      this.campionatoService.partiteDellaGiornata(
        this.lega.campionato.id!,
        this.lega.anno,
        g
      ).subscribe({
        next: (partite: any[]) => {
          partite?.forEach((p: any) => {
            if (p.forzata === true) {
              this.partiteForzate.set(`${g}_${p.casaSigla}`, true);
              this.partiteForzate.set(`${g}_${p.fuoriSigla}`, true);
            } else {
              // Assicura che venga rimosso se non forzata
              this.partiteForzate.set(`${g}_${p.casaSigla}`, false);
              this.partiteForzate.set(`${g}_${p.fuoriSigla}`, false);
            }
          });
        },
        error: () => {}
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

  getTorneoLogo(campionatoId: string | undefined): string | null {
    if (!campionatoId) return null;
    const map: Record<string, string> = {
      'SERIE_A': 'assets/logos/calcio/tornei/serie_A.png',
      'SERIE_B': 'assets/logos/calcio/tornei/serie_b.png',
      'LIGA': 'assets/logos/calcio/tornei/liga.png',
      'MONDIALI_2026': 'assets/logos/calcio/tornei/mondiali.jpg',
      'NBA_RS': 'assets/logos/basket/tornei/NBA.png',
      'AUS_OPEN': 'assets/logos/tennis/tornei/Australian Open.png',
      'ROLAND_GARROS': 'assets/logos/tennis/tornei/Roland Garros.png',
      'US_OPEN': 'assets/logos/tennis/tornei/US Open.png',
      'WIMBLEDON': 'assets/logos/tennis/tornei/wimbledon.png',
    };
    return map[campionatoId] || null;
  }

  // ── Progressione lega ─────────────────────────────────────────────────────

  getEffectiveGiornataFinale(): number {
    if (this.lega?.giornataFinale) return this.lega.giornataFinale;
    // fallback: ultima giornata del campionato, altrimenti giornataIniziale + 9
    if (this.lega?.campionato?.numGiornate) return this.lega.campionato.numGiornate;
    return (this.lega?.giornataIniziale ?? 1) + 9;
  }

  getLeagueTotalRounds(): number {
    if (this.lega?.giornataIniziale == null) return 0;
    return this.getEffectiveGiornataFinale() - this.lega.giornataIniziale + 1;
  }

  getLeagueRoundNumber(): number {
    if (this.lega?.giornataIniziale == null) return 1;
    const corrente = this.lega.giornataCorrente ?? this.lega.giornataIniziale;
    return Math.max(1, corrente - this.lega.giornataIniziale + 1);
  }

  getLegaProgressPercent(): number {
    if (this.lega?.giornataIniziale == null) return 0;
    const fine = this.getEffectiveGiornataFinale();
    const total = fine - this.lega.giornataIniziale;
    if (total <= 0) return 100;
    const corrente = this.lega.giornataCorrente ?? this.lega.giornataIniziale;
    const done = corrente - this.lega.giornataIniziale;
    return Math.min(100, Math.max(0, (done / total) * 100));
  }

  /** Posizioni percentuali dei divisori tra giornate sulla barra */
  getProgressTicks(): number[] {
    const total = this.getLeagueTotalRounds();
    if (total <= 2) return [];
    const ticks: number[] = [];
    for (let i = 1; i < total; i++) {
      ticks.push((i / (total - 1)) * 100);
    }
    return ticks;
  }

  // ─────────────────────────────────────────────────────────────────────────

  /**
   * Versione abbreviata del titolo giornata per mobile
   * Es: "Giornata 26" → "Gio. 26"
   */
  getDesGiornataTitleMobile(index: number): string {
    const fullTitle = this.getDesGiornataTitle(index);
    if (!fullTitle) return '';

    // CAMPIONATO: etichette compatte specifiche per fase torneo
    if (this.isCampionato()) {
      const compactMap: Record<string, string> = {
        'Girone - Giornata 1': 'G.1',
        'Girone - Giornata 2': 'G.2',
        'Girone - Giornata 3': 'G.3',
        'Sedicesimi di finale': '32°',
        'Ottavi di finale': '16°',
        'Quarti di finale': 'QF',
        'Semifinali': 'SF',
        'Finale': 'F',
      };
      // Cerca corrispondenza sull'etichetta base (prima della traduzione)
      const desBase = this.campionatoService.getDesGiornataNoAlias(
        this.lega?.campionato?.id ?? '', index
      );
      if (compactMap[desBase]) return compactMap[desBase];
      // Fallback: cerca sui valori tradotti
      for (const [key, short] of Object.entries(compactMap)) {
        if (fullTitle.includes(key)) return short;
      }
    }

    const roundWord = this.translate.instant('LEAGUE.ROUND');
    const weekWord = this.translate.instant('LEAGUE.WEEK');
    const roundShort = this.translate.instant('LEAGUE.ROUND_SHORT');
    const weekShort = this.translate.instant('LEAGUE.WEEK_SHORT');

    if (fullTitle.startsWith(roundWord + ' ')) {
      return fullTitle.replace(roundWord + ' ', roundShort + ' ');
    }
    if (fullTitle.startsWith(weekWord + ' ')) {
      return fullTitle.replace(weekWord + ' ', weekShort + ' ');
    }
    if (/^\d+$/.test(fullTitle)) {
      return fullTitle;
    }
    const numero = fullTitle.match(/\d+/);
    if (numero) {
      return `${roundShort} ${numero[0]}`;
    }
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
    const prevPicks = (giocatore.giocate || [])
      .filter((g: any) => Number(g?.giornata) !== giornata)
      .map((g: any) => g.squadraSigla);

    // Calcola alreadyUsed: ciclo per CAMPIONATO, blacklist globale per SURVIVOR
    let squadreDisponibili: any[];
    if (this.lega?.modalita === 'CAMPIONATO') {
      const numSquadre = this.squadre.length;
      const cycleStart = numSquadre > 0 ? Math.floor(prevPicks.length / numSquadre) * numSquadre : 0;
      const currentCycleTeams = new Set(prevPicks.slice(cycleStart));
      squadreDisponibili = this.squadre.map(
        (s: any) => ({ ...s, alreadyUsed: currentCycleTeams.has(s.sigla) })
      );
    } else {
      // SURVIVOR: qualsiasi squadra già usata nelle giornate precedenti è bloccata
      squadreDisponibili = this.squadre.map(
        (s: any) => ({ ...s, alreadyUsed: prevPicks.includes(s.sigla) })
      );
    }

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
        giocataCorrente: giocataCorrente  // ✅ Passa la giocata esistente per inizializzare pubblica
      },
      width: isDesktop ? '90vw' : '95vw',
      maxWidth: isDesktop ? '1100px' : '500px',
      maxHeight: '90vh',
      panelClass: ['seleziona-giocata-dialog', isDesktop ? 'desktop-dialog' : 'mobile-dialog'],
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false,
      // CENTRATO (nessun position)
      scrollStrategy: this.overlay.scrollStrategies.noop()
    };


    const dialogRef = this.dialog.open(SelezionaGiocataComponent, dialogConfig);
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.squadraSelezionata) {
        this.salvaSquadra(giocatore, giornata, result.squadraSelezionata, result.pubblica);
      } else if (result && result.eliminata) {
        this.loadLegaDetails();
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home'], { state: { selectedLegaId: this.lega?.id, activeTab: this.lega?.pubblica ? 'public' : 'private' } });
  }

  isCampionato(): boolean {
    return this.lega?.modalita === 'CAMPIONATO';
  }

  classificaAperta = false;

  toggleClassifica(): void {
    this.classificaAperta = !this.classificaAperta;
  }

  getClassificaCampionato(): Giocatore[] {
    if (!this.lega?.giocatori) return [];
    return [...this.lega.giocatori].sort((a, b) => (b.puntiTotali ?? 0) - (a.puntiTotali ?? 0));
  }

  getPosizioneClassifica(giocatore: Giocatore): number {
    return this.getClassificaCampionato().findIndex(g => g.user?.id === giocatore.user?.id) + 1;
  }

  getMiaPosizioneClassifica(): { pos: number; punti: number; emoji: string; totale: number; distanza: number; leaderNick: string | null; isLeader: boolean } | null {
    const me = this.getCurrentGiocatore();
    if (!me) return null;
    const classifica = this.getClassificaCampionato();
    const pos = classifica.findIndex(g => g.user?.id === me.user?.id) + 1;
    if (pos === 0) return null;
    const punti = me.puntiTotali ?? 0;
    const emoji = pos === 1 ? '🥇' : pos === 2 ? '🥈' : pos === 3 ? '🥉' : '🏆';
    const totale = classifica.length;
    const leader = classifica[0];
    const leaderPunti = leader?.puntiTotali ?? 0;
    const distanza = pos === 1 ? 0 : leaderPunti - punti;
    const isLeader = pos === 1;
    const leaderNick = (!isLeader && leader?.nickname) ? leader.nickname : null;
    return { pos, punti, emoji, totale, distanza, leaderNick, isLeader };
  }

  isCurrentUser(giocatore: Giocatore): boolean {
    return giocatore.user?.id === this.authService.getCurrentUser()?.id;
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

    let startGiornata: number;
    let endGiornata: number;

    const giornataCorrente = this.lega?.giornataCorrente || giornataIniziale;
    const maxGiornateVisibili = 5;
    // Mostra tutte le giornate dall'inizio fino alla corrente, max 5
    // Oltre 5 appare il pulsante storico — nessuna finestra scorrevole
    startGiornata = giornataIniziale;
    endGiornata = Math.min(maxGiornata, giornataCorrente, giornataIniziale + maxGiornateVisibili - 1);

    // Popola le colonne visibili
    for (let i = startGiornata; i <= endGiornata; i++) {
      this.displayedColumns.push('giocata' + (i - giornataIniziale));
    }

    // Popola giornataIndices solo con le giornate visibili (TEMPORANEO: MAX 10 PER TEST)
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
   * Restituisce le giornate visibili per un giocatore (max 5).
   * Tutti i giocatori — attivi ed eliminati — ricevono lo stesso array di colonne
   * in modo che il numero di <td> corrisponda sempre al numero di <th> dell'header.
   */
  getVisibleGiornateForPlayer(_giocatore: Giocatore): number[] {
    if (!this.giornataIndices || this.giornataIndices.length === 0) return [];

    const totalRounds = this.giornataIndices.length;
    if (totalRounds <= this.MAX_VISIBLE_ROUNDS) {
      return this.giornataIndices;
    }
    return this.giornataIndices.slice(-this.MAX_VISIBLE_ROUNDS);
  }

  /**
   * True se la cella è "post-eliminazione" per un giocatore eliminato:
   * usato nel template per applicare uno stile visivo diverso.
   */
  isCellPostElim(giocatore: Giocatore, giornataAssoluta: number): boolean {
    if (!this.lega) return false;
    if (giocatore.statiPerLega?.[this.lega.id]?.value !== StatoGiocatore.ELIMINATO.value) return false;
    const ultimaGiocata = this.getUltimaGiornataGiocata(giocatore);
    return ultimaGiocata > 0 && giornataAssoluta > ultimaGiocata;
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
   * Verifica se il giocatore ha più giocate del limite visibile nella tabella
   * Mostra l'emoji dello storico se ci sono giocate oltre alle 5 visualizzate nella tabella
   * ANCHE per i giocatori eliminati (devono poter vedere il loro storico completo)
   */
  hasMoreRounds(giocatore: Giocatore): boolean {
    // 🧪 MODALITÀ TEST: forza sempre la visualizzazione dell'icona storico
    if (this.TEST_MODE_FORCE_HISTORY_ICON) {
      return true; // Mostra sempre l'icona in modalità test
    }

    if (!giocatore?.giocate || !this.giornataIndices) return false;

    // Conta quante giocate ha effettuato in totale
    const totaleGiocate = giocatore.giocate.length;

    // Conta quante giornate sono visualizzate nella tabella corrente
    const giornateVisibili = this.giornataIndices.length;

    // Mostra il pulsante se ha più giocate di quelle visualizzate nella tabella
    // (cioè se ci sono giocate "nascoste" che non si vedono nella tabella)
    // ✅ ANCHE per i giocatori eliminati!
    return totaleGiocate > giornateVisibili;
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
    // Ottimizzazione per mobile
    const isMobile = window.innerWidth <= 768;

    // ✅ SOLUZIONE SEMPLICE: Passa tutte le giocate, il dialog le elaborerà
    // Non calcolare le giornate assolute qui, lascia che il dialog lo faccia internamente
    const dialogRef = this.dialog.open(PlayerHistoryDialogComponent, {
      width: isMobile ? '95vw' : '90vw',
      maxWidth: isMobile ? '100%' : '800px',
      maxHeight: isMobile ? '85vh' : '90vh',
      data: {
        giocatore: giocatore,
        lega: this.lega,
        giornataIndices: [], // ✅ Array vuoto, il dialog calcolerà le giornate internamente
        getGiocataByGiornataAssoluta: this.getGiocataByGiornataAssoluta.bind(this),
        getTeamLogo: this.getTeamLogo.bind(this),
        getSquadraNome: this.getSquadraNome.bind(this)
      },
      panelClass: 'player-history-dialog-wrapper',
      autoFocus: false,
      restoreFocus: false
      // CENTRATO
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
    if (!giocatore?.giocate) {
      return null;
    }

    // Il backend salva le giocate con giornata RELATIVA (1, 2, 3...)
    // quando chiamiamo giocaGiornata viene passata la giornata relativa
    // Quindi dobbiamo convertire la giornataAssoluta in relativa per cercare
    const giornataRelativa = giornataAssoluta - (this.lega?.giornataIniziale || 1) + 1;

    // Cerca SOLO per giornata relativa (è così che viene salvata)
    const giocata = giocatore.giocate.find((g: any) => Number(g?.giornata) === giornataRelativa);
    return giocata;
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

  getSquadraNomeSenzaCitta(squadraSigla: string | null | undefined): string | null {
    const nomeCompleto = this.getSquadraNome(squadraSigla);
    if (!nomeCompleto) return squadraSigla ?? null;
    return this.squadraService.formatNomeSquadra(nomeCompleto);
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

  isGiocatoreEliminato(g: Giocatore): boolean {
    return g.statiPerLega?.[this.lega?.id ?? 0]?.value === StatoGiocatore.ELIMINATO.value;
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

  /** True quando la giornata è in fase attiva di scelta (DA_GIOCARE o IN_CORSO) */
  isRoundPickPhaseActive(): boolean {
    const stato = this.lega?.statoGiornataCorrente?.value;
    return stato === StatoPartita.DA_GIOCARE.value || stato === StatoPartita.IN_CORSO.value;
  }

  /**
   * Restituisce true solo se inizioProssimaGiornata è nel futuro rispetto alla data di riferimento
   */
  isProssimaGiornataFutura(): boolean {
    if (!this.lega?.inizioProssimaGiornata) return false;
    const now = this.beDataRiferimento ?? new Date();
    return new Date(this.lega.inizioProssimaGiornata).getTime() > now.getTime();
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

  private maybeTriggerTutorial(): void {
    if (this.isTerminata()) return;
    if (this.isLeaderLega() || this.isAdmin()) {
      if (!localStorage.getItem('survivor_leader_tutorial_seen')) {
        this.showLeaderTutorial = true;
      }
    } else if (this.isInLega()) {
      if (!localStorage.getItem('survivor_player_tutorial_seen')) {
        this.showPlayerTutorial = true;
      }
    }
  }

  onLeaderTutorialDismissed(): void {
    this.showLeaderTutorial = false;
  }

  onPlayerTutorialDismissed(): void {
    this.showPlayerTutorial = false;
  }

  openLeaderTutorial(): void {
    this.showLeaderTutorial = true;
  }

  openPlayerTutorial(): void {
    this.showPlayerTutorial = true;
  }

  goToRichieste(): void {
    this.router.navigate(['/richieste']);
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

  canShare(): boolean {
    return !!navigator.share;
  }

  /**
   * Aggiunge, cambia o rimuove la reaction dell'utente su una giocata.
   * Se l'utente clicca sulla stessa emoji già scelta → rimuove la reaction.
   */
  toggleReaction(giocata: Giocata, emoji: string): void {
    if (!giocata.id) return;
    // Le reactions sono visibili solo quando il voto non è nascosto
    if (this.shouldHideGiocata(giocata, giocata.giornata ?? 0)) return;

    const stessaEmoji = giocata.miaReaction === emoji;
    const giocataId = giocata.id;

    // Aggiornamento ottimistico
    if (stessaEmoji) {
      // Rimuovi
      if (giocata.reactions) {
        giocata.reactions = { ...giocata.reactions, [emoji]: (giocata.reactions[emoji] ?? 1) - 1 };
        if (giocata.reactions[emoji] <= 0) {
          const { [emoji]: _, ...rest } = giocata.reactions;
          giocata.reactions = rest;
        }
      }
      giocata.miaReaction = null;
      this.pendingReactions.set(giocataId, null);
      this.reactionService.rimuovi(giocataId).subscribe({
        next: () => this.pendingReactions.delete(giocataId),
        error: () => { this.pendingReactions.delete(giocataId); this.loadLegaDetails(); }
      });
    } else {
      // Aggiungi o sostituisci
      const newReactions: Record<string, number> = { ...(giocata.reactions ?? {}) };
      if (giocata.miaReaction) {
        newReactions[giocata.miaReaction] = Math.max(0, (newReactions[giocata.miaReaction] ?? 1) - 1);
        if (newReactions[giocata.miaReaction] <= 0) delete newReactions[giocata.miaReaction];
      }
      newReactions[emoji] = (newReactions[emoji] ?? 0) + 1;
      giocata.reactions = newReactions;
      giocata.miaReaction = emoji;
      this.pendingReactions.set(giocataId, emoji);
      this.reactionService.reagisci(giocataId, emoji).subscribe({
        next: () => this.pendingReactions.delete(giocataId),
        error: () => { this.pendingReactions.delete(giocataId); this.loadLegaDetails(); }
      });
    }
  }

  getReactionEntries(giocata: Giocata): { emoji: string; count: number }[] {
    if (!giocata.reactions) return [];
    return Object.entries(giocata.reactions)
      .filter(([, count]) => count > 0)
      .map(([emoji, count]) => ({ emoji, count }));
  }

  getReactionAutori(giocata: Giocata, emoji: string): string {
    const nomi = giocata.reactionAutori?.[emoji] ?? [];
    if (nomi.length === 0) return '';
    const MAX = 3;
    if (nomi.length <= MAX) return nomi.join(', ');
    return `${nomi.slice(0, MAX).join(', ')} +${nomi.length - MAX} altri`;
  }

  expandBadgeAutori(event: Event): void {
    event.stopPropagation();
    this.activeBadgeAutoriExpanded = true;
    this.activeBadgeAutoriNomi = this.activeBadgeAutoriNomiAll;
    if (this.badgeAutoriTimer) { clearTimeout(this.badgeAutoriTimer); }
    this.badgeAutoriTimer = setTimeout(() => this.closeBadgeAutori(), 4000);
  }

  toggleBadgeAutori(giocata: Giocata, emoji: string, event: Event): void {
    event.stopPropagation();
    const key = `${giocata.id}_${emoji}`;
    if (this.activeBadgeAutoriKey === key) {
      this.closeBadgeAutori();
      return;
    }
    if (this.badgeAutoriTimer) { clearTimeout(this.badgeAutoriTimer); this.badgeAutoriTimer = null; }
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    // Calcola left centrato sul badge, clamped ai bordi del viewport
    const BADGE_MAX_W = Math.min(240, window.innerWidth - 16);
    const MARGIN = 8;
    const idealLeft = rect.left + rect.width / 2 - BADGE_MAX_W / 2;
    const clampedLeft = Math.min(
      Math.max(idealLeft, MARGIN),
      window.innerWidth - BADGE_MAX_W - MARGIN
    );
    this.badgeAutoriStyle = {
      top: `${rect.bottom + 6}px`,
      left: `${clampedLeft}px`,
    };
    const tutti = giocata.reactionAutori?.[emoji] ?? [];
    const MAX = 3;
    this.activeBadgeAutoriNomiAll = tutti.join(', ');
    this.activeBadgeAutoriNomi = tutti.length <= MAX
      ? tutti.join(', ')
      : `${tutti.slice(0, MAX).join(', ')} +${tutti.length - MAX} altri`;
    this.activeBadgeAutoriHasMore = tutti.length > MAX;
    this.activeBadgeAutoriExpanded = false;
    this.activeBadgeAutoriEmoji = emoji;
    this.activeBadgeAutoriKey = key;
    this.badgeAutoriTimer = setTimeout(() => this.closeBadgeAutori(), 2500);
  }

  private closeBadgeAutori(): void {
    this.activeBadgeAutoriKey = null;
    if (this.badgeAutoriTimer) { clearTimeout(this.badgeAutoriTimer); this.badgeAutoriTimer = null; }
  }

  isBadgeAutoriActive(giocataId: number | undefined, emoji: string): boolean {
    return this.activeBadgeAutoriKey === `${giocataId}_${emoji}`;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    if (this.popupJustOpened) return;
    this.activeReactionKey = null;
    this.activeGiocata = null;
    this.closeBadgeAutori();
  }

  openReactionPopup(key: string, giocata: Giocata | null, el: EventTarget | null): void {
    if (!giocata || !el) return;
    if (this.closePopupTimer) { clearTimeout(this.closePopupTimer); this.closePopupTimer = null; }
    if (this.pickerAutoCloseTimer) { clearTimeout(this.pickerAutoCloseTimer); this.pickerAutoCloseTimer = null; }
    const rect = (el as HTMLElement).getBoundingClientRect();
    // Picker width: 4 colonne * 38px + 3 gap * 6px + 2 * 10px padding = ~192px → metà = 96
    const HALF_W = 96;
    const MARGIN = 8;
    const rawLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.min(
      Math.max(rawLeft, HALF_W + MARGIN),
      window.innerWidth - HALF_W - MARGIN
    );
    // Se non c'è spazio sopra, mostra sotto (aggiunge classe via flag)
    const PICKER_H = 200;
    const showBelow = rect.top < PICKER_H + 10;
    this.reactionPickerBelow = showBelow;
    this.reactionPopupStyle = {
      top: showBelow ? `${rect.bottom + 6}px` : `${rect.top}px`,
      left: `${clampedLeft}px`
    };
    this.activeReactionKey = key;
    this.activeGiocata = giocata;
    this.pickerAutoCloseTimer = setTimeout(() => {
      this.activeReactionKey = null;
      this.activeGiocata = null;
      this.pickerAutoCloseTimer = null;
    }, 4000);
  }

  /** Apre il popup con un tap (mobile). Blocca la propagazione per evitare
   *  che il document:click lo richiuda subito. */
  openReactionPopupClick(key: string, giocata: Giocata | null, event: MouseEvent | TouchEvent): void {
    if (!giocata) return;
    event.stopPropagation();
    this.openReactionPopup(key, giocata, event.currentTarget as HTMLElement);
    this.popupJustOpened = true;
    setTimeout(() => { this.popupJustOpened = false; }, 400);
  }

  cancelClosePopup(): void {
    if (this.closePopupTimer) { clearTimeout(this.closePopupTimer); this.closePopupTimer = null; }
    if (this.pickerAutoCloseTimer) { clearTimeout(this.pickerAutoCloseTimer); this.pickerAutoCloseTimer = null; }
  }

  closeReactionPopupDelayed(): void {
    this.closePopupTimer = setTimeout(() => {
      this.activeReactionKey = null;
      this.activeGiocata = null;
      this.closePopupTimer = null;
    }, 600);
  }

  closeReactionPopup(): void {
    if (this.closePopupTimer) {
      clearTimeout(this.closePopupTimer);
      this.closePopupTimer = null;
    }
    this.activeReactionKey = null;
    this.activeGiocata = null;
  }

  startLongPress(key: string, giocata: Giocata | null, event: TouchEvent): void {
    if (!giocata) return;
    this.cancelLongPress();
    const el = event.currentTarget as HTMLElement;
    this.longPressTimer = setTimeout(() => {
      this.longPressTimer = null;
      const rect = el.getBoundingClientRect();
      const HALF_W = 96;
      const MARGIN = 8;
      const rawLeft = rect.left + rect.width / 2;
      const clampedLeft = Math.min(
        Math.max(rawLeft, HALF_W + MARGIN),
        window.innerWidth - HALF_W - MARGIN
      );
      const PICKER_H = 200;
      const showBelow = rect.top < PICKER_H + 10;
      this.reactionPickerBelow = showBelow;
      this.reactionPopupStyle = {
        top: showBelow ? `${rect.bottom + 6}px` : `${rect.top}px`,
        left: `${clampedLeft}px`
      };
      this.activeReactionKey = key;
      this.activeGiocata = giocata;
      this.popupJustOpened = true;
      setTimeout(() => { this.popupJustOpened = false; }, 400);
    }, 500);
  }

  cancelLongPress(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  async shareLink(): Promise<void> {
    const url = environment.baseUrl + '/join/' + this.lega!.id;
    const nomeUtente = this.authService.getCurrentUser()?.name ?? 'Un amico';
    const messaggi = [
      `🏆 ${nomeUtente} ti sfida su Survivor! Unisciti alla mia lega "${this.lega!.name}" e dimostra chi è il vero campione! 💪`,
      `👋 Ciao! Sono ${nomeUtente} e ti invito nella lega "${this.lega!.name}" su Survivor. Chi sopravvive di più? 😈`,
      `⚽ ${nomeUtente} ti aspetta nella lega "${this.lega!.name}" su Survivor. Ti unisci alla sfida? 🔥`,
    ];
    const text = messaggi[Math.floor(Math.random() * messaggi.length)];
    try {
      const { Share } = await import('@capacitor/share');
      await Share.share({ title: 'Unisciti alla mia lega!', text, url, dialogTitle: 'Condividi la lega' });
    } catch {
      // Su web puro, fallback navigator.share
      if (navigator.share) {
        navigator.share({ title: 'Unisciti alla mia lega!', text, url }).catch(() => {});
      }
    }
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

  openGestisciViteDialog(giocatore: Giocatore): void {
    if (!this.lega?.id) return;
    const dialogRef = this.dialog.open(GestisciViteDialogComponent, {
      width: '360px',
      maxWidth: '95vw',
      panelClass: 'gv-dialog-panel',
      data: {
        idLega: this.lega.id,
        idGiocatore: giocatore.id,
        nicknameGiocatore: giocatore.nickname,
        viteAttuali: giocatore.vitePerLega?.[this.lega.id] ?? this.lega.viteIniziali ?? 1,
      },
    });
    dialogRef.afterClosed().subscribe((legaAggiornata: Lega | undefined) => {
      if (legaAggiornata) {
        this.lega = legaAggiornata;
        this.caricaTabella();
      }
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
          maxWidth: '95vw',
          maxHeight: '90vh',
          data: data
          // CENTRATO
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
        // Reset del countdown dopo il calcolo della giornata: la giornata successiva
        // potrebbe avere ancora tempo disponibile per votare.
        this.countdownExpired = false;
        this.startCountdown();
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

  eliminaGiocata(giocatore: Giocatore, giornata: number): void {
    if (!this.lega) return;
    this.giocataService.eliminaGiocata(giornata, giocatore.id, this.lega.id)
      .subscribe({
        next: (res: Giocatore) => {
          if (res && Array.isArray(res.giocate)) {
            giocatore.giocate = res.giocate;
          }
          this.loadLegaDetails();
        },
        error: (err: any) => {
          console.error('Errore nell\'eliminazione della giocata', err);
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

    // Leader/Admin possono SEMPRE giocare/modificare per qualsiasi giocatore
    if (this.isLeaderLega() || this.isAdmin()) {
      return true;
    }

    // Gli utenti normali possono giocare SOLO per se stessi
    const currentUserId = this.authService.getCurrentUser()?.id;
    if (giocatore.user?.id !== currentUserId) {
      return false;
    }

    // Se la giornata è DA_GIOCARE (timeout attivo), l'utente può giocare/modificare la propria giocata
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

    // Ordine: utente corrente in cima, poi alfabetico per nickname
    const currentUser = this.authService.getCurrentUser();
    filtered.sort((a, b) => {
      const aIsMe = !!currentUser && a.user?.id === currentUser.id;
      const bIsMe = !!currentUser && b.user?.id === currentUser.id;
      if (aIsMe && !bIsMe) return -1;
      if (!aIsMe && bIsMe) return 1;
      return a.nickname.localeCompare(b.nickname);
    });

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

  // ══════════════════════════════════════════
  // 💀 EASTER EGG — Grim Reaper
  // ══════════════════════════════════════════
  grimReaperVisible = false;
  grimReaperVittimeGiornata: string[] = [];
  grimReaperMsg = '';
  grimReaperObsessed = false;
  private _tapTimestamps: number[] = [];
  private _grimReaperDismissTimer: any = null;
  private _grimReaperActivations = 0;

  onEliminatiTripleTap(): void {
    const now = Date.now();
    this._tapTimestamps.push(now);
    this._tapTimestamps = this._tapTimestamps.filter(t => now - t < 900);
    if (this._tapTimestamps.length >= 3) {
      this._tapTimestamps = [];
      this.attivaGrimReaper();
    }
  }

  private attivaGrimReaper(): void {
    if (!this.lega?.giocatori) return;
    this._grimReaperActivations++;

    if (this._grimReaperActivations > 3) {
      const msgs: string[] = this.translate.instant('EASTER_EGG.REAPER_OBSESSED');
      this.grimReaperMsg = Array.isArray(msgs)
        ? msgs[Math.floor(Math.random() * msgs.length)]
        : '🙄';
      this.grimReaperObsessed = true;
      this.grimReaperVittimeGiornata = [];
      this.grimReaperVisible = true;
      if (this._grimReaperDismissTimer) clearTimeout(this._grimReaperDismissTimer);
      this._grimReaperDismissTimer = setTimeout(() => {
        this.grimReaperVisible = false;
        this.grimReaperObsessed = false;
      }, 4500);
      return;
    }

    this.grimReaperObsessed = false;
    const giornataRelativa = (this.lega.giornataCorrente ?? this.lega.giornataIniziale) - this.lega.giornataIniziale + 1;
    this.grimReaperVittimeGiornata = this.lega.giocatori
      .filter(g => {
        const giocata = g.giocate?.find(gi => gi.giornata === giornataRelativa);
        return giocata?.esito === 'KO';
      })
      .map(g => g.nickname);
    if (this.grimReaperVittimeGiornata.length === 0) {
      this.grimReaperVittimeGiornata = this.lega.giocatori
        .filter(g => g.statiPerLega?.[this.lega!.id]?.value === StatoGiocatore.ELIMINATO.value)
        .map(g => g.nickname);
    }
    const msgs: string[] = this.translate.instant('EASTER_EGG.REAPER_MSGS');
    this.grimReaperMsg = Array.isArray(msgs)
      ? msgs[Math.floor(Math.random() * msgs.length)]
      : '💀';
    this.grimReaperVisible = true;
    if (this._grimReaperDismissTimer) clearTimeout(this._grimReaperDismissTimer);
    this._grimReaperDismissTimer = setTimeout(() => { this.grimReaperVisible = false; }, 4500);
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
  shouldHideGiocata(giocata: any, giornata: number, giocatore?: any): boolean {
    if (!giocata) return false;

    // Se la giocata è esplicitamente pubblica, mostrala sempre (ha priorità su tutto)
    if (giocata.pubblica === true) return false;

    // Se siamo nella giornata corrente e il countdown non è ancora scaduto,
    // le scelte private sono visibili solo al giocatore stesso e al leader/admin
    if (giornata === (this.lega?.giornataCorrente || 0) && !this.countdownExpired) {
      if (!this.isLeaderLega() && !this.isAdmin()) {
        const currentUserId = this.authService.getCurrentUser()?.id;
        if (!giocatore || giocatore.user?.id !== currentUserId) {
          return true;
        }
      }
    }

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

    // Caso 2: Voto privato (pubblica = false e giornata non iniziata, oppure countdown ancora attivo)
    if (this.shouldHideGiocata(giocata, giornata, giocatore)) {
      return '🔒 Privato';
    }

    // Caso 3: Voto pubblico (mostra squadra)
    return this.getSquadraNome(giocata.squadraSigla) || giocata.squadraSigla;
  }

  getGiocaIcon(): string {
    return this.utilService.getGiocaIcon(this.lega!.campionato!.sport!.id);
  }

  getGiocaEmoji(): string {
    const sport = this.lega?.campionato?.sport?.id;
    if (sport === 'CALCIO') return '⚽';
    if (sport === 'BASKET') return '🏀';
    if (sport === 'TENNIS') return '🎾';
    if (sport === 'FOOTBALL') return '🏈';
    if (sport === 'BASEBALL') return '⚾';
    if (sport === 'HOCKEY') return '🏒';
    if (sport === 'RUGBY') return '🏉';
    if (sport === 'VOLLEYBALL') return '🏐';
    return '🏆';
  }

  getCountdownTargetDate(): any {
    if (!this.lega || !this.lega.campionato || !this.lega.campionato.iniziGiornate) {
      return null;
    }
    const index = this.lega.giornataDaGiocare;
    return this.lega.campionato.iniziGiornate[index] || null;
  }

  isPartitaForzata(giocata: Giocata | null, giornata: number): boolean {
    if (!giocata?.squadraSigla) return false;

    const key = `${giornata}_${giocata.squadraSigla}`;
    return this.partiteForzate.get(key) === true;
  }

  /**
   * Restituisce i nickname degli ALTRI giocatori che hanno scelto la stessa squadra
   * nella giornata indicata. Mostra solo pick visibili (non nascosti).
   */
  getSamePickNicknames(giocatore: Giocatore, giornataAssoluta: number): string[] {
    const myGiocata = this.getGiocataByGiornataAssoluta(giocatore, giornataAssoluta);
    if (!myGiocata?.squadraSigla) return [];
    if (this.shouldHideGiocata(myGiocata, giornataAssoluta)) return [];

    const result: string[] = [];
    for (const other of (this.lega?.giocatori ?? [])) {
      if (other.id === giocatore.id) continue;
      const otherGiocata = this.getGiocataByGiornataAssoluta(other, giornataAssoluta);
      if (!otherGiocata?.squadraSigla) continue;
      if (this.shouldHideGiocata(otherGiocata, giornataAssoluta)) continue;
      if (otherGiocata.squadraSigla === myGiocata.squadraSigla) {
        result.push(other.nickname);
      }
    }
    return result;
  }

  /**
   * Per la card dedicata: restituisce squadra + nickname degli altri
   * per il giocatore dell'utente loggato nella giornata corrente.
   * Restituisce null se non si vede nulla (voto nascosto, nessun compagno, non in lega).
   */
  getSamePickForCurrentUser(): { squadraNome: string; nicknames: string[] } | null {
    const me = this.getCurrentGiocatore();
    if (!me || !this.lega?.giornataCorrente) return null;

    const giornataCorrente = this.lega.giornataCorrente;
    const myGiocata = this.getGiocataByGiornataAssoluta(me, giornataCorrente);
    if (!myGiocata?.squadraSigla) return null;
    if (this.shouldHideGiocata(myGiocata, giornataCorrente)) return null;

    const nicknames: string[] = [];
    for (const other of (this.lega.giocatori ?? [])) {
      if (other.id === me.id) continue;
      const otherGiocata = this.getGiocataByGiornataAssoluta(other, giornataCorrente);
      if (!otherGiocata?.squadraSigla) continue;
      if (this.shouldHideGiocata(otherGiocata, giornataCorrente)) continue;
      if (otherGiocata.squadraSigla === myGiocata.squadraSigla) {
        nicknames.push(other.nickname);
      }
    }

    return {
      squadraNome: this.getSquadraNome(myGiocata.squadraSigla) || myGiocata.squadraSigla,
      nicknames
    };
  }

  /**
   * Raggruppa i voti visibili della giornata corrente per squadra.
   * Usato dalle chips mobili. Restituisce array ordinato per count desc.
   */
  getVotiPerSquadra(): { nome: string; sigla: string; count: number; nicknames: string[] }[] {
    if (!this.lega?.giornataCorrente || !this.lega?.giocatori) return [];
    const giornataCorrente = this.lega.giornataCorrente;
    const map = new Map<string, { nome: string; sigla: string; count: number; nicknames: string[] }>();

    const roundInCorso = this.lega.statoGiornataCorrente?.value === StatoPartita.IN_CORSO.value;

    for (const giocatore of this.lega.giocatori) {
      const giocata = this.getGiocataByGiornataAssoluta(giocatore, giornataCorrente);
      if (!giocata?.squadraSigla) continue;
      if (this.shouldHideGiocata(giocata, giornataCorrente)) continue;
      // I voti privati (pubblica !== true) si svelano solo quando la giornata è IN_CORSO
      if (!roundInCorso && giocata.pubblica !== true) continue;
      const sigla: string = giocata.squadraSigla;
      const nome = this.getSquadraNome(sigla) || sigla;
      if (!map.has(sigla)) {
        map.set(sigla, { nome, sigla, count: 0, nicknames: [] });
      }
      const entry = map.get(sigla)!;
      entry.count++;
      entry.nicknames.push(giocatore.nickname);
    }

    return Array.from(map.values()).sort((a, b) => b.count - a.count);
  }

  /**
   * Restituisce la classe da applicare alla voti-chip per una squadra
   * - voti-chip--ok: se esiste almeno una giocata con esito 'OK'
   * - voti-chip--ko: se esiste almeno una giocata con esito 'KO'
   * - voti-chip--current: se ci sono voti ma ancora nessun esito
   */
  getVotiChipClass(sigla: string): string | null {
    if (!this.lega || !this.lega.giornataCorrente) return null;
    const giornata = this.lega.giornataCorrente;
    let foundAny = false;
    let hasOk = false;
    let hasKo = false;

    for (const giocatore of this.lega.giocatori ?? []) {
      const giocata = this.getGiocataByGiornataAssoluta(giocatore, giornata);
      if (!giocata || giocata.squadraSigla !== sigla) continue;
      if (this.shouldHideGiocata(giocata, giornata)) continue;
      foundAny = true;
      if (giocata.esito === 'OK') hasOk = true;
      if (giocata.esito === 'KO') hasKo = true;
      // se troviamo sia OK che KO possiamo fermarci
      if (hasOk && hasKo) break;
    }

    if (hasOk) return 'voti-chip--ok';
    if (hasKo) return 'voti-chip--ko';
    if (foundAny) return 'voti-chip--current';
    return null;
  }

  openVotiSheet(entry: { nome: string; sigla: string; count: number; nicknames: string[] }): void {
    this.votiSheet = { nome: entry.nome, sigla: entry.sigla, nicknames: entry.nicknames };
  }

  closeVotiSheet(): void {
    this.votiSheet = null;
  }

  openSamePickDialog(): void {    const data = this.getSamePickForCurrentUser();
    if (!data || data.nicknames.length === 0) return;
    const isMobile = window.innerWidth < 600;
    this.dialog.open(SamePickDialogComponent, {
      data,
      width: isMobile ? '92vw' : '380px',
      maxWidth: '92vw',
      panelClass: 'same-pick-dialog-panel',
      autoFocus: false
    });
  }

  apriRisultatiGiornata(): void {
    if (!this.lega) return;
    const isDesktop = window.innerWidth >= 768;
    const giornataCorrente = this.lega.giornataCorrente;
    // SEMPRE da 1: l'admin può vedere e forzare QUALSIASI giornata passata del campionato
    const giornataIniziale = 1;
    console.log('[LegaDettaglio v3] apriRisultatiGiornata → range:', giornataIniziale, '-', giornataCorrente);
    const dialogRef = this.dialog.open(RoundResultsDialogComponent, {
      data: {
        lega: this.lega,
        giornata: giornataCorrente,
        giornataIniziale: giornataIniziale,
        isLeader: this.isLeaderLega() || this.isAdmin()
      },
      width: isDesktop ? '520px' : '95vw',
      maxWidth: isDesktop ? '520px' : '95vw',
      maxHeight: '90vh',
      panelClass: ['round-results-dialog-container'],
      hasBackdrop: true,
      disableClose: false,
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(() => {
      this.loadLegaDetails();
    });
  }
}
