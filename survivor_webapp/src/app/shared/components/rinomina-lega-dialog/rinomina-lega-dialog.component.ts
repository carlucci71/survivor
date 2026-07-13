import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { LegaService } from '../../../core/services/lega.service';

@Component({
  selector: 'app-rinomina-lega-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
    TranslateModule,
  ],
  template: `
    <div class="dialog-container">

      <!-- HEADER -->
      <div class="dialog-header">
        <div class="dialog-header-icon">
          <mat-icon>drive_file_rename_outline</mat-icon>
        </div>
        <div class="dialog-header-text">
          <h2 class="dialog-title">{{ 'LEAGUE.RENAME_LEAGUE_TITLE' | translate }}</h2>
          <p class="dialog-subtitle">{{ data.legaNome }}</p>
        </div>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- BODY -->
      <div class="dialog-body">
        <div class="name-input-wrap" [class.name-input-wrap--error]="!!errorMessage">
          <mat-icon class="name-icon">emoji_events</mat-icon>
          <input
            #nameInput
            class="name-input"
            type="text"
            autocomplete="off"
            maxlength="100"
            [placeholder]="'LEAGUE.RENAME_LEAGUE_LABEL' | translate"
            [(ngModel)]="nomeLega"
            (keyup.enter)="salva()"
          />
        </div>
        <div class="char-counter">{{ nomeLega.length }}/100</div>

        <div class="feedback-message feedback-error" *ngIf="errorMessage">
          <mat-icon>error_outline</mat-icon>
          <span>{{ errorMessage }}</span>
        </div>
      </div>

      <!-- FOOTER -->
      <div class="dialog-footer">
        <button class="btn-cancel" (click)="onCancel()">{{ 'LEAGUE.RENAME_LEAGUE_CANCEL' | translate }}</button>
        <button
          class="btn-save"
          (click)="salva()"
          [disabled]="!canSave()"
        >
          <mat-icon *ngIf="!isSaving">check</mat-icon>
          {{ (isSaving ? 'LEAGUE.RENAME_LEAGUE_SAVING' : 'LEAGUE.RENAME_LEAGUE_SAVE') | translate }}
        </button>
      </div>

    </div>
  `,
  styles: [`
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

    .dialog-container {
      width: 100%;
      max-width: 420px;
      display: flex;
      flex-direction: column;
      background: $white;
      border-radius: $radius;
      overflow: hidden;
      font-family: 'Poppins', sans-serif;
    }

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

      mat-icon { color: $white; font-size: 22px; width: 22px; height: 22px; }
    }

    .dialog-header-text { flex: 1; min-width: 0; }

    .dialog-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: $white;
      text-transform: uppercase;
      letter-spacing: 0.4px;
      line-height: 1.3;
    }

    .dialog-subtitle {
      margin: 3px 0 0;
      font-size: 0.78rem;
      color: rgba(255,255,255,0.75);
      font-weight: 500;
      line-height: 1.4;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
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

    .dialog-body {
      padding: 20px 20px 6px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .name-input-wrap {
      display: flex;
      align-items: center;
      gap: 10px;
      background: $white;
      border: 2px solid $border;
      border-radius: $radius-sm;
      padding: 0 14px;
      height: 50px;
      transition: border-color 0.2s ease, box-shadow 0.2s ease;

      &:focus-within {
        border-color: $blue;
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.1);
      }

      &--error {
        border-color: #DC2626;
        &:focus-within { box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1); }
      }
    }

    .name-icon {
      color: $muted;
      font-size: 18px !important;
      width: 18px !important;
      height: 18px !important;
      flex-shrink: 0;
    }

    .name-input {
      flex: 1;
      border: none;
      outline: none;
      background: transparent;
      font-family: 'Poppins', sans-serif;
      font-size: 0.92rem;
      color: $text;
      font-weight: 600;
      min-width: 0;

      &::placeholder { color: $muted; font-weight: 400; }
    }

    .char-counter {
      align-self: flex-end;
      font-size: 0.72rem;
      color: $muted;
      font-weight: 500;
    }

    .feedback-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: $radius-sm;
      font-weight: 600;
      font-size: 0.85rem;
      margin-top: 4px;

      mat-icon { font-size: 20px; width: 20px; height: 20px; flex-shrink: 0; }
    }

    .feedback-error { background: rgba(239,68,68,0.1); color: #DC2626; }

    .dialog-footer {
      display: flex;
      gap: 10px;
      padding: 18px 20px 20px;
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

    .btn-save {
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

      mat-icon { font-size: 18px; width: 18px; height: 18px; }

      &:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 5px 18px rgba(10, 61, 145, 0.32); }

      &:disabled {
        background: #E5E7EB;
        color: #9CA3AF;
        box-shadow: none;
        cursor: not-allowed;
      }
    }

    @media (max-width: 480px) {
      .dialog-header { padding: 16px; gap: 10px; }
      .dialog-header-icon {
        width: 38px; height: 38px; border-radius: 10px;
        mat-icon { font-size: 18px; width: 18px; height: 18px; }
      }
      .dialog-title { font-size: 0.88rem; }
      .dialog-subtitle { font-size: 0.7rem; }
      .dialog-body { padding: 16px 14px 4px; }
      .name-input-wrap { height: 48px; }
      .dialog-footer { padding: 12px 14px 16px; }
      .btn-cancel, .btn-save { height: 44px; font-size: 0.8rem !important; }
    }
  `]
})
export class RinominaLegaDialogComponent {
  nomeLega: string;
  errorMessage: string | null = null;
  isSaving = false;

  constructor(
    public dialogRef: MatDialogRef<RinominaLegaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { legaId: number; legaNome: string },
    private legaService: LegaService,
    private translate: TranslateService
  ) {
    this.nomeLega = data.legaNome || '';
  }

  canSave(): boolean {
    const nome = this.nomeLega.trim();
    return !this.isSaving && nome.length > 0 && nome !== (this.data.legaNome || '').trim();
  }

  salva(): void {
    if (!this.canSave()) return;

    this.errorMessage = null;
    this.isSaving = true;
    const nomePulito = this.nomeLega.trim();

    this.legaService.rinominaLega(this.data.legaId, nomePulito).subscribe({
      next: () => {
        this.isSaving = false;
        this.dialogRef.close(true);
      },
      error: (err) => {
        this.isSaving = false;
        if (err?.error?.errorCode === 'CODE_LEGA_PRESENTE') {
          this.errorMessage = this.translate.instant('LEAGUE.RENAME_LEAGUE_TAKEN');
        } else if (err?.error?.message) {
          this.errorMessage = String(err.error.message);
        } else {
          this.errorMessage = this.translate.instant('LEAGUE.RENAME_LEAGUE_GENERIC_ERROR');
        }
      },
    });
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
