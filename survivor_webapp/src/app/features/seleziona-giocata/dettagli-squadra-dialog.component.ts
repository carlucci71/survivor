import { Component, Inject } from '@angular/core';
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

      <div class="tabs-container">
        <button class="tab" [class.active]="activeTab === 'ultimi'" (click)="activeTab = 'ultimi'">Ultimi</button>
        <button class="tab" [class.active]="activeTab === 'prossime'" (click)="activeTab = 'prossime'">Prossime</button>
        @if(data.opponentSigla) {
        <button class="tab" [class.active]="activeTab === 'opponent'" (click)="activeTab = 'opponent'">{{ data.opponentSigla }}</button>
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
                <span class="match" [class.bold]="r.casaSigla === data.squadraSelezionata">{{ r.casaNome }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="r.fuoriSigla === data.squadraSelezionata">{{ r.fuoriNome }}</span>
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
                <span class="match" [class.bold]="r.casaSigla === data.squadraSelezionata">{{ r.casaNome }}</span>
                <span class="vs">vs</span>
                <span class="match" [class.bold]="r.fuoriSigla === data.squadraSelezionata">{{ r.fuoriNome }}</span>
                <span class="date">{{ r.orario | date: 'dd/MM' }}</span>
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
                <span class="giornata">{{ data.getDesGiornata(r, r.casaSigla === data.opponentSigla) }}</span>
                <span class="match" [class.bold]="r.casaSigla === data.opponentSigla">{{ r.casaNome }}</span>
                <span class="score">{{ r.scoreCasa }}-{{ r.scoreFuori }}</span>
                <span class="match" [class.bold]="r.fuoriSigla === data.opponentSigla">{{ r.fuoriNome }}</span>
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
      padding: 16px;
      min-width: 320px;
      max-width: 420px;
      font-family: 'Poppins', sans-serif;
    }

    .dettagli-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 12px;
      padding-bottom: 10px;
      border-bottom: 1px solid rgba(255,255,255,0.3);
    }

    .dettagli-title {
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 1rem;
      font-weight: 700;
      color: #FFFFFF;
    }

    .squadra-badge {
      padding: 5px 12px;
      background: rgba(255,255,255,0.95);
      border-radius: 16px;
      font-size: 0.8rem;
      font-weight: 800;
    }

    .close-btn {
      background: rgba(255,255,255,0.2);
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s;
      color: #FFFFFF;

      mat-icon { font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(255,255,255,0.4); }
    }

    .tabs-container {
      display: flex;
      gap: 6px;
      margin-bottom: 10px;
    }

    .tab {
      flex: 1;
      padding: 6px 8px;
      background: rgba(255,255,255,0.85);
      border: none;
      border-radius: 8px;
      font-size: 0.65rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
      color: #374151;

      &.active {
        background: #FFFFFF;
        box-shadow: 0 3px 10px rgba(0,0,0,0.15);
        font-weight: 700;
      }
    }

    .content {
      background: rgba(255,255,255,0.95);
      border-radius: 10px;
      padding: 8px;
      max-height: 220px;
      overflow-y: auto;

      &::-webkit-scrollbar { width: 3px; }
      &::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.15); border-radius: 3px; }
    }

    .row {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 5px 8px;
      background: #F8FAFC;
      border-radius: 6px;
      border-left: 3px solid;
      margin-bottom: 4px;
      font-size: 0.55rem;

      &:last-child { margin-bottom: 0; }
    }

    .giornata {
      font-weight: 700;
      color: #6B7280;
      min-width: 50px;
      font-size: 0.5rem;
    }

    .match {
      color: #0A3D91;
      flex: 1;
      text-align: center;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &.bold { font-weight: 800; }
    }

    .score {
      font-weight: 700;
      background: #FFFFFF;
      padding: 2px 6px;
      border-radius: 4px;
      border: 1px solid #E5E7EB;
    }

    .vs {
      color: #9CA3AF;
      font-size: 0.5rem;
    }

    .date {
      color: #9CA3AF;
      font-size: 0.5rem;
      min-width: 35px;
      text-align: right;
    }

    .badge {
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      color: #FFFFFF;
      font-size: 0.5rem;
      min-width: 16px;
      text-align: center;

      &.v { background: linear-gradient(135deg, #10B981, #34D399); }
      &.n { background: linear-gradient(135deg, #F59E0B, #FBBF24); }
      &.p { background: linear-gradient(135deg, #EF4444, #F87171); }
    }

    .no-data {
      text-align: center;
      color: #6B7280;
      padding: 20px;
      font-size: 0.75rem;
    }
  `]
})
export class DettagliSquadraDialogComponent {
  activeTab: 'ultimi' | 'prossime' | 'opponent' = 'ultimi';

  constructor(
    public dialogRef: MatDialogRef<DettagliSquadraDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DettagliSquadraData
  ) {}

  getEsito(r: any): string {
    if (this.data.squadraSelezionata === r.casaSigla) {
      if (r.scoreCasa > r.scoreFuori) return 'V';
      if (r.scoreCasa === r.scoreFuori) return 'N';
      return 'P';
    } else {
      if (r.scoreFuori > r.scoreCasa) return 'V';
      if (r.scoreFuori === r.scoreCasa) return 'N';
      return 'P';
    }
  }

  getEsitoOpponent(r: any): string {
    if (this.data.opponentSigla === r.casaSigla) {
      if (r.scoreCasa > r.scoreFuori) return 'V';
      if (r.scoreCasa === r.scoreFuori) return 'N';
      return 'P';
    } else {
      if (r.scoreFuori > r.scoreCasa) return 'V';
      if (r.scoreFuori === r.scoreCasa) return 'N';
      return 'P';
    }
  }
}
