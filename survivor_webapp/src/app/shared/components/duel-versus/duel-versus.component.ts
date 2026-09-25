import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Giocatore, StatoGiocatore } from '../../../core/models/interfaces.model';

interface DuelSide {
  nickname: string;
  initial: string;
  isMe: boolean;
  out: boolean;
  crown: boolean;
  vite: number | null;
}

/**
 * Scheda "testa a testa" delle sfide 1v1: sostituisce i filtri Tutti/In gara/Eliminati
 * (inutili con due soli giocatori). Sempre in palette bronzo, come il resto del tema duello.
 */
@Component({
  selector: 'app-duel-versus',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  template: `
    <div class="dv">
      <div class="dv-side dv-side--left" *ngIf="left as p" [class.dv-out]="p.out" [class.dv-me]="p.isMe">
        <div class="dv-avatar">{{ p.initial }}<span class="dv-crown" *ngIf="p.crown">👑</span></div>
        <div class="dv-name">{{ p.nickname }}</div>
        <div class="dv-status" [class.dv-status--out]="p.out">
          <span class="dv-dot"></span>
          {{ (p.out ? 'DUEL.OUT' : 'LEAGUE.IN_GAME') | translate }}
          <span class="dv-lives" *ngIf="p.vite !== null && !p.out">❤️ {{ p.vite }}</span>
        </div>
      </div>

      <div class="dv-vs">
        <span class="dv-swords">⚔️</span>
        <span class="dv-vs-text">VS</span>
      </div>

      <div class="dv-side dv-side--right" *ngIf="right as p; else waiting" [class.dv-out]="p.out" [class.dv-me]="p.isMe">
        <div class="dv-avatar">{{ p.initial }}<span class="dv-crown" *ngIf="p.crown">👑</span></div>
        <div class="dv-name">{{ p.nickname }}</div>
        <div class="dv-status" [class.dv-status--out]="p.out">
          <span class="dv-dot"></span>
          {{ (p.out ? 'DUEL.OUT' : 'LEAGUE.IN_GAME') | translate }}
          <span class="dv-lives" *ngIf="p.vite !== null && !p.out">❤️ {{ p.vite }}</span>
        </div>
      </div>

      <ng-template #waiting>
        <div class="dv-side dv-side--right dv-empty">
          <div class="dv-avatar dv-avatar--empty">?</div>
          <div class="dv-name dv-name--empty">
            <span class="dv-hand" aria-hidden="true">
              <span class="dv-finger dv-finger--1"></span>
              <span class="dv-finger dv-finger--2"></span>
              <span class="dv-finger dv-finger--3"></span>
              <span class="dv-finger dv-finger--4"></span>
            </span>
          </div>
          <div class="dv-status dv-status--wait">{{ 'DUEL.WAITING_OPPONENT' | translate }}</div>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; max-width: 520px; margin: 4px auto 8px; }

    .dv {
      position: relative;
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      gap: 6px;
      padding: 16px 10px 14px;
      border-radius: 18px;
      background: linear-gradient(135deg, rgba(11, 95, 115,0.08), rgba(20, 163, 184,0.14));
      border: 1px solid rgba(20, 163, 184,0.35);
      box-shadow: 0 6px 20px rgba(11, 95, 115,0.12);
      overflow: hidden;
    }
    .dv::before {
      content: '';
      position: absolute;
      inset: 0;
      background: radial-gradient(circle at 50% 50%, rgba(155, 231, 238,0.35), transparent 60%);
      pointer-events: none;
    }

    .dv-side {
      position: relative;
      min-width: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      text-align: center;
      transition: filter 0.4s ease, opacity 0.4s ease;
    }
    .dv-side--left  { animation: dv-in-l 0.65s cubic-bezier(0.22, 1.2, 0.36, 1) both; }
    .dv-side--right { animation: dv-in-r 0.65s cubic-bezier(0.22, 1.2, 0.36, 1) 0.1s both; }

    .dv-avatar {
      position: relative;
      width: 54px;
      height: 54px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.4rem;
      font-weight: 800;
      color: #fff;
      text-transform: uppercase;
      background: linear-gradient(150deg, #9BE7EE, #14A3B8 55%, #0B5F73);
      border: 2px solid rgba(255,255,255,0.7);
      box-shadow: 0 4px 12px rgba(11, 95, 115,0.35);
    }
    .dv-me .dv-avatar { box-shadow: 0 0 0 3px rgba(20, 163, 184,0.35), 0 4px 12px rgba(11, 95, 115,0.35); }
    .dv-avatar--empty {
      background: transparent;
      color: #14A3B8;
      border: 2px dashed rgba(20, 163, 184,0.6);
      box-shadow: none;
      animation: dv-breathe 2s ease-in-out infinite;
    }
    .dv-crown { position: absolute; top: -14px; right: -6px; font-size: 1.1rem; transform: rotate(18deg); }

    .dv-name {
      max-width: 100%;
      font-size: 0.95rem;
      font-weight: 800;
      color: #0B5F73;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .dv-name--empty { height: 18px; display: flex; align-items: flex-end; }

    .dv-status {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 2px 9px;
      border-radius: 20px;
      font-size: 0.66rem;
      font-weight: 700;
      color: #059669;
      background: rgba(16,185,129,0.12);
      white-space: nowrap;
      max-width: 100%;
    }
    .dv-dot { width: 6px; height: 6px; border-radius: 50%; background: #10B981; animation: dv-pulse 1.8s ease-in-out infinite; }
    .dv-status--out { color: #B91C1C; background: rgba(239,68,68,0.12); }
    .dv-status--out .dv-dot { background: #EF4444; animation: none; }
    .dv-status--wait { color: #0B5F73; background: rgba(20, 163, 184,0.14); white-space: normal; line-height: 1.25; }
    .dv-lives { font-size: 0.66rem; }

    .dv-out { filter: grayscale(0.85); opacity: 0.7; }
    .dv-out .dv-name { text-decoration: line-through; }

    .dv-vs {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
    }
    .dv-swords {
      font-size: 1.7rem;
      line-height: 1;
      filter: drop-shadow(0 2px 4px rgba(11, 95, 115,0.4));
      animation: dv-clash 3.2s ease-in-out 0.7s infinite;
    }
    .dv-vs-text {
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 1.5px;
      color: #0B5F73;
      animation: dv-pulse 1.6s ease-in-out infinite;
    }

    .dv-hand { display: flex; align-items: flex-end; gap: 2px; height: 14px; }
    .dv-finger {
      width: 4px;
      border-radius: 2px 2px 1px 1px;
      background: linear-gradient(180deg, #9BE7EE, #14A3B8);
      animation: dv-tap 1.1s ease-in-out infinite;
    }
    .dv-finger--1 { height: 8px;  animation-delay: 0s; }
    .dv-finger--2 { height: 11px; animation-delay: 0.12s; }
    .dv-finger--3 { height: 13px; animation-delay: 0.24s; }
    .dv-finger--4 { height: 10px; animation-delay: 0.36s; }

    @keyframes dv-in-l { from { opacity: 0; transform: translateX(-40px); } to { opacity: 1; transform: translateX(0); } }
    @keyframes dv-in-r { from { opacity: 0; transform: translateX(40px); }  to { opacity: 1; transform: translateX(0); } }
    @keyframes dv-clash {
      0%, 70%, 100% { transform: scale(1) rotate(0deg); }
      78% { transform: scale(1.35) rotate(-8deg); }
      86% { transform: scale(1.15) rotate(6deg); }
    }
    @keyframes dv-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
    @keyframes dv-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.06); } }
    @keyframes dv-tap { 0%, 60%, 100% { transform: translateY(0); } 30% { transform: translateY(3px); } }

    @media (max-width: 380px) {
      .dv { padding: 14px 6px 12px; }
      .dv-avatar { width: 46px; height: 46px; font-size: 1.2rem; }
      .dv-name { font-size: 0.85rem; }
      .dv-swords { font-size: 1.4rem; }
    }
    @media (prefers-reduced-motion: reduce) {
      .dv-side, .dv-swords, .dv-vs-text, .dv-dot, .dv-avatar--empty, .dv-finger { animation: none; }
    }
  `]
})
export class DuelVersusComponent {
  @Input() giocatori: Giocatore[] = [];
  @Input() legaId = 0;
  @Input() myUserId: number | undefined | null;
  @Input() terminata = false;
  @Input() viteIniziali: number | undefined | null;

  private get sides(): DuelSide[] {
    const list = (this.giocatori ?? []).map((g): DuelSide => {
      const out = g.statiPerLega?.[this.legaId]?.value === StatoGiocatore.ELIMINATO.value;
      const vite = this.viteIniziali && this.viteIniziali > 1
        ? (g.vitePerLega?.[this.legaId] ?? this.viteIniziali)
        : null;
      return {
        nickname: g.nickname,
        initial: (g.nickname || '?').charAt(0),
        isMe: !!this.myUserId && g.user?.id === this.myUserId,
        out,
        crown: this.terminata && !out,
        vite,
      };
    });
    // Io sempre a sinistra
    return list.sort((a, b) => Number(b.isMe) - Number(a.isMe));
  }

  get left(): DuelSide | null { return this.sides[0] ?? null; }
  get right(): DuelSide | null { return this.sides[1] ?? null; }
}
