import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FotoProfiloService } from '../../../core/services/foto-profilo.service';
import { AvatarComponent } from '../avatar/avatar.component';

export interface FotoViewerData {
  giocatoreId: number;
  nickname: string;
  fotoVersion: number;
  /** false per la propria foto: non ha senso segnalarsi da soli */
  puoSegnalare: boolean;
}

/**
 * Foto di un altro giocatore in grande, con la possibilita' di segnalarla (richiesto dagli store per i contenuti
 * generati dagli utenti). Dopo la segnalazione la foto smette subito di vedersi per chi l'ha segnalata.
 */
@Component({
  selector: 'app-foto-viewer-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule, AvatarComponent],
  template: `
    <div class="fv">
      <button type="button" class="fv-close" (click)="close()" [attr.aria-label]="'COMMON.CLOSE' | translate">
        <svg class="fv-x" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
          <path d="M2 2 L12 12 M12 2 L2 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
        </svg>
      </button>

      <div class="fv-photo">
        <app-avatar [giocatoreId]="data.giocatoreId" [fotoVersion]="data.fotoVersion" [nome]="data.nickname" [size]="size"></app-avatar>
      </div>
      <h2 class="fv-name">{{ data.nickname }}</h2>

      <ng-container *ngIf="data.puoSegnalare">
        <button *ngIf="!confermando" type="button" class="fv-report" (click)="confermando = true">
          <svg viewBox="0 0 24 24" class="fv-flag" aria-hidden="true"><path fill="currentColor" d="M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z"/></svg>
          {{ 'PHOTO.REPORT' | translate }}
        </button>

        <div *ngIf="confermando" class="fv-confirm">
          <p class="fv-confirm-title">{{ 'PHOTO.REPORT_CONFIRM_TITLE' | translate }}</p>
          <p class="fv-confirm-text">{{ 'PHOTO.REPORT_CONFIRM_TEXT' | translate }}</p>
          <div class="fv-confirm-actions">
            <button type="button" class="fv-btn fv-btn--ghost" (click)="confermando = false" [disabled]="inviando">{{ 'COMMON.CANCEL' | translate }}</button>
            <button type="button" class="fv-btn fv-btn--danger" (click)="invia()" [disabled]="inviando">{{ 'PHOTO.REPORT_SEND' | translate }}</button>
          </div>
        </div>
      </ng-container>
    </div>
  `,
  styles: [`
    .fv {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      padding: 30px 22px 22px;
      background: var(--bg-card, #fff);
      border-radius: 22px;
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }
    .fv-close {
      position: absolute; top: 12px; right: 12px;
      width: 32px; height: 32px; padding: 0; margin: 0;
      display: flex; align-items: center; justify-content: center;
      border: none; border-radius: 50%;
      background: rgba(100, 116, 139, 0.14);
      color: #475569;
      cursor: pointer;
      transition: background 0.2s ease, transform 0.25s ease;
      -webkit-tap-highlight-color: transparent;
    }
    .fv-close:hover { background: rgba(100, 116, 139, 0.26); transform: rotate(90deg); }
    .fv-x { display: block; flex-shrink: 0; width: 13px; height: 13px; pointer-events: none; }

    .fv-photo {
      padding: 5px;
      border-radius: 50%;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      box-shadow: 0 10px 28px rgba(10, 61, 145, 0.3);
    }
    .fv-photo ::ng-deep .av { box-shadow: none; border: 3px solid #fff; box-sizing: content-box; }
    .fv-name { margin: 6px 0 0; font-size: 1.15rem; font-weight: 700; color: #0A3D91; word-break: break-word; }

    .fv-report {
      display: inline-flex; align-items: center; gap: 6px;
      margin-top: 4px; padding: 8px 16px;
      border-radius: 999px; border: 1.5px solid rgba(229, 57, 53, 0.35);
      background: transparent; color: #C62828;
      font-family: inherit; font-size: 0.8rem; font-weight: 600;
      cursor: pointer; transition: background 0.2s ease, border-color 0.2s ease;
    }
    .fv-report:hover { background: rgba(229, 57, 53, 0.08); border-color: #E53935; }
    .fv-flag { width: 15px; height: 15px; }

    .fv-confirm {
      width: 100%; margin-top: 4px; padding: 14px;
      border-radius: 16px; background: rgba(229, 57, 53, 0.06);
      border: 1px solid rgba(229, 57, 53, 0.2);
    }
    .fv-confirm-title { margin: 0 0 4px; font-size: 0.92rem; font-weight: 700; color: #B71C1C; }
    .fv-confirm-text { margin: 0 0 12px; font-size: 0.8rem; color: #64748B; line-height: 1.45; }
    .fv-confirm-actions { display: flex; gap: 8px; }
    .fv-btn {
      flex: 1; padding: 9px 10px; border-radius: 12px; border: none;
      font-family: inherit; font-size: 0.82rem; font-weight: 700; cursor: pointer;
      transition: transform 0.15s ease, opacity 0.2s ease;
    }
    .fv-btn:active { transform: scale(0.97); }
    .fv-btn:disabled { opacity: 0.55; cursor: default; }
    .fv-btn--ghost { background: rgba(100, 116, 139, 0.14); color: #475569; }
    .fv-btn--danger { background: linear-gradient(135deg, #E53935, #C62828); color: #fff; }
  `],
})
export class FotoViewerDialogComponent implements OnInit {
  size = 220;
  confermando = false;
  inviando = false;

  constructor(
    public dialogRef: MatDialogRef<FotoViewerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: FotoViewerData,
    private foto: FotoProfiloService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    // Su schermi stretti la foto in grande non deve toccare i bordi
    this.size = Math.max(150, Math.min(220, window.innerWidth - 120));
  }

  close(): void {
    this.dialogRef.close(false);
  }

  invia(): void {
    this.inviando = true;
    this.foto.segnala(this.data.giocatoreId).subscribe({
      next: () => {
        this.snackBar.open(this.translate.instant('PHOTO.REPORT_DONE'), '', {
          duration: 4000, horizontalPosition: 'center', verticalPosition: 'top', panelClass: ['app-snackbar--info'],
        });
        this.dialogRef.close(true);
      },
      error: () => {
        this.inviando = false;
      },
    });
  }
}
