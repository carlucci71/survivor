import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ConfermaAssegnazioneDialogComponent } from '../../shared/components/conferma-assegnazione-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Giocatore,
  Lega,
  Partita,
  Squadra,
  StatoPartita,
} from '../../core/models/interfaces.model';
import { LegaService } from '../../core/services/lega.service';
import { CampionatoService } from '../../core/services/campionato.service';
import { SquadraService } from '../../core/services/squadra.service';

@Component({
  selector: 'app-seleziona-giocata',
  templateUrl: './seleziona-giocata.component.html',
  styleUrls: ['./seleziona-giocata.component.scss'],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
  ],
})
export class SelezionaGiocataComponent implements OnInit {
  isMobile = false;
  private resizeHandler: any;
  private tabsReservedHeight = 0;
  public StatoPartita = StatoPartita;
  ultimiRisultati: Partita[] = [];
  ultimiRisultatiOpponent: Partita[] = [];
  prossimePartite: Partita[] = [];
  loadingUltimi = false;
  loadingProssime = false;
  squadreDisponibili: Squadra[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  lega!: Lega;
  giocatore: Giocatore;
  showDettagli = false;
  squadreConPartite: any[] = [];
  @ViewChild('risultatiRow') risultatiRow?: ElementRef<HTMLDivElement>;
  @ViewChild('teamSelect') teamSelect?: MatSelect;
  @ViewChild('selectField') selectField?: ElementRef<HTMLElement>;
  activeTab: 'ultimi' | 'prossime' | 'opponent' = 'ultimi';

  // Messaggi simpatici di incoraggiamento dopo la selezione
  private encouragementMessages = [
    { emoji: '🔥', message: 'Grande scelta! Questa squadra è on fire!' },
    { emoji: '💪', message: 'Ottima decisione! Hai le idee chiare!' },
    { emoji: '🎯', message: 'Centro! Hai puntato sulla squadra giusta!' },
    { emoji: '🏆', message: 'Scelta da campione! La vittoria ti aspetta!' },
    { emoji: '⚡', message: 'Che grinta! Questa selezione è elettrizzante!' },
    { emoji: '🚀', message: 'Stai volando alto! Selezione spaziale!' },
    { emoji: '👏', message: 'Applausi! Una scelta davvero intelligente!' },
    { emoji: '🎲', message: 'I dadi sono lanciati! Che vinca il migliore!' },
    { emoji: '🦁', message: 'Ruggisci come un leone! Scelta coraggiosa!' },
    { emoji: '⭐', message: 'Sei una stella! Selezione da 10 e lode!' },
    { emoji: '🧠', message: 'Cervello in azione! Mossa strategica!' },
    { emoji: '🎪', message: 'Benvenuto allo show! Hai scelto i protagonisti!' },
    { emoji: '🍀', message: 'In bocca al lupo! Che la fortuna sia con te!' },
    { emoji: '🌟', message: 'Brillante! Questa scelta ti porterà lontano!' },
    { emoji: '🏅', message: 'Medaglia d\'oro per questa selezione!' },
    { emoji: '🎸', message: 'Rock\'n\'roll! Scelta che spacca!' },
    { emoji: '🦅', message: 'Occhio d\'aquila! Hai visto giusto!' },
    { emoji: '💎', message: 'Hai trovato la gemma! Selezione preziosa!' },
    { emoji: '🌈', message: 'Dopo la pioggia esce l\'arcobaleno! Vai così!' },
    { emoji: '🎬', message: 'Ciak, si gira! Sei il regista della vittoria!' }
  ];

  // Mappa colori sociali delle squadre
  private readonly teamColors: { [key: string]: { primary: string; secondary: string } } = {
    // Serie A
    'JUV': { primary: '#000000', secondary: '#FFFFFF' },
    'INT': { primary: '#0068A8', secondary: '#000000' },
    'MIL': { primary: '#AC1F2D', secondary: '#000000' },
    'NAP': { primary: '#12A0D7', secondary: '#FFFFFF' },
    'ROM': { primary: '#8E1F2F', secondary: '#F0BC42' },
    'LAZ': { primary: '#87D8F7', secondary: '#FFFFFF' },
    'ATA': { primary: '#1E71B8', secondary: '#000000' },
    'FIO': { primary: '#482E92', secondary: '#FFFFFF' },
    'TOR': { primary: '#8B0000', secondary: '#FFFFFF' },
    'BOL': { primary: '#1A2F48', secondary: '#A41E22' },
    'UDI': { primary: '#000000', secondary: '#FFFFFF' },
    'EMP': { primary: '#005BA9', secondary: '#FFFFFF' },
    'SAS': { primary: '#00A850', secondary: '#000000' },
    'SAL': { primary: '#8B0000', secondary: '#FFFFFF' },
    'LEC': { primary: '#FFCC00', secondary: '#E3242B' },
    'VER': { primary: '#FFCC00', secondary: '#003DA5' },
    'MON': { primary: '#ED1C24', secondary: '#FFFFFF' },
    'SPE': { primary: '#FFFFFF', secondary: '#000000' },
    'CRE': { primary: '#D71920', secondary: '#808080' },
    'FRO': { primary: '#FFCC00', secondary: '#003DA5' },
    'GEN': { primary: '#A41E22', secondary: '#003DA5' },
    'CAG': { primary: '#A41E22', secondary: '#003DA5' },
    'PAR': { primary: '#FFCC00', secondary: '#003DA5' },
    'VEN': { primary: '#FF6600', secondary: '#007A33' },
    'COM': { primary: '#003DA5', secondary: '#FFFFFF' },
    'SAM': { primary: '#003DA5', secondary: '#FFFFFF' },
    'BRE': { primary: '#003DA5', secondary: '#FFFFFF' },
    'PIS': { primary: '#003DA5', secondary: '#000000' },
    // Tennis - colori generici per nazione
    'ITA': { primary: '#009246', secondary: '#CE2B37' },
    'ESP': { primary: '#AA151B', secondary: '#F1BF00' },
    'SRB': { primary: '#C6363C', secondary: '#0C4076' },
    'USA': { primary: '#3C3B6E', secondary: '#B22234' },
    'GER': { primary: '#000000', secondary: '#DD0000' },
    'FRA': { primary: '#002395', secondary: '#ED2939' },
    'GBR': { primary: '#012169', secondary: '#C8102E' },
    'AUS': { primary: '#00008B', secondary: '#FFCD00' },
    'RUS': { primary: '#FFFFFF', secondary: '#0039A6' },
    'SUI': { primary: '#FF0000', secondary: '#FFFFFF' },
    // Default
    'DEFAULT': { primary: '#0A3D91', secondary: '#4FC3F7' }
  };

  // Metodo per ottenere i colori sociali di una squadra
  getTeamColors(sigla: string): { primary: string; secondary: string } {
    return this.teamColors[sigla] || this.teamColors['DEFAULT'];
  }

  constructor(
    private squadraService: SquadraService,
    private campionatoService: CampionatoService,
    public dialogRef: MatDialogRef<SelezionaGiocataComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      giocatore: any;
      giornata: number;
      statoGiornataCorrente: StatoPartita;
      squadreDisponibili: any[];
      squadraCorrenteId?: string;
      lega: Lega;
    },
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.giocatore = data.giocatore;
    this.squadreDisponibili = data.squadreDisponibili || [];
    // Se c'è una squadra già selezionata per questa giornata, selezionala
    this.squadraSelezionata = data.squadraCorrenteId || null;
    this.statoGiornataCorrente = data.statoGiornataCorrente;
    this.lega = data.lega;
  }

  ngOnInit(): void {
    this.isMobile = window.matchMedia('(max-width: 700px)').matches;
    this.getSquadreByCampionatoAndGiornata(
      this.lega.campionato!.id,
      this.data.giornata + this.lega.giornataIniziale - 1
    );
    if (this.squadraSelezionata) {
      this.mostraUltimiRisultati();
      this.mostraProssimePartite();
    }
    // Carica le partite per tutte le squadre disponibili
    this.caricaPartitePerTutteSquadre();
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  setActiveTab(tab: 'ultimi' | 'prossime' | 'opponent') {
    // If the tab is already active, do nothing to avoid repeated tiny scrolls
    if (this.activeTab === tab) return;
    this.activeTab = tab;
  }

  trackByGiornata(index: number, item: any) {
    return item && item.giornata ? item.giornata : index;
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

  getSquadreByCampionatoAndGiornata(
    idCampionato: string,
    giornata: number
  ): void {
    this.squadraService
      .getSquadreByCampionatoAndGiornata(idCampionato, giornata)
      .subscribe({
        next: (squadre) => {
          const returnedSigle = new Set<string>();
          squadre.forEach((squadra: string) => {
            if (!squadra) return;
            const v = squadra.trim();
            if (v) returnedSigle.add(v);
            return;
          });
          this.squadreDisponibili = this.squadreDisponibili.filter((sd) => {
            const sdSigla = sd.sigla;
            return sdSigla ? returnedSigle.has(sdSigla) : false;
          });
        },
        error: (error) => {
          console.error(
            'Errore nel caricamento delle squadre del campionato:',
            error
          );
        },
      });
  }

  getDesGiornata(partita: Partita, casa: boolean): string {
    const index = partita.giornata;
    const alias = casa ? partita.aliasGiornataCasa : partita.aliasGiornataFuori;
    if (
      !this.lega ||
      !this.lega?.campionato ||
      !this.lega?.campionato.sport ||
      !this.lega?.campionato.sport.id
    ) {
      return '';
    }
    return this.campionatoService.getDesGiornata(
      this.lega?.campionato.id,
      index,
      alias
    );
  }

  mostraUltimiRisultati(sigla?: string) {
    const squadra = sigla || this.squadraSelezionata;
    if (
      squadra &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.loadingUltimi = true;
      this.campionatoService
        .calendario(
          this.lega.campionato?.id,
          squadra,
          this.lega.giornataCorrente - 1,
          false
        )
        .subscribe({
          next: (ultimiRisultati) => {
            // Se è stata passata una sigla diversa dalla squadra selezionata,
            // considerala come risultati dell'avversario, altrimenti popola i risultati della squadra.
            if (sigla && sigla !== this.squadraSelezionata) {
              this.ultimiRisultatiOpponent = ultimiRisultati;
              this.loadingUltimi = false;
            } else {
              this.ultimiRisultati = ultimiRisultati;
              this.loadingUltimi = false;
            }
          },
          error: (error) => {
            console.error('mostraUltimiRisultati: errore', error);
            this.loadingUltimi = false;
          },
        });
    }
  }

  mostraUltimiRisultatiOpponent() {
    const opp = this.getNextOpponentSigla(true);
    if (opp) {
      this.mostraUltimiRisultati(opp);
    }
  }

  mostraProssimePartite() {
    if (
      this.squadraSelezionata &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.loadingProssime = true;
      this.campionatoService
        .calendario(
          this.lega.campionato?.id,
          this.squadraSelezionata,
          this.lega.giornataCorrente,
          true
        )
        .subscribe({
          next: (prossimePartite) => {
            this.prossimePartite = prossimePartite;
            this.mostraUltimiRisultatiOpponent();
            this.loadingProssime = false;
          },
          error: (error) => {
            console.error('mostraProssimePartite: errore', error);
            this.loadingProssime = false;
          },
        });
    }
  }

  salvaSquadra() {
    if (this.statoGiornataCorrente.value !== StatoPartita.DA_GIOCARE.value) {
      this.dialog
        .open(ConfermaAssegnazioneDialogComponent, {
          width: '400px',
          disableClose: true,
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.showEncouragementMessage();
            this.dialogRef.close({
              squadraSelezionata: this.squadraSelezionata,
            });
          }
          // Se annulla, non fa nulla e la modale rimane aperta
        });
    } else {
      this.showEncouragementMessage();
      this.dialogRef.close({ squadraSelezionata: this.squadraSelezionata });
    }
  }

  private showEncouragementMessage(): void {
    const randomIndex = Math.floor(Math.random() * this.encouragementMessages.length);
    const selected = this.encouragementMessages[randomIndex];
    this.snackBar.open(`${selected.emoji} ${selected.message}`, '✕', {
      duration: 4000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: ['encouragement-snackbar']
    });
  }

  getNextOpponentSigla(sigla: boolean): string | null {
    if (
      !this.squadraSelezionata ||
      !this.prossimePartite ||
      this.prossimePartite.length === 0
    ) {
      return null;
    }
    const next = this.prossimePartite[0];
    if (!next) return null;
    if (next.casaSigla === this.squadraSelezionata) {
      if (sigla) {
        return next.fuoriSigla || null;
      } else {
        return next.fuoriNome || null;
      }
    }
    if (next.fuoriSigla === this.squadraSelezionata) {
      if (sigla) {
        return next.casaSigla || null;
      } else {
        return next.casaNome || null;
      }
    }
    return null;
  }

  getGiocaIcon(): string {
    // Restituisce l'icona appropriata in base allo sport
    const sportId = this.lega?.campionato?.sport?.id;
    if (sportId === 'BASKET') return 'sports_basketball';
    if (sportId === 'CALCIO') return 'sports_soccer';
    if (sportId === 'TENNIS') return 'sports_tennis';
    return 'sports_esports';
  }

  getSquadraInitials(nomeSquadra: string): string {
    if (!nomeSquadra) return '?';

    // Rimuovi parole comuni
    const parole = nomeSquadra
      .replace(/^(FC|AC|US|AS|SS|UC)\s+/i, '')
      .trim()
      .split(' ');

    if (parole.length === 1) {
      // Se è una parola sola, prendi le prime 2 lettere
      return parole[0].substring(0, 2).toUpperCase();
    }

    // Altrimenti prendi la prima lettera di ogni parola (max 2)
    return parole
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }

  getAvversarioNome(partita: Partita, siglaMiaSquadra: string): string {
    if (!partita) return '-';

    if (partita.casaSigla === siglaMiaSquadra) {
      return partita.fuoriNome || '-';
    } else {
      return partita.casaNome || '-';
    }
  }

  toggleDettagli(): void {
    if (!this.squadraSelezionata) return;

    const squadraSelezionata = this.squadraSelezionata; // Per evitare problemi di null check

    // Apri il dialog dei dettagli
    import('./dettagli-squadra-dialog.component').then(m => {
      const squadra = this.squadreConPartite.find(s => s.sigla === squadraSelezionata);
      this.dialog.open(m.DettagliSquadraDialogComponent, {
        data: {
          squadraSelezionata: squadraSelezionata,
          squadraNome: squadra?.nome || squadraSelezionata,
          ultimiRisultati: this.ultimiRisultati,
          prossimePartite: this.prossimePartite,
          ultimiRisultatiOpponent: this.ultimiRisultatiOpponent,
          opponentSigla: this.getNextOpponentSigla(true),
          teamColors: this.getTeamColors(squadraSelezionata),
          getDesGiornata: this.getDesGiornata.bind(this)
        },
        panelClass: 'dettagli-squadra-dialog-panel',
        backdropClass: 'dettagli-dialog-backdrop'
      });
    });
  }

  selezionaSquadra(sigla: string): void {
    this.squadraSelezionata = sigla;
    this.mostraUltimiRisultati();
    this.mostraProssimePartite();
  }

  caricaPartitePerTutteSquadre(): void {
    if (!this.lega.campionato?.id) return;

    // Inizializza subito le squadre con i dati base
    this.squadreConPartite = this.squadreDisponibili.map(squadra => {
      const squadraConPartite = {
        ...squadra,
        prossimaPartita: null as Partita | null,
        ultimiRisultati: [] as any[]
      };

      // Carica prossima partita
      this.campionatoService
        .calendario(
          this.lega.campionato!.id,
          squadra.sigla!,
          this.lega.giornataCorrente,
          true
        )
        .subscribe({
          next: (partite) => {
            if (partite && partite.length > 0) {
              squadraConPartite.prossimaPartita = partite[0];
            }
          },
          error: (error) => console.error('Errore caricamento prossima partita:', error)
        });

      // Carica ultimi risultati
      this.campionatoService
        .calendario(
          this.lega.campionato!.id,
          squadra.sigla!,
          this.lega.giornataCorrente - 1,
          false
        )
        .subscribe({
          next: (risultati) => {
            squadraConPartite.ultimiRisultati = risultati.slice(0, 3).map(r => {
              let esito = 'N';
              if (r.casaSigla === squadra.sigla) {
                if (r.scoreCasa! > r.scoreFuori!) esito = 'V';
                else if (r.scoreCasa! < r.scoreFuori!) esito = 'P';
              } else if (r.fuoriSigla === squadra.sigla) {
                if (r.scoreFuori! > r.scoreCasa!) esito = 'V';
                else if (r.scoreFuori! < r.scoreCasa!) esito = 'P';
              }
              return { ...r, esito };
            });
          },
          error: (error) => console.error('Errore caricamento ultimi risultati:', error)
        });

      return squadraConPartite;
    });
  }
}
