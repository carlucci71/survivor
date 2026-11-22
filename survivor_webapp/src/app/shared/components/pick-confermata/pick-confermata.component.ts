import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

export interface PickConfermataDati {
  /** Logo della squadra o foto dell'atleta; null = si mostra l'emoji dello sport */
  logo: string | null;
  nome: string;
  /** Es. "Giornata 12" (vuoto = non mostrato) */
  giornata: string;
  /** Frase d'incoraggiamento (vuota = non mostrata) */
  frase: string;
  emoji: string;
}

/** Durata totale in scena prima di sparire da sola (il tocco la chiude subito). */
const DURATA_MS = 3000;
const USCITA_MS = 320;

/**
 * Conferma visiva della scelta, mostrata SOLO dopo che il salvataggio e' andato a buon fine:
 * il logo nasce dal centro dello schermo con un anello che si espande e la spunta verde.
 * Overlay scuro con testi bianchi: colori fissi voluti, e' una schermata "celebrativa".
 */
@Component({
  selector: 'app-pick-confermata',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  template: `
    <div class="pc-overlay" [class.pc-overlay--out]="uscita" (click)="chiudi()" role="status" aria-live="polite">
      <div class="pc-stage">
        <div class="pc-logo-wrap">
          <span class="pc-ring"></span>
          <span class="pc-ring pc-ring--2"></span>
          <div class="pc-logo">
            @if (dati.logo && !logoRotto) {
              <img [src]="dati.logo" [alt]="dati.nome" (error)="logoRotto = true" />
            } @else {
              <span class="pc-emoji" aria-hidden="true">{{ dati.emoji }}</span>
            }
          </div>
          <span class="pc-check"><mat-icon>check</mat-icon></span>
        </div>
        <div class="pc-nome">{{ dati.nome }}</div>
        <div class="pc-sub">
          {{ 'PICK_CONFIRM.SAVED' | translate }}@if (dati.giornata) {<span> · {{ dati.giornata }}</span>}
        </div>
        @if (dati.frase) {
          <div class="pc-frase">{{ dati.frase }}</div>
        }
      </div>
    </div>
  `,
  styles: [`
    .pc-overlay {
      position: fixed;
      inset: 0;
      z-index: 3000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      background: rgba(8, 18, 40, 0.62);
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);
      animation: pc-fade-in 0.25s ease-out both;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent;
    }
    .pc-overlay--out { animation: pc-fade-out 0.32s ease-in both; }

    .pc-stage {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      max-width: 340px;
      width: 100%;
    }

    .pc-logo-wrap {
      position: relative;
      width: 148px;
      height: 148px;
      margin-bottom: 22px;
    }

    .pc-logo {
      position: relative;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow: 0 18px 50px rgba(0, 0, 0, 0.35), 0 0 0 6px rgba(255, 255, 255, 0.18);
      animation: pc-logo-in 0.75s cubic-bezier(0.34, 1.56, 0.64, 1) both;

      img { width: 72%; height: 72%; object-fit: contain; }
    }

    .pc-emoji { font-size: 64px; line-height: 1; }

    .pc-ring {
      position: absolute;
      inset: 0;
      border-radius: 50%;
      border: 3px solid rgba(255, 255, 255, 0.85);
      animation: pc-ring 1.3s ease-out 0.3s both;
      pointer-events: none;
    }
    .pc-ring--2 { animation-delay: 0.65s; border-color: rgba(129, 212, 250, 0.8); }

    .pc-check {
      position: absolute;
      right: 2px;
      bottom: 6px;
      width: 46px;
      height: 46px;
      border-radius: 50%;
      background: var(--success-color, #43A047);
      border: 4px solid #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
      animation: pc-check 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) 0.55s both;

      mat-icon { color: #fff; font-size: 26px; width: 26px; height: 26px; }
    }

    .pc-nome {
      font-family: var(--font-family, 'Poppins', sans-serif);
      font-size: 28px;
      font-weight: 800;
      color: #fff;
      letter-spacing: 0.3px;
      line-height: 1.15;
      text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
      animation: pc-up 0.45s ease-out 0.55s both;
    }

    .pc-sub {
      margin-top: 6px;
      font-size: 14px;
      font-weight: 600;
      color: rgba(255, 255, 255, 0.85);
      text-transform: uppercase;
      letter-spacing: 1px;
      animation: pc-up 0.45s ease-out 0.7s both;
    }

    .pc-frase {
      margin-top: 14px;
      font-size: 15px;
      line-height: 1.45;
      color: rgba(255, 255, 255, 0.92);
      animation: pc-up 0.45s ease-out 0.85s both;
    }

    @keyframes pc-fade-in { from { opacity: 0; } to { opacity: 1; } }
    @keyframes pc-fade-out { from { opacity: 1; } to { opacity: 0; transform: scale(1.04); } }
    @keyframes pc-logo-in {
      0% { transform: scale(0.15) rotate(-12deg); opacity: 0; }
      60% { transform: scale(1.1) rotate(3deg); opacity: 1; }
      100% { transform: scale(1) rotate(0); opacity: 1; }
    }
    @keyframes pc-ring {
      0% { transform: scale(0.9); opacity: 0.95; }
      100% { transform: scale(1.9); opacity: 0; }
    }
    @keyframes pc-check {
      0% { transform: scale(0); }
      100% { transform: scale(1); }
    }
    @keyframes pc-up {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @media (max-width: 360px) {
      .pc-logo-wrap { width: 124px; height: 124px; }
      .pc-nome { font-size: 24px; }
      .pc-emoji { font-size: 52px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pc-overlay, .pc-overlay--out, .pc-logo, .pc-ring, .pc-check, .pc-nome, .pc-sub, .pc-frase { animation: none; }
      .pc-ring { display: none; }
    }
  `]
})
export class PickConfermataComponent implements OnInit, OnDestroy {
  @Input({ required: true }) dati!: PickConfermataDati;
  @Output() chiusa = new EventEmitter<void>();

  uscita = false;
  logoRotto = false;
  private timer: ReturnType<typeof setTimeout> | null = null;

  ngOnInit(): void {
    this.timer = setTimeout(() => this.chiudi(), DURATA_MS);
  }

  ngOnDestroy(): void {
    if (this.timer) clearTimeout(this.timer);
  }

  chiudi(): void {
    if (this.uscita) return;
    if (this.timer) clearTimeout(this.timer);
    this.uscita = true;
    setTimeout(() => this.chiusa.emit(), USCITA_MS);
  }
}
