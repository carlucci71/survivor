import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conferma-assegnazione-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule, TranslateModule],
  template: `
    <div class="ca-dialog">
      <button class="ca-close" (click)="onNoClick()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <div class="ca-icon-wrap">
        <mat-icon class="ca-main-icon">edit_note</mat-icon>
      </div>

      <h2 class="ca-title">{{ 'PLAY.CONFIRM_CHANGE_TITLE' | translate }}</h2>
      <p class="ca-message">{{ 'PLAY.CONFIRM_CHANGE_MESSAGE' | translate }}</p>

      <div class="ca-actions">
        <button class="ca-btn ca-btn--cancel" (click)="onNoClick()">
          {{ 'COMMON.CANCEL' | translate }}
        </button>
        <button class="ca-btn ca-btn--confirm" (click)="onYesClick()">
          <mat-icon>check</mat-icon>
          {{ 'COMMON.OK' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .ca-dialog {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 36px 28px 28px;
      background: #fff;
      border-radius: 20px;
      position: relative;
      text-align: center;
      box-sizing: border-box;
      min-width: 0;
      width: 100%;
    }

    .ca-close {
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
    }
    .ca-close mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #374151;
    }
    .ca-close:hover { background: #E5E7EB; }

    .ca-icon-wrap {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FFF7ED, #FFEDD5);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
      animation: ca-pop 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      flex-shrink: 0;
    }

    @keyframes ca-pop {
      from { transform: scale(0.3); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .ca-main-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #EA580C;
    }

    .ca-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #111827;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      line-height: 1.3;
    }

    .ca-message {
      font-size: 0.88rem;
      color: #6B7280;
      line-height: 1.6;
      margin: 0;
      max-width: 300px;
    }

    .ca-actions {
      display: flex;
      gap: 10px;
      width: 100%;
      margin-top: 4px;
    }

    .ca-btn {
      flex: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 16px;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }
    .ca-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .ca-btn--cancel {
      background: #F3F4F6;
      color: #374151;
      border: 1.5px solid #E5E7EB;
    }
    .ca-btn--cancel:hover {
      background: #E5E7EB;
    }

    .ca-btn--confirm {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      box-shadow: 0 3px 10px rgba(10, 61, 145, 0.25);
    }
    .ca-btn--confirm:hover {
      background: linear-gradient(135deg, #4FC3F7, #0A3D91);
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(10, 61, 145, 0.35);
    }
    .ca-btn--confirm:active {
      transform: translateY(0) scale(0.98);
    }

    @media (max-width: 480px) {
      .ca-dialog {
        padding: 32px 20px 24px;
        gap: 14px;
      }
      .ca-title { font-size: 1.05rem; }
      .ca-message { font-size: 0.84rem; }
      .ca-btn { padding: 9px 12px; font-size: 0.85rem; }
    }
  `]
})
export class ConfermaAssegnazioneDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfermaAssegnazioneDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close(false);
  }

  onYesClick(): void {
    this.dialogRef.close(true);
  }
}
