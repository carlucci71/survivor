import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conferma-assegnazione-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Conferma modifica</h2>
    <mat-dialog-content>
      Sei sicuro di voler cambiare questa assegnazione anche se la giornata è iniziata?
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Annulla</button>
      <button mat-raised-button color="primary" (click)="onYesClick()">OK</button>
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
