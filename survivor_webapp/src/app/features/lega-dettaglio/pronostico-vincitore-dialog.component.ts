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

      <button class="pv-close" (click)="close()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <div class="pv-icon-wrap">
        <span class="pv-crystal">🔮</span>
      </div>

      <h2 class="pv-title">{{ 'LEAGUE.PRONOSTICO_TITLE' | translate }}</h2>
      <p class="pv-subtitle">{{ 'LEAGUE.PRONOSTICO_SUBTITLE' | translate }}</p>

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
            <span class="pv-row-nickname">{{ g.nickname }}</span>
            @if (selezionatoId === g.id) {
              <mat-icon class="pv-row-check">check_circle</mat-icon>
            }
          </button>
        } @empty {
          <p class="pv-empty">{{ 'LEAGUE.PRONOSTICO_EMPTY' | translate }}</p>
        }
      </div>

      <div class="pv-actions">
        <button class="pv-btn pv-btn--cancel" (click)="close()">{{ 'LEAGUE.PRONOSTICO_CANCEL' | translate }}</button>
        <button class="pv-btn pv-btn--save" (click)="conferma()" [disabled]="!selezionatoId || loading">
          <mat-icon class="pv-btn-ico">{{ loading ? 'hourglass_empty' : 'check' }}</mat-icon>
          {{ loading ? ('LEAGUE.PRONOSTICO_SAVING' | translate) : ('LEAGUE.PRONOSTICO_CONFIRM' | translate) }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    .pv-dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 40px 24px 24px;
      background: #fff;
      border-radius: 24px;
      text-align: center;
      box-sizing: border-box;
      width: 100%;
      font-family: 'Poppins', sans-serif;
    }

    .pv-close {
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
    .pv-close mat-icon { font-size: 17px; width: 17px; height: 17px; color: #374151; }
    .pv-close:hover { background: #E5E7EB; }

    .pv-icon-wrap {
      width: 72px;
      height: 72px;
      border-radius: 50%;
      background: linear-gradient(135deg, #EEF2FF, #E0E7FF);
      border: 2px solid rgba(99,102,241,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 14px;
      flex-shrink: 0;
    }
    .pv-crystal { font-size: 2.2rem; line-height: 1; }

    .pv-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #0A3D91;
      margin: 0 0 4px;
    }

    .pv-subtitle {
      font-size: 0.82rem;
      color: #6B7280;
      margin: 0 0 18px;
    }

    .pv-search-wrap {
      position: relative;
      width: 100%;
      margin-bottom: 12px;
    }
    .pv-search-icon {
      position: absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #9CA3AF;
    }
    .pv-search-input {
      width: 100%;
      box-sizing: border-box;
      padding: 10px 12px 10px 38px;
      border-radius: 12px;
      border: 1.5px solid #E5E7EB;
      font-family: inherit;
      font-size: 0.88rem;
      outline: none;
      transition: border-color 0.15s;
    }
    .pv-search-input:focus { border-color: #4FC3F7; }

    .pv-list {
      width: 100%;
      max-height: 240px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      gap: 6px;
      margin-bottom: 20px;
    }

    .pv-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 11px 14px;
      border-radius: 12px;
      border: 1.5px solid #F0F0F0;
      background: #FAFAFA;
      cursor: pointer;
      font-family: inherit;
      transition: background 0.15s, border-color 0.15s;
      box-sizing: border-box;
    }
    .pv-row:hover { background: #F3F4F6; }
    .pv-row--selected {
      background: rgba(79,195,247,0.1);
      border-color: rgba(79,195,247,0.5);
    }
    .pv-row-nickname { font-size: 0.9rem; font-weight: 600; color: #1A202C; }
    .pv-row-check { color: #0A3D91; font-size: 20px; width: 20px; height: 20px; }

    .pv-empty {
      font-size: 0.85rem;
      color: #9CA3AF;
      padding: 20px 0;
    }

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
    .pv-btn-ico { font-size: 16px; width: 16px; height: 16px; }
    .pv-btn--cancel { background: #F3F4F6; color: #374151; }
    .pv-btn--cancel:hover { background: #E5E7EB; }
    .pv-btn--save {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      box-shadow: 0 3px 10px rgba(10,61,145,0.25);
    }
    .pv-btn--save:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(10,61,145,0.35);
    }
    .pv-btn--save:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .pv-btn--save:disabled { opacity: 0.6; cursor: not-allowed; }

    @media (max-width: 400px) {
      .pv-dialog { padding: 36px 18px 20px; }
      .pv-icon-wrap { width: 62px; height: 62px; }
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
