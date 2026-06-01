import { Component, Input, Output, EventEmitter, OnChanges, OnInit, OnDestroy, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Lega, Giocata, StatoLega, StatoPartita } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';
import { TranslateLeagueDataPipe } from '../../pipes/translate-league-data.pipe';
import { TranslateModule } from '@ngx-translate/core';

interface ConfettiPiece {
  styles: { [key: string]: string };
  animClass: string;
  round: boolean;
}

interface LegaConGiocata {
  lega: Lega;
  logoUrl: string | null;
  torneoLogoUrl: string | null;
  sportEmoji: string;
  esitoClass: string;
  esitoLabel: string;
  animationState: 'win' | 'loss' | 'none';
  teamBgRaw: string | null;
  displayGiocata: Giocata | null;  // giocata corrente o ultima nota con esito
  displayGiornata: number;        // giornata assoluta della displayGiocata
  isLastResult: boolean;          // true = stiamo mostrando l'ultimo risultato passato (nessuna pick attiva)
}

@Component({
  selector: 'app-giocata-recap-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule, TranslateLeagueDataPipe, TranslateModule],
  templateUrl: './giocata-recap-card.component.html',
  styleUrls: ['./giocata-recap-card.component.scss'],
})
export class GiocataRecapCardComponent implements OnChanges, OnInit, OnDestroy {
  @Input() leghe: Lega[] = [];
  @Input() initialLegaId: number | null = null;
  @Output() refreshRequired = new EventEmitter<void>();

  legheAttive: LegaConGiocata[] = [];
  selectedIndex = 0;
  isProd = environment.production;

  // Flash overlay: aggiunto/rimosso dal DOM via @if → l'animazione CSS parte sempre
  showFlash = false;
  flashType: 'win' | 'loss' | null = null;
  confettiPieces: ConfettiPiece[] = [];

  // IDs delle leghe già animate in questa sessione
  private shownAnimations = new Set<number>();
  // Ultima giocata con esito per ciascuna lega — persistita in localStorage
  private lastKnownGiocata = new Map<number, Giocata>();
  private readonly LAST_KNOWN_KEY = 'survivor_last_known_giocata';
  private refreshInterval: any;
  private flashTimeout: any;

  // ─── Mappa colori sociali squadre ────────────────────────────────────────
  private readonly teamColors: { [key: string]: { primary: string; secondary: string } } = {
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
    'DEFAULT':    { primary: '#0A3D91', secondary: '#4FC3F7' },
  };

  constructor(
    private router: Router,
    private logoService: TeamLogoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    // Carica la cache dal localStorage per mostrare il risultato precedente anche dopo un refresh
    try {
      const raw = localStorage.getItem(this.LAST_KNOWN_KEY);
      if (raw) {
        const parsed: [number, Giocata][] = JSON.parse(raw);
        this.lastKnownGiocata = new Map(parsed);
      }
    } catch { /* ignora errori di parsing */ }

    this.refreshInterval = setInterval(() => {
      const needsRefresh = this.legheAttive.some(item => {
        const esito = item.lega.miaGiocataCorrente?.esito;
        return !!item.lega.miaGiocataCorrente && esito !== 'OK' && esito !== 'KO';
      });
      if (needsRefresh) this.refreshRequired.emit();
    }, 60000);
  }

  ngOnDestroy(): void {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    if (this.flashTimeout) clearTimeout(this.flashTimeout);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leghe']) this.buildLegheAttive();
  }

  private buildLegheAttive(): void {
    if (!this.leghe?.length) {
      this.legheAttive = [];
      return;
    }

    const selectedLegaId = this.legheAttive[this.selectedIndex]?.lega.id;
    const toAnimate: { legaId: number; state: 'win' | 'loss' }[] = [];

    const newList = this.leghe
      .filter(l => {
        const statoVal = l.stato?.value;
        const isAttiva = statoVal === StatoLega.AVVIATA.value || statoVal === StatoLega.DA_AVVIARE.value;
        if (isAttiva) {
          return l.giornataDaGiocare > 0 ||
            l.miaGiocataCorrente?.esito === 'KO' ||
            this.lastKnownGiocata.has(l.id ?? 0) ||
            !!l.miaUltimaGiocataConEsito;
        }
        return false;
      })
      .map(l => {
        const legaId = l.id ?? 0;
        const mia = l.miaGiocataCorrente;
        const esitoMia = mia?.esito;

        // Aggiorna la cache ogni volta che arriva un risultato definitivo
        if (mia && (esitoMia === 'OK' || esitoMia === 'KO')) {
          this.lastKnownGiocata.set(legaId, mia);
          this.saveLastKnownCache();
        }
        // Il backend fornisce direttamente l'ultima giocata con esito quando mia è null:
        // usiamola per aggiornare la cache così le animazioni win/loss funzionano anche
        // al primo load dopo il calcolo della giornata.
        if (!mia && l.miaUltimaGiocataConEsito) {
          this.lastKnownGiocata.set(legaId, l.miaUltimaGiocataConEsito);
          this.saveLastKnownCache();
        }

        // La giocata da visualizzare: corrente se esiste, altrimenti l'ultima nota dalla cache
        const displayGiocata: Giocata | null = mia ?? this.lastKnownGiocata.get(legaId) ?? null;
        // isLastResult = true solo se il prossimo round è già iniziato (IN_CORSO/TERMINATA).
        // Se il round corrente è DA_GIOCARE (non ancora partito), trattiamo la pick precedente
        // come "attiva" così la home mostra la scelta effettuata invece di "Gioca Ora".
        const isLastResult = !mia && !!displayGiocata
          && l.statoGiornataCorrente?.value !== StatoPartita.DA_GIOCARE.value;
        const displayEsito = displayGiocata?.esito;

        // Giornata assoluta da mostrare sul badge
        const displayGiornata = displayGiocata?.giornata != null
          ? displayGiocata.giornata + (l.giornataIniziale ?? 1) - 1
          : l.giornataDaGiocare;

        const isDaAvviare = l.stato?.value === StatoLega.DA_AVVIARE.value;
        let animationState: 'win' | 'loss' | 'none' = 'none';
        if (!isDaAvviare) {
          if (this.shownAnimations.has(legaId)) {
            if (displayEsito === 'OK') animationState = 'win';
            else if (displayEsito === 'KO') animationState = 'loss';
          } else if (displayEsito === 'OK' || displayEsito === 'KO') {
            toAnimate.push({ legaId, state: displayEsito === 'OK' ? 'win' : 'loss' });
            this.shownAnimations.add(legaId);
          }
        }

        return {
          lega: l,
          displayGiocata,
          isLastResult,
          displayGiornata,
          logoUrl: displayGiocata
            ? this.logoService.getLogoUrl(l.campionato?.sport?.id, l.campionato?.id, displayGiocata.squadraSigla)
            : null,
          torneoLogoUrl: this.getTorneoLogoUrl(l.campionato?.id),
          sportEmoji: this.getSportEmoji(l.campionato?.sport?.id),
          // Per LIVE usiamo mia (non la cache), cosi non mostriamo LIVE sul vecchio risultato
          ...this.getEsitoInfo(displayEsito, isLastResult ? undefined : l),
          animationState,
          teamBgRaw: displayGiocata ? this.buildTeamBgRaw(l, displayGiocata) : null,
        };
      });

    this.legheAttive = newList;

    if (toAnimate.length > 0) {
      const firstIdx = newList.findIndex(l => (l.lega.id ?? 0) === toAnimate[0].legaId);
      if (firstIdx >= 0) this.selectedIndex = firstIdx;
    } else if (this.initialLegaId != null) {
      const initialIdx = this.legheAttive.findIndex(l => l.lega.id === this.initialLegaId);
      if (initialIdx >= 0) this.selectedIndex = initialIdx;
      this.initialLegaId = null; // usa solo al primo caricamento
    } else if (selectedLegaId !== undefined) {
      const preserved = this.legheAttive.findIndex(l => l.lega.id === selectedLegaId);
      if (preserved >= 0) this.selectedIndex = preserved;
    } else {
      const noPickIdx = this.legheAttive.findIndex(l => !l.lega.miaGiocataCorrente);
      this.selectedIndex = noPickIdx >= 0 ? noPickIdx : 0;
    }

    if (toAnimate.length > 0) {
      // 80ms: Angular ha già renderizzato il DOM con animationState='none'.
      // Ora impostiamo il colore permanente E mostriamo il flash.
      // Il flash è un elemento NUOVO inserito via @if → l'animation CSS parte garantita.
      setTimeout(() => {
        toAnimate.forEach(({ legaId, state }) => {
          const idx = this.legheAttive.findIndex(item => (item.lega.id ?? 0) === legaId);
          if (idx >= 0) {
            this.legheAttive[idx] = { ...this.legheAttive[idx], animationState: state };
          }
        });
        this.legheAttive = [...this.legheAttive];
        this.generateConfetti(toAnimate[0].state);
        this.showFlash = true;
        this.flashType = toAnimate[0].state;
        this.cdr.detectChanges();

        // Rimuovi il flash dal DOM dopo che tutti i coriandoli sono finiti
        if (this.flashTimeout) clearTimeout(this.flashTimeout);
        this.flashTimeout = setTimeout(() => {
          this.showFlash = false;
          this.cdr.detectChanges();
        }, toAnimate[0].state === 'loss' ? 6000 : 3200);
      }, 80);
    }
  }

  get selected(): LegaConGiocata | null {
    return this.legheAttive[this.selectedIndex] ?? null;
  }

  selectLega(index: number): void {
    this.selectedIndex = index;
  }

  testFlash(type: 'win' | 'loss'): void {
    if (this.legheAttive.length > 0) {
      this.legheAttive[this.selectedIndex] = { ...this.legheAttive[this.selectedIndex], animationState: type };
      this.legheAttive = [...this.legheAttive];
    }
    this.generateConfetti(type);
    this.showFlash = true;
    this.flashType = type;
    this.cdr.detectChanges();
    if (this.flashTimeout) clearTimeout(this.flashTimeout);
    this.flashTimeout = setTimeout(() => {
      this.showFlash = false;
      this.cdr.detectChanges();
    }, type === 'loss' ? 6000 : 3200);
  }

  goToLega(): void {
    if (this.selected) this.router.navigate(['/lega', this.selected.lega.id]);
  }

  private getTorneoLogoUrl(campionatoId: string | undefined): string | null {
    if (!campionatoId) return null;
    const map: Record<string, string> = {
      'SERIE_A':       'assets/logos/calcio/tornei/serie_A.png',
      'SERIE_B':       'assets/logos/calcio/tornei/serie_b.png',
      'LIGA':          'assets/logos/calcio/tornei/liga.png',
      'MONDIALI_2026': 'assets/logos/calcio/tornei/mondiali.jpg',
      'NBA_RS':        'assets/logos/basket/tornei/NBA.png',
      'AUS_OPEN':      'assets/logos/tennis/tornei/Australian Open.png',
      'ROLAND_GARROS': 'assets/logos/tennis/tornei/Roland Garros.png',
      'US_OPEN':       'assets/logos/tennis/tornei/US Open.png',
      'WIMBLEDON':     'assets/logos/tennis/tornei/wimbledon.png',
    };
    return map[campionatoId] || null;
  }

  private getSportEmoji(sportId: string | undefined): string {
    if (sportId === 'CALCIO') return '⚽';
    if (sportId === 'BASKET') return '🏀';
    if (sportId === 'TENNIS') return '🎾';
    return '🏆';
  }

  private getEsitoInfo(esito: string | undefined, lega?: Lega): { esitoClass: string; esitoLabel: string } {
    if (esito === 'OK') return { esitoClass: 'win',  esitoLabel: 'WIN'  };
    if (esito === 'KO') return { esitoClass: 'loss', esitoLabel: 'LOSS' };
    if (lega?.miaGiocataCorrente && lega.statoGiornataCorrente?.value === 'IN_CORSO') {
      return { esitoClass: 'live', esitoLabel: 'LIVE' };
    }
    return { esitoClass: 'wait', esitoLabel: 'IN ATTESA' };
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  private saveLastKnownCache(): void {
    try {
      localStorage.setItem(this.LAST_KNOWN_KEY, JSON.stringify([...this.lastKnownGiocata.entries()]));
    } catch { /* ignora errori di storage */ }
  }

  private generateConfetti(type: 'win' | 'loss'): void {
    const winColors  = ['#FFD700','#69F0AE','#FF6EC7','#4FC3F7','#FFB300','#E040FB','#76FF03','#FF8C00','#FFFFFF','#FF9800'];
    const ashColors  = ['#2a2a2a','#3d3d3d','#1a1a1a','#444444','#505050','#222222'];
    const colors = type === 'win' ? winColors : ashColors;
    const count  = type === 'win' ? 36 : 18;
    this.confettiPieces = Array.from({ length: count }, (_, i) => {
      const x     = 3 + Math.random() * 94;
      const w     = type === 'loss' ? Math.round(3 + Math.random() * 5) : Math.round(8 + Math.random() * 8);
      const h     = type === 'loss' ? Math.round(2 + Math.random() * 4) : Math.round(5 + Math.random() * 7);
      const color = colors[i % colors.length];
      const round = Math.random() > 0.5;
      const animClass = type === 'loss' ? `ash-v${i % 5}` : `cf-v${i % 10}`;
      return {
        round,
        animClass,
        styles: {
          left:       `${x.toFixed(1)}%`,
          width:      `${round ? w : w * 2}px`,
          height:     `${h}px`,
          background: color,
        },
      };
    });
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const m = /^#([0-9A-Fa-f]{6})$/.exec(hex);
    if (!m) return null;
    return {
      r: parseInt(m[1].slice(0, 2), 16),
      g: parseInt(m[1].slice(2, 4), 16),
      b: parseInt(m[1].slice(4, 6), 16),
    };
  }

  private buildTeamBgRaw(lega: Lega, giocata: Giocata): string {
    const sigla   = giocata.squadraSigla ?? '';
    const sportId = lega.campionato?.sport?.id ?? '';
    const campId  = lega.campionato?.id ?? '';
    const colors =
      this.teamColors[`${campId}_${sigla}`] ??
      this.teamColors[`${sportId}_${sigla}`] ??
      this.teamColors[sigla] ??
      this.teamColors['DEFAULT'];
    // Colori sociali reali come base, dark scrim sopra per leggibilità del testo bianco
    const scrim = `linear-gradient(160deg, rgba(0,0,0,0.42) 0%, rgba(0,0,0,0.20) 50%, rgba(0,0,0,0.45) 100%)`;
    const team  = `linear-gradient(135deg, ${colors.primary} 0%, ${colors.secondary} 100%)`;
    return `${scrim}, ${team}`;
  }

}

