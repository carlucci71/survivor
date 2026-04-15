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
          <span class="sg-icon">🔍</span>
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
            <div class="sg-empty"><mat-icon>sports_soccer</mat-icon><span>Nessuna partita trovata</span></div>
          }
          @for (p of data.partite; track p.casaSigla + p.giornata) {
            <div class="sg-match"
                 [class.terminata]="p.stato.value === 'TERMINATA'"
                 [class.in-corso]="p.stato.value === 'IN_CORSO'">
              <div class="sg-match-header">
                <span class="sg-match-time">{{ p.orario | date:'EEE d MMM · HH:mm' }}</span>
                @if (p.stato.value === 'IN_CORSO') {
                  <span class="sg-badge live">LIVE</span>
                } @else if (p.stato.value === 'TERMINATA') {
                  <span class="sg-badge fin">FIN</span>
                }
              </div>
              <div class="sg-match-row">
                <span class="sg-team home">{{ p.casaNome }}</span>
                @if (p.stato.value === 'TERMINATA' || p.stato.value === 'IN_CORSO') {
                  <span class="sg-score">
                    <span class="sc">{{ p.scoreCasa }}</span>
                    <span class="sep">-</span>
                    <span class="sc">{{ p.scoreFuori }}</span>
                  </span>
                } @else {
                  <span class="sg-vs">vs</span>
                }
                <span class="sg-team away">{{ p.fuoriNome }}</span>
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
    .sg-dialog {
      display: flex;
      flex-direction: column;
      width: 100%;
      max-height: 85vh;
      overflow: hidden;
      background: #fff;
      border-radius: 16px;
    }

    /* Header */
    .sg-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 14px 16px 10px;
      background: linear-gradient(135deg, #0A3D91, #1565c0);
      border-radius: 16px 16px 0 0;
    }

    .sg-header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #fff;
      font-size: 0.9rem;
      font-weight: 700;
      letter-spacing: 0.3px;

      .sg-icon { font-size: 1rem; }
    }

    .sg-close {
      background: rgba(255,255,255,0.15);
      border: none;
      border-radius: 50%;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #fff;
      transition: background 0.18s;
      padding: 0;

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover { background: rgba(255,255,255,0.25); }
    }

    /* Tabs */
    .sg-tabs {
      display: flex;
      border-bottom: 1px solid #E5E7EB;
      background: #F9FAFB;
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
      color: #6B7280;
      font-size: 0.73rem;
      font-weight: 600;
      letter-spacing: 0.4px;
      text-transform: uppercase;
      padding: 11px 8px;
      cursor: pointer;
      transition: color 0.18s, border-color 0.18s;

      mat-icon { font-size: 15px; width: 15px; height: 15px; }

      &.active {
        color: #0A3D91;
        border-bottom-color: #0A3D91;
        background: #fff;
      }
      &:hover:not(.active) { color: #374151; }
    }

    /* Calendario */
    .sg-body {
      padding: 6px 8px;
      overflow-y: auto;
      flex: 1;
    }

    .sg-empty {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 6px;
      padding: 32px 0;
      color: #9CA3AF;
      font-size: 0.82rem;

      mat-icon { font-size: 32px; width: 32px; height: 32px; opacity: 0.35; }
    }

    .sg-match {
      padding: 5px 8px;
      border-radius: 8px;
      border: 1px solid #E5E7EB;
      background: #FAFAFA;
      margin-bottom: 3px;
      transition: box-shadow 0.14s;

      &:hover { box-shadow: 0 2px 8px rgba(10,61,145,0.07); }
      &.terminata { border-left: 3px solid #D1D5DB; }
      &.in-corso  { border-left: 3px solid #1565c0; background: rgba(10,61,145,0.02); }
    }

    .sg-match-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 2px;
    }

    .sg-match-time {
      flex: 1;
      font-size: 0.67rem;
      color: #6B7280;
      text-transform: capitalize;
    }

    .sg-badge {
      font-size: 0.58rem;
      font-weight: 700;
      letter-spacing: 0.5px;
      padding: 1px 5px;
      border-radius: 4px;

      &.live { background: #1565c0; color: #fff; animation: pulse-live 1.4s ease-in-out infinite; }
      &.fin  { background: #E5E7EB; color: #6B7280; }
    }

    @keyframes pulse-live {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.55; }
    }

    .sg-match-row {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .sg-team {
      flex: 1;
      font-size: 0.76rem;
      font-weight: 600;
      color: #111827;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.home { text-align: right; }
      &.away { text-align: left; }
    }

    .sg-score {
      display: flex;
      align-items: center;
      gap: 3px;
      font-size: 0.82rem;
      font-weight: 700;
      color: #0A3D91;
      min-width: 34px;
      justify-content: center;
      background: rgba(10,61,145,0.07);
      border-radius: 5px;
      padding: 1px 5px;
      flex-shrink: 0;

      .sc  { min-width: 12px; text-align: center; }
      .sep { color: #9CA3AF; font-weight: 400; }
    }

    .sg-vs {
      font-size: 0.72rem;
      color: #9CA3AF;
      min-width: 22px;
      text-align: center;
      flex-shrink: 0;
    }

    /* Classifica */
    .sg-standings-wrap {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      flex: 1;
    }

    .sg-standings-head {
      display: grid;
      grid-template-columns: 28px 1fr 28px 24px 24px 24px 30px 32px;
      gap: 2px;
      padding: 8px 14px;
      background: #fff;
      border-bottom: 2px solid rgba(10,61,145,0.15);
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
      grid-template-columns: 28px 1fr 28px 24px 24px 24px 30px 32px;
      gap: 2px;
      padding: 9px 14px;
      border-bottom: 1px solid #F3F4F6;
      align-items: center;
      transition: background 0.12s;

      &:hover { background: rgba(10,61,145,0.025); }
      &:last-child { border-bottom: none; }
      &.pos1 { background: rgba(255,214,0,0.07); }
      &.pos2 { background: rgba(192,192,192,0.06); }
      &.pos3 { background: rgba(205,127,50,0.05); }
    }

    .sth-rank {
      font-size: 0.7rem;
      font-weight: 700;
      color: #6B7280;
      text-align: center;

      &.medal { font-size: 1rem; line-height: 1; }
    }

    .sth-team {
      font-size: 0.78rem;
      font-weight: 700;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.3px;

      .sg-standing-row & {
        font-size: 0.8rem;
        font-weight: 500;
        color: #111827;
        text-transform: none;
        letter-spacing: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .sth-num {
      font-size: 0.72rem;
      font-weight: 700;
      color: #6B7280;
      text-align: center;

      .sg-standing-row & { font-weight: 400; color: #4B5563; }
    }

    .sth-pts {
      font-size: 0.7rem;
      font-weight: 800;
      color: #0A3D91;
      text-align: center;

      .sg-standing-row & { font-size: 0.84rem; }
    }

    .gd {
      font-size: 0.74rem;
      font-weight: 600;
      text-align: center;
      &.pos { color: #16a34a; }
      &.neg { color: #dc2626; }
    }

    @media (min-width: 480px) {
      .sg-standings-head,
      .sg-standing-row {
        grid-template-columns: 30px 1fr 32px 26px 26px 26px 34px 36px;
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
}
