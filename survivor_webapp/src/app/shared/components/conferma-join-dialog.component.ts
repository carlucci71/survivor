import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conferma-join-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title style="margin-bottom: 12px; font-size: 1.3rem;">{{ 'JOIN_LEAGUE.CONFIRM_TITLE' | translate }}</h2>
    <mat-dialog-content style="padding: 12px 24px;">
      <p style="margin: 0 0 8px 0; font-size: 0.95rem; line-height: 1.4;">
        {{ 'JOIN_LEAGUE.CONFIRM_MESSAGE' | translate:{name: data.lega.name} }}
      </p>
      <div style="display: grid; gap: 6px; margin-top: 12px; font-size: 0.9rem; color: #666;">
        <div><strong>{{ 'JOIN_LEAGUE.CHAMPIONSHIP' | translate }}:</strong> {{data.lega.campionato?.nome || '-'}}</div>
        <div><strong>{{ 'JOIN_LEAGUE.INITIAL_ROUND' | translate }}:</strong> {{data.lega.giornataIniziale}}</div>
        <div><strong>{{ 'JOIN_LEAGUE.NUM_MEMBERS' | translate }}:</strong> {{data.lega.giocatori.length}}</div>
      </div>
      <div *ngIf="data.lega.withPwd" style="margin-top: 16px;">
        <mat-form-field appearance="outline" style="width:100%;" subscriptSizing="dynamic">
          <mat-label>{{ 'JOIN_LEAGUE.PASSWORD' | translate }}</mat-label>
          <input matInput [(ngModel)]="password" [placeholder]="'JOIN_LEAGUE.PASSWORD_PLACEHOLDER' | translate" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end" style="padding: 12px 24px; gap: 8px;">
      <button mat-button (click)="onNo()">{{ 'JOIN_LEAGUE.CANCEL_BUTTON' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onYes()">{{ 'COMMON.CONFIRM' | translate }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfermaJoinDialogComponent {
  password: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<ConfermaJoinDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { lega: any }
  ) {}

  onNo(): void {
    this.dialogRef.close(null);
  }

  onYes(): void {
    this.dialogRef.close(this.password);
  }
}
