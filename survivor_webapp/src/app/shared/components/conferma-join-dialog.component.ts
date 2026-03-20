import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conferma-join-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatIconModule, TranslateModule],
  template: `
    <div class="cj-dialog">

      <!-- Tasto chiudi -->
      <button class="cj-close" (click)="onNo()" aria-label="Chiudi">
        <mat-icon>close</mat-icon>
      </button>

      <!-- Icona principale -->
      <div class="cj-icon-wrap">
        <mat-icon class="cj-main-icon">group_add</mat-icon>
      </div>

      <!-- Titolo e sottotitolo -->
      <h2 class="cj-title">{{ 'JOIN_LEAGUE.CONFIRM_TITLE' | translate }}</h2>
      <p class="cj-subtitle">{{ 'JOIN_LEAGUE.CONFIRM_MESSAGE' | translate:{name: data.lega.name} }}</p>

      <!-- Card lega (dark gradient) -->
      <div class="cj-lega-card">
        <div class="cj-lega-name">{{ data.lega.name }}</div>
        <div class="cj-lega-meta">
          @if (data.lega.campionato?.nome) {
            <span class="cj-meta-chip">
              <mat-icon>emoji_events</mat-icon>
              {{ data.lega.campionato!.nome }}
            </span>
          }
          <span class="cj-meta-chip">
            <mat-icon>flag</mat-icon>
            Giornata {{ data.lega.giornataIniziale }}
          </span>
          <span class="cj-meta-chip">
            <mat-icon>group</mat-icon>
            {{ (data.lega.numPartecipanti ?? data.lega.giocatori?.length ?? 0) }} partecipanti
          </span>
        </div>
      </div>

      <!-- Campo password (solo per leghe protette) -->
      @if (data.lega.withPwd) {
        <div class="cj-pwd-wrap">
          <label class="cj-pwd-label" for="cj-pwd-input">
            <mat-icon class="cj-pwd-icon">lock</mat-icon>
            {{ 'JOIN_LEAGUE.PASSWORD' | translate }}
          </label>
          <div class="cj-pwd-input-wrap">
            <input id="cj-pwd-input"
                   class="cj-pwd-input"
                   [type]="showPwd ? 'text' : 'password'"
                   [(ngModel)]="password"
                   [placeholder]="'JOIN_LEAGUE.PASSWORD_PLACEHOLDER' | translate" />
            <button type="button" class="cj-eye-btn"
                    (click)="showPwd = !showPwd"
                    [attr.aria-label]="showPwd ? 'Nascondi password' : 'Mostra password'">
              <mat-icon>{{ showPwd ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
          </div>
        </div>
      }

      <!-- Pulsanti azione -->
      <div class="cj-actions">
        <button class="cj-btn cj-btn--cancel" (click)="onNo()">
          {{ 'JOIN_LEAGUE.CANCEL_BUTTON' | translate }}
        </button>
        <button class="cj-btn cj-btn--confirm" (click)="onYes()">
          <mat-icon>login</mat-icon>
          {{ 'COMMON.CONFIRM' | translate }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    .cj-dialog {
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

    /* ── Tasto chiudi ─────────────────────────── */
    .cj-close {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      border: none;
      background: #F3F4F6;
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background 0.15s;
      padding: 0;

      mat-icon { font-size: 17px; width: 17px; height: 17px; color: #374151; }
      &:hover { background: #E5E7EB; }
    }

    /* ── Icona principale ─────────────────────── */
    .cj-icon-wrap {
      width: 68px;
      height: 68px;
      border-radius: 50%;
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 4px;
      box-shadow: 0 4px 16px rgba(10, 61, 145, 0.15);
      animation: cj-pop 0.35s cubic-bezier(0.68, -0.55, 0.265, 1.55) both;
    }

    @keyframes cj-pop {
      from { transform: scale(0.4); opacity: 0; }
      to   { transform: scale(1);   opacity: 1; }
    }

    .cj-main-icon {
      font-size: 34px;
      width: 34px;
      height: 34px;
      color: #0A3D91;
    }

    /* ── Testi ────────────────────────────────── */
    .cj-title {
      font-size: 1.2rem;
      font-weight: 800;
      color: #111827;
      font-family: 'Poppins', sans-serif;
      margin: 0;
      line-height: 1.3;
      text-transform: uppercase;
      letter-spacing: 0.4px;
    }

    .cj-subtitle {
      font-size: 0.85rem;
      color: #6B7280;
      line-height: 1.55;
      margin: 0;
      max-width: 300px;
    }

    /* ── Card lega (dark gradient) ────────────── */
    .cj-lega-card {
      width: 100%;
      background: linear-gradient(135deg, #040f2e 0%, #0A3D91 60%, #1565C0 100%);
      border-radius: 12px;
      padding: 14px 18px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      text-align: left;
    }

    .cj-lega-name {
      font-size: 1rem;
      font-weight: 700;
      color: #fff;
      letter-spacing: 0.2px;
    }

    .cj-lega-meta {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }

    .cj-meta-chip {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      font-size: 0.72rem;
      color: rgba(255, 255, 255, 0.85);
      background: rgba(255, 255, 255, 0.12);
      border-radius: 12px;
      padding: 3px 8px;

      mat-icon { font-size: 13px; width: 13px; height: 13px; }
    }

    /* ── Campo password ───────────────────────── */
    .cj-pwd-wrap {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 6px;
      text-align: left;
    }

    .cj-pwd-label {
      display: flex;
      align-items: center;
      gap: 5px;
      font-size: 0.8rem;
      font-weight: 600;
      color: #374151;
      font-family: 'Poppins', sans-serif;
    }

    .cj-pwd-icon {
      font-size: 15px;
      width: 15px;
      height: 15px;
      color: #0A3D91;
    }

    .cj-pwd-input-wrap {
      display: flex;
      align-items: center;
      background: #F8F9FA;
      border: 1.5px solid rgba(10, 61, 145, 0.18);
      border-radius: 10px;
      overflow: hidden;
      transition: border-color 0.2s, box-shadow 0.2s;

      &:focus-within {
        border-color: #0A3D91;
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.08);
      }
    }

    .cj-pwd-input {
      flex: 1;
      border: none;
      background: transparent;
      padding: 11px 14px;
      font-size: 0.9rem;
      font-family: 'Poppins', sans-serif;
      color: #111827;
      outline: none;
      min-width: 0;

      &::placeholder { color: #9CA3AF; }
    }

    .cj-eye-btn {
      border: none;
      background: transparent;
      cursor: pointer;
      padding: 0 12px;
      display: flex;
      align-items: center;
      color: #6B7280;
      transition: color 0.15s;
      flex-shrink: 0;

      &:hover { color: #0A3D91; }
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
    }

    /* ── Pulsanti azione ──────────────────────── */
    .cj-actions {
      display: flex;
      gap: 10px;
      width: 100%;
      justify-content: center;
      margin-top: 4px;
    }

    .cj-btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      padding: 10px 22px;
      border-radius: 24px;
      font-size: 0.87rem;
      font-weight: 700;
      font-family: 'Poppins', sans-serif;
      cursor: pointer;
      border: none;
      flex: 1;
      max-width: 160px;
      transition: box-shadow 0.2s, transform 0.15s, background 0.15s;

      mat-icon { font-size: 17px; width: 17px; height: 17px; }
    }

    .cj-btn--cancel {
      background: #F3F4F6;
      color: #374151;
      &:hover { background: #E5E7EB; }
    }

    .cj-btn--confirm {
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      color: #fff;
      box-shadow: 0 4px 14px rgba(10, 61, 145, 0.35);

      &:hover {
        box-shadow: 0 6px 20px rgba(10, 61, 145, 0.5);
        transform: translateY(-1px);
      }
      &:active { transform: translateY(0); }
    }

    /* ── Responsive ───────────────────────────── */
    @media (max-width: 400px) {
      .cj-dialog  { padding: 28px 16px 22px; gap: 13px; }
      .cj-title   { font-size: 1.05rem; }
      .cj-btn     { padding: 9px 14px; font-size: 0.82rem; }
    }
  `]
})
export class ConfermaJoinDialogComponent {
  password: string | null = null;
  showPwd = false;

  constructor(
    public dialogRef: MatDialogRef<ConfermaJoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lega: any }
  ) {}

  onNo(): void {
    this.dialogRef.close(null);
  }

  onYes(): void {
    this.dialogRef.close(this.password ?? '');
  }
}
