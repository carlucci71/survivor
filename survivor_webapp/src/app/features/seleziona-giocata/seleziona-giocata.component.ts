import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy, ViewEncapsulation, AfterViewInit } from '@angular/core';
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
import { TranslateModule, TranslateService } from '@ngx-translate/core';
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
  standalone: true,
  templateUrl: './seleziona-giocata.component.html',
  styleUrls: ['./seleziona-giocata.component.scss'],
  encapsulation: ViewEncapsulation.None,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    MatSnackBarModule,
    TranslateModule,
  ],
})
export class SelezionaGiocataComponent implements OnInit, AfterViewInit {
  @ViewChild('scrollWrapper') scrollWrapper!: ElementRef<HTMLDivElement>;

  isMobile = false;
  private resizeHandler: any;
  private tabsReservedHeight = 0;
  public StatoPartita = StatoPartita;
  ultimiRisultati: Partita[] = [];
  ultimiRisultatiOpponent: Partita[] = [];
  prossimaGiornata: Partita[] = [];
  prossimePartite: Partita[] = [];
  loadingUltimi = false;
  loadingProssime = false;
  squadreDisponibili: Squadra[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  lega!: Lega;
  giocatore: Giocatore;
  showDettagli = false;

  // Controllo scroll frecce
  canScrollLeft = false;
  canScrollRight = false;
  squadreConPartite: any[] = [];
  squadreFiltrate: any[] = [];
  searchQuery: string = '';
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

  // Mappa colori sociali delle squadre per sport
  private readonly teamColors: { [key: string]: { primary: string; secondary: string } } = {
    // CALCIO - Serie A
    'CALCIO_JUV': { primary: '#000000', secondary: '#FFFFFF' },
    'CALCIO_INT': { primary: '#0068A8', secondary: '#000000' },
    'CALCIO_MIL': { primary: '#AC1F2D', secondary: '#000000' },
    'CALCIO_NAP': { primary: '#12A0D7', secondary: '#FFFFFF' },
    'CALCIO_ROM': { primary: '#8E1F2F', secondary: '#F0BC42' },
    'CALCIO_LAZ': { primary: '#87D8F7', secondary: '#FFFFFF' },
    'CALCIO_ATA': { primary: '#1E71B8', secondary: '#000000' },
    'CALCIO_FIO': { primary: '#482E92', secondary: '#FFFFFF' },
    'CALCIO_TOR': { primary: '#8B0000', secondary: '#FFFFFF' },
    'CALCIO_BOL': { primary: '#1A2F48', secondary: '#A41E22' },
    'CALCIO_UDI': { primary: '#000000', secondary: '#FFFFFF' },
    'CALCIO_EMP': { primary: '#005BA9', secondary: '#FFFFFF' },
    'CALCIO_SAS': { primary: '#00A850', secondary: '#000000' },
    'CALCIO_SAL': { primary: '#8B0000', secondary: '#FFFFFF' },
    'CALCIO_LEC': { primary: '#FFCC00', secondary: '#E3242B' },
    'CALCIO_VER': { primary: '#FFCC00', secondary: '#003DA5' },
    'CALCIO_MON': { primary: '#ED1C24', secondary: '#FFFFFF' },
    'CALCIO_SPE': { primary: '#FFFFFF', secondary: '#000000' },
    'CALCIO_CRE': { primary: '#D71920', secondary: '#808080' },
    'CALCIO_FRO': { primary: '#FFCC00', secondary: '#003DA5' },
    'CALCIO_GEN': { primary: '#A41E22', secondary: '#003DA5' },
    'CALCIO_CAG': { primary: '#A41E22', secondary: '#003DA5' },
    'CALCIO_PAR': { primary: '#FFCC00', secondary: '#003DA5' },
    'CALCIO_VEN': { primary: '#FF6600', secondary: '#007A33' },
    'CALCIO_COM': { primary: '#003DA5', secondary: '#FFFFFF' },
    'CALCIO_SAM': { primary: '#003DA5', secondary: '#FFFFFF' },
    'CALCIO_BRE': { primary: '#003DA5', secondary: '#FFFFFF' },
    'CALCIO_PIS': { primary: '#003DA5', secondary: '#000000' },

    // BASKET - NBA
    'BASKET_ATL': { primary: '#E03A3E', secondary: '#C1D32F' },
    'BASKET_BOS': { primary: '#007A33', secondary: '#FFFFFF' },
    'BASKET_BKN': { primary: '#000000', secondary: '#FFFFFF' },
    'BASKET_CHA': { primary: '#1D1160', secondary: '#00788C' },
    'BASKET_CHI': { primary: '#CE1141', secondary: '#000000' },
    'BASKET_CLE': { primary: '#860038', secondary: '#FDBB30' },
    'BASKET_DAL': { primary: '#00538C', secondary: '#B8C4CA' },
    'BASKET_DEN': { primary: '#0E2240', secondary: '#FEC524' },
    'BASKET_DET': { primary: '#C8102E', secondary: '#1D428A' },
    'BASKET_GSW': { primary: '#1D428A', secondary: '#FFC72C' },
    'BASKET_HOU': { primary: '#CE1141', secondary: '#000000' },
    'BASKET_IND': { primary: '#002D62', secondary: '#FDBB30' },
    'BASKET_LAC': { primary: '#C8102E', secondary: '#1D428A' },
    'BASKET_LAL': { primary: '#552583', secondary: '#FDB927' },
    'BASKET_MEM': { primary: '#5D76A9', secondary: '#12173F' },
    'BASKET_MIA': { primary: '#98002E', secondary: '#000000' },
    'BASKET_MIL': { primary: '#00471B', secondary: '#EEE1C6' },
    'BASKET_MIN': { primary: '#0C2340', secondary: '#236192' },
    'BASKET_NOP': { primary: '#0C2340', secondary: '#C8102E' },
    'BASKET_NYK': { primary: '#006BB6', secondary: '#F58426' },
    'BASKET_OKC': { primary: '#007AC1', secondary: '#EF3B24' },
    'BASKET_ORL': { primary: '#0077C0', secondary: '#C4CED4' },
    'BASKET_PHI': { primary: '#006BB6', secondary: '#ED174C' },
    'BASKET_PHX': { primary: '#1D1160', secondary: '#E56020' },
    'BASKET_POR': { primary: '#E03A3E', secondary: '#000000' },
    'BASKET_SAC': { primary: '#5A2D81', secondary: '#63727A' },
    'BASKET_SAS': { primary: '#C4CED4', secondary: '#000000' },
    'BASKET_TOR': { primary: '#CE1141', secondary: '#000000' },
    'BASKET_UTA': { primary: '#002B5C', secondary: '#00471B' },
    'BASKET_WAS': { primary: '#002B5C', secondary: '#E31837' },

    // TENNIS - colori generici per nazione
    'TENNIS_ITA': { primary: '#009246', secondary: '#CE2B37' },
    'TENNIS_ESP': { primary: '#AA151B', secondary: '#F1BF00' },
    'TENNIS_SRB': { primary: '#C6363C', secondary: '#0C4076' },
    'TENNIS_USA': { primary: '#3C3B6E', secondary: '#B22234' },
    'TENNIS_GER': { primary: '#000000', secondary: '#DD0000' },
    'TENNIS_FRA': { primary: '#002395', secondary: '#ED2939' },
    'TENNIS_GBR': { primary: '#012169', secondary: '#C8102E' },
    'TENNIS_AUS': { primary: '#00008B', secondary: '#FFCD00' },
    'TENNIS_RUS': { primary: '#FFFFFF', secondary: '#0039A6' },
    'TENNIS_SUI': { primary: '#FF0000', secondary: '#FFFFFF' },

    // Default
    'DEFAULT': { primary: '#0A3D91', secondary: '#4FC3F7' }
  };

  // Metodo per ottenere i colori sociali di una squadra
  getTeamColors(sigla: string): { primary: string; secondary: string } {
    const sportId = this.lega?.campionato?.sport?.id || 'DEFAULT';
    const key = `${sportId}_${sigla}`;
    return this.teamColors[key] || this.teamColors[sigla] || this.teamColors['DEFAULT'];
  }

  // Mapping esplicito sigla → file logo (con estensioni corrette)
  private readonly logoFiles: { [key: string]: string } = {
    // SERIE A (20 squadre)
    'ATA': 'ATA',           // Atalanta (senza estensione)
    'BOL': 'BOLO.png',      // Bologna
    'CAG': 'CAGL.png',      // Cagliari
    'COM': 'COMO.png',      // Como
    'CRE': 'CREMON.png',    // Cremonese
    'EMP': 'EMP.png',       // Empoli ✨ AGGIUNTO
    'FIO': 'FIO.png',       // Fiorentina
    'GEN': 'GENOA.png',     // Genoa
    'INT': 'INT.png',       // Inter
    'JUV': 'JUV.png',       // Juventus
    'LAZ': 'LAZIO.png',     // Lazio
    'LEC': 'LECCE.webp',    // Lecce (webp)
    'MIL': 'MIL.png',       // Milan
    'MON': 'MON.png',       // Monza
    'NAP': 'NAP.png',       // Napoli
    'PAR': 'PARMA.png',     // Parma
    'PIS': 'PISA.png',      // Pisa
    'ROM': 'ROMA.webp',     // Roma (webp)
    'SAS': 'SASS.png',      // Sassuolo
    'TOR': 'TORO.png',      // Torino
    'UDI': 'UDI.png',       // Udinese ✨ AGGIUNTO
    'VEN': 'VEN.png',       // Venezia
    'VER': 'VER.png',       // Verona

    // SERIE B (18 squadre)
    'AVE': 'AVE.png',       // Avellino ✨ AGGIUNTO
    'BAR': 'BARI.png',      // Bari
    'CAR': 'CARRARESE.png', // Carrarese
    'CTZ': 'CATANZARO.png', // Catanzaro
    'CES': 'CES.png',       // Cesena
    'ENT': 'ENT.png',       // Entella
    'JST': 'JUVE_STABIA.png', // Juve Stabia (sigla corretta)
    'MAN': 'MANT.png',      // Mantova
    'MOD': 'MOD.png',       // Modena
    'PAD': 'PADOVA.png',    // Padova
    'PAL': 'PAL.png',       // Palermo
    'PES': 'PESC.png',      // Pescara
    'REG': 'REGGIANA.png',  // Reggiana
    'SAM': 'SAMP.png',      // Sampdoria ✨ AGGIUNTO
    'SPE': 'SPEZIA.webp',   // Spezia
    'STR': 'SUDTIROL.png',  // Sudtirol (sigla corretta) ✨ CORRETTO
  };

  // Mapping foto tennisti (sigla → file)
  private readonly tennisPhotos: { [key: string]: string } = {
    'ALCARAZ': 'ALCARAZ.png',
    'BUBLIK': 'BUBLIK.png',
    'CERUNDOLO': 'CERUNDOLO.png',
    'DARDERI': 'DARDERI.png',
    'DE_MINAUR': 'DE_MIINAUR.png',
    'DE MINAUR': 'DE_MIINAUR.png', // Alias senza underscore
    'DEMINAUR': 'DE_MIINAUR.png',  // Alias senza spazi
    'DJOKOVIC': 'DJOKOVIC.png',
    'FRITZ': 'FRITZ.png',
    'MEDVEDEV': 'MEDVEDEV.png',
    'MENSIK': 'MENSIK.png',
    'MUSETTI': 'MUSETTI.webp',
    'PAUL': 'PAUL.png',
    'RUUD': 'RUUD.png',
    'SHELTON': 'SHELTON.png',
    'SINNER': 'SINNER.png',
    'TIEN': 'TIEN.png',
    'ZVEREV': 'ZVEREV.webp',
  };

  // Mapping loghi NBA basket (sigla → file)
  private readonly basketLogos: { [key: string]: string } = {
    // EASTERN CONFERENCE
    'PHI': '76ERS.png',        // Philadelphia 76ers
    'ATL': 'HAWKS.png',        // Atlanta Hawks
    'BOS': 'CELTICS.png',      // Boston Celtics
    'BKN': 'NETS.png',         // Brooklyn Nets
    'CHA': 'HORNETS.png',      // Charlotte Hornets
    'CHI': 'BULLS.png',        // Chicago Bulls
    'CLE': 'CAVALIERS.png',    // Cleveland Cavaliers
    'IND': 'PACERS.png',       // Indiana Pacers
    'MIA': 'HEAT.png',         // Miami Heat
    'MIL': 'BUCKS.png',        // Milwaukee Bucks
    'NYK': 'KNICKS.png',       // New York Knicks
    'ORL': 'ORLANDO_MAGIC.png', // Orlando Magic
    'TOR': 'RAPTORS.png',      // Toronto Raptors
    'WAS': 'WIZARDS.png',      // Washington Wizards
    'DET': 'PISTONS.png',      // Detroit Pistons

    // WESTERN CONFERENCE
    'DEN': 'NUGGETS.png',      // Denver Nuggets
    'SAS': 'SPURS.png',        // San Antonio Spurs ✨ COMPLETATO
    'LAL': 'LAKERS.png',       // Los Angeles Lakers
    'HOU': 'ROCKETS.png',      // Houston Rockets
    'MIN': 'TIMBERWOLVES.png', // Minnesota Timberwolves
    'PHX': 'SUNS.png',         // Phoenix Suns
    'MEM': 'GRIZZLIES.png',    // Memphis Grizzlies
    'GSW': 'WARRIORS.png',     // Golden State Warriors
    'POR': 'BLAZERS.png',      // Portland Trail Blazers
    'DAL': 'MAVERICKS.png',    // Dallas Mavericks
    'UTA': 'UTAH.webp',        // Utah Jazz
    'LAC': 'CLIPPERS.png',     // LA Clippers
    'SAC': 'SACRAMENTO.png',   // Sacramento Kings
    'NOP': 'PELICANS.png',     // New Orleans Pelicans
    'OKC': 'THUNDER.png',      // Oklahoma City Thunder
  };

  // Metodo per ottenere il logo ufficiale della squadra (assets locali)
  getTeamLogo(sigla: string): string | null {
    const sportId = this.lega?.campionato?.sport?.id;

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


    // Per calcio, usa mapping esplicito
    if (sportId === 'CALCIO' || sportId === 'SERIE_A' || sportId === 'SERIE_B') {
      const fileName = this.logoFiles[sigla];
      if (fileName) {
        return `assets/logos/calcio/${fileName}`;
      }
      return null; // Fallback su SVG maglietta se non trovato
    }

    // Per basket, usa il mapping dei loghi NBA se disponibile
    if (sportId === 'BASKET') {
      const logoFile = this.basketLogos[sigla];
      if (logoFile) {
        return `assets/logos/basket/${logoFile}`;
      }
      return null; // Fallback su SVG maglietta se non trovato
    }

    return null;
  }

  // Metodo per calcolare il colore del testo in contrasto con lo sfondo
  getContrastColor(hexColor: string): string {
    const hex = hexColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  // Gestisce errori di caricamento logo e mostra fallback
  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const sportId = this.lega?.campionato?.sport?.id;

    if (sportId === 'TENNIS') {
      // Per il tennis, usa placeholder.svg
      console.warn('🎾 Errore caricamento foto tennista, uso placeholder');
      img.src = 'assets/logos/tennis/placeholder.svg';
    } else {
      // Per calcio/basket, mostra SVG maglietta fallback
      const svg = img.nextElementSibling as HTMLElement;
      if (img && svg) {
        img.style.display = 'none';
        svg.style.display = 'block';
      }
    }
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
    private snackBar: MatSnackBar,
    private translate: TranslateService
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
      this.lega.anno,
      this.data.giornata
    );
    if (this.squadraSelezionata) {
      this.mostraUltimiRisultati(this.squadraSelezionata);
      this.mostraProssimePartite();
    }
    this.caricaProssimaGiornata();
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
    anno: number,
    giornata: number
  ): void {
    this.squadraService
      .getSquadreByCampionatoAndGiornata(idCampionato, anno, giornata)
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
    const desc = this.campionatoService.getDesGiornata(
      this.lega?.campionato.id,
      index,
      alias
    );

    // Abbreviate "Settimana" to "Sett." for Basket to save space
    if (this.lega?.campionato?.sport?.id === 'BASKET') {
      return desc.replace('Settimana', 'Sett.');
    }

    return desc;
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
          this.lega.anno,
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
          this.lega.anno,
          this.lega.giornataCorrente,
          true
        )
        .subscribe({
          next: (prossimePartite) => {
            this.prossimePartite = prossimePartite;
            const opponentSigla = this.getNextOpponentSigla(true);
            if (opponentSigla){
              this.mostraUltimiRisultati(opponentSigla);
            }
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

  formatNomeSquadra(nome: string): string {
    if (!nome) return '';

    // Rimuovi underscore e sostituiscili con spazi
    let formatted = nome.replace(/_/g, ' ');

    // Standardizza nomi NBA - mostra il nome della squadra, non la città
    const abbreviazioni: { [key: string]: string } = {
      'PORTLAND TRAIL BLAZERS': 'TRAIL BLAZERS',
      'GOLDEN STATE WARRIORS': 'WARRIORS',
      'OKLAHOMA CITY THUNDER': 'THUNDER',
      'NEW ORLEANS PELICANS': 'PELICANS',
      'MINNESOTA TIMBERWOLVES': 'TIMBERWOLVES',
      'SACRAMENTO KINGS': 'KINGS',
      'SAN ANTONIO SPURS': 'SPURS',
      'LOS ANGELES LAKERS': 'LAKERS',
      'LOS ANGELES CLIPPERS': 'CLIPPERS',
      'MEMPHIS GRIZZLIES': 'GRIZZLIES',
      'DALLAS MAVERICKS': 'MAVERICKS',
      'ORLANDO MAGIC': 'MAGIC',
      'PHILADELPHIA 76ERS': '76ERS',
      'CHARLOTTE HORNETS': 'HORNETS',
      'CLEVELAND CAVALIERS': 'CAVALIERS',
      'MILWAUKEE BUCKS': 'BUCKS',
      'WASHINGTON WIZARDS': 'WIZARDS',
      'TORONTO RAPTORS': 'RAPTORS',
      'BROOKLYN NETS': 'NETS',
      'NEW YORK KNICKS': 'KNICKS',
      'BOSTON CELTICS': 'CELTICS',
      'DETROIT PISTONS': 'PISTONS',
      'INDIANA PACERS': 'PACERS',
      'CHICAGO BULLS': 'BULLS',
      'ATLANTA HAWKS': 'HAWKS',
      'MIAMI HEAT': 'HEAT',
      'DENVER NUGGETS': 'NUGGETS',
      'UTAH JAZZ': 'JAZZ',
      'PHOENIX SUNS': 'SUNS',
      'HOUSTON ROCKETS': 'ROCKETS',
    };

    const upper = formatted.toUpperCase();
    if (abbreviazioni[upper]) {
      return abbreviazioni[upper];
    }

    return formatted;
  }

  getSearchPlaceholder(): string {
    const sportId = this.lega?.campionato?.sport?.id;
    return sportId === 'TENNIS'
      ? this.translate.instant('LEAGUE.SEARCH_PLAYER')
      : this.translate.instant('LEAGUE.SEARCH_TEAM');
  }

  getTabLabel(type: 'ultimi' | 'prossime', opponentSigla?: string): string {
    const sportId = this.lega?.campionato?.sport?.id;

    if (type === 'ultimi') {
      return sportId === 'TENNIS'
        ? this.translate.instant('LEAGUE.LAST_ENCOUNTERS')
        : this.translate.instant('LEAGUE.LAST_MATCHES');
    } else if (type === 'prossime') {
      return sportId === 'TENNIS'
        ? this.translate.instant('LEAGUE.NEXT_GAMES')
        : this.translate.instant('LEAGUE.NEXT_MATCHES');
    }

    return opponentSigla ? this.formatNomeSquadra(opponentSigla) : '';
  }

  getTabOpponentLabel(): string {
    const sportId = this.lega?.campionato?.sport?.id;
    const opponentSigla = this.getNextOpponentSigla(true);

    if (sportId === 'TENNIS') {
      return this.translate.instant('LEAGUE.HEAD_TO_HEAD');
    }

    return opponentSigla ? this.formatNomeSquadra(opponentSigla) : '';
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
      const opponentSigla = this.getNextOpponentSigla(true);
      const sportId = this.lega?.campionato?.sport?.id;

      this.dialog.open(m.DettagliSquadraDialogComponent, {
        data: {
          squadraSelezionata: this.formatNomeSquadra(squadraSelezionata),
          squadraNome: squadra?.nome ? this.formatNomeSquadra(squadra.nome) : this.formatNomeSquadra(squadraSelezionata),
          ultimiRisultati: this.ultimiRisultati,
          prossimePartite: this.prossimePartite,
          ultimiRisultatiOpponent: this.ultimiRisultatiOpponent,
          opponentSigla: opponentSigla ? this.formatNomeSquadra(opponentSigla) : null,
          teamColors: this.getTeamColors(squadraSelezionata),
          getDesGiornata: this.getDesGiornata.bind(this),
          sportId: sportId,
          tabLabels: {
            ultimi: this.getTabLabel('ultimi'),
            prossime: this.getTabLabel('prossime'),
            opponent: this.getTabOpponentLabel()
          }
        },
        panelClass: 'dettagli-squadra-dialog-panel',
        backdropClass: 'dettagli-dialog-backdrop'
      });
    });
  }

  selezionaSquadra(sigla: string): void {
    this.squadraSelezionata = sigla;
    this.mostraUltimiRisultati(this.squadraSelezionata);
    this.mostraProssimePartite();
  }

  caricaProssimaGiornata(): void {
    if (!this.lega.campionato?.id) return;
      // Carica prossima giornata
      this.campionatoService
        .partiteDellaGiornata(
          this.lega.campionato!.id,
            this.lega.anno,
          this.lega.giornataCorrente
        )
        .subscribe({
          next: (partite) => {
            this.prossimaGiornata = partite;
          },
          error: (error) => {
            console.error('Errore caricamento prossima giornata:', error);
          }


    });

  }


  caricaPartitePerTutteSquadre(): void {
    if (!this.lega.campionato?.id) return;

    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';
    

    // Inizializza subito le squadre con i dati base
    this.squadreConPartite = this.squadreDisponibili.map(squadra => {
      const squadraConPartite = {
        ...squadra,
        prossimaPartita: null as Partita | null,
        ultimiRisultati: [] as any[]
      };
        this.prossimaGiornata.forEach((partita) => {
          if (partita.casaSigla == squadra.sigla || partita.fuoriSigla == squadra.sigla){
              squadraConPartite.prossimaPartita = partita;
        }

        // Quando tutti i caricamenti sono completati, applica il filtro
        if (isTennis) {
          this.applicaFiltroGiocatoriAttivi();
        }
      });


      return squadraConPartite;
    });

    // Inizializza la lista filtrata con tutte le squadre
    this.squadreFiltrate = [...this.squadreConPartite];
  }

  applicaFiltroGiocatoriAttivi(): void {
    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';

    if (isTennis) {
      // Filtra solo i giocatori che hanno una prossima partita (sono ancora in gara)
      this.squadreConPartite = this.squadreConPartite.filter(squadra => squadra.prossimaPartita !== null);
    }

    // Riapplica il filtro di ricerca
    this.filtraSquadre();
  }

  filtraSquadre(): void {
    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';
    let squadreDaFiltrare = [...this.squadreConPartite];

    // Per il tennis, mostra solo i giocatori ancora in gara (con prossima partita)
    if (isTennis) {
      squadreDaFiltrare = squadreDaFiltrare.filter(squadra => squadra.prossimaPartita !== null);
    }

    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.squadreFiltrate = squadreDaFiltrare;
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.squadreFiltrate = squadreDaFiltrare.filter(squadra => {
      const nome = (squadra.nome || '').toLowerCase();
      const sigla = (squadra.sigla || '').toLowerCase();
      return nome.includes(query) || sigla.includes(query);
    });
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filtraSquadre();
  }

  // Scroll a sinistra
  scrollLeft(): void {
    if (this.scrollWrapper) {
      const container = this.scrollWrapper.nativeElement;
      container.scrollBy({ left: -300, behavior: 'smooth' });
      setTimeout(() => this.updateScrollButtons(), 100);
    }
  }

  // Scroll a destra
  scrollRight(): void {
    if (this.scrollWrapper) {
      const container = this.scrollWrapper.nativeElement;
      container.scrollBy({ left: 300, behavior: 'smooth' });
      setTimeout(() => this.updateScrollButtons(), 100);
    }
  }

  // Aggiorna visibilità pulsanti scroll
  updateScrollButtons(): void {
    if (this.scrollWrapper) {
      const container = this.scrollWrapper.nativeElement;
      this.canScrollLeft = container.scrollLeft > 0;
      this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 5);
    }
  }

  // Chiamato dopo AfterViewInit per inizializzare lo stato delle frecce
  ngAfterViewInit(): void {
    if (this.scrollWrapper) {
      const container = this.scrollWrapper.nativeElement;

      // Listener per aggiornare le frecce durante lo scroll
      container.addEventListener('scroll', () => {
        this.updateScrollButtons();
      });

      // Inizializza stato frecce
      setTimeout(() => this.updateScrollButtons(), 200);
    }
  }


}
