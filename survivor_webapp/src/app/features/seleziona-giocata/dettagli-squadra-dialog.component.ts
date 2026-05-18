import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface DettagliSquadraData {
  squadraSelezionata: string;
  squadraNome: string;
  ultimiRisultati: any[];
  prossimePartite: any[];
  ultimiRisultatiOpponent: any[];
  opponentSigla: string | null;
  teamColors: { primary: string; secondary: string };
  getDesGiornata: (risultato: any, isCasa: boolean) => string;
  sportId?: string;
  tabLabels?: {
    ultimi: string;
    prossime: string;
    opponent: string;
  };
  allSquadre?: { sigla: string; nome: string }[];
  loadStats?: (sigla: string, callback: (result: {
    squadraSigla: string;
    squadraNome: string;
    ultimi: any[];
    prossime: any[];
    opponentSigla: string | null;
    ultimiOpponent: any[];
    colors: { primary: string; secondary: string };
  }) => void) => void;
}

@Component({
  selector: 'app-dettagli-squadra-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dettagli-dialog" [style.background]="'linear-gradient(135deg, ' + localColors.primary + ', ' + localColors.secondary + ')'">
      <div class="dettagli-header">
        <!-- Search bar -->
        <ng-container *ngIf="!searchMode">
          <div class="dettagli-title">
            <span>📊</span>
            <span class="squadra-badge" [style.color]="localColors.primary">{{ localSigla }}</span>
            <button mat-icon-button class="sq-search-toggle" (click)="toggleSearchMode()">
              <mat-icon>search</mat-icon>
            </button>
          </div>
        </ng-container>
        <ng-container *ngIf="searchMode">
          <div class="sq-search-wrap" (click)="$event.stopPropagation()">
            <div class="sq-search-bar">
              <mat-icon class="sq-search-icon">search</mat-icon>
              <input class="sq-search-input"
                     [(ngModel)]="searchTerm"
                     (input)="onSearchInput()"
                     (focus)="onSearchFocus()"
                     (blur)="closeDropdownDelayed()"
                     placeholder="Cerca squadra..."
                     autocomplete="off">
              <button class="sq-clear-btn" (mousedown)="clearSearch()">
                <mat-icon>close</mat-icon>
              </button>
            </div>
            <div *ngIf="showDropdown && filteredSquadre.length > 0" class="sq-dropdown">
              <div *ngFor="let sq of filteredSquadre; trackBy: trackSigla" class="sq-dropdown-item" (mousedown)="selectTeam(sq.sigla, sq.nome)">
                <span class="sq-item-sigla">{{ sq.sigla }}</span>
                <span class="sq-item-nome">{{ sq.nome }}</span>
              </div>
            </div>
          </div>
        </ng-container>

        <button class="close-btn" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      @if(countdownActive) {
      <div class="countdown-container">
        <div class="countdown-wrapper"
             [style.borderColor]="localColors.primary"
             [style.background]="'#ffffff'">
          <div class="countdown-icon" [style.color]="localColors.primary">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="countdown-content">
            <span class="countdown-label">Prossima partita tra</span>
            <span class="countdown-time">
              {{ countdown }}
            </span>
          </div>
          <div class="countdown-pulse" [style.background]="localColors.primary"></div>
        </div>
      </div>
      }

      @if(loading) {
        <div class="loading-overlay"><span class="loading-spinner"></span></div>
      }

      <div class="tabs-container">
        <button class="tab" [class.active]="activeTab === 'ultimi'" (click)="activeTab = 'ultimi'">
          {{ data.tabLabels?.ultimi || 'Ultimi' }}
        </button>
        <button class="tab" [class.active]="activeTab === 'prossime'" (click)="activeTab = 'prossime'">
          {{ data.tabLabels?.prossime || 'Prossime' }}
        </button>
        @if(localOpponentSigla) {
        <button class="tab" [class.active]="activeTab === 'opponent'" (click)="activeTab = 'opponent'">
          {{ localOpponentSigla || data.tabLabels?.opponent }}
        </button>
        }
      </div>

      <div class="content">
        @if(activeTab === 'ultimi') {
          @if(localUltimi.length === 0) {
            <div class="no-data">Nessun risultato</div>
          } @else {
            @for(r of localUltimi.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="localColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, r.casaSigla === localSigla) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === localSigla">{{ formatNome(r.casaNome) }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === localSigla">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge" [class.v]="getEsitoFor(r, localSigla) === 'V'" [class.n]="getEsitoFor(r, localSigla) === 'N'" [class.p]="getEsitoFor(r, localSigla) === 'P'">{{ getEsitoFor(r, localSigla) }}</span>
              </div>
            }
          }
        }

        @if(activeTab === 'prossime') {
          @if(localProssime.length === 0) {
            <div class="no-data">Nessuna partita</div>
          } @else {
            @for(r of localProssime.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="localColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, r.casaSigla === localSigla) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === localSigla">{{ formatNome(r.casaNome) }}</span>
                <span class="vs">vs</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === localSigla">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge date-badge">{{ r.orario | date: 'dd/MM' }}</span>
              </div>
            }
          }
        }

        @if(activeTab === 'opponent') {
          @if(localUltimiOpponent.length === 0) {
            <div class="no-data">Nessun risultato</div>
          } @else {
            @for(r of localUltimiOpponent.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="localColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, formatNome(r.casaSigla) === localOpponentSigla) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === localOpponentSigla">{{ formatNome(r.casaNome) }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === localOpponentSigla">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge" [class.v]="getEsitoFor(r, localOpponentSigla) === 'V'" [class.n]="getEsitoFor(r, localOpponentSigla) === 'N'" [class.p]="getEsitoFor(r, localOpponentSigla) === 'P'">{{ getEsitoFor(r, localOpponentSigla) }}</span>
              </div>
            }
          }
        }
      </div>
    </div>
  `,
  styles: [`
    .dettagli-dialog {
      border-radius: 16px;
      padding: 20px;
      width: 100%;
      max-width: 600px;
      font-family: 'Poppins', sans-serif;
      overflow-x: hidden;
      box-sizing: border-box;
    }

    @media (max-width: 768px) {
      .dettagli-dialog {
        max-width: 100%;
        padding: 18px;
      }
    }

    @media (max-width: 480px) {
      .dettagli-dialog {
        max-width: 100%;
        padding: 16px;
      }
    }

    .dettagli-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 8px;
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      width: 100%;
      box-sizing: border-box;
    }

    /* SEARCH */
    .sq-search-wrap {
      position: relative;
      flex: 1;
      min-width: 0;
    }

    .sq-search-bar {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 20px;
      padding: 5px 10px;
      transition: background 0.15s;

      &:focus-within {
        background: rgba(255,255,255,0.35);
        border-color: rgba(255,255,255,0.7);
      }
    }

    .sq-search-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: rgba(255,255,255,0.85);
      flex-shrink: 0;
    }

    .sq-search-input {
      flex: 1;
      background: transparent;
      border: none;
      outline: none;
      font-size: 0.75rem;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      min-width: 0;

      &::placeholder { color: rgba(255,255,255,0.6); }
    }

    .sq-clear-btn {
      background: none;
      border: none;
      padding: 0;
      cursor: pointer;
      display: flex;
      align-items: center;
      color: rgba(255,255,255,0.7);
      flex-shrink: 0;

      mat-icon { font-size: 15px; width: 15px; height: 15px; }
    }

    .sq-dropdown {
      position: absolute;
      top: calc(100% + 4px);
      left: 0;
      right: 0;
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 8px 24px rgba(0,0,0,0.18);
      z-index: 100;
      overflow: hidden;
      max-height: 220px;
      overflow-y: auto;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.12); border-radius: 4px; }
    }

    .sq-dropdown-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 9px 14px;
      cursor: pointer;
      transition: background 0.1s;

      &:hover { background: #EFF6FF; }
      &:not(:last-child) { border-bottom: 1px solid #F3F4F6; }
    }

    .sq-item-sigla {
      font-size: 0.7rem;
      font-weight: 800;
      color: #0A3D91;
      min-width: 30px;
      flex-shrink: 0;
    }

    .sq-item-nome {
      font-size: 0.75rem;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* LOADING */
    .loading-overlay {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 12px 0 4px;
    }

    .loading-spinner {
      width: 22px;
      height: 22px;
      border: 3px solid rgba(255,255,255,0.35);
      border-top-color: #fff;
      border-radius: 50%;
      animation: spin 0.7s linear infinite;
      display: inline-block;
    }

    @keyframes spin { to { transform: rotate(360deg); } }

    /* COUNTDOWN TIMER */
    .countdown-container {
      margin: 0 0 16px 0;
      animation: slideDown 0.5s ease-out;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    @keyframes slideDown {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    .countdown-wrapper {
      position: relative;
      display: flex;
      align-items: center;
      gap: 16px;
      padding: 14px 18px;
      border-radius: 12px;
      border: 2px solid;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      animation: pulse 2s ease-in-out infinite;
      box-sizing: border-box;
      max-width: 100%;
    }

    @media (max-width: 480px) {
      .countdown-wrapper {
        gap: 12px;
        padding: 12px 16px;
        box-sizing: border-box;
      }
    }

    @keyframes pulse {
      0%, 100% {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      }
      50% {
        box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
      }
    }

    .countdown-pulse {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.05;
      animation: pulseWave 2s ease-in-out infinite;
      pointer-events: none;
    }

    @keyframes pulseWave {
      0%, 100% {
        opacity: 0.03;
        transform: scale(1);
      }
      50% {
        opacity: 0.08;
        transform: scale(1.02);
      }
    }

    .countdown-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 32px;
      animation: rotate 2s linear infinite;

      mat-icon {
        font-size: 32px;
        width: 32px;
        height: 32px;
      }
    }

    @media (max-width: 480px) {
      .countdown-icon {
        font-size: 28px;

        mat-icon {
          font-size: 28px;
          width: 28px;
          height: 28px;
        }
      }
    }

    @keyframes rotate {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }

    .countdown-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      z-index: 1;
    }

    .countdown-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: #6B7280;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .countdown-time {
      font-size: 1.4rem;
      font-weight: 800;
      font-family: 'Poppins', sans-serif;
      letter-spacing: 0.5px;
      animation: fadeIn 0.5s ease-in;
      color: #1F2937;
    }

    @media (max-width: 768px) {
      .countdown-label {
        font-size: 0.7rem;
      }

      .countdown-time {
        font-size: 1.25rem;
      }
    }

    @media (max-width: 480px) {
      .countdown-label {
        font-size: 0.65rem;
      }

      .countdown-time {
        font-size: 1.1rem;
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .dettagli-title {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.2rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    @media (max-width: 480px) {
      .dettagli-title {
        font-size: 1rem;
      }
    }

    .squadra-badge {
      padding: 6px 14px;
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      font-size: 0.9rem;
      font-weight: 800;
    }

    @media (max-width: 480px) {
      .squadra-badge {
        padding: 5px 12px;
        font-size: 0.8rem;
      }
    }

    .close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #FFFFFF;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover { background: rgba(255,255,255,0.4); }
    }
 .nav-btns {
     display: flex;
     gap: 4px;
     align-items: center;
   }
   .nav-btn {
     background: rgba(255,255,255,0.2);
     border: none;
     border-radius: 50%;
     width: 32px;
     height: 32px;
     display: flex;
     align-items: center;
     justify-content: center;
     cursor: pointer;
     transition: all 0.2s;
     color: #FFFFFF;
   }

   .sport-icon-btn {
  background: rgba(255,255,255,0.2);
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  color: #fff;
  margin-left: 8px;
}
.sport-icon-btn:hover {
  background: rgba(255,255,255,0.4);
}
.sport-icon-btn mat-icon {
  font-size: 20px;
  width: 20px;
  height: 20px;
}

.seleziona-btn {
      color: #fff;
      border: none;
      border-radius: 16px;
      padding: 0 18px;
      height: 32px;
      font-weight: 700;
      font-size: 0.85rem;
      margin-left: 8px;
      cursor: pointer;
      transition: filter 0.2s, box-shadow 0.2s;
      box-shadow: 0 2px 8px rgba(59,130,246,0.08);
    }
    .seleziona-btn:hover {
      filter: brightness(1.08);
      box-shadow: 0 4px 16px rgba(59,130,246,0.15);
    }
   
   .nav-btn mat-icon {
     font-size: 20px;
     width: 20px;
     height: 20px;
   }
   .nav-btn:hover {
     background: rgba(255,255,255,0.4);
   }

    .tabs-container {
      display: flex;
      gap: 8px;
      margin-bottom: 14px;
      width: 100%;
      box-sizing: border-box;
      overflow-x: hidden;
    }

    .tab {
      flex: 1;
      padding: 10px 12px;
      background: rgba(255,255,255,0.85);
      border: none;
      border-radius: 8px;
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #374151;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      min-width: 0;

      &.active {
        background: #FFFFFF;
        box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        font-weight: 700;
      }
    }

    @media (max-width: 480px) {
      .tab {
        padding: 8px 10px;
        font-size: 0.7rem;
      }
    }

    .content {
      background: rgba(255,255,255,0.95);
      border-radius: 10px;
      padding: 12px;
      max-height: 380px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;

      &::-webkit-scrollbar { width: 4px; }
      &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 4px; }
    }

    @media (max-width: 768px) {
      .content {
        max-height: 340px;
        padding: 10px;
      }
    }

    @media (max-width: 480px) {
      .content {
        max-height: 280px;
        padding: 8px;
      }
    }

    .row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: #F8FAFC;
      border-radius: 6px;
      border-left: 3px solid;
      margin-bottom: 6px;
      font-size: 0.7rem;
      box-sizing: border-box;
      max-width: 100%;

      &:last-child { margin-bottom: 0; }
    }

    @media (max-width: 768px) {
      .row {
        gap: 7px;
        padding: 7px 10px;
        font-size: 0.65rem;
      }
    }

    @media (max-width: 480px) {
      .row {
        gap: 6px;
        padding: 6px 8px;
        font-size: 0.6rem;
      }
    }

    .giornata {
      font-weight: 700;
      color: #6B7280;
      min-width: 55px;
      font-size: 0.65rem;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .giornata {
        min-width: 50px;
        font-size: 0.6rem;
      }
    }

    @media (max-width: 480px) {
      .giornata {
        min-width: 45px;
        font-size: 0.55rem;
      }
    }

    .match {
      color: #0A3D91;
      flex: 1;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.7rem;
      min-width: 0;

      &.bold { font-weight: 800; }
    }

    @media (max-width: 768px) {
      .match {
        font-size: 0.65rem;
      }
    }

    @media (max-width: 480px) {
      .match {
        font-size: 0.6rem;
      }
    }

    .score {
      font-weight: 700;
      background: #FFFFFF;
      padding: 3px 8px;
      border-radius: 4px;
      border: 1px solid #E5E7EB;
      font-size: 0.7rem;
      flex-shrink: 0;
    }

    @media (max-width: 768px) {
      .score {
        padding: 2px 7px;
        font-size: 0.65rem;
      }
    }

    @media (max-width: 480px) {
      .score {
        padding: 2px 6px;
        font-size: 0.6rem;
      }
    }

    .vs {
      color: #9CA3AF;
      font-size: 0.65rem;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .vs {
        font-size: 0.6rem;
      }
    }


    .badge {
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      color: #FFFFFF;
      font-size: 0.65rem;
      min-width: 40px;
      text-align: center;
      flex-shrink: 0;

      &.v { background: linear-gradient(135deg, #10B981, #34D399); }
      &.n { background: linear-gradient(135deg, #F59E0B, #FBBF24); }
      &.p { background: linear-gradient(135deg, #EF4444, #F87171); }

      &.date-badge {
        background: linear-gradient(135deg, #6B7280, #9CA3AF);
      }
    }

    @media (max-width: 768px) {
      .badge {
        padding: 2px 7px;
        font-size: 0.6rem;
        min-width: 38px;
      }
    }

    @media (max-width: 480px) {
      .badge {
        padding: 2px 6px;
        font-size: 0.55rem;
        min-width: 35px;
      }
    }

    .no-data {
      text-align: center;
      color: #6B7280;
      padding: 30px;
      font-size: 0.85rem;
    }

    @media (max-width: 480px) {
      .no-data {
        padding: 20px;
        font-size: 0.75rem;
      }
    }
  `]
})
export class DettagliSquadraDialogComponent implements OnDestroy {
  searchMode = false;

  getSportIcon(sportId?: string): string {
    switch ((sportId || '').toUpperCase()) {
      case 'CALCIO':
        return 'sports_soccer';
      case 'BASKET':
        return 'sports_basketball';
      case 'TENNIS':
        return 'sports_tennis';
      case 'VOLLEY':
        return 'sports_volleyball';
      default:
        return 'sports_soccer'; // fallback to soccer ball
    }
  }


  toggleSearchMode() {
    this.searchMode = !this.searchMode;
    if (!this.searchMode) {
      this.clearSearch();
    }
  }

  trackSigla(index: number, item: any) {
    return item.sigla;
  }

  currentSquadraIndex: number = 0;

  activeTab: 'ultimi' | 'prossime' | 'opponent' = 'ultimi';
  countdown: string = '';
  countdownActive: boolean = false;
  private intervalId: any;

  // Local mutable state (changes when user searches a different team)
  localSigla: string;
  localNome: string;
  localUltimi: any[];
  localProssime: any[];
  localOpponentSigla: string | null;
  localUltimiOpponent: any[];
  localColors: { primary: string; secondary: string };
  loading = false;

  // Search state
  searchTerm = '';
  showDropdown = false;
  filteredSquadre: { sigla: string; nome: string }[] = [];

  constructor(
    public dialogRef: MatDialogRef<DettagliSquadraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DettagliSquadraData
  ) {
    // Imposta l'indice corrente della squadra selezionata
    if (data.allSquadre) {
      this.currentSquadraIndex = data.allSquadre.findIndex(sq => sq.sigla === data.squadraSelezionata);
      if (this.currentSquadraIndex === -1) this.currentSquadraIndex = 0;
    }
    this.localSigla = data.squadraSelezionata;
    this.localNome = data.squadraNome;
    this.localUltimi = [...data.ultimiRisultati];
    this.localProssime = [...data.prossimePartite];
    this.localOpponentSigla = data.opponentSigla;
    this.localUltimiOpponent = [...data.ultimiRisultatiOpponent];
    this.localColors = { ...data.teamColors };
    this.startCountdownFromPartite(data.prossimePartite);
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

   selezionaSquadraDialog() {
     this.dialogRef.close({ selezionata: this.localSigla });
   }  
  // ── Navigazione prev/next squadre ──
  navigateSquadra(direction: number): void {
    if (!this.data.allSquadre || this.data.allSquadre.length === 0) return;
    const len = this.data.allSquadre.length;
    this.currentSquadraIndex = (this.currentSquadraIndex + direction + len) % len;
    const next = this.data.allSquadre[this.currentSquadraIndex];
    this.selectTeam(next.sigla, next.nome);
  }

  // ── Search methods ──────────────────────────────────────────────

  onSearchInput(): void {
    const term = this.searchTerm.trim().toLowerCase();
    if (!term) {
      this.filteredSquadre = [];
      this.showDropdown = false;
      return;
    }
    this.filteredSquadre = (this.data.allSquadre || [])
      .filter(s => s.nome.toLowerCase().includes(term) || s.sigla.toLowerCase().includes(term))
      .slice(0, 8);
    this.showDropdown = this.filteredSquadre.length > 0;
  }

  onSearchFocus(): void {
    if (this.searchTerm.trim() && this.filteredSquadre.length > 0) {
      this.showDropdown = true;
    }
  }

  closeDropdownDelayed(): void {
    setTimeout(() => { this.showDropdown = false; }, 200);
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.filteredSquadre = [];
    this.showDropdown = false;
    this.searchMode = false;
  }

  selectTeam(sigla: string, nome: string): void {
    // Aggiorna currentSquadraIndex se cambia da navigazione manuale
    if (this.data.allSquadre) {
      const idx = this.data.allSquadre.findIndex(sq => sq.sigla === sigla);
      if (idx !== -1) this.currentSquadraIndex = idx;
    }
    this.clearSearch();
    if (!this.data.loadStats) return;
    this.loading = true;
    this.data.loadStats(sigla, (result) => {
      this.localSigla = result.squadraSigla;
      this.localNome = result.squadraNome;
      this.localUltimi = result.ultimi;
      this.localProssime = result.prossime;
      this.localOpponentSigla = result.opponentSigla;
      this.localUltimiOpponent = result.ultimiOpponent;
      this.localColors = result.colors;
      this.loading = false;
      this.activeTab = 'ultimi';
      if (this.intervalId) clearInterval(this.intervalId);
      this.startCountdownFromPartite(result.prossime);
    });
  }

  // ── Countdown ───────────────────────────────────────────────────

  private startCountdownFromPartite(partite: any[]): void {
    const prossimaPartita = partite && partite.length > 0 ? partite[0] : null;
    if (!prossimaPartita || !prossimaPartita.orario) {
      this.countdownActive = false;
      return;
    }

    const updateCountdown = () => {
      const now = new Date().getTime();
      const matchTime = new Date(prossimaPartita.orario).getTime();
      const distance = matchTime - now;

      if (distance < 0) {
        this.countdown = 'Partita in corso';
        this.countdownActive = false;
        if (this.intervalId) clearInterval(this.intervalId);
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      if (days > 0) {
        this.countdown = `${days}g ${hours}h ${minutes}m`;
      } else if (hours > 0) {
        this.countdown = `${hours}h ${minutes}m ${seconds}s`;
      } else {
        this.countdown = `${minutes}m ${seconds}s`;
      }
      this.countdownActive = true;
    };

    updateCountdown();
    this.intervalId = setInterval(updateCountdown, 1000);
  }

  // ── Helpers ─────────────────────────────────────────────────────

  formatNome(nome: string | null | undefined): string {
    if (!nome) return '';
    return nome.replace(/_/g, ' ');
  }

  getEsitoFor(r: any, sigla: string | null): string {
    if (!sigla) return 'N';
    const casa = this.formatNome(r.casaSigla);
    const fuori = this.formatNome(r.fuoriSigla);
    if (sigla === casa) {
      if (r.scoreCasa > r.scoreFuori) return 'V';
      if (r.scoreCasa === r.scoreFuori) return 'N';
      return 'P';
    } else if (sigla === fuori) {
      if (r.scoreFuori > r.scoreCasa) return 'V';
      if (r.scoreFuori === r.scoreCasa) return 'N';
      return 'P';
    }
    return 'N';
  }

  // Keep old methods for backward compat (not used in template anymore)
  getEsito(r: any): string { return this.getEsitoFor(r, this.localSigla); }
  getEsitoOpponent(r: any): string { return this.getEsitoFor(r, this.localOpponentSigla); }
}
