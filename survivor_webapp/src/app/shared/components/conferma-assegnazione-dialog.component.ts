import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-conferma-assegnazione-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule, TranslateModule],
  template: `
    <h2 mat-dialog-title>{{ 'PLAY.CONFIRM_CHANGE_TITLE' | translate }}</h2>
    <mat-dialog-content>
      {{ 'PLAY.CONFIRM_CHANGE_MESSAGE' | translate }}
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">{{ 'COMMON.CANCEL' | translate }}</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">{{ 'COMMON.OK' | translate }}</button>
    </mat-dialog-actions>
  `
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
