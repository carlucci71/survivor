import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

export interface RichiediIngressoData {
  lega: {
    name: string;
    giornataIniziale: number;
    campionato?: { nome?: string };
    giocatori: any[];
  };
  success?: boolean;
}

@Component({
  selector: 'app-richiedi-ingresso-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="ri-dialog">
      <button class="ri-close" (click)="dialogRef.close(false)" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      @if (!data.success) {
        <!-- CONFIRM VIEW -->
        <div class="ri-icon-wrap">
          <mat-icon class="ri-main-icon">how_to_reg</mat-icon>
        </div>

        <h2 class="ri-title">Richiedi ingresso</h2>
        <p class="ri-subtitle">Stai per inviare una richiesta per unirti a questa lega. Il creatore dovrà approvarla.</p>

        <div class="ri-lega-card">
          <div class="ri-lega-name">{{ data.lega.name }}</div>
          <div class="ri-lega-meta">
            @if (data.lega.campionato?.nome) {
              <span class="ri-meta-chip">
                <mat-icon>emoji_events</mat-icon>
                {{ data.lega.campionato!.nome }}
              </span>
            }
            <span class="ri-meta-chip">
              <mat-icon>flag</mat-icon>
              Giornata {{ data.lega.giornataIniziale }}
            </span>
            <span class="ri-meta-chip">
              <mat-icon>group</mat-icon>
              {{ data.lega.giocatori.length }} partecipanti
            </span>
          </div>
        </div>

        <div class="ri-actions">
          <button class="ri-btn ri-btn--cancel" (click)="dialogRef.close(false)">Annulla</button>
          <button class="ri-btn ri-btn--confirm" (click)="dialogRef.close(true)">
            <mat-icon>send</mat-icon>
            Invia richiesta
          </button>
        </div>

      } @else {
        <!-- SUCCESS VIEW -->
        <div class="ri-success-icon-wrap">
          <mat-icon class="ri-success-icon">check_circle</mat-icon>
        </div>

        <h2 class="ri-title">Richiesta inviata!</h2>
        <p class="ri-subtitle">La tua richiesta per <strong>{{ data.lega.name }}</strong> è stata inviata. Riceverai una notifica non appena il creatore la approverà.</p>

        <button class="ri-btn ri-btn--confirm" style="margin-top: 8px;" (click)="dialogRef.close(false)">
          <mat-icon>done</mat-icon>
          Perfetto!
        </button>
      }
    </div>
  `,
  styles: [`
    .ri-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 36px 28px 28px;
      background: #fff;
      border-radius: 20px;
      position: relative;
      text-align: center;
      min-width: 0;
      box-sizing: border-box;
    }

    .ri-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 30px;
      height: 30px;
      border: none;
      background: #F3F4F6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      padding: 0;

      mat-icon { font-size: 16px; width: 16px; height: 16px; color: #374151; }
      &:hover { background: #E5E7EB; }
    }

    .ri-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
    }

    .ri-main-icon {
      font-size: 32px;
      width: 32px;
      height: 32px;
      color: #0A3D91;
    }

    .ri-success-icon-wrap {
      width: 64px;
      height: 64px;
      border-radius: 50%;
      background: linear-gradient(135deg, #ECFDF5, #D1FAE5);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
      animation: pop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
    }

    @keyframes pop {
      from { transform: scale(0.3); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .ri-success-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #10B981;
    }

    .ri-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #111827;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      line-height: 1.3;
    }

    .ri-subtitle {
      font-size: 0.85rem;
      color: #6B7280;
      line-height: 1.5;
      margin: 0;
      max-width: 300px;
    }

    .ri-lega-card {
      width: 100%;
      background: linear-gradient(135deg, #040f2e 0%, #0A3D91 60%, #1565C0 100%);
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
    }

    .ri-lega-name {
      font-size: 0.95rem;
      font-weight: 700;
      color: #fff;
    }

    .ri-lega-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .ri-meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      color: rgba(255,255,255,0.85);
      background: rgba(255,255,255,0.12);
      border-radius: 12px;
      padding: 3px 8px;

      mat-icon { font-size: 13px; width: 13px; height: 13px; }
    }

    .ri-actions {
      display: flex;
      gap: 10px;
      width: 100%;
      justify-content: center;
    }

    .ri-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: 24px;
      font-size: 0.87rem;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      border: none;
      transition: box-shadow 0.2s, transform 0.15s;

      mat-icon { font-size: 17px; width: 17px; height: 17px; }
    }

    .ri-btn--cancel {
      background: #F3F4F6;
      color: #374151;
      &:hover { background: #E5E7EB; }
    }

    .ri-btn--confirm {
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      color: #fff;
      box-shadow: 0 4px 14px rgba(10, 61, 145, 0.35);
      &:hover { box-shadow: 0 6px 20px rgba(10, 61, 145, 0.5); transform: translateY(-1px); }
      &:active { transform: translateY(0); }
    }

    @media (max-width: 400px) {
      .ri-dialog { padding: 28px 16px 22px; gap: 13px; }
      .ri-title   { font-size: 1.1rem; }
    }
  `]
})
export class RichiediIngressoDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RichiediIngressoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RichiediIngressoData
  ) {}
}
