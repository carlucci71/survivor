import { Component, Optional } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export type SceltaNuovaLega = 'sfida' | 'crea' | 'unisciti';

/**
 * Pannello "Nuove leghe" aperto dal "+" della home: le tre card di prima (Sfida lampo con la
 * moneta 1v1 animata, Crea lega, Unisciti). Su telefono sale dal basso (MatBottomSheet, si chiude
 * anche trascinandolo giu'), su desktop e' una finestra centrata (MatDialog): stesso componente.
 * Restituisce la scelta; la navigazione la fa la home.
 */
@Component({
  selector: 'app-nuova-lega-sheet',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  template: `
    <div class="nl-sheet" [style.transform]="trascinamento ? 'translateY(' + trascinamento + 'px)' : null"
         [class.nl-sheet--drag]="trascinando">
      <div class="nl-grab-area"
           (touchstart)="inizioTocco($event)" (touchmove)="muoviTocco($event)" (touchend)="fineTocco()">
        <span class="nl-grab" aria-hidden="true"></span>
        <h2 class="nl-title">{{ 'HOME.NEW_LEAGUES' | translate }}</h2>
      </div>

      <div class="nl-tiles">
        <button type="button" class="nl-tile nl-tile--duel" [class.duel-seal--clicked]="sfidaAnimating" (click)="scegliSfida()">
          <span class="duel-seal-coin">
            <span class="duel-seal-halo"></span>
            <span class="duel-seal-disc" aria-hidden="true">
              <span class="duel-seal-layer" style="--z:-3px"></span>
              <span class="duel-seal-layer" style="--z:-2px"></span>
              <span class="duel-seal-layer" style="--z:-1px"></span>
              <span class="duel-seal-layer" style="--z:0px"></span>
              <span class="duel-seal-layer" style="--z:1px"></span>
              <span class="duel-seal-layer" style="--z:2px"></span>
              <span class="duel-seal-layer" style="--z:3px"></span>
              <span class="duel-seal-face duel-seal-face--front"><span class="duel-seal-text">1v1</span></span>
              <span class="duel-seal-face duel-seal-face--back">⚔️</span>
            </span>
          </span>
          <span class="nl-tile-title">{{ 'DUEL.QUICK_LABEL' | translate }}</span>
          <span class="nl-tile-sub">{{ 'DUEL.CARD_TITLE' | translate }}</span>
        </button>
        <button type="button" class="nl-tile nl-tile--crea" (click)="chiudi('crea')">
          <mat-icon class="nl-icon">add_circle</mat-icon>
          <span class="nl-tile-title">{{ 'HOME.CREATE_LEAGUE' | translate }}</span>
          <span class="nl-tile-sub">{{ 'HOME.TILE_CREATE_SUB' | translate }}</span>
        </button>
        <button type="button" class="nl-tile nl-tile--unisciti" (click)="chiudi('unisciti')">
          <mat-icon class="nl-icon">groups</mat-icon>
          <span class="nl-tile-title">{{ 'HOME.JOIN_LEAGUE' | translate }}</span>
          <span class="nl-tile-sub">{{ 'HOME.TILE_JOIN_SUB' | translate }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; }

    .nl-sheet {
      padding: 8px 16px calc(20px + env(safe-area-inset-bottom, 0px));
      font-family: var(--font-family);
      transition: transform 0.2s ease;

      &--drag { transition: none; }
    }

    .nl-grab-area { padding: 4px 0 14px; touch-action: none; }

    .nl-grab {
      display: block;
      width: 42px;
      height: 5px;
      margin: 0 auto 14px;
      border-radius: 3px;
      background: var(--border-hover);
    }

    .nl-title {
      margin: 0;
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--primary-dark);
    }

    .nl-tiles {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
    }

    .nl-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 16px 6px 14px;
      border: 1px solid var(--border-color);
      border-radius: 18px;
      background: var(--bg-card);
      box-shadow: var(--card-shadow);
      font-family: 'Poppins', sans-serif;
      text-align: center;
      cursor: pointer;
      transition: transform var(--transition-fast), box-shadow var(--transition-normal);

      &:hover { transform: translateY(-2px); box-shadow: var(--card-hover-shadow); }
      &:active { transform: translateY(0) scale(0.98); }
    }

    /* Un colore tenue per card: sfida = ambra/bronzo (come la moneta 1v1), crea = blu dell'app
       (--primary-dark), unisciti = grigio perla neutro */
    .nl-tile--duel {
      border-color: rgba(205, 127, 50, 0.4);
      background: linear-gradient(180deg, #FFF6EA, #FBE7CF);
    }

    .nl-tile--crea {
      border-color: rgba(10, 61, 145, 0.25);
      /* colori pieni (non trasparenti): azzurro chiaro ricavato dal blu dell'app #0A3D91 */
      background: linear-gradient(180deg, #F2F6FC, #E1EAF7);
      .nl-icon { color: var(--primary-dark); }
    }

    .nl-tile--unisciti {
      border-color: var(--border-color);
      background: linear-gradient(180deg, #FAFAFB, #ECEEF2);
      .nl-icon { color: var(--text-secondary); }
    }

    .nl-icon { font-size: 36px; width: 36px; height: 36px; margin-bottom: 4px; color: var(--primary-dark); }
    .nl-tile-title { font-size: 0.85rem; font-weight: 700; color: var(--text-primary); line-height: 1.2; }
    .nl-tile-sub { font-size: 0.7rem; color: var(--text-tertiary); line-height: 1.3; }

    /* ── Moneta 1v1 (stessi stili della card che c'era in home) ── */
    .duel-seal-coin {
      position: relative;
      flex-shrink: 0;
      width: 42px;
      height: 42px;
      margin-bottom: 2px;
      perspective: 260px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .duel-seal-halo {
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      pointer-events: none;
      animation: duelSealHalo 3.2s ease-out infinite;
    }
    .duel-seal-disc {
      position: absolute;
      inset: 0;
      transform-style: preserve-3d;
      animation: duelSealFlip 3.2s cubic-bezier(0.45, 0, 0.25, 1) infinite;
    }
    .duel-seal--clicked .duel-seal-disc { animation: duelSealBurstY 0.4s ease-out; }
    .duel-seal-layer {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      background: #6B431A;
      transform: translateZ(var(--z));
    }
    .duel-seal-face {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      background: radial-gradient(circle at 32% 28%, #F3D5B0, #CD7F32 48%, #8B5A2B 100%);
      border: 2px solid rgba(255, 236, 210, 0.7);
      box-shadow: inset 0 0 8px rgba(255, 236, 210, 0.4);
      box-sizing: border-box;
      overflow: hidden;
    }
    .duel-seal-face--front { transform: translateZ(3.5px); }
    .duel-seal-face--back { transform: rotateY(180deg) translateZ(3.5px); font-size: 1.15rem; line-height: 1; }
    .duel-seal-face::after {
      content: '';
      position: absolute;
      top: -20%;
      left: -70%;
      width: 40%;
      height: 140%;
      background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.6), transparent);
      transform: rotate(14deg);
      animation: duelSealShine 3.2s ease-in-out infinite;
    }
    .duel-seal-text {
      position: relative;
      z-index: 1;
      color: #fff;
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.1px;
      font-family: 'Poppins', sans-serif;
      text-shadow: 0 1px 2px rgba(70, 38, 10, 0.7);
    }
    @keyframes duelSealFlip {
      0%   { transform: rotateY(0deg) scale(1); }
      8%   { transform: rotateY(0deg) scale(1.1); }
      48%  { transform: rotateY(720deg) scale(1.1); }
      56%  { transform: rotateY(720deg) scale(1); }
      100% { transform: rotateY(720deg) scale(1); }
    }
    @keyframes duelSealShine {
      0%, 45% { left: -70%; }
      60%     { left: 130%; }
      100%    { left: 130%; }
    }
    @keyframes duelSealHalo {
      0%, 45% { box-shadow: 0 0 0 0 rgba(205, 127, 50, 0.6); }
      75%     { box-shadow: 0 0 0 10px rgba(205, 127, 50, 0); }
      100%    { box-shadow: 0 0 0 10px rgba(205, 127, 50, 0); }
    }
    @keyframes duelSealBurstY {
      0%   { transform: rotateY(0deg)   scale(1); }
      50%  { transform: rotateY(200deg) scale(1.25); }
      100% { transform: rotateY(360deg) scale(1); }
    }

    @media (max-width: 360px) {
      .nl-tiles { gap: 6px; }
      .nl-tile { padding: 14px 4px 12px; }
      .nl-tile-title { font-size: 0.78rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .duel-seal-disc, .duel-seal--clicked .duel-seal-disc, .duel-seal-halo, .duel-seal-face::after { animation: none; }
    }
  `],
})
export class NuovaLegaSheetComponent {
  sfidaAnimating = false;
  /** Spostamento verso il basso mentre si trascina il pannello (px) */
  trascinamento = 0;
  trascinando = false;
  private yIniziale = 0;

  constructor(
    @Optional() private sheetRef: MatBottomSheetRef<NuovaLegaSheetComponent, SceltaNuovaLega>,
    @Optional() private dialogRef: MatDialogRef<NuovaLegaSheetComponent, SceltaNuovaLega>,
  ) {}

  /** Piccolo "scatto" della moneta prima di aprire la sfida, come faceva la card in home */
  scegliSfida(): void {
    this.sfidaAnimating = true;
    setTimeout(() => this.chiudi('sfida'), 380);
  }

  chiudi(scelta?: SceltaNuovaLega): void {
    if (this.sheetRef) this.sheetRef.dismiss(scelta);
    else this.dialogRef?.close(scelta);
  }

  // ── Trascinare giu' per chiudere (solo pannello dal basso) ─────────────────────
  inizioTocco(e: TouchEvent): void {
    if (!this.sheetRef) return;
    this.yIniziale = e.touches[0].clientY;
    this.trascinando = true;
  }

  muoviTocco(e: TouchEvent): void {
    if (!this.trascinando) return;
    this.trascinamento = Math.max(0, e.touches[0].clientY - this.yIniziale);
  }

  fineTocco(): void {
    if (!this.trascinando) return;
    this.trascinando = false;
    if (this.trascinamento > 80) this.chiudi();
    else this.trascinamento = 0;
  }
}
