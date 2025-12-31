import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-conferma-join-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Conferma iscrizione</h2>
    <mat-dialog-content>
      <p>Vuoi entrare nella lega <strong>{{data.lega.nome}}</strong>?</p>
      <p>Campionato: {{data.lega.campionato?.nome || '-'}}</p>
      <p>Giornata iniziale: {{data.lega.giornataIniziale}}</p>
      <p>Numero iscritti: {{data.lega.giocatori.length}}</p>
      <div *ngIf="data.lega.withPwd">
        <mat-form-field appearance="fill" style="width:100%;">
          <mat-label>Password di accesso</mat-label>
          <input matInput [(ngModel)]="password" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onNo()">Annulla</button>
      <button mat-raised-button color="primary" (click)="onYes()">Conferma</button>
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
