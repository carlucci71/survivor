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
    <h2 mat-dialog-title>{{ 'JOIN_LEAGUE.CONFIRM_TITLE' | translate }}</h2>
    <mat-dialog-content>
      <p>{{ 'JOIN_LEAGUE.CONFIRM_MESSAGE' | translate:{name: data.lega.name} }}</p>
      <p>{{ 'JOIN_LEAGUE.CHAMPIONSHIP' | translate }}: {{data.lega.campionato?.nome || '-'}}</p>
      <p>{{ 'JOIN_LEAGUE.INITIAL_ROUND' | translate }}: {{data.lega.giornataIniziale}}</p>
      <p>{{ 'JOIN_LEAGUE.NUM_MEMBERS' | translate }}: {{data.lega.giocatori.length}}</p>
      <div *ngIf="data.lega.withPwd">
        <mat-form-field appearance="fill" style="width:100%;">
          <mat-label>{{ 'JOIN_LEAGUE.PASSWORD' | translate }}</mat-label>
          <input matInput [(ngModel)]="password" [placeholder]="'JOIN_LEAGUE.PASSWORD_PLACEHOLDER' | translate" />
        </mat-form-field>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
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
