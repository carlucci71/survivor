import { Component, Inject, OnInit, ViewChild, ElementRef, ViewEncapsulation, AfterViewInit } from '@angular/core';

export interface FormulaRow {
  labelKey: string;
  factor: number;
  weight: number;
  contribution: number;
}

export interface SquadraConsiglio {
  sigla: string;
  nome: string;
  /** Punteggio affidabilità 0–100 */
  score: number;
  /** Fattore win-rate stagionale 0–100 */
  factorWinRate: number;
  /** Gioca in casa */
  factorHome: boolean;
  /** Debolezza avversario 0–100 (100 = avversario ultimo in classifica) */
  factorAvvDebole: number;
  /** Goal balance normalizzato 0–100 */
  factorGoalBalance: number;
  /** Nome dell'avversario nella prossima partita */
  nomeAvversario?: string;
}

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
import { GiocataService } from '../../core/services/giocata.service';

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
  public StatoPartita = StatoPartita;
  ultimiRisultati: Partita[] = [];
  ultimiRisultatiOpponent: Partita[] = [];
  prossimaGiornata: Partita[] = [];
  prossimePartite: Partita[] = [];
  loadingUltimi = false;
  loadingProssime = false;

  // 💡 Consigli algoritmici
  consigli: SquadraConsiglio[] = [];
  underdogDiGiornata: SquadraConsiglio | null = null;
  loadingConsigli = false;
  consigliAperto = false;
  consiglioPending: { sigla: string; nome: string; isUnderdog: boolean; formulaRows: FormulaRow[]; formulaTotal: number } | null = null;
  consigliReasonEmoji = '';
  consigliReasonText = '';

  squadreDisponibili: Squadra[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  lega!: Lega;
  giocatore: Giocatore;
  showDettagli = false;
  giocataPubblica: boolean = false; // Di default la giocata è nascosta

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

  // Messaggi simpatici di incoraggiamento dopo la selezione (IT + EN)
  private encouragementMessages = [
    { emoji: '🔥', it: 'Grande scelta! Questa squadra è on fire!', en: 'Great pick! This team is on fire!' },
    { emoji: '💪', it: 'Ottima decisione! Hai le idee chiare!', en: 'Smart move! You know exactly what you want!' },
    { emoji: '🎯', it: 'Centro! Hai puntato sulla squadra giusta!', en: 'Bullseye! You nailed the right team!' },
    { emoji: '🏆', it: 'Scelta da campione! La vittoria ti aspetta!', en: 'Champion\'s choice! Victory is waiting for you!' },
    { emoji: '⚡', it: 'Che grinta! Questa selezione è elettrizzante!', en: 'What energy! This selection is electrifying!' },
    { emoji: '🚀', it: 'Stai volando alto! Selezione spaziale!', en: 'You\'re flying high! Out-of-this-world pick!' },
    { emoji: '👏', it: 'Applausi! Una scelta davvero intelligente!', en: 'Applause! A truly smart pick!' },
    { emoji: '🎲', it: 'I dadi sono lanciati! Che vinca il migliore!', en: 'The dice are cast! May the best win!' },
    { emoji: '🦁', it: 'Ruggisci come un leone! Scelta coraggiosa!', en: 'Roar like a lion! A bold, courageous choice!' },
    { emoji: '⭐', it: 'Sei una stella! Selezione da 10 e lode!', en: 'You\'re a star! A perfect 10 pick!' },
    { emoji: '🧠', it: 'Cervello in azione! Mossa strategica!', en: 'Brain in gear! A proper strategic move!' },
    { emoji: '🎪', it: 'Benvenuto allo show! Hai scelto i protagonisti!', en: 'Welcome to the show! You picked the headliners!' },
    { emoji: '🍀', it: 'In bocca al lupo! Che la fortuna sia con te!', en: 'Best of luck! May fortune smile upon you!' },
    { emoji: '🌟', it: 'Brillante! Questa scelta ti porterà lontano!', en: 'Brilliant! This pick will take you far!' },
    { emoji: '🏅', it: 'Medaglia d\'oro per questa selezione!', en: 'Gold medal worthy selection!' },
    { emoji: '🎸', it: 'Rock\'n\'roll! Scelta che spacca!', en: 'Rock \'n\' roll! A pick that absolutely rocks!' },
    { emoji: '🦅', it: 'Occhio d\'aquila! Hai visto giusto!', en: 'Eagle eye! You saw it perfectly!' },
    { emoji: '💎', it: 'Hai trovato la gemma! Selezione preziosa!', en: 'You found the gem! A precious pick!' },
    { emoji: '🌈', it: 'Dopo la pioggia esce l\'arcobaleno! Vai così!', en: 'After the rain comes the rainbow! Keep it up!' },
    { emoji: '🎬', it: 'Ciak, si gira! Sei il regista della vittoria!', en: 'Action! You\'re directing your own victory!' },
    { emoji: '😏', it: 'Sempre quella, eh? Grande classico!', en: 'That one again? A true classic move!' },
    { emoji: '🎰', it: 'Tutto in! Solo i coraggiosi scelgono così!', en: 'All in! Only the brave pick like this!' },
    { emoji: '🤓', it: 'Analisi tattica completata. Scelta approvata!', en: 'Tactical analysis complete. Pick approved!' },
    { emoji: '🍕', it: 'Più calda di una pizza appena sfornata!', en: 'Hotter than a fresh pizza out of the oven!' },
    { emoji: '😎', it: 'Stile innato. Scelta di classe assoluta!', en: 'Born cool. An absolute class act of a pick!' },
    { emoji: '🐉', it: 'Hai selezionato il drago! Trema chiunque!', en: 'You picked the dragon! Everyone better tremble!' },
    { emoji: '🧲', it: 'Questa squadra attira vittorie come un magnete!', en: 'This team attracts wins like a magnet!' },
    { emoji: '🎩', it: 'Abracadabra! Una scelta da vero mago!', en: 'Abracadabra! A pick worthy of a wizard!' },
    { emoji: '🏄', it: 'Cavalchi l\'onda! Selezione da surfista!', en: 'Riding the wave! A true surfer\'s choice!' },
    { emoji: '🔮', it: 'Il cristallo magico ha parlato! Scelta ispirata!', en: 'The crystal ball has spoken! An inspired pick!' },
    { emoji: '🦊', it: 'Furbo come una volpe! Scelta da stratega!', en: 'Sly as a fox! A strategist\'s pick!' },
    { emoji: '🎻', it: 'Questa scelta è musica per le orecchie!', en: 'This pick is music to my ears!' },
    { emoji: '🚂', it: 'Il treno del successo è partito! Sei a bordo!', en: 'The success train has left the station! You\'re on it!' },
    { emoji: '🌋', it: 'Eruzione imminente! Questa squadra è esplosiva!', en: 'Eruption incoming! This team is absolutely explosive!' },
    { emoji: '🎊', it: 'Festa anticipata! Questa scelta merita i coriandoli!', en: 'Early celebrations! This pick deserves confetti!' },
    { emoji: '🏰', it: 'Stai costruendo il tuo impero! Scelta solida!', en: 'Building your empire! A rock-solid pick!' },
    { emoji: '🤝', it: 'Accordo fatto! Una partnership da vincitori!', en: 'Deal done! A winning partnership!' },
    { emoji: '🏇', it: 'Via di corsa! La vittoria non aspetta!', en: 'Off to the races! Victory won\'t wait!' },
    { emoji: '🦋', it: 'Ha le ali! Vola verso il trionfo!', en: 'It has wings! Fly towards triumph!' },
    { emoji: '👑', it: 'Scelta regale! Il trono ti aspetta!', en: 'A royal choice! The throne awaits you!' }
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
   // if(sportId === 'CALCIO')
       const sportId2 = this.lega?.campionato?.id ;
    const key = `${sportId}_${sigla}`;
    const key2 = `${sportId2}_${sigla}`;
    return this.teamColors[key2] || this.teamColors[key] || this.teamColors[sigla] || this.teamColors['DEFAULT'];
  }

  // Mapping esplicito sigla → file logo (con estensioni corrette)
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
    'SERIE_B_BEN': 'benevento.png',

    // MONDIALI 2026 (48 squadre nazionali)
    'MONDIALI_2026_ALG': 'mondiali/algeria.png',
    'MONDIALI_2026_SAU': 'mondiali/arabia-saudita.png',
    'MONDIALI_2026_ARG': 'mondiali/argentina.png',
    'MONDIALI_2026_AUS': 'mondiali/australia.png',
    'MONDIALI_2026_AUT': 'mondiali/austria.png',
    'MONDIALI_2026_BEL': 'mondiali/belgio.png',
    'MONDIALI_2026_BRA': 'mondiali/brasile.png',
    'MONDIALI_2026_CAN': 'mondiali/canada.png',
    'MONDIALI_2026_CPV': 'mondiali/capoverde.png',
    'MONDIALI_2026_COL': 'mondiali/colombia.png',
    'MONDIALI_2026_COR': 'mondiali/corea.png',
    'MONDIALI_2026_CIV': 'mondiali/costa-avorio.png',
    'MONDIALI_2026_CRO': 'mondiali/croazia.png',
    'MONDIALI_2026_CUR': 'mondiali/curacao.png',
    'MONDIALI_2026_ECU': 'mondiali/ecuador.png',
    'MONDIALI_2026_EGI': 'mondiali/egitto.png',
    'MONDIALI_2026_FRA': 'mondiali/francia.png',
    'MONDIALI_2026_GER': 'mondiali/germania.png',
    'MONDIALI_2026_GHA': 'mondiali/ghana.png',
    'MONDIALI_2026_JAP': 'mondiali/giappone.png',
    'MONDIALI_2026_GIO': 'mondiali/giordania.png',
    'MONDIALI_2026_HAI': 'mondiali/haiti.png',
    'MONDIALI_2026_ING': 'mondiali/inghilterra.png',
    'MONDIALI_2026_IRA': 'mondiali/iran.png',
    'MONDIALI_2026_MAR': 'mondiali/marocco.png',
    'MONDIALI_2026_MES': 'mondiali/messico.png',
    'MONDIALI_2026_NOR': 'mondiali/norvegia.png',
    'MONDIALI_2026_NZE': 'mondiali/nuova-zelanda.png',
    'MONDIALI_2026_OLA': 'mondiali/olanda.png',
    'MONDIALI_2026_PAN': 'mondiali/panama.png',
    'MONDIALI_2026_PAR': 'mondiali/paraguay.png',
    'MONDIALI_2026_POR': 'mondiali/portogallo.png',
    'MONDIALI_2026_QAT': 'mondiali/qatar.png',
    'MONDIALI_2026_SCO': 'mondiali/scozia.png',
    'MONDIALI_2026_SEN': 'mondiali/senegal.png',
    'MONDIALI_2026_SPA': 'mondiali/spagna.png',
    'MONDIALI_2026_USA': 'mondiali/stati-uniti.png',
    'MONDIALI_2026_SAF': 'mondiali/sudafrica.png',
    'MONDIALI_2026_SVI': 'mondiali/svizzera.png',
    'MONDIALI_2026_TUN': 'mondiali/tunisia.png',
    'MONDIALI_2026_URU': 'mondiali/uruguay.png',
    'MONDIALI_2026_UZB': 'mondiali/uzbekistan.png',
    'MONDIALI_2026_BOS': 'mondiali/bosnia-erzegovina.png',
    'MONDIALI_2026_CEC': 'mondiali/repubblica-ceca.png',
    'MONDIALI_2026_TUR': 'mondiali/turchia.png',
    'MONDIALI_2026_SVE': 'mondiali/svezia.png',
    'MONDIALI_2026_IRQ': 'mondiali/iraq.png',
    'MONDIALI_2026_COD': 'mondiali/congo.png',
  };

  // Mapping foto tennisti (sigla → file)
  private readonly tennisPhotos: { [key: string]: string } = {
    // ── Cognome solo (legacy / altri tornei) ──────────────────────
    'ALCARAZ': 'ALCARAZ.png',
    'BUBLIK': 'BUBLIK.png',
    'CERUNDOLO': 'CERUNDOLO.png',
    'DARDERI': 'DARDERI.png',
    'DE_MINAUR': 'DE_MIINAUR.png',
    'DE MINAUR': 'DE_MIINAUR.png',
    'DEMINAUR': 'DE_MIINAUR.png',
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
    // ── Nome completo UPPERCASE (sigla Roland Garros) ──────────────
    'JANNIK_SINNER': 'jannik_sinner.png',
    'CARLOS_ALCARAZ': 'carlos_alcaraz.png',
    'NOVAK_DJOKOVIC': 'novak_djokovic.png',
    'DANIIL_MEDVEDEV': 'daniil_medvedev.png',
    'ALEXANDER_ZVEREV': 'alexander_zverev.png',
    'CASPER_RUUD': 'casper_ruud.png',
    'HOLGER_RUNE': 'holger_rune.png',
    'HUBERT_HURKACZ': 'hubert_hurkacz.png',
    'TAYLOR_FRITZ': 'taylor_fritz.png',
    'TOMMY_PAUL': 'tommy_paul.png',
    'BEN_SHELTON': 'ben_shelton.png',
    'JACK_DRAPER': 'jack_draper.png',
    'ANDREY_RUBLEV': 'andrey_rublev.png',
    'ALEX_DE_MINAUR': 'alex_de_minaur.png',
    'STEFANOS_TSITSIPAS': 'stefanos_tsitsipas.png',
    'ARTHUR_FILS': 'arthur_fils.png',
    'SEBASTIAN_BAEZ': 'sebastian_baez.png',
    'SEBASTIAN_KORDA': 'sebastian_korda.png',
    'FRANCES_TIAFOE': 'frances_tiafoe.png',
    'ALEJANDRO_DAVIDOVICH_FOKINA': 'alejandro_davidovich_fokina.png',
    'ALEJANDRO_TABILO': 'alejandro_tabilo.png',
    'FELIX_AUGER_ALIASSIME': 'felix_auger-aliassime.png',
    'FRANCISCO_CERUNDOLO': 'francisco_cerundolo.png',
    'JUAN_MANUEL_CERUNDOLO': 'juan_manuel_cerundolo.png',
    'LORENZO_MUSETTI': 'lorenzo_musetti.png',
    'LORENZO_SONEGO': 'lorenzo_sonego.png',
    'FABIAN_MAROZSAN': 'fabian_marozsan.png',
    'MIOMIR_KECMANOVIC': 'miomir_kecmanovic.png',
    'KAREN_KHACHANOV': 'karen_khachanov.png',
    'UGO_HUMBERT': 'ugo_humbert.png',
    'CORENTIN_MOUTET': 'corentin_moutet.png',
    'MATTEO_BERRETTINI': 'matteo_berrettini.png',
    'NUNO_BORGES': 'nuno_borges.png',
    'TALLON_GRIEKSPOOR': 'tallon_griekspoor.png',
    'ALEXANDER_BUBLIK': 'alexander_bublik.png',
    'BRANDON_NAKASHIMA': 'brandon_nakashima.png',
    'TOMAS_MACHAC': 'tomas_machac.png',
    'JIRI_LEHECKA': 'jiri_lehecka.png',
    'ALEXEI_POPYRIN': 'alexei_popyrin.png',
    'ALEKSANDAR_VUKIC': 'aleksandar_vukic.png',
    'ALEKSANDAR_KOVACEVIC': 'aleksandar_kovacevic.png',
    'BOTIC_VAN_DE_ZANDSCHULP': 'botic_van_de_zandschulp.png',
    'CAMERON_NORRIE': 'cameron_norrie.png',
    'DENIS_SHAPOVALOV': 'denis_shapovalov.png',
    'JAUME_MUNAR': 'jaume_munar.png',
    'RINKY_HIJIKATA': 'rinky_hijikata.png',
    'ARTHUR_RINDERKNECH': 'arthur_rinderknech.png',
    'DAMIR_DZUMHUR': 'damir_dzumhur.png',
    'DANIEL_ALTMAIER': 'daniel_altmaier.png',
    'MARCOS_GIRON': 'marcos_giron.png',
    'MARTON_FUCSOVICS': 'marton_fucsovics.png',
    'LUCA_VAN_ASSCHE': 'luca_van_assche.png',
    'KAMIL_MAJCHRZAK': 'kamil_majchrzak.png',
    'QUENTIN_HALYS': 'quentin_halys.png',
    'JENSON_BROOKSBY': 'jenson_brooksby.png',
    'REILLY_OPELKA': 'reilly_opelka.png',
    'YANNICK_HANFMANN': 'yannick_hanfmann.png',
    'ZIZOU_BERGS': 'zizou_bergs.png',
    'JAMES_DUCKWORTH': 'james_duckworth.png',
    'PABLO_CARRENO_BUSTA': 'pablo_carreno_busta.png',
    'JAN_LENNARD_STRUFF': 'jan-lennard_struff.png',
    'SEBASTIAN_OFNER': 'sebastian_ofner.png',
    'TOMAS_MARTIN_ETCHEVERRY': 'tomas_martin_etcheverry.png',
    'ROBERTO_BAUTISTA_AGUT': 'roberto_bautista_agut.png',
    'YIBING_WU': 'yibing_wu.png',
    'CAMILO_UGO_CARABELLI': 'camilo_ugo_carabelli.png',
    'ALEXANDER_SHEVCHENKO': 'alexander_shevchenko.png',
    'ALEXANDR_SHEVCHENKO': 'alexander_shevchenko.png',
    'LUCIANO_DARDERI': 'DARDERI.png',
    'ADRIAN_MANNARINO': 'adrian_mannarino.png',
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
    const campionatoId = this.lega?.campionato?.id;
    const calcioId = campionatoId; //SERIE_A, SERIE_B, LIGA
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

      // Nessuna foto trovata → usa placeholder direttamente (evita 404)
      return 'assets/logos/tennis/placeholder.svg';
    }


    // Per calcio, usa mapping esplicito
    // calcioId SERIE_A, SERIE_B,LIGAv
    if (sportId === 'CALCIO') {
      const fileName = this.logoFiles[calcioId+'_'+sigla];

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

  currentLang: string = 'it';

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
      giocataCorrente?: any;  // ✅ Giocata esistente (se presente)
    },
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private giocataService: GiocataService,
  ) {
    this.currentLang = this.translate.currentLang || this.translate.getDefaultLang() || 'it';
    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
    });
    this.giocatore = data.giocatore;
    // Dedup by sigla: rimuove eventuali duplicati già dalla sorgente
    const seenSigle = new Set<string>();
    this.squadreDisponibili = (data.squadreDisponibili || []).filter(s => {
      if (!s?.sigla || seenSigle.has(s.sigla)) return false;
      seenSigle.add(s.sigla);
      return true;
    });
    // Se c'è una squadra già selezionata per questa giornata, selezionala
    this.squadraSelezionata = data.squadraCorrenteId || null;
    this.statoGiornataCorrente = data.statoGiornataCorrente;
    this.lega = data.lega;

    // ✅ Inizializza giocataPubblica con il valore della giocata esistente
    if (data.giocataCorrente && typeof data.giocataCorrente.pubblica === 'boolean') {
      this.giocataPubblica = data.giocataCorrente.pubblica;
    } else {
      // Default: false (nascosta) se non esiste una giocata precedente
      this.giocataPubblica = false;
    }
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
    // Prima carica la prossima giornata, poi le partite per tutte le squadre
    this.caricaProssimaGiornata();
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
          // Confronto case-insensitive: evita mismatch tra sigla DB e sigla API
          // (es. "JANNIK_SINNER" vs "jannik_sinner", o "C._ALCARAZ" vs "CARLOS_ALCARAZ")
          const returnedSigleUpper = new Set([...returnedSigle].map(s => s.toUpperCase()));
          this.squadreDisponibili = this.squadreDisponibili.filter((sd) => {
            const sdSigla = sd.sigla;
            return sdSigla ? (returnedSigle.has(sdSigla) || returnedSigleUpper.has(sdSigla.toUpperCase())) : false;
          });
          // Aggiunge eventuali giocatori del round corrente non presenti nella lista iniziale
          // (es. sigla cambiata tra round precedenti e round corrente, o Lucky Losers nuovi)
          const existingSigle = new Set(this.squadreDisponibili.map(sd => sd.sigla?.toUpperCase()));
          // Ricava siglas già usate dalla lista originale del dialog (per marcarle alreadyUsed)
          // Confronto uppercase per robustezza contro varianti di sigla
          const alreadyUsedSigle = new Set<string>(
            (this.data.squadreDisponibili || []).filter((s: any) => s?.alreadyUsed && s.sigla).map((s: any) => s.sigla.toUpperCase())
          );
          returnedSigle.forEach((sigla: string) => {
            if (!existingSigle.has(sigla.toUpperCase())) {
              const nome = sigla.split('_')
                .map((w: string) => w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : w)
                .join(' ');
              this.squadreDisponibili.push({ sigla, nome, alreadyUsed: alreadyUsedSigle.has(sigla.toUpperCase()) } as any);
            }
          });
          // Ri-valida alreadyUsed su tutta la lista usando le giocate effettive del giocatore.
          // Garantisce che giocatori già scelti vengano marcati correttamente anche in caso di:
          // - sigla mismatch tra this.squadre e le giocate salvate
          // - giocatori non presenti in this.squadre (cache stale, Lucky Losers aggiunti dopo)
          {
            const currentGiornata = this.data.giornata;
            const prevPicks = ((this.data.giocatore?.giocate || []) as any[])
              .filter((g: any) => Number(g?.giornata) !== currentGiornata && g?.squadraSigla)
              .sort((a: any, b: any) => Number(a.giornata) - Number(b.giornata))
              .map((g: any) => (g.squadraSigla as string).toUpperCase());

            let usedSigle: Set<string>;
            if (this.lega?.modalita === 'CAMPIONATO') {
              // Ciclo: blocca solo i pick del ciclo corrente; si azzera quando si usano tutte le squadre
              const numSquadre = (this.data.squadreDisponibili || []).length || this.squadreDisponibili.length;
              const cycleStart = numSquadre > 0 ? Math.floor(prevPicks.length / numSquadre) * numSquadre : 0;
              usedSigle = new Set<string>(prevPicks.slice(cycleStart));
            } else {
              // SURVIVOR: blacklist globale — qualsiasi pick precedente è bloccato
              usedSigle = new Set<string>(prevPicks);
            }

            this.squadreDisponibili = this.squadreDisponibili.map((s: any) => ({
              ...s,
              alreadyUsed: s.alreadyUsed || usedSigle.has(s.sigla?.toUpperCase())
            }));
          }
          // Ricostruisci squadreConPartite con la lista filtrata se già disponibile
          if (this.prossimaGiornata.length > 0) {
            this.caricaPartitePerTutteSquadre();
          }
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
          width: '380px',
          maxWidth: '95vw',
          disableClose: true,
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.showEncouragementMessage();
            this.dialogRef.close({
              squadraSelezionata: this.squadraSelezionata,
              pubblica: this.giocataPubblica
            });
          }
          // Se annulla, non fa nulla e la modale rimane aperta
        });
    } else {
      this.showEncouragementMessage();
      this.dialogRef.close({
        squadraSelezionata: this.squadraSelezionata,
        pubblica: this.giocataPubblica
      });
    }
  }

  private showEncouragementMessage(): void {
    const randomIndex = Math.floor(Math.random() * this.encouragementMessages.length);
    const selected = this.encouragementMessages[randomIndex];
    const isEnglish = this.translate.currentLang === 'en';
    const message = isEnglish ? selected.en : selected.it;
    this.snackBar.open(`${selected.emoji} ${message}`, '✕', {
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
    return this.squadraService.formatNomeSquadra(nome);
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
    if (!partita) {
      return '-';
    }

    // Determina quale squadra è l'avversario
    let avversarioNome = '';
    if (partita.casaSigla === siglaMiaSquadra) {
      // Io gioco in casa, l'avversario è fuori
      avversarioNome = partita.fuoriNome || partita.fuoriSigla || '';
    } else if (partita.fuoriSigla === siglaMiaSquadra) {
      // Io gioco fuori, l'avversario è in casa
      avversarioNome = partita.casaNome || partita.casaSigla || '';
    } else {
      // Fallback: non dovrebbe succedere ma gestito per sicurezza
      console.warn('getAvversarioNome: sigla non trovata in partita', { partita, siglaMiaSquadra });
      return '-';
    }

    // Se il nome dell'avversario è vuoto, usa la sigla come fallback
    return avversarioNome || '-';
  }

  /**
   * Verifica se una squadra gioca in casa nella prossima partita
   */
  isPlayingHome(siglaSquadra: string): boolean {
    const squadra = this.squadreConPartite.find(s => s.sigla === siglaSquadra);
    if (!squadra || !squadra.prossimaPartita) {
      return false;
    }
    return squadra.prossimaPartita.casaSigla === siglaSquadra;
  }

  nomeFromSigla(sigla: string): string {
    return  this.squadreDisponibili.find(s => s.sigla === sigla)?.nome || '';

  }


  toggleDettagli(): void {
    if (!this.squadraSelezionata) return;

    const squadraSelezionata = this.squadraSelezionata; // Per evitare problemi di null check

    // Apri il dialog dei dettagli
    import('./dettagli-squadra-dialog.component').then(m => {
      const squadra = this.squadreConPartite.find(s => s.sigla === squadraSelezionata);
      const opponentSigla = this.getNextOpponentSigla(true);
      const sportId = this.lega?.campionato?.sport?.id;

      const ref = this.dialog.open(m.DettagliSquadraDialogComponent, {
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
          },
          allSquadre: this.squadreConPartite.map(s => ({
            sigla: s.sigla,
            nome: s.nome ? this.formatNomeSquadra(s.nome) : this.formatNomeSquadra(s.sigla)
          })),
          loadStats: (sigla: string, callback: (result: any) => void) => {
            const campionatoId = this.lega.campionato!.id;
            const anno = this.lega.anno;
            const giornata = this.lega.giornataCorrente;
            const squadraObj = this.squadreConPartite.find(s => s.sigla === sigla);
            const nome = squadraObj?.nome
              ? this.formatNomeSquadra(squadraObj.nome)
              : this.formatNomeSquadra(sigla);
            const colors = this.getTeamColors(sigla);
            const formattedSigla = this.formatNomeSquadra(sigla);

            this.campionatoService.calendario(campionatoId, sigla, anno, giornata - 1, false).subscribe({
              next: (ultimi) => {
                this.campionatoService.calendario(campionatoId, sigla, anno, giornata, true).subscribe({
                  next: (prossime) => {
                    let opponentSiglaRaw: string | null = null;
                    if (prossime.length > 0) {
                      const next = prossime[0] as any;
                      opponentSiglaRaw = next.casaSigla === sigla ? (next.fuoriSigla || null) : (next.casaSigla || null);
                    }
                    if (opponentSiglaRaw) {
                      this.campionatoService.calendario(campionatoId, opponentSiglaRaw, anno, giornata - 1, false).subscribe({
                        next: (ultimiOpp) => {
                          callback({ squadraSigla: formattedSigla, squadraNome: nome, ultimi, prossime, opponentSigla: this.formatNomeSquadra(opponentSiglaRaw!), ultimiOpponent: ultimiOpp, colors });
                        },
                        error: () => {
                          callback({ squadraSigla: formattedSigla, squadraNome: nome, ultimi, prossime, opponentSigla: this.formatNomeSquadra(opponentSiglaRaw!), ultimiOpponent: [], colors });
                        }
                      });
                    } else {
                      callback({ squadraSigla: formattedSigla, squadraNome: nome, ultimi, prossime, opponentSigla: null, ultimiOpponent: [], colors });
                    }
                  },
                  error: () => {
                    callback({ squadraSigla: formattedSigla, squadraNome: nome, ultimi, prossime: [], opponentSigla: null, ultimiOpponent: [], colors });
                  }
                });
              },
              error: () => {
                callback({ squadraSigla: formattedSigla, squadraNome: nome, ultimi: [], prossime: [], opponentSigla: null, ultimiOpponent: [], colors });
              }
            });
          }
        },
        maxWidth: '600px',
        width: '90vw',
        maxHeight: '90vh',
        panelClass: 'dettagli-squadra-dialog-panel',
        backdropClass: 'dettagli-dialog-backdrop',
        autoFocus: false,
        hasBackdrop: true
        // CENTRATO (nessun position)
      });
      ref.afterClosed().subscribe(result => {
        if (result?.selezionata) {
          this.selezionaSquadra(result.selezionata);
        }
      });
    });
  }

  selezionaSquadra(sigla: string): void {
    // Squadra già usata in giornate precedenti → non selezionabile
    const squadra = this.squadreConPartite.find(s => s.sigla === sigla);
    if (squadra?.alreadyUsed) return;

    // Click sulla squadra già selezionata → ignora
    if (this.squadraSelezionata === sigla) return;
    this.squadraSelezionata = sigla;
    this.mostraUltimiRisultati(this.squadraSelezionata);
    this.mostraProssimePartite();
  }

  annullaRimozione(): void {
    this.showConfirmRemove = false;
  }

  confermaRimozione(): void {
    if (this._eliminaLoading) return;
    this._eliminaLoading = true;
    this.giocataService.eliminaGiocata(
      this.data.giornata,
      this.data.giocatore.id,
      this.data.lega.id
    ).subscribe({
      next: (res) => {
        this._eliminaLoading = false;
        this.showConfirmRemove = false;
        this.squadraSelezionata = null;
        this.dialogRef.close({ eliminata: true });
      },
      error: (err: any) => {
        this._eliminaLoading = false;
        this.showConfirmRemove = false;
        console.error('❌ Errore eliminazione giocata - status:', err?.status, 'message:', err?.error?.message || err?.message, err);
      }
    });
  }

  _giocataEliminata = false;
  showConfirmRemove = false;  // mostra overlay di conferma rimozione
  _eliminaLoading = false;   // spinner durante la chiamata

  /** Intercetta la chiusura (es. click X) per notificare al padre se la giocata è stata eliminata */
  chiudi(): void {
    if (this._giocataEliminata) {
      this.dialogRef.close({ eliminata: true });
    } else {
      this.dialogRef.close();
    }
  }

  caricaProssimaGiornata(): void {
    if (!this.lega.campionato?.id) {
      return;
    }
    this.campionatoService
      .partiteDellaGiornata(
        this.lega.campionato!.id,
        this.lega.anno,
        this.lega.giornataCorrente
      )
      .subscribe({
        next: (partite) => {
          this.prossimaGiornata = partite;
          this.caricaPartitePerTutteSquadre();
          this.calcolaConsigli();
        },
        error: (error) => {
          console.error('Errore caricamento prossima giornata:', error);
          this.caricaPartitePerTutteSquadre();
        },
      });
  }

  caricaPartitePerTutteSquadre(): void {
    if (!this.lega.campionato?.id) return;

    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';

    // Deduplica per sigla: evita duplicati indipendentemente dalla fonte
    const seen = new Set<string>();
    const uniqueSquadre = this.squadreDisponibili.filter(s => {
      if (!s.sigla || seen.has(s.sigla)) return false;
      seen.add(s.sigla);
      return true;
    });

    // Inizializza subito le squadre con i dati base
    this.squadreConPartite = uniqueSquadre.map(squadra => {
      const squadraConPartite = {
        ...squadra,
        prossimaPartita: null as Partita | null,
        ultimiRisultati: [] as any[]
      };

      // Trova la prossima partita per questa squadra
      this.prossimaGiornata.forEach((partita) => {
        // Confronto sia con == che con === per sicurezza (potrebbe essere string vs number)
        if (partita.casaSigla == squadra.sigla || partita.fuoriSigla == squadra.sigla) {
          squadraConPartite.prossimaPartita = partita;
        }
      });

      return squadraConPartite;
    });

    // Quando tutti i caricamenti sono completati, applica il filtro
    if (isTennis) {
      this.applicaFiltroGiocatoriAttivi();
    }

    // Inizializza la lista filtrata con tutte le squadre
    this.squadreFiltrate = [...this.squadreConPartite];

    // Aggiorna i bottoni frecce dopo il caricamento
    setTimeout(() => this.updateScrollButtons(), 200);
  }

  applicaFiltroGiocatoriAttivi(): void {
    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';
    const isRolandGarros = this.lega?.campionato?.id === 'ROLAND_GARROS';

    if (isTennis && !isRolandGarros) {
      // Filtra solo i giocatori che hanno una prossima partita (sono ancora in gara)
      this.squadreConPartite = this.squadreConPartite.filter(squadra => squadra.prossimaPartita !== null);
    }

    // Riapplica il filtro di ricerca
    this.filtraSquadre();
  }

  filtraSquadre(): void {
    const isTennis = this.lega?.campionato?.sport?.id === 'TENNIS';
    const isRolandGarros = this.lega?.campionato?.id === 'ROLAND_GARROS';

    // Dedup definitivo: garantisce assenza duplicati prima del render
    const seenInFilter = new Set<string>();
    let squadreDaFiltrare = this.squadreConPartite.filter(s => {
      if (!s.sigla || seenInFilter.has(s.sigla)) return false;
      seenInFilter.add(s.sigla);
      return true;
    });

    // Per il tennis (escluso Roland Garros), mostra solo i giocatori ancora in gara (con prossima partita)
    if (isTennis && !isRolandGarros) {
      squadreDaFiltrare = squadreDaFiltrare.filter(squadra => squadra.prossimaPartita !== null);
    }

    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.squadreFiltrate = squadreDaFiltrare;
      // Aggiorna le frecce dopo il filtro
      setTimeout(() => this.updateScrollButtons(), 100);
      return;
    }

    const query = this.searchQuery.toLowerCase().trim();
    this.squadreFiltrate = squadreDaFiltrare.filter(squadra => {
      const nome = (squadra.nome || '').toLowerCase();
      const sigla = (squadra.sigla || '').toLowerCase();
      return nome.includes(query) || sigla.includes(query);
    });

    // Aggiorna le frecce dopo il filtro
    setTimeout(() => this.updateScrollButtons(), 100);
  }

  isCampionato(): boolean {
    return this.lega?.modalita === 'CAMPIONATO';
  }

  get squadreFiltrateDisponibili(): any[] {
    return this.squadreFiltrate.filter((s: any) => !s.alreadyUsed);
  }

  get squadreFiltrateGiaUsate(): any[] {
    return this.squadreFiltrate.filter((s: any) => s.alreadyUsed);
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filtraSquadre();
    // Forza aggiornamento frecce dopo clear
    setTimeout(() => this.updateScrollButtons(), 150);
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
      const hasOverflow = container.scrollWidth > container.clientWidth;

      // Se non c'è overflow, nascondi entrambe le frecce
      if (!hasOverflow) {
        this.canScrollLeft = false;
        this.canScrollRight = false;
        return;
      }

      // Altrimenti calcola normalmente
      this.canScrollLeft = container.scrollLeft > 10; // Tolleranza di 10px
      this.canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 10); // Tolleranza di 10px
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

  /**
   * Gestisce scroll con mouse wheel (rotella)
   * Converte lo scroll verticale in orizzontale
   */
  onScrollWrapperScroll(event: WheelEvent): void {
    const wrapper = this.scrollWrapper?.nativeElement;
    if (!wrapper) return;

    // Previeni lo scroll verticale di default
    event.preventDefault();

    // Converti scroll verticale in orizzontale
    wrapper.scrollLeft += event.deltaY;

    // Aggiorna stato frecce
    this.updateScrollButtons();
  }

  // ─── Consigli algoritmici ──────────────────────────────────────────────────

  /**
   * Calcola le top-3 squadre consigliate usando la classifica stagionale.
   * Score = winRate×40% + goalBalanceNorm×20% + casaBonus×20% + avvDebole×20%
   * Richiede 1 sola chiamata API (classificaCampionato).
   */
  mostraRagione(card: SquadraConsiglio, isUnderdog: boolean): void {
    const key = isUnderdog ? 'UNDERDOG_REASONS' : 'TOP_REASONS';
    const idx = Math.floor(Math.random() * 20);
    this.consigliReasonEmoji = this.translate.instant(`PLAY.CONSIGLI.${key}.${idx}.EMOJI`);
    this.consigliReasonText  = this.translate.instant(`PLAY.CONSIGLI.${key}.${idx}.TEXT`);
    const formulaRows = isUnderdog ? this.getUnderdogFormula(card) : this.getTopFormula(card);
    const formulaTotal = formulaRows.reduce((sum, r) => sum + r.contribution, 0);
    this.consiglioPending = { sigla: card.sigla, nome: card.nome, isUnderdog, formulaRows, formulaTotal };
  }

  private getTopFormula(card: SquadraConsiglio): FormulaRow[] {
    const homeVal = card.factorHome ? 100 : 40;
    return [
      { labelKey: 'PLAY.CONSIGLI.FORMULA_WIN',  factor: card.factorWinRate,    weight: 40, contribution: Math.round(card.factorWinRate * 0.40) },
      { labelKey: 'PLAY.CONSIGLI.FORMULA_GB',   factor: card.factorGoalBalance, weight: 20, contribution: Math.round(card.factorGoalBalance * 0.20) },
      { labelKey: 'PLAY.CONSIGLI.FORMULA_HOME', factor: homeVal,                weight: 20, contribution: Math.round(homeVal * 0.20) },
      { labelKey: 'PLAY.CONSIGLI.FORMULA_OPP',  factor: card.factorAvvDebole,   weight: 20, contribution: Math.round(card.factorAvvDebole * 0.20) },
    ];
  }

  private getUnderdogFormula(card: SquadraConsiglio): FormulaRow[] {
    const homeVal = card.factorHome ? 100 : 30;
    const weak    = 100 - card.factorWinRate;
    const strong  = 100 - card.factorAvvDebole;
    return [
      { labelKey: 'PLAY.CONSIGLI.FORMULA_WEAK',       factor: weak,    weight: 40, contribution: Math.round(weak * 0.40) },
      { labelKey: 'PLAY.CONSIGLI.FORMULA_HOME_BONUS', factor: homeVal, weight: 35, contribution: Math.round(homeVal * 0.35) },
      { labelKey: 'PLAY.CONSIGLI.FORMULA_OPP_STRONG', factor: strong,  weight: 25, contribution: Math.round(strong * 0.25) },
    ];
  }

  confermaConsiglio(): void {
    if (this.consiglioPending) {
      this.selezionaSquadra(this.consiglioPending.sigla);
      this.consiglioPending = null;
      this.consigliAperto = false;
    }
  }

  annullaConsiglio(): void {
    this.consiglioPending = null;
  }

  chiudiConsigli(): void {
    this.consiglioPending = null;
    this.consigliAperto = false;
  }

  calcolaConsigli(): void {
    // Solo calcio/basket: la classifica stagionale non si applica al tennis a gironi
    if (this.lega?.campionato?.sport?.id === 'TENNIS') return;
    const campionatoId = this.lega?.campionato?.id;
    if (!campionatoId) return;

    this.loadingConsigli = true;

    this.campionatoService.classificaCampionato(campionatoId, this.lega.anno).subscribe({
      next: (classifica) => {
        const total = classifica.length || 1;
        const disponibili = this.squadreConPartite.filter((s: any) => !s.alreadyUsed);

        const raw = disponibili.map((squadra: any) => {
          const row = classifica.find(r => r.sigla === squadra.sigla);
          const pj = row?.pj ?? 0;
          const winRate = pj > 0 ? (row!.v / pj) : 0;
          const avgGB   = pj > 0 ? ((row!.gf - row!.gs) / pj) : 0;
          const isHome  = this.isPlayingHome(squadra.sigla);

          let avvPos = Math.ceil(total / 2); // default: metà classifica
          let avvNome = '';
          if (squadra.prossimaPartita) {
            const isCasa = squadra.prossimaPartita.casaSigla === squadra.sigla;
            const avvSigla = isCasa ? squadra.prossimaPartita.fuoriSigla : squadra.prossimaPartita.casaSigla;
            avvNome = isCasa
              ? (squadra.prossimaPartita.fuoriNome || avvSigla || '')
              : (squadra.prossimaPartita.casaNome  || avvSigla || '');
            const avvIdx = classifica.findIndex(r => r.sigla === avvSigla);
            if (avvIdx >= 0) avvPos = avvIdx + 1;
          }
          const avvDebole = (total - avvPos + 1) / total;

          return { squadra, winRate, avgGB, isHome, avvDebole, avvNome };
        });

        // Normalizza goal balance su range 0-1
        const gbs = raw.map((s: any) => s.avgGB);
        const minGB = Math.min(...gbs, 0);
        const maxGB = Math.max(...gbs, 0.01);
        const gbRange = maxGB - minGB || 1;

        const scored: SquadraConsiglio[] = raw.map((s: any) => {
          const gbNorm  = (s.avgGB - minGB) / gbRange;
          const homeVal = s.isHome ? 1.0 : 0.4;
          const total01 = s.winRate * 0.40 + gbNorm * 0.20 + homeVal * 0.20 + s.avvDebole * 0.20;
          return {
            sigla:             s.squadra.sigla,
            nome:              s.squadra.nome,
            score:             Math.round(Math.min(total01, 1) * 100),
            factorWinRate:     Math.round(s.winRate * 100),
            factorHome:        s.isHome,
            factorAvvDebole:   Math.round(s.avvDebole * 100),
            factorGoalBalance: Math.round(gbNorm * 100),
            nomeAvversario:    s.avvNome || undefined,
          };
        });

        this.consigli = scored
          .filter(c => c.score > 0)
          .sort((a, b) => b.score - a.score)
          .slice(0, 3);

        // ── Underdog della giornata ─────────────────────────────────
        // Sfavorita (winRate 15–45%) che gimca in casa contro un avversario forte
        const underdogPool = scored.filter(c =>
          c.factorWinRate >= 15 && c.factorWinRate <= 45
        );
        if (underdogPool.length > 0) {
          const casalinghe = underdogPool.filter(c => c.factorHome);
          const pool = casalinghe.length > 0 ? casalinghe : underdogPool;
          const sorted = pool
            .map(c => ({
              ...c,
              uScore: (1 - c.factorWinRate / 100) * 0.40
                    + (c.factorHome ? 1.0 : 0.3) * 0.35
                    + (1 - c.factorAvvDebole / 100) * 0.25
            }))
            .sort((a, b) => b.uScore - a.uScore);
          this.underdogDiGiornata = sorted[0];
        } else {
          const fallback = scored.filter(c => c.score < 45);
          this.underdogDiGiornata = fallback.length > 0 ? fallback[fallback.length - 1] : null;
        }

        this.loadingConsigli = false;
      },
      error: () => {
        this.loadingConsigli = false;
        this.consigli = [];
        this.underdogDiGiornata = null;
      }
    });
  }

  /** Colore del score: verde ≥70, giallo ≥45, rosso <45 */
  getScoreColor(score: number): string {
    if (score >= 70) return '#16A34A';
    if (score >= 45) return '#D97706';
    return '#DC2626';
  }

  /**
   * Restituisce la classe CSS per scalare il font del nome in base alla sua lunghezza.
   * Nomi corti (<= 15 car.) → dimensione normale.
   * Nomi medi (16-22 car.)  → leggermente ridotta (name-sm).
   * Nomi lunghi (> 22 car.) → ancora più ridotta (name-xs).
   */
  getNameClass(nome: string): string {
    const len = (nome || '').length;
    if (len > 22) return 'name-xs';
    if (len > 15) return 'name-sm';
    return '';
  }

  /**
   * Restituisce la classe CSS per scalare il font del testo "vs avversario".
   * Usata per evitare troncature eccessive su nomi lunghi.
   */
  getVsClass(nome: string): string {
    const len = (nome || '').length;
    if (len > 18) return 'vs-long';
    return '';
  }

}
