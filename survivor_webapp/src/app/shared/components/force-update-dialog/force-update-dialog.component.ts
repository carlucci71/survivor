import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-force-update-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, MatIconModule],
  template: `
    <div class="fud-card">

      <!-- Header gradient -->
      <div class="fud-header">
        <div class="fud-logo-ring">
          <mat-icon class="fud-logo-icon">emoji_events</mat-icon>
        </div>
        <div class="fud-badge">
          <mat-icon>system_update</mat-icon>
          <span>Aggiornamento disponibile</span>
        </div>
      </div>

      <!-- Body -->
      <div class="fud-body">
        <h2 class="fud-title">Nuova versione<br>disponibile</h2>
        <p class="fud-desc">
          Per continuare a giocare aggiorna Survivor all'ultima versione.
          Ci sono novità e miglioramenti che non vuoi perderti!
        </p>

        <button class="fud-btn" (click)="openStore()">
          <mat-icon>download</mat-icon>
          <span>Aggiorna ora</span>
        </button>

        <p class="fud-hint">Disponibile sullo store della tua piattaforma</p>
      </div>

    </div>
  `,
  styles: [`
    :host {
      display: block;
      font-family: 'Poppins', sans-serif;
    }

    .fud-card {
      width: min(88vw, 360px);
      border-radius: 20px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 24px 64px rgba(10, 61, 145, 0.22);
    }

    /* ── HEADER ── */
    .fud-header {
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 50%, #4FC3F7 100%);
      padding: 32px 24px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      position: relative;
      overflow: hidden;
    }

    .fud-header::before {
      content: '';
      position: absolute;
      top: -40px; right: -40px;
      width: 140px; height: 140px;
      border-radius: 50%;
      background: rgba(255,255,255,0.06);
    }
    .fud-header::after {
      content: '';
      position: absolute;
      bottom: -50px; left: -30px;
      width: 160px; height: 160px;
      border-radius: 50%;
      background: rgba(255,255,255,0.05);
    }

    .fud-logo-ring {
      width: 80px; height: 80px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: 2px solid rgba(255,255,255,0.3);
      display: flex; align-items: center; justify-content: center;
      z-index: 1;
    }

    .fud-logo-icon {
      font-size: 44px;
      width: 44px; height: 44px;
      color: #FFD700;
    }

    .fud-badge {
      display: flex; align-items: center; gap: 6px;
      background: rgba(255,255,255,0.18);
      border: 1px solid rgba(255,255,255,0.3);
      border-radius: 20px;
      padding: 6px 14px;
      z-index: 1;
    }

    .fud-badge mat-icon {
      font-size: 16px; width: 16px; height: 16px;
      color: #fff;
    }

    .fud-badge span {
      font-size: 12px;
      font-weight: 600;
      color: #fff;
      letter-spacing: 0.3px;
    }

    /* ── BODY ── */
    .fud-body {
      padding: 28px 24px 28px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
    }

    .fud-title {
      font-size: 22px;
      font-weight: 700;
      color: #0A3D91;
      margin: 0 0 14px;
      line-height: 1.3;
    }

    .fud-desc {
      font-size: 14px;
      color: #555;
      line-height: 1.6;
      margin: 0 0 24px;
      max-width: 280px;
    }

    .fud-btn {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      width: 100%;
      padding: 14px 24px;
      background: linear-gradient(135deg, #0A3D91, #1976D2);
      color: #fff;
      border: none;
      border-radius: 12px;
      font-family: 'Poppins', sans-serif;
      font-size: 16px;
      font-weight: 700;
      cursor: pointer;
      box-shadow: 0 6px 20px rgba(10, 61, 145, 0.35);
      transition: transform 0.15s, box-shadow 0.15s;
      margin-bottom: 12px;
    }

    .fud-btn:active {
      transform: scale(0.97);
      box-shadow: 0 3px 10px rgba(10, 61, 145, 0.3);
    }

    .fud-btn mat-icon {
      font-size: 20px; width: 20px; height: 20px;
    }

    .fud-hint {
      font-size: 12px;
      color: #aaa;
      margin: 0;
    }
  `]
})
export class ForceUpdateDialogComponent {
  private readonly data = inject<{ storeUrl: string }>(MAT_DIALOG_DATA);

  openStore(): void {
    window.open(this.data.storeUrl, '_system');
  }
}
