import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { LegaService } from '../../core/services/lega.service';
import { TranslateService } from '@ngx-translate/core';

export interface GestisciViteDialogData {
  idLega: number;
  idGiocatore: number;
  nicknameGiocatore: string;
  viteAttuali: number;
}

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="gv-dialog">

      <!-- Close -->
      <button class="gv-close" (click)="close()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Header icon -->
      <div class="gv-icon-wrap">
        <span class="gv-heart">❤️</span>
      </div>

      <!-- Titolo -->
      <p class="gv-label">{{ livesOfLabel }}</p>
      <div class="gv-nickname-pill">{{ data.nicknameGiocatore }}</div>

      <!-- Stepper -->
      <div class="gv-stepper-wrap">
        <button class="gv-step-btn" (click)="dec()" [disabled]="vite <= 0" aria-label="Riduci">
          <mat-icon>remove</mat-icon>
        </button>
        <div class="gv-step-val">
          <span class="gv-num">{{ vite }}</span>
          <span class="gv-sub">{{ vite === 1 ? oneLlife : manyLives }}</span>
        </div>
        <button class="gv-step-btn" (click)="inc()" aria-label="Aumenta">
          <mat-icon>add</mat-icon>
        </button>
      </div>

      <!-- Azioni -->
      <div class="gv-actions">
        <button class="gv-btn gv-btn--cancel" (click)="close()">{{ cancelLabel }}</button>
        <button class="gv-btn gv-btn--save" (click)="salva()" [disabled]="loading">
          <mat-icon class="gv-btn-ico">{{ loading ? 'hourglass_empty' : 'check' }}</mat-icon>
          {{ loading ? savingLabel : saveLabel }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    .gv-dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      padding: 40px 28px 28px;
      background: #fff;
      border-radius: 24px;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    /* ── Close ─────────────────────────────────── */
    .gv-close {
      position: absolute;
      top: 14px;
      right: 14px;
      width: 32px;
      height: 32px;
      border: none;
      background: #F3F4F6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      padding: 0;
    }
    .gv-close mat-icon {
      font-size: 17px;
      width: 17px;
      height: 17px;
      color: #374151;
    }
    .gv-close:hover { background: #E5E7EB; }

    /* ── Icon hero ──────────────────────────────── */
    .gv-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFF1F2, #FFE4E6);
      border: 2px solid rgba(239,68,68,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 18px;
      animation: gv-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
      flex-shrink: 0;
    }
    @keyframes gv-pop {
      from { transform: scale(0.2); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    .gv-heart {
      font-size: 2.2rem;
      line-height: 1;
      animation: gv-beat 1.6s ease-in-out infinite;
    }
    @keyframes gv-beat {
      0%, 100% { transform: scale(1); }
      14%       { transform: scale(1.25); }
      28%       { transform: scale(1); }
      42%       { transform: scale(1.18); }
      70%       { transform: scale(1); }
    }

    /* ── Intestazione ───────────────────────────── */
    .gv-label {
      font-size: 0.78rem;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      margin: 0 0 6px;
    }
    .gv-nickname-pill {
      display: inline-flex;
      align-items: center;
      background: rgba(10,61,145,0.06);
      border: 1px solid rgba(10,61,145,0.14);
      border-radius: 99px;
      padding: 5px 18px;
      font-size: 0.9rem;
      font-weight: 700;
      color: #0A3D91;
      letter-spacing: 0.3px;
      margin-bottom: 28px;
      max-width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    /* ── Stepper ────────────────────────────────── */
    .gv-stepper-wrap {
      display: flex;
      align-items: center;
      gap: 0;
      background: #FAFAFA;
      border: 2px solid rgba(10,61,145,0.14);
      border-radius: 18px;
      overflow: hidden;
      width: 100%;
      max-width: 260px;
      margin-bottom: 28px;
    }
    .gv-step-btn {
      flex-shrink: 0;
      width: 56px;
      height: 80px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0A3D91;
      transition: background 0.15s;
    }
    .gv-step-btn mat-icon {
      font-size: 22px;
      width: 22px;
      height: 22px;
    }
    .gv-step-btn:hover:not(:disabled) { background: rgba(10,61,145,0.07); }
    .gv-step-btn:active:not(:disabled) { background: rgba(10,61,145,0.14); }
    .gv-step-btn:disabled {
      color: #D1D5DB;
      cursor: not-allowed;
    }
    .gv-step-val {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 2px;
      border-left: 1.5px solid rgba(10,61,145,0.1);
      border-right: 1.5px solid rgba(10,61,145,0.1);
      padding: 10px 4px;
    }
    .gv-num {
      font-size: 2.4rem;
      font-weight: 800;
      color: #ef4444;
      line-height: 1;
      font-family: 'Poppins', sans-serif;
    }
    .gv-sub {
      font-size: 0.7rem;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    /* ── Azioni ─────────────────────────────────── */
    .gv-actions {
      display: flex;
      gap: 10px;
      width: 100%;
    }
    .gv-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 12px 16px;
      border-radius: 12px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      transition: all 0.18s ease;
      border: none;
    }
    .gv-btn-ico {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .gv-btn--cancel {
      background: #F3F4F6;
      color: #374151;
    }
    .gv-btn--cancel:hover { background: #E5E7EB; }
    .gv-btn--save {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      box-shadow: 0 3px 10px rgba(10,61,145,0.25);
    }
    .gv-btn--save:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(10,61,145,0.35);
    }
    .gv-btn--save:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .gv-btn--save:disabled { opacity: 0.6; cursor: not-allowed; }

    /* ── Responsive ─────────────────────────────── */
    @media (max-width: 400px) {
      .gv-dialog { padding: 36px 20px 24px; }
      .gv-icon-wrap { width: 62px; height: 62px; }
      .gv-stepper-wrap { max-width: 100%; }
      .gv-num { font-size: 2rem; }
    }
  `],
})
export class GestisciViteDialogComponent {
  vite: number;
  loading = false;

  livesOfLabel: string;
  oneLlife: string;
  manyLives: string;
  cancelLabel: string;
  saveLabel: string;
  savingLabel: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: GestisciViteDialogData,
    private dialogRef: MatDialogRef<GestisciViteDialogComponent>,
    private legaService: LegaService,
    private translate: TranslateService
  ) {
    this.vite = data.viteAttuali;
    this.livesOfLabel  = this.translate.instant('LEAGUE.LIVES_OF');
    this.oneLlife      = this.translate.instant('LEAGUE.ONE_LIFE');
    this.manyLives     = this.translate.instant('LEAGUE.MANY_LIVES');
    this.cancelLabel   = this.translate.instant('LEAGUE.MANAGE_LIVES_CANCEL');
    this.saveLabel     = this.translate.instant('LEAGUE.MANAGE_LIVES_SAVE');
    this.savingLabel   = this.translate.instant('LEAGUE.MANAGE_LIVES_SAVING');
  }

  inc(): void { this.vite++; }
  dec(): void { if (this.vite > 0) this.vite--; }

  close(): void { this.dialogRef.close(); }

  salva(): void {
    this.loading = true;
    this.legaService.aggiornVite(this.data.idLega, this.data.idGiocatore, this.vite).subscribe({
      next: (lega) => {
        this.dialogRef.close(lega);
      },
      error: (err) => {
        console.error('Errore aggiornamento vite', err);
        this.loading = false;
      },
    });
  }
}
