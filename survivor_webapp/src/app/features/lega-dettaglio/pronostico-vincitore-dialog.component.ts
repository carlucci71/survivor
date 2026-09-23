import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LegaService } from '../../core/services/lega.service';

export interface PronosticoVincitoreDialogData {
  idLega: number;
  giocatoriAttivi: { id: number; nickname: string }[];
  giocatorePronosticatoId?: number | null;
}

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, TranslateModule],
  template: `
    <div class="pv-dialog">

      <!-- Bolle decorative di sfondo -->
      <span class="pv-bubble pv-b1"></span>
      <span class="pv-bubble pv-b2"></span>
      <span class="pv-bubble pv-b3"></span>
      <span class="pv-bubble pv-b4"></span>
      <span class="pv-bubble pv-b5"></span>
      <span class="pv-bubble pv-b6"></span>

      <button class="pv-close" (click)="close()" [attr.aria-label]="'DIALOGS.CLOSE' | translate">
        <mat-icon>close</mat-icon>
      </button>

      <div class="pv-hero">
        <div class="pv-icon-wrap">
          <span class="pv-crystal">🔮</span>
        </div>
        <h2 class="pv-title">{{ 'LEAGUE.PRONOSTICO_TITLE' | translate }}</h2>
        <p class="pv-subtitle">{{ 'LEAGUE.PRONOSTICO_SUBTITLE' | translate }}</p>
      </div>

      <div class="pv-body">
        <div class="pv-search-wrap">
          <mat-icon class="pv-search-icon">search</mat-icon>
          <input
            class="pv-search-input"
            type="text"
            [(ngModel)]="searchQuery"
            [placeholder]="'LEAGUE.PRONOSTICO_SEARCH_PLACEHOLDER' | translate"
          />
        </div>

        <div class="pv-list">
          @for (g of giocatoriFiltrati(); track g.id) {
            <button class="pv-row" [class.pv-row--selected]="selezionatoId === g.id" (click)="seleziona(g.id)">
              <span class="pv-avatar">{{ iniziale(g.nickname) }}</span>
              <span class="pv-row-nickname">{{ g.nickname }}</span>
              <span class="pv-radio">
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>
              </span>
            </button>
          } @empty {
            <p class="pv-empty">{{ 'LEAGUE.PRONOSTICO_EMPTY' | translate }}</p>
          }
        </div>

        <div class="pv-actions">
          <button class="pv-btn pv-btn--cancel" (click)="close()">{{ 'LEAGUE.PRONOSTICO_CANCEL' | translate }}</button>
          <button class="pv-btn pv-btn--save" (click)="conferma()" [disabled]="!selezionatoId || loading">
            {{ loading ? ('LEAGUE.PRONOSTICO_SAVING' | translate) : ('LEAGUE.PRONOSTICO_CONFIRM' | translate) }}
          </button>
        </div>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    .pv-dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--bg-card, #fff);
      border-radius: 24px;
      overflow: hidden;
      box-sizing: border-box;
      width: 100%;
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }

    /* ─── Bolle fluttuanti ─── */
    .pv-bubble {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
    }
    .pv-b1, .pv-b2, .pv-b3 {
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.12));
      border: 1px solid rgba(255,255,255,0.35);
    }
    .pv-b1 { width: 54px; height: 54px; top: -10px; left: 8%;  animation: pv-float1 6.5s ease-in-out infinite; }
    .pv-b2 { width: 26px; height: 26px; top: 62px; left: 24%;   animation: pv-float2 5s ease-in-out infinite; }
    .pv-b3 { width: 38px; height: 38px; top: 18px; right: 16%;  animation: pv-float1 7.5s ease-in-out infinite reverse; }
    .pv-b4, .pv-b5, .pv-b6 {
      background: radial-gradient(circle at 30% 30%, rgba(79,195,247,0.22), rgba(79,195,247,0.05));
      border: 1px solid rgba(79,195,247,0.22);
    }
    .pv-b4 { width: 34px; height: 34px; top: 200px; left: -10px;  animation: pv-float2 6s ease-in-out infinite; }
    .pv-b5 { width: 22px; height: 22px; top: 290px; right: 10px;  animation: pv-float1 5.5s ease-in-out infinite; }
    .pv-b6 { width: 46px; height: 46px; bottom: 40px; right: -14px; animation: pv-float2 8s ease-in-out infinite; }

    @keyframes pv-float1 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(6px, -12px) scale(1.08); }
    }
    @keyframes pv-float2 {
      0%, 100% { transform: translate(0, 0) scale(1); }
      50%      { transform: translate(-7px, 10px) scale(0.94); }
    }

    /* ─── Header ─── */
    .pv-close {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 3;
      width: 32px;
      height: 32px;
      border: none;
      background: rgba(255,255,255,0.22);
      backdrop-filter: blur(4px);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      padding: 0;
    }
    .pv-close mat-icon { font-size: 17px; width: 17px; height: 17px; color: #fff; }
    .pv-close:hover { background: rgba(255,255,255,0.36); }

    .pv-hero {
      position: relative;
      z-index: 1;
      padding: 30px 24px 26px;
      background: var(--gradient-primary, linear-gradient(135deg, #0A3D91, #4FC3F7));
      color: #fff;
      overflow: hidden;
      border-radius: 24px 24px 0 0;
    }
    .pv-hero::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -1px;
      height: 16px;
      background: var(--bg-card, #fff);
      border-radius: 18px 18px 0 0;
    }

    .pv-icon-wrap {
      position: relative;
      z-index: 1;
      width: 68px;
      height: 68px;
      margin: 0 auto 12px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 1.5px solid rgba(255,255,255,0.45);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15), inset 0 0 18px rgba(255,255,255,0.25);
      display: flex;
      align-items: center;
      justify-content: center;
      animation: pv-glow 3s ease-in-out infinite;
    }
    .pv-crystal {
      font-size: 2.1rem;
      line-height: 1;
      animation: pv-bob 3s ease-in-out infinite;
    }
    @keyframes pv-glow {
      0%, 100% { box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 0 0 0 rgba(255,255,255,0.35), inset 0 0 18px rgba(255,255,255,0.25); }
      50%      { box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 0 0 10px rgba(255,255,255,0), inset 0 0 18px rgba(255,255,255,0.25); }
    }
    @keyframes pv-bob {
      0%, 100% { transform: translateY(0); }
      50%      { transform: translateY(-3px); }
    }

    .pv-title {
      position: relative;
      z-index: 1;
      font-size: 1.3rem;
      font-weight: 800;
      color: #fff;
      margin: 0 0 2px;
      letter-spacing: 0.2px;
    }
    .pv-subtitle {
      position: relative;
      z-index: 1;
      font-size: 0.82rem;
      color: rgba(255,255,255,0.88);
      margin: 0;
    }

    /* ─── Corpo ─── */
    .pv-body {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      padding: 6px 20px 22px;
      /* Angoli e sfondo espliciti anche qui, non solo su .pv-dialog: su alcuni motori di
         rendering mobile l'overflow:hidden del contenitore non ritaglia in modo affidabile
         un figlio con animazioni (bolle/glow) attive, lasciando l'angolo in basso squadrato. */
      background: var(--bg-card, #fff);
      border-radius: 0 0 24px 24px;
    }

    .pv-search-wrap {
      position: relative;
      width: 100%;
      margin-bottom: 12px;
    }
    .pv-search-icon {
      position: absolute;
      left: 13px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: var(--text-tertiary, #9CA3AF);
    }
    .pv-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 11px 14px 11px 40px;
      border-radius: 30px;
      border: 1.5px solid var(--border-color, #E5E7EB);
      background: var(--bg-tertiary, #F8F9FA);
      color: var(--text-primary, #1A202C);
      font-family: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }
    .pv-search-input:focus {
      border-color: var(--primary-color, #4FC3F7);
      background: var(--bg-card, #fff);
      box-shadow: 0 0 0 3px rgba(79,195,247,0.18);
    }

    .pv-list {
      width: 100%;
      max-height: 232px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 7px;
      margin-bottom: 18px;
      padding: 2px 2px 2px 0;
      scrollbar-width: thin;
    }

    .pv-row {
      display: flex;
      align-items: center;
      gap: 12px;
      width: 100%;
      padding: 9px 14px 9px 10px;
      border-radius: 16px;
      border: 1.5px solid var(--border-color, #E2E8F0);
      background: var(--bg-card, #fff);
      cursor: pointer;
      font-family: inherit;
      text-align: left;
      transition: background 0.15s, border-color 0.15s, transform 0.12s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .pv-row:hover {
      background: var(--hover-overlay, rgba(79,195,247,0.08));
      border-color: var(--border-hover, #CBD5E0);
    }
    .pv-row:active { transform: scale(0.985); }
    .pv-row--selected,
    .pv-row--selected:hover {
      background: linear-gradient(135deg, rgba(79,195,247,0.16), rgba(79,195,247,0.06));
      border-color: var(--primary-color, #4FC3F7);
      box-shadow: 0 3px 12px rgba(10,61,145,0.12);
    }

    .pv-avatar {
      flex-shrink: 0;
      width: 36px;
      height: 36px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.9rem;
      font-weight: 700;
      color: var(--primary-dark, #0A3D91);
      background: var(--hover-overlay, rgba(79,195,247,0.12));
      border: 1.5px solid rgba(79,195,247,0.35);
      text-transform: uppercase;
      transition: all 0.15s;
    }
    .pv-row--selected .pv-avatar {
      color: #fff;
      background: var(--gradient-primary, linear-gradient(135deg, #0A3D91, #4FC3F7));
      border-color: transparent;
    }

    .pv-row-nickname {
      flex: 1;
      min-width: 0;
      font-size: 0.92rem;
      font-weight: 600;
      color: var(--text-primary, #1A202C);
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .pv-radio {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: 2px solid var(--border-hover, #CBD5E0);
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.18s ease;
    }
    .pv-radio svg {
      width: 14px;
      height: 14px;
      fill: none;
      stroke: #fff;
      stroke-width: 3;
      stroke-linecap: round;
      stroke-linejoin: round;
      opacity: 0;
      transform: scale(0.5);
      transition: all 0.18s ease;
    }
    .pv-row--selected .pv-radio {
      background: var(--gradient-primary, linear-gradient(135deg, #0A3D91, #4FC3F7));
      border-color: transparent;
    }
    .pv-row--selected .pv-radio svg { opacity: 1; transform: scale(1); }

    .pv-empty {
      font-size: 0.85rem;
      color: var(--text-tertiary, #9CA3AF);
      padding: 20px 0;
      margin: 0;
    }

    /* ─── Azioni ─── */
    .pv-actions {
      display: flex;
      gap: 10px;
      width: 100%;
    }
    .pv-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 13px 16px;
      border-radius: 30px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      transition: all 0.18s ease;
      border: none;
    }
    .pv-btn--cancel {
      flex: 0 0 auto;
      background: var(--bg-tertiary, #F3F4F6);
      color: var(--text-secondary, #4A5568);
      padding-left: 22px;
      padding-right: 22px;
    }
    .pv-btn--cancel:hover { background: var(--border-color, #E5E7EB); }
    .pv-btn--save {
      background: var(--gradient-primary, linear-gradient(135deg, #0A3D91, #4FC3F7));
      color: #fff;
      box-shadow: 0 4px 14px rgba(10,61,145,0.28);
    }
    .pv-btn--save:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 18px rgba(10,61,145,0.38);
    }
    .pv-btn--save:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .pv-btn--save:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }

    @media (max-width: 400px) {
      .pv-hero { padding: 26px 18px 24px; }
      .pv-icon-wrap { width: 60px; height: 60px; }
      .pv-crystal { font-size: 1.9rem; }
      .pv-body { padding: 4px 14px 18px; }
      .pv-btn { padding: 12px 12px; font-size: 0.84rem; }
      .pv-btn--cancel { padding-left: 16px; padding-right: 16px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .pv-bubble, .pv-icon-wrap, .pv-crystal { animation: none; }
    }
  `],
})
export class PronosticoVincitoreDialogComponent {
  searchQuery = '';
  selezionatoId: number | null;
  loading = false;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: PronosticoVincitoreDialogData,
    private dialogRef: MatDialogRef<PronosticoVincitoreDialogComponent>,
    private legaService: LegaService,
    private translate: TranslateService
  ) {
    this.selezionatoId = data.giocatorePronosticatoId ?? null;
  }

  giocatoriFiltrati(): { id: number; nickname: string }[] {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) return this.data.giocatoriAttivi;
    return this.data.giocatoriAttivi.filter(g => g.nickname.toLowerCase().includes(q));
  }

  iniziale(nickname: string): string {
    return Array.from((nickname ?? '').trim())[0] ?? '';
  }

  seleziona(id: number): void {
    this.selezionatoId = id;
  }

  close(): void {
    this.dialogRef.close();
  }

  conferma(): void {
    if (!this.selezionatoId || this.loading) return;
    this.loading = true;
    this.legaService.salvaPronosticoVincitore(this.data.idLega, this.selezionatoId).subscribe({
      next: (pronostico) => {
        this.dialogRef.close(pronostico);
      },
      error: (err) => {
        console.error('Errore salvataggio pronostico', err);
        this.loading = false;
      },
    });
  }
}
