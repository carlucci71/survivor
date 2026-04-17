import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { ClassificaRow, Partita } from '../../core/models/interfaces.model';

export interface StudioGiocataDialogData {
  partite: Partita[];
  classifica: ClassificaRow[];
  giornataLabel: string;
}

@Component({
  selector: 'app-studio-giocata-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule, TranslateModule],
  template: `
    <div class="sg-dialog">
      <!-- Header -->
      <div class="sg-header">
        <div class="sg-header-title">
          <span class="sg-header-icon">🔍</span>
          <span>{{ data.giornataLabel }}</span>
        </div>
        <button class="sg-close" (click)="close()"><mat-icon>close</mat-icon></button>
      </div>

      <!-- Tabs -->
      <div class="sg-tabs">
        <button class="sg-tab" [class.active]="tab === 'calendario'" (click)="tab = 'calendario'">
          <mat-icon>calendar_month</mat-icon>{{ 'LEAGUE.STUDIO.TAB_CALENDAR' | translate }}
        </button>
        <button class="sg-tab" [class.active]="tab === 'classifica'" (click)="tab = 'classifica'">
          <mat-icon>leaderboard</mat-icon>{{ 'LEAGUE.STUDIO.TAB_STANDINGS' | translate }}
        </button>
      </div>

      <!-- Calendario -->
      @if (tab === 'calendario') {
        <div class="sg-body">
          @if (data.partite.length === 0) {
            <div class="sg-empty">
              <mat-icon>sports_soccer</mat-icon>
              <span>Nessuna partita trovata</span>
            </div>
          }
          @for (p of data.partite; track p.casaSigla + p.giornata) {
            <div class="sg-match"
                 [class.terminata]="p.stato.value === 'TERMINATA'"
                 [class.in-corso]="p.stato.value === 'IN_CORSO'">
              <div class="sg-match-meta">
                <span class="sg-match-time">{{ p.orario | date:'EEE d MMM · HH:mm' }}</span>
                @if (p.stato.value === 'IN_CORSO') {
                  <span class="sg-badge live">● LIVE</span>
                } @else if (p.stato.value === 'TERMINATA') {
                  <span class="sg-badge fin">FIN</span>
                }
              </div>
              <div class="sg-match-row">
                <div class="sg-team-block home">
                  <span class="sg-team-name">{{ p.casaNome }}</span>
                </div>
                @if (p.stato.value === 'TERMINATA' || p.stato.value === 'IN_CORSO') {
                  <div class="sg-score">
                    <span class="sc">{{ p.scoreCasa }}</span>
                    <span class="sep">–</span>
                    <span class="sc">{{ p.scoreFuori }}</span>
                  </div>
                } @else {
                  <div class="sg-vs">VS</div>
                }
                <div class="sg-team-block away">
                  <span class="sg-team-name">{{ p.fuoriNome }}</span>
                </div>
              </div>
            </div>
          }
        </div>
      }

      <!-- Classifica -->
      @if (tab === 'classifica') {
        <div class="sg-standings-wrap">
          @if (data.classifica.length === 0) {
            <div class="sg-empty"><mat-icon>leaderboard</mat-icon><span>Classifica non disponibile</span></div>
          } @else {
            <div class="sg-standings-head">
              <span class="sth-rank">#</span>
              <span class="sth-team">{{ 'LEAGUE.STUDIO.TEAM' | translate }}</span>
              <span class="sth-num">PG</span>
              <span class="sth-num">V</span>
              <span class="sth-num">N</span>
              <span class="sth-num">P</span>
              <span class="sth-num">GD</span>
              <span class="sth-pts">PT</span>
            </div>
            <div class="sg-standings-body">
              @for (row of data.classifica; track row.sigla; let i = $index) {
                <div class="sg-standing-row" [class.pos1]="i===0" [class.pos2]="i===1" [class.pos3]="i===2">
                  <span class="sth-rank medal">
                    @if (i === 0) { 🥇 }
                    @else if (i === 1) { 🥈 }
                    @else if (i === 2) { 🥉 }
                    @else { {{ i + 1 }} }
                  </span>
                  <span class="sth-team">{{ row.nome }}</span>
                  <span class="sth-num">{{ row.pj }}</span>
                  <span class="sth-num">{{ row.v }}</span>
                  <span class="sth-num">{{ row.n }}</span>
                  <span class="sth-num">{{ row.p }}</span>
                  <span class="sth-num gd" [class.pos]="row.gf - row.gs > 0" [class.neg]="row.gf - row.gs < 0">
                    {{ row.gf - row.gs > 0 ? '+' : '' }}{{ row.gf - row.gs }}
                  </span>
                  <span class="sth-pts">{{ row.punti }}</span>
                </div>
              }
            </div>
          }
        </div>
      }
    </div>
  `,
  styles: [`
    :host { font-family: 'Poppins', sans-serif; }

    .sg-dialog {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 78vh;
      max-height: 640px;
      min-height: 420px;
      overflow: hidden;
      background: #F4F7FF;
      border-radius: 18px;
    }

    /* ── Header ─────────────────────────────────── */
    .sg-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 18px 12px;
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 60%, #1976D2 100%);
      border-radius: 18px 18px 0 0;
      flex-shrink: 0;
    }
    .sg-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 0.95rem;
      font-weight: 700;
      letter-spacing: 0.4px;
    }
    .sg-header-icon { font-size: 1.1rem; }
    .sg-close {
      background: rgba(255,255,255,0.15);
      border: 1.5px solid rgba(255,255,255,0.25);
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      transition: background 0.18s, transform 0.18s;
      padding: 0;
      flex-shrink: 0;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: rgba(255,255,255,0.28); transform: scale(1.08); }
    }

    /* ── Tabs ───────────────────────────────────── */
    .sg-tabs {
      display: flex;
      background: #fff;
      border-bottom: 2px solid #E8EEF8;
      flex-shrink: 0;
    }
    .sg-tab {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      background: none;
      border: none;
      border-bottom: 3px solid transparent;
      margin-bottom: -2px;
      color: #94A3B8;
      font-family: 'Poppins', sans-serif;
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.6px;
      text-transform: uppercase;
      padding: 12px 8px;
      cursor: pointer;
      transition: color 0.18s, border-color 0.18s;
      mat-icon { font-size: 14px; width: 14px; height: 14px; }
      &.active { color: #0A3D91; border-bottom-color: #4FC3F7; }
      &:hover:not(.active) { color: #475569; }
    }

    /* ── Calendario ─────────────────────────────── */
    .sg-body {
      padding: 10px 10px 6px;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .sg-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 40px 0;
      color: #94A3B8;
      font-size: 0.82rem;
      mat-icon { font-size: 36px; width: 36px; height: 36px; opacity: 0.3; }
    }

    .sg-match {
      background: #fff;
      border-radius: 12px;
      padding: 9px 12px 11px;
      border: 1.5px solid #E8EEF8;
      box-shadow: 0 2px 8px rgba(10,61,145,0.05);
      border-left: 4px solid #CBD5E1;
      transition: box-shadow 0.18s, transform 0.18s;

      &:hover { box-shadow: 0 4px 16px rgba(10,61,145,0.11); transform: translateY(-1px); }
      &.in-corso { border-left-color: #4FC3F7; background: linear-gradient(135deg, #fff 80%, rgba(79,195,247,0.04) 100%); }
      &.terminata { border-left-color: #CBD5E1; opacity: 0.85; }
    }

    .sg-match-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 8px;
    }
    .sg-match-time {
      font-size: 0.68rem;
      font-weight: 600;
      color: #64748B;
      letter-spacing: 0.3px;
      text-transform: capitalize;
    }

    .sg-badge {
      font-size: 0.6rem;
      font-weight: 800;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 20px;
      &.live {
        background: linear-gradient(90deg, #0A3D91, #4FC3F7);
        color: #fff;
        animation: pulse-live 1.4s ease-in-out infinite;
      }
      &.fin { background: #E2E8F0; color: #64748B; }
    }
    @keyframes pulse-live {
      0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(79,195,247,0.4); }
      50% { opacity: 0.85; box-shadow: 0 0 0 4px rgba(79,195,247,0); }
    }

    .sg-match-row {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .sg-team-block {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 7px;
      min-width: 0;
      &.home { flex-direction: row; }
      &.away { flex-direction: row-reverse; }
    }
    .sg-team-badge {
      width: 30px;
      height: 30px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.52rem;
      font-weight: 800;
      letter-spacing: 0.5px;
      flex-shrink: 0;
      &.home-badge { background: linear-gradient(135deg, #0A3D91, #1565C0); color: #fff; }
      &.away-badge { background: linear-gradient(135deg, #1E293B, #334155); color: #fff; }
    }
    .sg-team-name {
      font-size: 0.78rem;
      font-weight: 700;
      color: #1E293B;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      .home & { text-align: left; }
      .away & { text-align: right; }
    }

    .sg-score {
      display: flex;
      align-items: center;
      gap: 4px;
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      border-radius: 8px;
      padding: 4px 10px;
      flex-shrink: 0;
      min-width: 52px;
      justify-content: center;
      .sc { font-size: 0.88rem; font-weight: 800; color: #fff; min-width: 12px; text-align: center; }
      .sep { font-size: 0.8rem; color: rgba(255,255,255,0.5); font-weight: 400; }
    }

    .sg-vs {
      font-size: 0.7rem;
      font-weight: 700;
      color: #94A3B8;
      min-width: 32px;
      text-align: center;
      flex-shrink: 0;
      letter-spacing: 1px;
    }

    /* ── Classifica ─────────────────────────────── */
    .sg-standings-wrap {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex: 1;
    }
    .sg-standings-head {
      display: grid;
      grid-template-columns: 32px 1fr 28px 24px 24px 24px 32px 34px;
      gap: 2px;
      padding: 8px 12px;
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .sg-standings-body {
      overflow-y: auto;
      flex: 1;
    }
    .sg-standing-row {
      display: grid;
      grid-template-columns: 32px 1fr 28px 24px 24px 24px 32px 34px;
      gap: 2px;
      padding: 10px 12px;
      border-bottom: 1px solid #F1F5F9;
      align-items: center;
      transition: background 0.12s;
      background: #fff;
      &:hover { background: #F8FAFF; }
      &:last-child { border-bottom: none; }
      &.pos1 { background: linear-gradient(90deg, rgba(255,214,0,0.08) 0%, #fff 100%); }
      &.pos2 { background: linear-gradient(90deg, rgba(192,192,192,0.08) 0%, #fff 100%); }
      &.pos3 { background: linear-gradient(90deg, rgba(205,127,50,0.07) 0%, #fff 100%); }
    }
    .sth-rank {
      font-size: 0.7rem;
      font-weight: 700;
      color: rgba(255,255,255,0.7);
      text-align: center;
      &.medal { font-size: 1rem; line-height: 1; }
      .sg-standing-row & { color: #64748B; }
    }
    .sth-team {
      font-size: 0.68rem;
      font-weight: 700;
      color: rgba(255,255,255,0.85);
      text-transform: uppercase;
      letter-spacing: 0.4px;
      .sg-standing-row & {
        font-size: 0.8rem;
        font-weight: 600;
        color: #1E293B;
        text-transform: none;
        letter-spacing: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
    .sth-num {
      font-size: 0.68rem;
      font-weight: 700;
      color: rgba(255,255,255,0.7);
      text-align: center;
      .sg-standing-row & { font-size: 0.75rem; font-weight: 400; color: #475569; }
    }
    .sth-pts {
      font-size: 0.68rem;
      font-weight: 800;
      color: #4FC3F7;
      text-align: center;
      .sg-standing-row & { font-size: 0.85rem; font-weight: 800; color: #0A3D91; }
    }
    .gd {
      font-size: 0.74rem;
      font-weight: 700;
      text-align: center;
      &.pos { color: #16A34A; }
      &.neg { color: #DC2626; }
    }

    @media (max-width: 400px) {
      .sg-team-badge { width: 24px; height: 24px; font-size: 0.45rem; border-radius: 6px; }
      .sg-team-name { font-size: 0.72rem; }
      .sg-score { padding: 3px 7px; min-width: 44px; .sc { font-size: 0.8rem; } }
      .sg-standings-head, .sg-standing-row {
        grid-template-columns: 26px 1fr 24px 20px 20px 20px 26px 28px;
        padding: 8px 8px;
      }
    }
  `]
})
export class StudioGiocataDialogComponent {
  tab: 'calendario' | 'classifica' = 'calendario';

  constructor(
    public dialogRef: MatDialogRef<StudioGiocataDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudioGiocataDialogData
  ) {}

  close(): void { this.dialogRef.close(); }

  getInitials(nome: string): string {
    if (!nome) return '?';
    const words = nome.trim().split(/\s+/);
    if (words.length === 1) return nome.substring(0, 3).toUpperCase();
    return words.map(w => w[0]).join('').substring(0, 3).toUpperCase();
  }
}
