import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatRippleModule } from '@angular/material/core';
import { Lega, StatoLega } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';

interface LegaConGiocata {
  lega: Lega;
  logoUrl: string | null;
  sportEmoji: string;
  esitoClass: string;
  esitoLabel: string;
}

@Component({
  selector: 'app-giocata-recap-card',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatRippleModule],
  templateUrl: './giocata-recap-card.component.html',
  styleUrls: ['./giocata-recap-card.component.scss'],
})
export class GiocataRecapCardComponent implements OnChanges {
  @Input() leghe: Lega[] = [];

  legheAttive: LegaConGiocata[] = [];
  selectedIndex = 0;

  constructor(private router: Router, private logoService: TeamLogoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['leghe']) {
      this.buildLegheAttive();
    }
  }

  private buildLegheAttive(): void {
    if (!this.leghe?.length) {
      this.legheAttive = [];
      return;
    }

    this.legheAttive = this.leghe
      .filter(l => l.stato?.value === StatoLega.AVVIATA.value && l.giornataDaGiocare > 0)
      .map(l => ({
        lega: l,
        logoUrl: l.miaGiocataCorrente
          ? this.logoService.getLogoUrl(
              l.campionato?.sport?.id,
              l.campionato?.id,
              l.miaGiocataCorrente.squadraSigla
            )
          : null,
        sportEmoji: this.getSportEmoji(l.campionato?.sport?.id),
        ...this.getEsitoInfo(l.miaGiocataCorrente?.esito),
      }));

    // Seleziona di default la prima lega senza giocata (priorità all'azione)
    const noPickIdx = this.legheAttive.findIndex(l => !l.lega.miaGiocataCorrente);
    this.selectedIndex = noPickIdx >= 0 ? noPickIdx : 0;
  }

  get selected(): LegaConGiocata | null {
    return this.legheAttive[this.selectedIndex] ?? null;
  }

  selectLega(index: number): void {
    this.selectedIndex = index;
  }

  goToLega(): void {
    if (this.selected) {
      this.router.navigate(['/lega', this.selected.lega.id]);
    }
  }

  private getSportEmoji(sportId: string | undefined): string {
    if (sportId === 'CALCIO') return '⚽';
    if (sportId === 'BASKET') return '🏀';
    if (sportId === 'TENNIS') return '🎾';
    return '🏆';
  }

  private getEsitoInfo(esito: string | undefined): { esitoClass: string; esitoLabel: string } {
    switch (esito) {
      case 'VINTA':   return { esitoClass: 'win',  esitoLabel: 'WIN'  };
      case 'PERSA':   return { esitoClass: 'loss', esitoLabel: 'LOSS' };
      case 'IN_CORSO':return { esitoClass: 'live', esitoLabel: 'LIVE' };
      default:        return { esitoClass: 'wait', esitoLabel: 'IN ATTESA' };
    }
  }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }
}
