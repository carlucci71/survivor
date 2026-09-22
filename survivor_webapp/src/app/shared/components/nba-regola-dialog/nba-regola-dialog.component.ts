import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

const STORAGE_KEY = 'nba_regola_vista';

/**
 * Spiega come si decide una settimana NBA (bilancio vittorie-sconfitte, poi differenza punti).
 * L'animazione e' solo CSS: una riga di partite che compaiono, il conteggio, la parita' e il verdetto.
 */
@Component({
  selector: 'app-nba-regola-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  template: `
    <div class="nba-dialog">
      <div class="nba-header">
        <mat-icon class="nba-header-icon">sports_basketball</mat-icon>
        <h2 class="nba-title">{{ 'NBA_RULE.TITLE' | translate }}</h2>
        <button class="nba-close" (click)="dialogRef.close()" [attr.aria-label]="'COMMON.CLOSE' | translate">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="nba-body">
        <p class="nba-intro">{{ 'NBA_RULE.INTRO' | translate }}</p>

        @if (playing) {
        <div class="nba-scene">
          <div class="nba-scene-label">{{ 'NBA_RULE.EXAMPLE' | translate }}</div>

          <div class="nba-games">
            @for (g of games; track $index) {
            <div class="nba-game" [class.nba-game--win]="g.win" [class.nba-game--loss]="!g.win"
                 [style.animation-delay]="(0.3 + $index * 0.7) + 's'">
              <span class="nba-game-tag">{{ (g.win ? 'NBA_RULE.WIN_SHORT' : 'NBA_RULE.LOSS_SHORT') | translate }}</span>
              <span class="nba-game-diff">{{ g.diff > 0 ? '+' : '' }}{{ g.diff }}</span>
            </div>
            }
          </div>

          <div class="nba-count">
            <span class="nba-count-item">{{ 'NBA_RULE.WINS' | translate }} <strong>2</strong></span>
            <span class="nba-count-sep">-</span>
            <span class="nba-count-item">{{ 'NBA_RULE.LOSSES' | translate }} <strong>2</strong></span>
            <span class="nba-tie">{{ 'NBA_RULE.TIE' | translate }}</span>
          </div>

          <div class="nba-diff">
            <span class="nba-diff-label">{{ 'NBA_RULE.DIFF' | translate }}</span>
            <span class="nba-diff-sum">+10 -3 +6 -8 = <strong>+5</strong></span>
          </div>

          <div class="nba-verdict">
            <mat-icon>check_circle</mat-icon>
            <span>{{ 'NBA_RULE.VERDICT' | translate }}</span>
          </div>
        </div>
        }

        <button class="nba-replay" (click)="replay()">
          <mat-icon>replay</mat-icon>
          {{ 'NBA_RULE.REPLAY' | translate }}
        </button>

        <ol class="nba-steps">
          <li>
            <strong>{{ 'NBA_RULE.STEP1_TITLE' | translate }}</strong>
            <span>{{ 'NBA_RULE.STEP1_TEXT' | translate }}</span>
          </li>
          <li>
            <strong>{{ 'NBA_RULE.STEP2_TITLE' | translate }}</strong>
            <span>{{ 'NBA_RULE.STEP2_TEXT' | translate }}</span>
          </li>
          <li>
            <strong>{{ 'NBA_RULE.STEP3_TITLE' | translate }}</strong>
            <span>{{ 'NBA_RULE.STEP3_TEXT' | translate }}</span>
          </li>
        </ol>

        <p class="nba-note"><mat-icon>schedule</mat-icon>{{ 'NBA_RULE.WAIT_NOTE' | translate }}</p>
        <p class="nba-note"><mat-icon>favorite</mat-icon>{{ 'NBA_RULE.SURVIVOR_LIFE_NOTE' | translate }}</p>
        <p class="nba-note"><mat-icon>leaderboard</mat-icon>{{ 'NBA_RULE.CAMPIONATO_NOTE' | translate }}</p>
      </div>

      <div class="nba-footer">
        <button class="nba-ok" (click)="dialogRef.close()">{{ 'NBA_RULE.GOT_IT' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    .nba-dialog {
      display: flex;
      flex-direction: column;
      max-height: 88vh;
      background: var(--bg-card);
      color: var(--text-primary);
      border-radius: 20px;
      overflow: hidden;
    }
    .nba-header {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 14px 16px;
      background: var(--gradient-primary);
      color: var(--text-on-primary);
    }
    .nba-header-icon { flex-shrink: 0; }
    .nba-title {
      flex: 1;
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      line-height: 1.25;
    }
    .nba-close {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 34px;
      height: 34px;
      border: none;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.18);
      color: inherit;
      cursor: pointer;
    }
    .nba-body {
      padding: 16px;
      overflow-y: auto;
    }
    .nba-intro {
      margin: 0 0 14px;
      font-size: 0.92rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }

    /* Scena animata */
    .nba-scene {
      padding: 14px 12px;
      border: 1px solid var(--border-color);
      border-radius: 16px;
      background: rgba(10, 61, 145, 0.04);
    }
    .nba-scene-label {
      margin-bottom: 10px;
      font-size: 0.78rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
    }
    .nba-games {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }
    .nba-game {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 8px 4px;
      border-radius: 12px;
      border: 2px solid transparent;
      opacity: 0;
      transform: scale(0.6);
      animation: nba-pop 0.45s cubic-bezier(0.2, 0.9, 0.3, 1.3) forwards;
    }
    .nba-game--win {
      background: rgba(67, 160, 71, 0.14);
      border-color: var(--success-color);
      color: var(--success-color);
    }
    .nba-game--loss {
      background: rgba(229, 57, 53, 0.12);
      border-color: var(--error-color);
      color: var(--error-color);
    }
    .nba-game-tag { font-size: 1.1rem; font-weight: 800; }
    .nba-game-diff { font-size: 0.82rem; font-weight: 700; }

    .nba-count {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 14px;
      font-size: 0.9rem;
      opacity: 0;
      animation: nba-fade 0.4s ease forwards;
      animation-delay: 3.3s;
    }
    .nba-count strong { font-size: 1.15rem; }
    .nba-tie {
      padding: 2px 10px;
      border-radius: 999px;
      background: var(--warning-color);
      color: #fff;
      font-weight: 800;
      font-size: 0.82rem;
      opacity: 0;
      animation: nba-pop 0.4s cubic-bezier(0.2, 0.9, 0.3, 1.3) forwards;
      animation-delay: 3.8s;
    }

    .nba-diff {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      margin-top: 12px;
      opacity: 0;
      animation: nba-fade 0.4s ease forwards;
      animation-delay: 4.7s;
    }
    .nba-diff-label {
      font-size: 0.75rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      color: var(--text-secondary);
    }
    .nba-diff-sum { font-size: 1rem; }
    .nba-diff-sum strong { color: var(--success-color); font-size: 1.2rem; }

    .nba-verdict {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      margin-top: 14px;
      padding: 10px 12px;
      border-radius: 12px;
      background: var(--success-color);
      color: #fff;
      font-weight: 800;
      opacity: 0;
      transform: scale(0.8);
      animation: nba-pop 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.3) forwards;
      animation-delay: 5.9s;
    }

    .nba-replay {
      display: flex;
      align-items: center;
      gap: 6px;
      margin: 10px auto 4px;
      padding: 6px 14px;
      border: 1px solid var(--border-color);
      border-radius: 999px;
      background: var(--bg-card);
      color: var(--text-secondary);
      font-size: 0.82rem;
      font-weight: 600;
      cursor: pointer;
    }
    .nba-replay mat-icon { font-size: 18px; width: 18px; height: 18px; }

    .nba-steps {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 12px 0;
      padding: 0;
      list-style: none;
    }
    .nba-steps li {
      display: flex;
      flex-direction: column;
      gap: 2px;
      padding: 10px 12px;
      border-left: 3px solid var(--primary-color);
      border-radius: 4px 12px 12px 4px;
      background: rgba(10, 61, 145, 0.04);
    }
    .nba-steps strong { font-size: 0.9rem; }
    .nba-steps span { font-size: 0.84rem; color: var(--text-secondary); line-height: 1.4; }

    .nba-note {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      margin: 8px 0 0;
      font-size: 0.8rem;
      color: var(--text-secondary);
      line-height: 1.4;
    }
    .nba-note mat-icon { flex-shrink: 0; font-size: 18px; width: 18px; height: 18px; color: var(--primary-dark); }

    .nba-footer {
      padding: 12px 16px 16px;
      border-top: 1px solid var(--border-color);
    }
    .nba-ok {
      width: 100%;
      padding: 12px;
      border: none;
      border-radius: 14px;
      background: var(--gradient-primary);
      color: var(--text-on-primary);
      font-size: 0.95rem;
      font-weight: 700;
      cursor: pointer;
    }

    @keyframes nba-pop {
      from { opacity: 0; transform: scale(0.6); }
      to { opacity: 1; transform: scale(1); }
    }
    @keyframes nba-fade {
      from { opacity: 0; transform: translateY(6px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (prefers-reduced-motion: reduce) {
      .nba-game, .nba-count, .nba-tie, .nba-diff, .nba-verdict {
        animation: none;
        opacity: 1;
        transform: none;
      }
    }
  `]
})
export class NbaRegolaDialogComponent {
  /** Esempio mostrato nell'animazione: 2 vittorie, 2 sconfitte, differenza punti +5. */
  readonly games = [
    { win: true, diff: 10 },
    { win: false, diff: -3 },
    { win: true, diff: 6 },
    { win: false, diff: -8 },
  ];

  playing = true;

  constructor(public dialogRef: MatDialogRef<NbaRegolaDialogComponent>) {
    NbaRegolaDialogComponent.segnaVista();
  }

  /** Riavvia l'animazione: ricrea la scena cosi' i keyframe ripartono da zero. */
  replay(): void {
    this.playing = false;
    setTimeout(() => (this.playing = true), 50);
  }

  static giaVista(): boolean {
    try {
      return localStorage.getItem(STORAGE_KEY) === '1';
    } catch {
      return false;
    }
  }

  private static segnaVista(): void {
    try {
      localStorage.setItem(STORAGE_KEY, '1');
    } catch {
      // storage non disponibile: l'avviso comparira' di nuovo, non e' un problema
    }
  }
}
