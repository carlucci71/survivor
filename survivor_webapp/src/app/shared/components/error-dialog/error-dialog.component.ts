import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-error-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="ed-dialog">
      <button class="ed-close" (click)="dialogRef.close()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <div class="ed-icon-wrap">
        <mat-icon class="ed-main-icon">error_outline</mat-icon>
      </div>

      <h2 class="ed-title">Ops, qualcosa è andato storto</h2>
      <p class="ed-message">{{ data.message }}</p>

      <button class="ed-btn" (click)="dialogRef.close()">
        <mat-icon>check</mat-icon>
        Chiudi
      </button>
    </div>
  `,
  styles: [`
    .ed-dialog {
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

    .ed-close {
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
    .ed-close mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #374151;
    }
    .ed-close:hover { background: #E5E7EB; }

    .ed-icon-wrap {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #FEF2F2, #FEE2E2);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
      animation: ed-pop 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55);
      flex-shrink: 0;
    }

    @keyframes ed-pop {
      from { transform: scale(0.3); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .ed-main-icon {
      font-size: 36px;
      width: 36px;
      height: 36px;
      color: #DC2626;
    }

    .ed-title {
      font-size: 1.15rem;
      font-weight: 800;
      color: #111827;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      line-height: 1.3;
    }

    .ed-message {
      font-size: 0.88rem;
      color: #6B7280;
      line-height: 1.6;
      margin: 0;
      max-width: 320px;
      word-break: break-word;
    }

    .ed-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 28px;
      background: linear-gradient(135deg, #DC2626, #EF4444);
      color: #fff;
      border: none;
      border-radius: 10px;
      font-size: 0.9rem;
      font-weight: 600;
      cursor: pointer;
      box-shadow: 0 3px 10px rgba(220, 38, 38, 0.25);
      transition: all 0.2s ease;
      margin-top: 4px;
      font-family: 'Poppins', sans-serif;
    }
    .ed-btn mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .ed-btn:hover {
      background: linear-gradient(135deg, #EF4444, #DC2626);
      transform: translateY(-1px);
      box-shadow: 0 5px 16px rgba(220, 38, 38, 0.35);
    }
    .ed-btn:active {
      transform: translateY(0) scale(0.98);
    }

    @media (max-width: 480px) {
      .ed-dialog {
        padding: 32px 20px 24px;
        gap: 14px;
      }
      .ed-title { font-size: 1.05rem; }
      .ed-message { font-size: 0.84rem; }
      .ed-btn { padding: 9px 24px; font-size: 0.85rem; }
    }
  `],
})
export class ErrorDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ErrorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { message: string }
  ) {}
}
