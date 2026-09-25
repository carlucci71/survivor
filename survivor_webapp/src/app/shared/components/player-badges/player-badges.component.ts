import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

interface BadgeDef {
  tier: 'duel' | 'survivor' | 'camp';
  count: number;
  stars: number;
  label: string;
}

/**
 * Badge storico giocatore: una medaglia per categoria (sfida 1v1, Survivor, Campionato),
 * sempre tutte visibili quando possedute — mai una sostituisce l'altra. Bronzo/argento/oro
 * segna la gerarchia di prestigio tra categorie (1v1 più frequente/rapido, Campionato più raro).
 * Una stella si aggiunge ogni 3 vittorie in quella categoria, senza mai far scomparire la medaglia.
 */
@Component({
  selector: 'app-player-badges',
  standalone: true,
  imports: [CommonModule, MatTooltipModule, TranslateModule],
  template: `
    <span class="player-badges" [class.player-badges--large]="size === 'large'" *ngIf="badges.length">
      <span class="pb-badge pb-badge--{{ badge.tier }}" *ngFor="let badge of badges" [matTooltip]="tooltipFor(badge)">
        <span class="pb-inner">
          <span *ngIf="badge.tier === 'duel'" class="pb-emoji">⚔️</span>
          <svg *ngIf="badge.tier === 'survivor'" class="pb-icon" width="10" height="10" viewBox="0 0 60 60" fill="none">
            <path d="M30 6 L50 14 V30 C50 44 40 52 30 56 C20 52 10 44 10 30 V14 Z" fill="rgba(255,255,255,0.18)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
          </svg>
          <svg *ngIf="badge.tier === 'camp'" class="pb-icon" width="10" height="10" viewBox="0 0 60 60" fill="none">
            <path d="M18 10 H42 V22 C42 32 36 38 30 38 C24 38 18 32 18 22 Z" fill="rgba(255,255,255,0.18)" stroke="#fff" stroke-width="5" stroke-linejoin="round"/>
            <line x1="30" y1="38" x2="30" y2="46" stroke="#fff" stroke-width="5"/>
            <rect x="20" y="46" width="20" height="6" rx="2" fill="#fff"/>
          </svg>
        </span>
        <span class="pb-count">&times;{{ badge.count }}</span>
        <svg *ngIf="badge.stars > 0" class="pb-star" width="9" height="9" viewBox="0 0 24 24">
          <path d="M12 2 L15 9 L22 10 L17 15 L18 22 L12 18 L6 22 L7 15 L2 10 L9 9 Z" fill="#FFD966"/>
        </svg>
      </span>
    </span>
  `,
  styles: [`
    .player-badges {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      flex-shrink: 0;
    }
    .pb-badge {
      position: relative;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      flex-shrink: 0;
      box-shadow: 0 1px 3px rgba(0,0,0,0.35);
      cursor: default;
    }
    .pb-badge--duel   { background: linear-gradient(150deg,#E8C4A0,#CD7F32 55%,#8B5A2B); }
    .pb-badge--survivor { background: linear-gradient(150deg,#F0F2F5,#C0C7D1 50%,#8E97A3); }
    .pb-badge--camp   { background: linear-gradient(150deg,#FFE9B0,#F9A825 55%,#B8791A); }
    .pb-inner {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pb-icon { filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35)); }
    .pb-emoji { font-size: 10px; line-height: 1; filter: drop-shadow(0 1px 1px rgba(0,0,0,0.35)); }
    .pb-count {
      position: absolute;
      bottom: -3px;
      right: -5px;
      background: #0A3D91;
      color: #fff;
      font-size: 7px;
      font-weight: 700;
      border: 1.2px solid #fff;
      border-radius: 6px;
      padding: 0 3px;
      line-height: 1.3;
    }
    .pb-star {
      position: absolute;
      top: -4px;
      left: -4px;
      filter: drop-shadow(0 0 2px rgba(249,168,37,0.9));
    }

    /* Versione grande: dialog trofei/profilo, non accanto a un nickname stretto */
    .player-badges--large {
      gap: 10px;
    }
    .player-badges--large .pb-badge {
      width: 40px;
      height: 40px;
    }
    .player-badges--large .pb-count {
      font-size: 10px;
      border-radius: 8px;
      padding: 1px 5px;
      bottom: -4px;
      right: -8px;
    }
    .player-badges--large .pb-star {
      width: 16px;
      height: 16px;
      top: -6px;
      left: -6px;
    }
    .player-badges--large .pb-icon {
      width: 20px;
      height: 20px;
    }
    .player-badges--large .pb-emoji {
      font-size: 20px;
    }
  `]
})
export class PlayerBadgesComponent {
  @Input() vittorie1v1: number | undefined | null = 0;
  @Input() vittorieSurvivor: number | undefined | null = 0;
  @Input() vittorieCampionato: number | undefined | null = 0;
  /** 'compact' (default, accanto al nickname) o 'large' (dialog trofei/profilo) */
  @Input() size: 'compact' | 'large' = 'compact';

  constructor(private translate: TranslateService) {}

  get badges(): BadgeDef[] {
    const result: BadgeDef[] = [];
    if ((this.vittorie1v1 ?? 0) > 0) {
      result.push({ tier: 'duel', count: this.vittorie1v1 ?? 0, stars: Math.floor((this.vittorie1v1 ?? 0) / 3), label: this.translate.instant('BADGE.DUELLO_1V1') });
    }
    if ((this.vittorieSurvivor ?? 0) > 0) {
      result.push({ tier: 'survivor', count: this.vittorieSurvivor ?? 0, stars: Math.floor((this.vittorieSurvivor ?? 0) / 3), label: this.translate.instant('BADGE.SURVIVOR') });
    }
    if ((this.vittorieCampionato ?? 0) > 0) {
      result.push({ tier: 'camp', count: this.vittorieCampionato ?? 0, stars: Math.floor((this.vittorieCampionato ?? 0) / 3), label: this.translate.instant('BADGE.CAMPIONATO') });
    }
    return result;
  }

  tooltipFor(badge: BadgeDef): string {
    const stars = badge.stars > 0 ? ' · ' + '★'.repeat(badge.stars) : '';
    return `${badge.label} · ×${badge.count}${stars}`;
  }
}
