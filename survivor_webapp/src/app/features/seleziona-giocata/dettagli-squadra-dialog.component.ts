import { Component, Inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}

@Component({
  selector: 'app-dettagli-squadra-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="dettagli-dialog" [style.background]="'linear-gradient(135deg, ' + data.teamColors.primary + ', ' + data.teamColors.secondary + ')'">
      <div class="dettagli-header">
        <div class="dettagli-title">
          <span>📊</span>
          <span class="squadra-badge" [style.color]="data.teamColors.primary">{{ data.squadraSelezionata }}</span>
        </div>
        <button class="close-btn" (click)="dialogRef.close()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      @if(countdownActive) {
      <div class="countdown-container">
        <div class="countdown-wrapper"
             [style.borderColor]="data.teamColors.primary"
             [style.background]="'linear-gradient(135deg, rgba(255,255,255,0.95), rgba(255,255,255,0.85))'">
          <div class="countdown-icon" [style.color]="data.teamColors.primary">
            <mat-icon>schedule</mat-icon>
          </div>
          <div class="countdown-content">
            <span class="countdown-label">Prossima partita tra</span>
            <span class="countdown-time"
                  [style.background]="'linear-gradient(135deg, ' + data.teamColors.primary + ', ' + data.teamColors.secondary + ')'"
                  [style.webkitBackgroundClip]="'text'"
                  [style.webkitTextFillColor]="'transparent'"
                  [style.backgroundClip]="'text'">
              {{ countdown }}
            </span>
          </div>
          <div class="countdown-pulse" [style.background]="data.teamColors.primary"></div>
        </div>
      </div>
      }

      <div class="tabs-container">
        <button class="tab" [class.active]="activeTab === 'ultimi'" (click)="activeTab = 'ultimi'">
          {{ data.tabLabels?.ultimi || 'Ultimi' }}
        </button>
        <button class="tab" [class.active]="activeTab === 'prossime'" (click)="activeTab = 'prossime'">
          {{ data.tabLabels?.prossime || 'Prossime' }}
        </button>
        @if(data.opponentSigla) {
        <button class="tab" [class.active]="activeTab === 'opponent'" (click)="activeTab = 'opponent'">
          {{ data.tabLabels?.opponent || data.opponentSigla }}
        </button>
        }
      </div>

      <div class="content">
        @if(activeTab === 'ultimi') {
          @if(data.ultimiRisultati.length === 0) {
            <div class="no-data">Nessun risultato</div>
          } @else {
            @for(r of data.ultimiRisultati.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="data.teamColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, r.casaSigla === data.squadraSelezionata) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === data.squadraSelezionata">{{ formatNome(r.casaNome) }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === data.squadraSelezionata">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge" [class.v]="getEsito(r) === 'V'" [class.n]="getEsito(r) === 'N'" [class.p]="getEsito(r) === 'P'">{{ getEsito(r) }}</span>
              </div>
            }
          }
        }

        @if(activeTab === 'prossime') {
          @if(data.prossimePartite.length === 0) {
            <div class="no-data">Nessuna partita</div>
          } @else {
            @for(r of data.prossimePartite.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="data.teamColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, r.casaSigla === data.squadraSelezionata) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === data.squadraSelezionata">{{ formatNome(r.casaNome) }}</span>
                <span class="vs">vs</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === data.squadraSelezionata">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge date-badge">{{ r.orario | date: 'dd/MM' }}</span>
              </div>
            }
          }
        }

        @if(activeTab === 'opponent') {
          @if(data.ultimiRisultatiOpponent.length === 0) {
            <div class="no-data">Nessun risultato</div>
          } @else {
            @for(r of data.ultimiRisultatiOpponent.slice(0, 6); track r.giornata) {
              <div class="row" [style.borderLeftColor]="data.teamColors.primary">
                <span class="giornata">{{ data.getDesGiornata(r, formatNome(r.casaSigla) === data.opponentSigla) }}</span>
                <span class="match" [class.bold]="formatNome(r.casaSigla) === data.opponentSigla">{{ formatNome(r.casaNome) }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="formatNome(r.fuoriSigla) === data.opponentSigla">{{ formatNome(r.fuoriNome) }}</span>
                <span class="badge" [class.v]="getEsitoOpponent(r) === 'V'" [class.n]="getEsitoOpponent(r) === 'N'" [class.p]="getEsitoOpponent(r) === 'P'">{{ getEsitoOpponent(r) }}</span>
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
      margin-bottom: 16px;
      padding-bottom: 14px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
      width: 100%;
      box-sizing: border-box;
    }

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
  activeTab: 'ultimi' | 'prossime' | 'opponent' = 'ultimi';
  countdown: string = '';
  countdownActive: boolean = false;
  private intervalId: any;

  constructor(
    public dialogRef: MatDialogRef<DettagliSquadraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DettagliSquadraData
  ) {
    this.startCountdown();
  }

  ngOnDestroy(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private startCountdown(): void {
    // Trova la prossima partita
    const prossimaPartita = this.data.prossimePartite && this.data.prossimePartite.length > 0
      ? this.data.prossimePartite[0]
      : null;

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
        if (this.intervalId) {
          clearInterval(this.intervalId);
        }
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

  formatNome(nome: string | null | undefined): string {
    if (!nome) return '';
    return nome.replace(/_/g, ' ');
  }

  getEsito(r: any): string {
    const casaSiglaFormatted = this.formatNome(r.casaSigla);
    const fuoriSiglaFormatted = this.formatNome(r.fuoriSigla);

    if (this.data.squadraSelezionata === casaSiglaFormatted) {
      if (r.scoreCasa > r.scoreFuori) return 'V';
      if (r.scoreCasa === r.scoreFuori) return 'N';
      return 'P';
    } else if (this.data.squadraSelezionata === fuoriSiglaFormatted) {
      if (r.scoreFuori > r.scoreCasa) return 'V';
      if (r.scoreFuori === r.scoreCasa) return 'N';
      return 'P';
    }
    return 'N';
  }

  getEsitoOpponent(r: any): string {
    const casaSiglaFormatted = this.formatNome(r.casaSigla);
    const fuoriSiglaFormatted = this.formatNome(r.fuoriSigla);

    if (this.data.opponentSigla === casaSiglaFormatted) {
      if (r.scoreCasa > r.scoreFuori) return 'V';
      if (r.scoreCasa === r.scoreFuori) return 'N';
      return 'P';
    } else if (this.data.opponentSigla === fuoriSiglaFormatted) {
      if (r.scoreFuori > r.scoreCasa) return 'V';
      if (r.scoreFuori === r.scoreCasa) return 'N';
      return 'P';
    }
    return 'N';
  }
}
