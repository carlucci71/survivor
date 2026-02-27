import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { CampionatoService } from '../../../core/services/campionato.service';
import { AdminService } from '../../../core/services/admin.service';

export interface RoundResultsData {
  lega: any;
  giornata: number;
  isLeader: boolean;
}

@Component({
  selector: 'app-round-results-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  template: `
    <div class="round-results-dialog">
      <!-- Header -->
      <div class="dialog-header">
        <h2 class="dialog-title">{{ 'ROUND_RESULTS.TITLE' | translate }} {{ getGiornataLabel() }}</h2>
        <button class="close-btn" (click)="close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Barra azione leader: visibile solo se leader -->
      @if (data.isLeader && !loading && partite.length > 0) {
        <div class="leader-bar">
          <div class="leader-hint">
            @if (selectedKey) {
              <mat-icon class="hint-icon">touch_app</mat-icon>
              <span>{{ getSelectedLabel() }}</span>
            } @else {
              <mat-icon class="hint-icon">touch_app</mat-icon>
              <span>Seleziona una partita per applicare o rimuovere la forzatura</span>
            }
          </div>
          <button class="apply-force-btn"
                  [disabled]="!selectedKey || savingKey !== null"
                  [class.remove-mode]="isSelectedForzata()"
                  (click)="applyForzatura()">
            @if (savingKey !== null) {
              <mat-icon class="spin-icon">sync</mat-icon>
            } @else if (isSelectedForzata()) {
              <mat-icon>cancel</mat-icon>
              <span>Rimuovi forzatura</span>
            } @else {
              <mat-icon>verified</mat-icon>
              <span>Applica forzatura</span>
            }
          </button>
        </div>
      }

      <div class="dialog-body">
        @if (loading) {
          <div class="loading-container">
            <div class="loading-spinner"></div>
            <span class="loading-text">{{ 'COMMON.LOADING' | translate }}</span>
          </div>
        } @else if (partite.length === 0) {
          <div class="empty-state">
            <mat-icon>sports_score</mat-icon>
            <span>{{ 'ROUND_RESULTS.NO_MATCHES' | translate }}</span>
          </div>
        } @else {
          <div class="matches-list">
            @for (partita of partite; track getMatchKey(partita)) {
              <div class="match-row"
                   [class.forzata]="partita.forzata"
                   [class.selected]="selectedKey === getMatchKey(partita)"
                   [class.clickable]="data.isLeader"
                   (click)="data.isLeader && selectPartita(partita)">

                <!-- Casa -->
                <span class="team home" [title]="partita.casaNome">{{ partita.casaNome }}</span>

                <!-- Centro: risultato + stato + data -->
                <div class="match-center">
                  <div class="score-box">
                    @if (hasScore(partita)) {
                      <span class="score">{{ partita.scoreCasa }}-{{ partita.scoreFuori }}</span>
                    } @else {
                      <span class="score-pending">vs</span>
                    }
                  </div>
                  <div class="match-meta">
                    <span class="stato-badge"
                          [class.terminata]="isTerminata(partita)"
                          [class.in-corso]="isInCorso(partita)">
                      {{ getStatoLabel(partita) }}
                    </span>
                    @if (partita.orario) {
                      <span class="data-label">{{ formatDate(partita.orario) }}</span>
                    }
                  </div>
                </div>

                <!-- Fuori -->
                <span class="team away" [title]="partita.fuoriNome">{{ partita.fuoriNome }}</span>

                <!-- Badge forzatura (solo se forzata) -->
                @if (partita.forzata) {
                  <span class="forced-badge">
                    <mat-icon>verified</mat-icon>
                  </span>
                }

                <!-- Spinner per la partita in salvataggio -->
                @if (savingKey === getMatchKey(partita)) {
                  <span class="saving-indicator">
                    <mat-icon class="spin-icon">sync</mat-icon>
                  </span>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Footer: legenda + chiudi -->
      <div class="dialog-footer">
        @if (!loading && partite.length > 0) {
          <div class="legend">
            <mat-icon class="legend-icon">verified</mat-icon>
            <span class="legend-text">{{ 'ROUND_RESULTS.LEGEND_FORCED' | translate }}</span>
          </div>
        }
        <button class="close-button" (click)="close()">
          {{ 'COMMON.CLOSE' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Poppins', sans-serif;
    }

    .round-results-dialog {
      background: #FFFFFF;
      border-radius: 16px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 90vh;
    }

    /* ── HEADER ── */
    .dialog-header {
      position: relative;
      padding: 14px 48px 14px 20px;
      background: linear-gradient(135deg, #4FC3F7 0%, #0A3D91 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }

    .dialog-title {
      margin: 0;
      font-size: 15px;
      font-weight: 700;
      color: white;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .close-btn {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      width: 28px;
      height: 28px;
      background: rgba(255,255,255,0.2);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.2s;

      &:hover { background: rgba(255,255,255,0.35); }

      mat-icon {
        color: white;
        font-size: 16px;
        width: 16px;
        height: 16px;
      }
    }

    /* ── LEADER BAR ── */
    .leader-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      padding: 8px 12px;
      background: #F0F7FF;
      border-bottom: 1px solid #DBEAFE;
      flex-shrink: 0;
    }

    .leader-hint {
      display: flex;
      align-items: center;
      gap: 6px;
      flex: 1;
      min-width: 0;
    }

    .hint-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #0A3D91;
      flex-shrink: 0;
    }

    .leader-hint span {
      font-size: 0.72rem;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .apply-force-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 6px 14px;
      border-radius: 20px;
      border: none;
      background: linear-gradient(135deg, #4FC3F7 0%, #0A3D91 100%);
      color: white;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      white-space: nowrap;
      font-family: 'Poppins', sans-serif;
      transition: opacity 0.2s, transform 0.15s;
      flex-shrink: 0;

      mat-icon {
        font-size: 15px;
        width: 15px;
        height: 15px;
      }

      &.remove-mode {
        background: linear-gradient(135deg, #F87171 0%, #DC2626 100%);
      }

      &:disabled {
        opacity: 0.4;
        cursor: not-allowed;
        transform: none;
      }

      &:not(:disabled):hover {
        opacity: 0.88;
        transform: translateY(-1px);
      }
    }

    /* ── BODY scrollabile ── */
    .dialog-body {
      padding: 10px 12px 6px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      background: #FFFFFF;
      overflow-y: auto;
      flex: 1;
      min-height: 0;
    }

    .dialog-body::-webkit-scrollbar { width: 4px; }
    .dialog-body::-webkit-scrollbar-track { background: transparent; }
    .dialog-body::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 4px; }

    /* ── LOADING / EMPTY ── */
    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      padding: 24px;
    }

    .loading-spinner {
      width: 30px;
      height: 30px;
      border: 3px solid #E5E7EB;
      border-top-color: #0A3D91;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
    }

    .loading-text { color: #6B7280; font-size: 0.85rem; }

    @keyframes spin { to { transform: rotate(360deg); } }

    .empty-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 24px;
      color: #9CA3AF;
      mat-icon { font-size: 36px; width: 36px; height: 36px; }
    }

    /* ── LISTA PARTITE ── */
    .matches-list {
      display: flex;
      flex-direction: column;
      gap: 5px;
    }

    .match-row {
      background: #F8FAFC;
      border-radius: 10px;
      border-left: 3px solid #E5E7EB;
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 10px;
      transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;

      &.clickable { cursor: pointer; }

      &.forzata {
        border-left-color: #10B981;
        background: #F0FDF4;
      }

      &.selected {
        border-left-color: #0A3D91;
        background: #EFF6FF;
        box-shadow: 0 0 0 1.5px rgba(10, 61, 145, 0.25);
      }

      &.forzata.selected {
        border-left-color: #10B981;
        background: #ECFDF5;
        box-shadow: 0 0 0 1.5px rgba(16, 185, 129, 0.3);
      }

      &.clickable:hover:not(.selected) {
        background: #F1F5F9;
        border-left-color: #94A3B8;
      }
    }

    .team {
      flex: 1;
      font-size: 0.8rem;
      font-weight: 600;
      color: #0A3D91;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;

      &.home { text-align: right; }
      &.away { text-align: left; }
    }

    .match-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      flex-shrink: 0;
      min-width: 80px;
    }

    .score-box {
      display: flex;
      align-items: center;
      gap: 3px;
    }

    .score {
      font-weight: 800;
      font-size: 0.95rem;
      color: #1F2937;
      white-space: nowrap;
    }

    .score-pending {
      font-weight: 600;
      font-size: 0.8rem;
      color: #9CA3AF;
    }

    .match-meta {
      display: flex;
      align-items: center;
      gap: 4px;
    }

    .stato-badge {
      font-size: 0.58rem;
      padding: 1px 5px;
      border-radius: 8px;
      background: #E5E7EB;
      color: #6B7280;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.2px;
      white-space: nowrap;

      &.terminata { background: #DCFCE7; color: #15803D; }
      &.in-corso   { background: #FEF3C7; color: #D97706; }
    }

    .data-label {
      font-size: 0.6rem;
      color: #9CA3AF;
      white-space: nowrap;
    }

    /* Badge forzatura */
    .forced-badge {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #10B981;
      }
    }

    .saving-indicator {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      mat-icon {
        font-size: 16px;
        width: 16px;
        height: 16px;
        color: #6B7280;
      }
    }

    .spin-icon { animation: spin 0.8s linear infinite; }

    /* ── FOOTER fisso ── */
    .dialog-footer {
      padding: 8px 12px 12px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      background: #FFFFFF;
      border-top: 1px solid #F3F4F6;
      flex-shrink: 0;
    }

    .legend {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 10px;
      background: #F0FDF4;
      border-radius: 8px;
      width: 100%;
      box-sizing: border-box;
    }

    .legend-icon {
      font-size: 14px;
      width: 14px;
      height: 14px;
      color: #10B981;
      flex-shrink: 0;
    }

    .legend-text {
      font-size: 0.7rem;
      color: #374151;
      line-height: 1.3;
    }

    .close-button {
      background: linear-gradient(135deg, #4FC3F7 0%, #0A3D91 100%);
      color: white;
      border: none;
      border-radius: 20px;
      padding: 7px 32px;
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      letter-spacing: 0.3px;
      font-family: 'Poppins', sans-serif;
      transition: opacity 0.2s;

      &:hover { opacity: 0.88; }
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 480px) {
      .dialog-body { padding: 8px 10px 6px; }
      .team { font-size: 0.72rem; }
      .score { font-size: 0.88rem; }
      .match-center { min-width: 65px; }
      .match-row { padding: 7px 8px; gap: 4px; }
      .leader-bar { flex-direction: column; align-items: stretch; gap: 6px; }
      .apply-force-btn { justify-content: center; }
      .leader-hint span { white-space: normal; }
    }
  `]
})
export class RoundResultsDialogComponent implements OnInit {
  partite: any[] = [];
  loading = true;
  savingKey: string | null = null;
  selectedKey: string | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RoundResultsData,
    private dialogRef: MatDialogRef<RoundResultsDialogComponent>,
    private campionatoService: CampionatoService,
    private adminService: AdminService
  ) {}

  ngOnInit(): void {
    this.loadPartite();
  }

  loadPartite(): void {
    if (!this.data.lega?.campionato?.id) {
      this.loading = false;
      return;
    }
    this.campionatoService.partiteDellaGiornata(
      this.data.lega.campionato.id,
      this.data.lega.anno,
      this.data.giornata
    ).subscribe({
      next: (partite) => {
        this.partite = partite || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  selectPartita(partita: any): void {
    const key = this.getMatchKey(partita);
    this.selectedKey = this.selectedKey === key ? null : key;
  }

  getSelectedPartita(): any | null {
    if (!this.selectedKey) return null;
    return this.partite.find(p => this.getMatchKey(p) === this.selectedKey) || null;
  }

  isSelectedForzata(): boolean {
    return !!this.getSelectedPartita()?.forzata;
  }

  getSelectedLabel(): string {
    const p = this.getSelectedPartita();
    if (!p) return '';
    return `${p.casaNome} vs ${p.fuoriNome}`;
  }

  applyForzatura(): void {
    const partita = this.getSelectedPartita();
    if (!partita || !this.data.isLeader) return;

    const key = this.getMatchKey(partita);
    this.savingKey = key;
    const nuovoValore = !partita.forzata;

    this.adminService.aggiornaForzataPartita(
      this.data.lega.id,
      this.data.lega.campionato.id,
      this.data.lega.anno,
      partita.giornata,
      partita.casaSigla,
      partita.fuoriSigla,
      nuovoValore
    ).subscribe({
      next: () => {
        this.savingKey = null;
        // Ricarica tutte le partite dal backend per avere lo stato reale aggiornato
        this.campionatoService.partiteDellaGiornata(
          this.data.lega.campionato.id,
          this.data.lega.anno,
          this.data.giornata
        ).subscribe({
          next: (partiteAggiornate) => {
            this.partite = partiteAggiornate || [];
          }
        });
      },
      error: () => {
        this.savingKey = null;
      }
    });
  }

  getMatchKey(partita: any): string {
    return `${partita.casaSigla}_${partita.fuoriSigla}`;
  }

  hasScore(partita: any): boolean {
    return partita.scoreCasa !== null && partita.scoreCasa !== undefined &&
           partita.scoreFuori !== null && partita.scoreFuori !== undefined;
  }

  isTerminata(partita: any): boolean {
    return partita.stato?.value === 'TERMINATA' || partita.stato === 'TERMINATA';
  }

  isInCorso(partita: any): boolean {
    return partita.stato?.value === 'IN_CORSO' || partita.stato === 'IN_CORSO';
  }

  getStatoLabel(partita: any): string {
    const stato = partita.stato?.value || partita.stato;
    const stati: any = {
      'DA_GIOCARE': 'Da giocare',
      'IN_CORSO': 'In corso',
      'TERMINATA': 'Terminata',
      'SOSPESA': 'Sospesa',
      'RINVIATA': 'Rinviata'
    };
    return stati[stato] || stato || '-';
  }

  formatDate(orario: any): string {
    if (!orario) return '';
    try {
      const d = new Date(orario);
      return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }

  getGiornataLabel(): string {
    const lega = this.data.lega;
    if (!lega) return String(this.data.giornata);
    const sportId = lega.campionato?.sport?.id;
    if (sportId === 'TENNIS') return `Round ${this.data.giornata}`;
    if (sportId === 'BASKET') return `Day ${this.data.giornata}`;
    return `Giornata ${this.data.giornata}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}

