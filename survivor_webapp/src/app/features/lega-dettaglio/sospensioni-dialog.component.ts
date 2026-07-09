import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { SospensioniService } from '../../core/services/sospensioni.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';

@Component({
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule],
  template: `
    <div class="sd-dialog">

      <!-- Close -->
      <button class="sd-close" (click)="close()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Icon hero -->
      <div class="sd-icon-wrap">
        <mat-icon class="sd-icon">pause_circle</mat-icon>
      </div>

      <!-- Titolo -->
      <p class="sd-label-top">{{ titleLabel }}</p>

      <!-- Lista giornate sospese -->
      <div class="sd-list-wrap">
        <div *ngIf="giornate.length === 0" class="sd-empty">
          <mat-icon class="sd-empty-icon">event_busy</mat-icon>
          <span>{{ noSuspensionsLabel }}</span>
        </div>
        <div *ngIf="giornate.length > 0" class="sd-chips">
          <div *ngFor="let g of sortedGiornate()" class="sd-chip">
            <mat-icon class="sd-chip-icon">calendar_today</mat-icon>
            <span class="sd-chip-label">{{ roundLabel }} {{ g }}</span>
            <button class="sd-chip-del" (click)="remove(g)" [disabled]="loadingRemove === g" aria-label="Rimuovi">
              <mat-icon>{{ loadingRemove === g ? 'hourglass_empty' : 'close' }}</mat-icon>
            </button>
          </div>
        </div>
      </div>

      <!-- Aggiungi giornata -->
      <div class="sd-add-section">
        <p class="sd-add-label">{{ addRoundLabel }}</p>
        <div class="sd-stepper">
          <button class="sd-step-btn" (click)="dec()" [disabled]="newGiornata <= 1" aria-label="Riduci">
            <mat-icon>remove</mat-icon>
          </button>
          <div class="sd-step-val">
            <span class="sd-num">{{ newGiornata }}</span>
          </div>
          <button class="sd-step-btn" (click)="inc()" aria-label="Aumenta">
            <mat-icon>add</mat-icon>
          </button>
        </div>
        <button class="sd-btn sd-btn--add" (click)="add()" [disabled]="loadingAdd || giornate.includes(newGiornata)">
          <mat-icon class="sd-btn-ico">{{ loadingAdd ? 'hourglass_empty' : 'add_circle' }}</mat-icon>
          {{ loadingAdd ? loadingLabel : addLabel }}
        </button>
      </div>

      <!-- Chiudi -->
      <button class="sd-btn sd-btn--close" (click)="close()">
        {{ closeLabel }}
      </button>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    :host { display: block; }

    .sd-dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0;
      padding: 40px 24px 28px;
      background: #fff;
      border-radius: 24px;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    /* ── Close ─────────────────────────────────── */
    .sd-close {
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
    .sd-close:hover { background: #E5E7EB; }
    .sd-close mat-icon { font-size: 17px; width: 17px; height: 17px; color: #374151; }

    /* ── Icon hero ──────────────────────────────── */
    .sd-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      border: 2px solid rgba(10,61,145,0.12);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      animation: sd-pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
      flex-shrink: 0;
    }
    @keyframes sd-pop {
      from { transform: scale(0.2); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    .sd-icon {
      font-size: 34px;
      width: 34px;
      height: 34px;
      color: #0A3D91;
    }

    /* ── Titolo ─────────────────────────────────── */
    .sd-label-top {
      font-size: 1.05rem;
      font-weight: 700;
      color: #1F2937;
      margin: 0 0 20px;
      letter-spacing: 0.2px;
    }

    /* ── Lista chips ────────────────────────────── */
    .sd-list-wrap {
      width: 100%;
      margin-bottom: 20px;
      min-height: 48px;
    }
    .sd-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 14px 0;
      color: #9CA3AF;
      font-size: 0.82rem;
      font-weight: 500;
    }
    .sd-empty-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #D1D5DB;
    }
    .sd-chips {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      justify-content: center;
      padding: 4px 0;
    }
    .sd-chip {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: rgba(10,61,145,0.06);
      border: 1.5px solid rgba(10,61,145,0.14);
      border-radius: 99px;
      padding: 5px 6px 5px 10px;
      font-size: 0.82rem;
      font-weight: 600;
      color: #0A3D91;
      animation: sd-chip-in 0.2s ease both;
    }
    @keyframes sd-chip-in {
      from { transform: scale(0.6); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }
    .sd-chip-icon { font-size: 13px; width: 13px; height: 13px; color: #4B8AF0; }
    .sd-chip-label { line-height: 1; }
    .sd-chip-del {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      border: none;
      background: rgba(239,68,68,0.1);
      color: #EF4444;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .sd-chip-del:hover:not(:disabled) { background: rgba(239,68,68,0.2); }
    .sd-chip-del:disabled { opacity: 0.5; cursor: not-allowed; }
    .sd-chip-del mat-icon { font-size: 13px; width: 13px; height: 13px; }

    /* ── Divisore ───────────────────────────────── */
    .sd-add-section {
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding-top: 16px;
      border-top: 1.5px solid #F3F4F6;
      margin-bottom: 12px;
    }
    .sd-add-label {
      font-size: 0.72rem;
      font-weight: 500;
      color: #9CA3AF;
      text-transform: uppercase;
      letter-spacing: 0.7px;
      margin: 0;
    }

    /* ── Stepper ────────────────────────────────── */
    .sd-stepper {
      display: flex;
      align-items: center;
      background: #FAFAFA;
      border: 2px solid rgba(10,61,145,0.14);
      border-radius: 16px;
      overflow: hidden;
      width: 100%;
      max-width: 200px;
    }
    .sd-step-btn {
      width: 48px;
      height: 56px;
      border: none;
      background: transparent;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0A3D91;
      transition: background 0.15s;
      flex-shrink: 0;
    }
    .sd-step-btn mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .sd-step-btn:hover:not(:disabled) { background: rgba(10,61,145,0.07); }
    .sd-step-btn:disabled { color: #D1D5DB; cursor: not-allowed; }
    .sd-step-val {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-left: 1.5px solid rgba(10,61,145,0.1);
      border-right: 1.5px solid rgba(10,61,145,0.1);
      padding: 8px 4px;
    }
    .sd-num {
      font-size: 1.9rem;
      font-weight: 800;
      color: #0A3D91;
      line-height: 1;
      font-family: 'Poppins', sans-serif;
    }

    /* ── Bottoni ────────────────────────────────── */
    .sd-btn {
      width: 100%;
      max-width: 280px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      padding: 13px 16px;
      border-radius: 14px;
      font-size: 0.88rem;
      font-weight: 600;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      transition: all 0.18s ease;
      border: none;
    }
    .sd-btn-ico { font-size: 17px; width: 17px; height: 17px; }

    .sd-btn--add {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      box-shadow: 0 3px 10px rgba(10,61,145,0.25);
    }
    .sd-btn--add:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(10,61,145,0.35);
    }
    .sd-btn--add:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .sd-btn--add:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

    .sd-btn--close {
      background: #F3F4F6;
      color: #6B7280;
    }
    .sd-btn--close:hover { background: #E5E7EB; color: #374151; }

    /* ── Responsive ─────────────────────────────── */
    @media (max-width: 400px) {
      .sd-dialog { padding: 36px 16px 22px; }
      .sd-icon-wrap { width: 62px; height: 62px; }
      .sd-icon { font-size: 28px; width: 28px; height: 28px; }
      .sd-num { font-size: 1.6rem; }
      .sd-btn { max-width: 100%; }
    }
  `],
})
export class SospensioniDialogComponent {
  giornate: number[] = [];
  newGiornata = 1;
  loadingAdd = false;
  loadingRemove: number | null = null;

  titleLabel: string;
  noSuspensionsLabel: string;
  roundLabel: string;
  addRoundLabel: string;
  addLabel: string;
  loadingLabel: string;
  closeLabel: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<SospensioniDialogComponent>,
    private sospensioniService: SospensioniService,
    private translate: TranslateService,
  ) {
    if (data && data.giornate) {
      this.giornate = [...data.giornate];
    }
    this.titleLabel        = this.translate.instant('SUSPENSIONS.TITLE');
    this.noSuspensionsLabel = this.translate.instant('SUSPENSIONS.NO_SUSPENSIONS');
    this.roundLabel        = this.translate.instant('LEAGUE.ROUND');
    this.addRoundLabel     = this.translate.instant('SUSPENSIONS.NEW_ROUND_PLACEHOLDER');
    this.addLabel          = this.translate.instant('COMMON.ADD');
    this.loadingLabel      = this.translate.instant('COMMON.LOADING') || '...';
    this.closeLabel        = this.translate.instant('COMMON.CLOSE');
  }

  sortedGiornate(): number[] {
    return [...this.giornate].sort((a, b) => a - b);
  }

  inc(): void { this.newGiornata++; }
  dec(): void { if (this.newGiornata > 1) this.newGiornata--; }

  close(): void { this.dialogRef.close(); }

  add(): void {
    if (this.newGiornata == null || this.giornate.includes(this.newGiornata)) return;
    this.loadingAdd = true;
    const g = this.newGiornata;
    const payload = { verso: 'ADD', idLega: this.data.idLega, giornata: g };
    this.sospensioniService.updateSospensioni(payload).subscribe({
      next: () => {
        if (!this.giornate.includes(g)) this.giornate.push(g);
        this.newGiornata = g + 1;
        this.loadingAdd = false;
      },
      error: (err) => {
        console.error('Errore add sospensione', err);
        this.loadingAdd = false;
      },
    });
  }

  remove(g: number): void {
    this.loadingRemove = g;
    const payload = { verso: 'REMOVE', idLega: this.data.idLega, giornata: g };
    this.sospensioniService.updateSospensioni(payload).subscribe({
      next: () => {
        this.giornate = this.giornate.filter((x) => x !== g);
        this.loadingRemove = null;
      },
      error: (err) => {
        console.error('Errore remove sospensione', err);
        this.loadingRemove = null;
      },
    });
  }
}
