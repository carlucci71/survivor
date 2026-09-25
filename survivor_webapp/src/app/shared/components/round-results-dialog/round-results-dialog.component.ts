import { Component, Inject, OnInit, AfterViewChecked, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CampionatoService } from '../../../core/services/campionato.service';
import { AdminService } from '../../../core/services/admin.service';

export interface RoundResultsData {
  lega: any;
  giornata: number;
  giornataIniziale?: number;
  isLeader: boolean;
  /** Sfida 1v1: tema bronzo. */
  duel?: boolean;
  /** Risolve il logo di una squadra (stessa logica di lega-dettaglio). */
  getTeamLogo?: (sigla: string) => string | null;
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
    <div class="rr" [class.duel-theme]="data.duel">
      <!-- Header -->
      <div class="rr-header">
        <span class="rr-header-icon"><mat-icon>{{ data.isLeader ? 'bolt' : 'scoreboard' }}</mat-icon></span>
        <h2 class="rr-title">{{ 'ROUND_RESULTS.TITLE' | translate }} {{ getGiornataLabel() }}</h2>
        <button class="rr-close-x" (click)="close()" [attr.aria-label]="'COMMON.CLOSE' | translate">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- Navigazione giornate -->
      @if (giornateDisponibili.length > 0) {
        <div class="rr-nav">
          <button class="rr-arrow" [disabled]="currentRoundIndex <= 0" (click)="goToPrevRound()">
            <mat-icon>chevron_left</mat-icon>
          </button>
          <div class="rr-chips-wrap" #chipsWrapper>
            <div class="rr-chips">
              @for (g of giornateDisponibili; track g; let i = $index) {
                <button class="round-chip"
                        [class.active]="i === currentRoundIndex"
                        [class.pre-lega]="g < (data.lega?.giornataIniziale ?? 1)"
                        (click)="goToRound(i)">
                  {{ getRoundShortLabel(g) }}
                </button>
              }
            </div>
          </div>
          <button class="rr-arrow" [disabled]="currentRoundIndex >= giornateDisponibili.length - 1" (click)="goToNextRound()">
            <mat-icon>chevron_right</mat-icon>
          </button>
        </div>
      }

      @if (data.isLeader && !loading && partite.length > 0) {
        <div class="rr-hint">
          <mat-icon>touch_app</mat-icon>
          <span>{{ 'ROUND_RESULTS.FORCE_HINT_SHORT' | translate }}</span>
        </div>
      }

      <div class="rr-body">
        @if (loading) {
          <div class="rr-loading">
            <div class="rr-spinner"></div>
            <span>{{ 'COMMON.LOADING' | translate }}</span>
          </div>
        } @else if (partite.length === 0) {
          <div class="rr-empty">
            <mat-icon>sports_score</mat-icon>
            <span>{{ 'ROUND_RESULTS.NO_MATCHES' | translate }}</span>
          </div>
        } @else {
          <div class="rr-list">
            @for (partita of partite; track getMatchKey(partita); let i = $index) {
              <div class="rr-card"
                   [class.forzata]="partita.forzata"
                   [class.selected]="selectedKey === getMatchKey(partita)"
                   [class.clickable]="data.isLeader"
                   [style.animation-delay.ms]="i * 35"
                   (click)="data.isLeader && selectPartita(partita)">

                <div class="rr-team">
                  <div class="rr-logo" [class.no-img]="!logoFor(partita.casaSigla)">
                    @if (logoFor(partita.casaSigla); as logo) {
                      <img [src]="logo" [alt]="partita.casaNome" (error)="onLogoError($event)" />
                    }
                    <span class="rr-logo-fb">{{ initials(partita.casaNome) }}</span>
                  </div>
                  <span class="rr-name" [title]="partita.casaNome">{{ partita.casaNome }}</span>
                </div>

                <div class="rr-mid">
                  <div class="rr-score" [class.pending]="!hasScore(partita)">
                    @if (hasScore(partita)) {
                      {{ partita.scoreCasa }}<span class="rr-dash">-</span>{{ partita.scoreFuori }}
                    } @else {
                      vs
                    }
                  </div>
                  <span class="rr-status" [class.done]="isTerminata(partita)" [class.live]="isInCorso(partita)">
                    @if (isInCorso(partita)) { <span class="rr-live-dot"></span> }
                    {{ getStatoLabel(partita) }}
                  </span>
                  @if (partita.orario) {
                    <span class="rr-time">{{ formatDate(partita.orario) }}</span>
                  }
                </div>

                <div class="rr-team">
                  <div class="rr-logo" [class.no-img]="!logoFor(partita.fuoriSigla)">
                    @if (logoFor(partita.fuoriSigla); as logo) {
                      <img [src]="logo" [alt]="partita.fuoriNome" (error)="onLogoError($event)" />
                    }
                    <span class="rr-logo-fb">{{ initials(partita.fuoriNome) }}</span>
                  </div>
                  <span class="rr-name" [title]="partita.fuoriNome">{{ partita.fuoriNome }}</span>
                </div>

                @if (partita.forzata) {
                  <span class="rr-forced-tag"><mat-icon>lock</mat-icon>{{ 'ROUND_RESULTS.FORCED_TAG' | translate }}</span>
                }
                <span class="rr-check"><mat-icon>check</mat-icon></span>
                @if (savingKey === getMatchKey(partita)) {
                  <span class="rr-saving"><mat-icon class="spin-icon">sync</mat-icon></span>
                }
              </div>
            }
          </div>
        }
      </div>

      <!-- Barra azioni fissa in basso -->
      <div class="rr-footer">
        @if (data.isLeader && !loading && partite.length > 0) {
          @if (selectedKey) {
            <div class="rr-selected-label">{{ getSelectedLabel() }}</div>
          }
          <button class="rr-apply"
                  [disabled]="!selectedKey || savingKey !== null"
                  [class.remove-mode]="isSelectedForzata()"
                  (click)="applyForzatura()">
            @if (savingKey !== null) {
              <mat-icon class="spin-icon">sync</mat-icon>
            } @else if (isSelectedForzata()) {
              <mat-icon>lock_open</mat-icon>
              <span>{{ 'ROUND_RESULTS.REMOVE_FORCE' | translate }}</span>
            } @else {
              <mat-icon>bolt</mat-icon>
              <span>{{ 'ROUND_RESULTS.APPLY_FORCE' | translate }}</span>
            }
          </button>
        }
        <button class="rr-close-btn" (click)="close()">{{ 'COMMON.CLOSE' | translate }}</button>
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; font-family: 'Poppins', sans-serif; }

    /* Palette: navy di default, bronzo per le sfide 1v1 */
    .rr {
      --rr-1: #0A3D91; --rr-2: #1565C0; --rr-3: #4FC3F7;
      --rr-tint: rgba(10, 61, 145, 0.06);
      --rr-line: rgba(10, 61, 145, 0.14);
      --rr-shadow: rgba(10, 61, 145, 0.28);
      background: #fff;
      border-radius: 20px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 90vh;
    }
    .rr.duel-theme {
      --rr-1: #0B5F73; --rr-2: #0E7490; --rr-3: #14A3B8;
      --rr-tint: rgba(11, 95, 115, 0.07);
      --rr-line: rgba(11, 95, 115, 0.2);
      --rr-shadow: rgba(11, 95, 115, 0.3);
    }

    /* ── Header ── */
    .rr-header {
      position: relative;
      display: flex; align-items: center; justify-content: center; gap: 10px;
      padding: 16px 52px 16px 20px;
      background: linear-gradient(135deg, var(--rr-1) 0%, var(--rr-2) 60%, var(--rr-3) 100%);
      flex-shrink: 0;
    }
    .rr-header-icon {
      width: 32px; height: 32px; border-radius: 50%;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
    }
    .rr-header-icon mat-icon { color: #fff; font-size: 19px; width: 19px; height: 19px; }
    .rr-title { margin: 0; font-size: 0.98rem; font-weight: 800; color: #fff; letter-spacing: 0.4px; text-transform: uppercase; }
    .rr-close-x {
      position: absolute; top: 50%; right: 12px; transform: translateY(-50%);
      width: 32px; height: 32px; border: none; border-radius: 50%; cursor: pointer;
      background: rgba(255,255,255,0.2);
      display: flex; align-items: center; justify-content: center;
      transition: background 0.2s, transform 0.25s;
    }
    .rr-close-x mat-icon { color: #fff; font-size: 18px; width: 18px; height: 18px; }
    .rr-close-x:hover { background: rgba(255,255,255,0.35); transform: translateY(-50%) rotate(90deg); }

    /* ── Selettore giornate ── */
    .rr-nav {
      display: flex; align-items: center; gap: 6px;
      padding: 10px 10px; background: var(--rr-tint); flex-shrink: 0;
    }
    .rr-arrow {
      flex-shrink: 0; width: 30px; height: 30px; border-radius: 50%;
      border: 1px solid var(--rr-line); background: #fff; color: var(--rr-1);
      display: flex; align-items: center; justify-content: center; cursor: pointer;
    }
    .rr-arrow mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .rr-arrow:disabled { opacity: 0.35; cursor: default; }
    .rr-chips-wrap { flex: 1; min-width: 0; overflow-x: auto; scrollbar-width: none; scroll-behavior: smooth; }
    .rr-chips-wrap::-webkit-scrollbar { display: none; }
    .rr-chips { display: flex; gap: 6px; width: max-content; padding: 2px; }
    .round-chip {
      border: 1px solid var(--rr-line); background: #fff; color: #64748B;
      border-radius: 20px; padding: 6px 14px; font-family: inherit;
      font-size: 0.78rem; font-weight: 600; cursor: pointer; white-space: nowrap;
      transition: all 0.2s ease;
    }
    .round-chip.pre-lega { opacity: 0.7; }
    .round-chip.active {
      background: linear-gradient(135deg, var(--rr-1), var(--rr-3)); color: #fff; border-color: transparent;
      box-shadow: 0 4px 12px var(--rr-shadow); opacity: 1; transform: scale(1.04);
    }

    .rr-hint {
      display: flex; align-items: center; justify-content: center; gap: 6px;
      padding: 8px 14px; font-size: 0.76rem; font-weight: 500; color: var(--rr-1);
      background: var(--rr-tint); border-top: 1px solid var(--rr-line); flex-shrink: 0;
    }
    .rr-hint mat-icon { font-size: 16px; width: 16px; height: 16px; }

    /* ── Corpo: card partite ── */
    .rr-body { flex: 1; overflow-y: auto; padding: 12px 12px 6px; -webkit-overflow-scrolling: touch; min-height: 160px; }
    .rr-body::-webkit-scrollbar { width: 4px; }
    .rr-body::-webkit-scrollbar-thumb { background: var(--rr-line); border-radius: 4px; }
    .rr-list { display: flex; flex-direction: column; gap: 10px; }

    .rr-card {
      position: relative;
      display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 8px;
      padding: 12px 10px 10px;
      border-radius: 16px;
      background: #fff;
      border: 1.5px solid var(--rr-line);
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.05);
      transition: transform 0.18s ease, box-shadow 0.2s ease, border-color 0.2s ease, background 0.2s ease;
      animation: rr-in 0.4s ease both;
    }
    .rr-card.clickable { cursor: pointer; }
    .rr-card.clickable:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(15, 23, 42, 0.1); }
    .rr-card.selected {
      border-color: var(--rr-3);
      background: linear-gradient(135deg, #fff 55%, var(--rr-tint));
      box-shadow: 0 0 0 3px var(--rr-tint), 0 8px 22px var(--rr-shadow);
      transform: scale(1.015);
    }
    .rr-card.forzata { border-color: rgba(217, 119, 6, 0.5); background: linear-gradient(135deg, #fff 60%, rgba(251, 191, 36, 0.12)); }
    .rr-card.forzata.selected { border-color: #D97706; }
    @keyframes rr-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }

    .rr-team { display: flex; flex-direction: column; align-items: center; gap: 6px; min-width: 0; }
    .rr-logo {
      position: relative; width: 44px; height: 44px; border-radius: 50%;
      background: var(--rr-tint); display: flex; align-items: center; justify-content: center; overflow: hidden;
    }
    .rr-logo img { position: relative; z-index: 1; width: 34px; height: 34px; object-fit: contain; }
    .rr-logo-fb { display: none; font-size: 0.72rem; font-weight: 800; color: var(--rr-1); letter-spacing: 0.3px; }
    .rr-logo.no-img .rr-logo-fb { display: block; }
    .rr-name {
      max-width: 100%; text-align: center; font-size: 0.78rem; font-weight: 700; line-height: 1.2; color: #1F2937;
      display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
    }

    .rr-mid { display: flex; flex-direction: column; align-items: center; gap: 4px; }
    .rr-score {
      min-width: 64px; text-align: center; padding: 4px 12px; border-radius: 12px;
      font-size: 1.35rem; font-weight: 800; color: var(--rr-1); background: var(--rr-tint); letter-spacing: 1px;
    }
    .rr-score.pending { font-size: 0.95rem; color: #94A3B8; text-transform: lowercase; }
    .rr-dash { margin: 0 3px; opacity: 0.55; }
    .rr-status {
      display: inline-flex; align-items: center; gap: 5px; padding: 2px 9px; border-radius: 20px;
      font-size: 0.6rem; font-weight: 700; letter-spacing: 0.4px; text-transform: uppercase;
      background: #EEF1F5; color: #64748B;
    }
    .rr-status.done { background: rgba(16, 185, 129, 0.14); color: #047857; }
    .rr-status.live { background: rgba(239, 68, 68, 0.13); color: #B91C1C; }
    .rr-live-dot { width: 6px; height: 6px; border-radius: 50%; background: #EF4444; animation: rr-pulse 1.3s ease-in-out infinite; }
    @keyframes rr-pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.4; transform: scale(1.4); } }
    .rr-time { font-size: 0.66rem; color: #94A3B8; font-weight: 500; }

    .rr-forced-tag {
      position: absolute; top: -9px; left: 12px; display: inline-flex; align-items: center; gap: 3px;
      padding: 1px 8px 1px 5px; border-radius: 20px; font-size: 0.58rem; font-weight: 800; letter-spacing: 0.4px;
      text-transform: uppercase; color: #fff; background: linear-gradient(135deg, #D97706, #F59E0B);
      box-shadow: 0 2px 6px rgba(217, 119, 6, 0.4);
    }
    .rr-forced-tag mat-icon { font-size: 11px; width: 11px; height: 11px; }

    .rr-check {
      position: absolute; top: -9px; right: 12px; width: 22px; height: 22px; border-radius: 50%;
      background: linear-gradient(135deg, var(--rr-1), var(--rr-3)); color: #fff;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 3px 8px var(--rr-shadow);
      transform: scale(0); transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
    .rr-check mat-icon { font-size: 15px; width: 15px; height: 15px; }
    .rr-card.selected .rr-check { transform: scale(1); }
    .rr-saving { position: absolute; inset: 0; border-radius: 16px; background: rgba(255,255,255,0.7); display: flex; align-items: center; justify-content: center; }

    .spin-icon { animation: rr-spin 0.9s linear infinite; }
    @keyframes rr-spin { to { transform: rotate(360deg); } }

    .rr-loading, .rr-empty {
      display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 10px;
      padding: 40px 20px; color: #94A3B8; font-size: 0.85rem;
    }
    .rr-empty mat-icon { font-size: 40px; width: 40px; height: 40px; opacity: 0.6; }
    .rr-spinner { width: 30px; height: 30px; border-radius: 50%; border: 3px solid var(--rr-tint); border-top-color: var(--rr-3); animation: rr-spin 0.8s linear infinite; }

    /* ── Footer con azioni ── */
    .rr-footer {
      display: flex; flex-direction: column; gap: 8px; padding: 12px 14px 14px; flex-shrink: 0;
      background: #fff; border-top: 1px solid var(--rr-line); box-shadow: 0 -6px 16px rgba(15, 23, 42, 0.05);
    }
    .rr-selected-label { text-align: center; font-size: 0.74rem; font-weight: 600; color: var(--rr-1); }
    .rr-apply {
      width: 100%; display: flex; align-items: center; justify-content: center; gap: 8px;
      padding: 13px 16px; border: none; border-radius: 14px; cursor: pointer; font-family: inherit;
      font-size: 0.92rem; font-weight: 800; letter-spacing: 0.3px; color: #fff;
      background: linear-gradient(135deg, var(--rr-1), var(--rr-3));
      box-shadow: 0 6px 18px var(--rr-shadow);
      transition: transform 0.15s ease, box-shadow 0.2s ease, opacity 0.2s ease;
    }
    .rr-apply mat-icon { font-size: 20px; width: 20px; height: 20px; }
    .rr-apply:hover:not(:disabled) { transform: translateY(-2px); }
    .rr-apply:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; background: #94A3B8; }
    .rr-apply.remove-mode:not(:disabled) { background: linear-gradient(135deg, #B91C1C, #EF4444); box-shadow: 0 6px 18px rgba(185, 28, 28, 0.3); }
    .rr-close-btn {
      width: 100%; padding: 9px; border: none; background: transparent; cursor: pointer; font-family: inherit;
      font-size: 0.85rem; font-weight: 600; color: #64748B; border-radius: 12px; transition: background 0.2s;
    }
    .rr-close-btn:hover { background: var(--rr-tint); }

    @media (max-width: 380px) {
      .rr-card { padding: 10px 6px 8px; gap: 4px; }
      .rr-logo { width: 38px; height: 38px; }
      .rr-logo img { width: 29px; height: 29px; }
      .rr-name { font-size: 0.7rem; }
      .rr-score { font-size: 1.15rem; min-width: 54px; padding: 3px 8px; }
    }
    @media (prefers-reduced-motion: reduce) {
      .rr-card, .rr-live-dot, .spin-icon, .rr-spinner { animation: none; }
      .rr-card.selected { transform: none; }
    }
  `]
})
export class RoundResultsDialogComponent implements OnInit, AfterViewChecked {
  partite: any[] = [];
  loading = true;
  savingKey: string | null = null;
  selectedKey: string | null = null;

  /** Giornate disponibili (da giornataIniziale a giornataCorrente inclusa) */
  giornateDisponibili: number[] = [];
  currentRoundIndex = 0;

  @ViewChild('chipsWrapper') chipsWrapper?: ElementRef<HTMLElement>;
  private needsScrollToActive = false;

  /** Giornata attualmente visualizzata */
  get currentGiornata(): number {
    return this.giornateDisponibili[this.currentRoundIndex] ?? this.data.giornata;
  }

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: RoundResultsData,
    private dialogRef: MatDialogRef<RoundResultsDialogComponent>,
    private campionatoService: CampionatoService,
    private adminService: AdminService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // v3 - giornate da 1 a giornataCorrente
    this.buildGiornateDisponibili();
    this.needsScrollToActive = true;
    this.loadPartite();
  }

  ngAfterViewChecked(): void {
    if (this.needsScrollToActive && this.chipsWrapper) {
      this.scrollToActiveChip();
      this.needsScrollToActive = false;
    }
  }

  scrollToActiveChip(): void {
    if (!this.chipsWrapper) return;
    const wrapper = this.chipsWrapper.nativeElement;
    const activeChip = wrapper.querySelector('.round-chip.active') as HTMLElement;
    if (activeChip) {
      const chipLeft = activeChip.offsetLeft;
      const chipWidth = activeChip.offsetWidth;
      const wrapperWidth = wrapper.offsetWidth;
      wrapper.scrollLeft = chipLeft - wrapperWidth / 2 + chipWidth / 2;
    }
  }

  buildGiornateDisponibili(): void {
    const lega = this.data.lega;

    // Partiamo sempre da 1: l'admin deve poter vedere e forzare qualsiasi giornata passata
    const giornataIniziale = 1;

    // Giornata corrente = ultima giornata disponibile da mostrare
    const giornataCorrente = this.data.giornata
      ?? lega?.giornataCorrente
      ?? lega?.giornataIniziale
      ?? 1;

    // Numero massimo giornate del campionato
    const maxGiornate = lega?.campionato?.numGiornate ?? giornataCorrente;

    // Mostra tutte le giornate: passate, corrente e future
    const fine = maxGiornate;

    this.giornateDisponibili = [];
    for (let g = giornataIniziale; g <= fine; g++) {
      this.giornateDisponibili.push(g);
    }

    if (this.giornateDisponibili.length === 0) {
      this.giornateDisponibili = [fine];
    }

    // Apri sulla giornata corrente (non sull'ultima)
    const indexCorrente = this.giornateDisponibili.indexOf(giornataCorrente);
    this.currentRoundIndex = indexCorrente >= 0 ? indexCorrente : this.giornateDisponibili.length - 1;
  }

  goToRound(index: number): void {
    if (index < 0 || index >= this.giornateDisponibili.length) return;
    if (index === this.currentRoundIndex) return;
    this.currentRoundIndex = index;
    this.selectedKey = null;
    this.needsScrollToActive = true;
    this.loadPartite();
  }

  goToPrevRound(): void {
    this.goToRound(this.currentRoundIndex - 1);
  }

  goToNextRound(): void {
    this.goToRound(this.currentRoundIndex + 1);
  }

  loadPartite(): void {
    if (!this.data.lega?.campionato?.id) {
      this.loading = false;
      return;
    }
    this.loading = true;
    this.campionatoService.partiteDellaGiornata(
      this.data.lega.campionato.id,
      this.data.lega.anno,
      this.currentGiornata
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
        this.campionatoService.partiteDellaGiornata(
          this.data.lega.campionato.id,
          this.data.lega.anno,
          this.currentGiornata
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
    const keys: Record<string, string> = {
      DA_GIOCARE: 'ROUND_RESULTS.STATE_DA_GIOCARE',
      IN_CORSO: 'ROUND_RESULTS.STATE_IN_CORSO',
      TERMINATA: 'ROUND_RESULTS.STATE_TERMINATA',
      SOSPESA: 'ROUND_RESULTS.STATE_SOSPESA',
      RINVIATA: 'ROUND_RESULTS.STATE_RINVIATA'
    };
    return keys[stato] ? this.translate.instant(keys[stato]) : (stato || '-');
  }

  logoFor(sigla: string): string | null {
    return sigla && this.data.getTeamLogo ? this.data.getTeamLogo(sigla) : null;
  }

  onLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
    img.parentElement?.classList.add('no-img');
  }

  initials(nome: string): string {
    return (nome || '?').replace(/[^A-Za-zÀ-ÿ0-9 ]/g, '').trim().slice(0, 3).toUpperCase();
  }

  formatDate(orario: any): string {
    if (!orario) return '';
    try {
      const d = new Date(orario);
      return d.toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
    } catch { return ''; }
  }

  getGiornataLabel(): string {
    return this.getRoundFullLabel(this.currentGiornata);
  }

  getRoundFullLabel(g: number): string {
    const lega = this.data.lega;
    if (!lega) return String(g);
    const sportId = lega.campionato?.sport?.id;
    if (sportId === 'TENNIS') return `Round ${g}`;
    if (sportId === 'BASKET') return `Day ${g}`;
    return this.translate.instant('LEAGUE.ROUND') + ' ' + g;
  }

  getRoundShortLabel(g: number): string {
    const lega = this.data.lega;
    if (!lega) return this.translate.instant('LEAGUE.ROUND') + ' ' + g;
    const sportId = lega.campionato?.sport?.id;
    if (sportId === 'TENNIS') return `Round ${g}`;
    if (sportId === 'BASKET') return `Day ${g}`;
    return this.translate.instant('LEAGUE.ROUND') + ' ' + g;
  }

  close(): void {
    this.dialogRef.close();
  }
}

