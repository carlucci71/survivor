import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { LegaService } from '../../../core/services/lega.service';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-invita-utenti-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    MatIconModule,
    FormsModule,
    MatCardModule,
    TranslateModule,
  ],
  template: `
    <div class="dialog-container">

      <!-- HEADER -->
      <div class="dialog-header">
        <div class="dialog-header-icon">
          <mat-icon>group_add</mat-icon>
        </div>
        <div class="dialog-header-text">
          <h2 class="dialog-title">{{ data.legaNome }}</h2>
          <p class="dialog-subtitle">{{ 'INVITE_USERS.SUBTITLE' | translate }}</p>
        </div>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- BODY -->
      <div class="dialog-body" [class.scroll-enabled]="shouldEnableScroll()">

        <!-- Bottone condividi -->
        <button class="share-btn" (click)="shareLink()" type="button">
          <mat-icon>share</mat-icon>
          <span>{{ 'COMMON.SHARE_LINK' | translate }}</span>
        </button>

        <!-- Divider -->
        <div class="or-divider">
          <span>{{ 'INVITE_USERS.OR_EMAIL' | translate }}</span>
        </div>

        <!-- Input email + aggiungi -->
        <div class="email-row">
          <div class="email-input-wrap">
            <mat-icon class="email-icon">email</mat-icon>
            <input
              class="email-input"
              type="email"
              autocomplete="off"
              [placeholder]="'INVITE_USERS.EMAIL_PLACEHOLDER' | translate"
              [(ngModel)]="emailInput"
              (keyup.enter)="addEmail()"
            />
          </div>
          <button class="add-btn"
                  (click)="addEmail()"
                  [disabled]="!isValidEmail(emailInput)"
                  type="button">
            {{ 'COMMON.ADD' | translate }}
          </button>
        </div>

        <!-- Chips email aggiunte -->
        <div class="emails-list" *ngIf="emailsList.length > 0">
          <mat-chip-set>
            <mat-chip *ngFor="let email of emailsList" (removed)="removeEmail(email)">
              {{email}}
              <button matChipRemove>
                <mat-icon>cancel</mat-icon>
              </button>
            </mat-chip>
          </mat-chip-set>
        </div>

        <!-- Successo / Errore -->
        <div class="feedback-message feedback-success" *ngIf="inviteSuccess">
          <mat-icon>check_circle</mat-icon>
          <span>{{ 'INVITE_USERS.SUCCESS' | translate }}</span>
        </div>
        <div class="feedback-message feedback-error" *ngIf="inviteError">
          <mat-icon>error_outline</mat-icon>
          <span>{{inviteError}}</span>
        </div>

      </div>

      <!-- FOOTER -->
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="onCancel()">{{ 'COMMON.CANCEL' | translate }}</button>
        <button
          class="btn-send"
          (click)="invitaUtenti()"
          [disabled]="emailsList.length === 0 || inviteSuccess"
        >
          <mat-icon>send</mat-icon>
          {{ 'COMMON.SEND_INVITES' | translate }} ({{emailsList.length}})
        </button>
      </div>

    </div>
  `,
  styles: [`
    /* ── MATERIAL DIALOG OVERRIDE ── */
    ::ng-deep .mat-mdc-dialog-container .mdc-dialog__surface {
      padding: 0 !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      box-shadow: 0 24px 64px rgba(0,0,0,0.18) !important;
    }
    ::ng-deep .mat-mdc-dialog-container {
      padding: 0 !important;
    }

    $blue: #0A3D91;
    $cyan: #4FC3F7;
    $white: #FFFFFF;
    $text: #1A1A2E;
    $muted: #6B7280;
    $border: rgba(10, 61, 145, 0.14);
    $radius: 16px;
    $radius-sm: 10px;

    /* ── CONTAINER ── */
    .dialog-container {
      width: 100%;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      background: $white;
      border-radius: $radius;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
    }

    /* ── HEADER ── */
    .dialog-header {
      display: flex;
      align-items: center;
      gap: 14px;
      padding: 20px 20px 20px 22px;
      background: linear-gradient(135deg, #040f2e 0%, $blue 60%, #1565C0 100%);
      position: relative;
      flex-shrink: 0;
    }

    .dialog-header-icon {
      width: 44px;
      height: 44px;
      background: rgba(255,255,255,0.15);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon {
        color: $white;
        font-size: 22px;
        width: 22px;
        height: 22px;
      }
    }

    .dialog-header-text {
      flex: 1;
      min-width: 0;
    }

    .dialog-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: $white;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      line-height: 1.3;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .dialog-subtitle {
      margin: 3px 0 0;
      font-size: 0.73rem;
      color: rgba(255,255,255,0.75);
      font-weight: 400;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .close-btn {
      flex-shrink: 0;
      background: rgba(255,255,255,0.14) !important;
      color: $white !important;
      border-radius: 50% !important;
      width: 36px !important;
      height: 36px !important;
      transition: background 0.2s ease !important;

      &:hover { background: rgba(255,255,255,0.25) !important; }

      mat-icon { font-size: 18px; width: 18px; height: 18px; }
    }

    /* ── BODY ── */
    .dialog-body {
      flex: 1;
      padding: 20px 20px 6px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      overflow-y: auto;
      overflow-x: hidden;

      &.scroll-enabled {
        max-height: 55vh;

        &::-webkit-scrollbar { width: 5px; }
        &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
        &::-webkit-scrollbar-thumb { background: $blue; border-radius: 3px; }
      }
    }

    /* ── SHARE ── */
    .share-btn {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 13px 20px;
      background: linear-gradient(135deg, $blue, $cyan);
      color: $white;
      border: none;
      border-radius: $radius-sm;
      font-family: 'Poppins', sans-serif;
      font-size: 0.95rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      cursor: pointer;
      box-shadow: 0 4px 16px rgba(10, 61, 145, 0.25);
      transition: all 0.2s ease;

      mat-icon { font-size: 20px; width: 20px; height: 20px; }

      &:hover { transform: translateY(-2px); box-shadow: 0 6px 22px rgba(10, 61, 145, 0.35); }
    }

    /* ── DIVIDER ── */
    .or-divider {
      display: flex;
      align-items: center;
      gap: 10px;
      color: $muted;
      font-size: 0.8rem;
      font-weight: 500;
      letter-spacing: 0.2px;

      &::before, &::after { content: ''; flex: 1; height: 1px; background: rgba(10, 61, 145, 0.18); }
    }

    /* ── EMAIL INPUT ── */
    .email-row {
      display: flex;
      gap: 10px;
      align-items: center;
    }

    .email-input-wrap {
      flex: 1;
      display: flex;
      align-items: center;
      gap: 10px;
      background: $white;
      border: 2px solid $border;
      border-radius: $radius-sm;
      padding: 0 14px;
      height: 50px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;
      min-width: 0;

      &:focus-within {
        border-color: $blue;
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.1);
      }
    }

    .email-icon {
      color: $muted;
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      flex-shrink: 0;
    }

    .email-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: 'Poppins', sans-serif;
      font-size: 0.88rem;
      color: $text;
      font-weight: 500;
      min-width: 0;

      &::placeholder { color: $muted; font-weight: 400; }
    }

    .add-btn {
      flex-shrink: 0;
      height: 50px;
      padding: 0 20px;
      background: $white;
      color: $blue;
      border: 2px solid $blue;
      border-radius: $radius-sm;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      transition: all 0.2s ease;
      white-space: nowrap;

      &:hover:not(:disabled) { background: $blue; color: $white; }

      &:disabled {
        background: #F9FAFB;
        color: #9CA3AF;
        border-color: #E5E7EB;
        cursor: not-allowed;
      }
    }

    /* ── CHIPS ── */
    .emails-list {
      ::ng-deep mat-chip-set { display: flex; flex-wrap: wrap; gap: 6px; min-height: auto; }

      ::ng-deep mat-chip {
        background: rgba(10, 61, 145, 0.07) !important;
        color: $blue !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 0.78rem !important;
        font-weight: 600 !important;
        border-radius: 20px !important;
      }
    }

    /* ── FEEDBACK ── */
    .feedback-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: $radius-sm;
      font-weight: 600;
      font-size: 0.88rem;

      mat-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    }

    .feedback-success { background: rgba(16,185,129,0.1); color: #059669; }
    .feedback-error   { background: rgba(239,68,68,0.1);  color: #DC2626; }

    /* ── FOOTER ── */
    .dialog-footer {
      display: flex;
      gap: 10px;
      padding: 14px 20px 18px;
      border-top: 1px solid $border;
      flex-shrink: 0;
      background: #FAFBFD;
    }

    .btn-cancel {
      flex: 1;
      height: 46px;
      background: $white;
      color: $muted;
      border: 2px solid #E5E7EB;
      border-radius: $radius-sm;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      font-weight: 600;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover { border-color: $muted; color: $text; }
    }

    .btn-send {
      flex: 2;
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      background: linear-gradient(135deg, $blue, $cyan);
      color: $white;
      border: none;
      border-radius: $radius-sm;
      font-family: 'Poppins', sans-serif;
      font-size: 0.85rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      cursor: pointer;
      box-shadow: 0 3px 12px rgba(10, 61, 145, 0.22);
      transition: all 0.2s ease;

      mat-icon { font-size: 16px; width: 16px; height: 16px; }

      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(10, 61, 145, 0.32); }

      &:disabled {
        background: #E5E7EB;
        color: #9CA3AF;
        box-shadow: none;
        cursor: not-allowed;
      }
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 480px) {
      .dialog-header { padding: 16px; gap: 10px; }
      .dialog-header-icon { width: 38px; height: 38px; border-radius: 10px;
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
      .dialog-title { font-size: 0.88rem; }
      .dialog-subtitle { font-size: 0.7rem; }

      .dialog-body { padding: 14px 14px 4px; gap: 12px; }

      .email-row { flex-direction: column; align-items: stretch; }
      .email-input-wrap { height: 48px; }
      .add-btn { height: 48px; width: 100%; }

      .dialog-footer { padding: 10px 14px 14px; }
      .btn-cancel, .btn-send { height: 44px; font-size: 0.8rem !important; }
    }
  `]
})
export class InvitaUtentiDialogComponent {
  emailInput: string = '';
  emailsList: string[] = [];
  inviteSuccess: boolean = false;
  inviteError: string | null = null;

  constructor(
    public dialogRef: MatDialogRef<InvitaUtentiDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { legaId: number; legaNome: string },
    private legaService: LegaService
  ) {}

  // ...existing code...

  canShare(): boolean {
    return !!navigator.share;
  }

  shareLink(): void {
    const url = environment.baseUrl + '/joinLega';
    const text = `Entra nella lega "${this.data.legaNome}" su Survivor`;
    import('@capacitor/share').then(({ Share }) => {
      Share.share({ title: 'Unisciti alla mia lega!', text, url, dialogTitle: 'Condividi la lega' }).catch(() => {});
    }).catch(() => {
      // Fallback web puro (no Capacitor)
      if (navigator.share) {
        navigator.share({ title: 'Unisciti alla mia lega!', text, url }).catch(() => {});
      }
    });
  }

  shouldEnableScroll(): boolean {
    // Attiva lo scroll solo se ci sono più di 8 email (soglia per evitare che il bottone sparisca)
    return this.emailsList.length > 3;
  }

  addEmail(): void {
    if (this.emailInput && this.isValidEmail(this.emailInput)) {
      if (!this.emailsList.includes(this.emailInput)) {
        this.emailsList.push(this.emailInput);
        this.emailInput = '';
      }
    }
  }

  removeEmail(email: string): void {
    const index = this.emailsList.indexOf(email);
    if (index >= 0) {
      this.emailsList.splice(index, 1);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  invitaUtenti(): void {
    if (this.emailsList.length === 0) {
      return;
    }

    this.inviteError = null;
    this.inviteSuccess = false;

    this.legaService.invitaUtenti(this.data.legaId, this.emailsList).subscribe({
      next: () => {
        this.inviteSuccess = true;
        this.emailsList = [];
        setTimeout(() => {
          this.dialogRef.close(true);
        }, 2000);
      },
      error: (err) => {
        console.error('Errore invio inviti:', err);
        this.inviteError = 'Errore durante l\'invio degli inviti. Riprova.';
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
