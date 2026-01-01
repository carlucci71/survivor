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
  ],
  template: `
    <h2 mat-dialog-title>Invita Utenti a {{ data.legaNome }}</h2>
    <mat-dialog-content>
      <div class="invite-section">
        <p>Inserisci gli indirizzi email degli utenti che vuoi invitare:</p>
        
        <div class="email-input-section">
          <mat-form-field appearance="outline" class="email-field">
            <mat-label>Indirizzo email</mat-label>
            <input 
              matInput 
              placeholder="email@esempio.com" 
              [(ngModel)]="emailInput"
              (keyup.enter)="addEmail()"
            />
          </mat-form-field>
          <button mat-raised-button color="accent" (click)="addEmail()" [disabled]="!isValidEmail(emailInput)">
            Aggiungi
          </button>
        </div>

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

        <div class="invite-success" *ngIf="inviteSuccess">
          <mat-card class="success-card">
            <mat-card-content>
              ✓ Inviti inviati con successo!
            </mat-card-content>
          </mat-card>
        </div>

        <div class="invite-error" *ngIf="inviteError">
          <mat-card class="error-card">
            <mat-card-content>
              {{inviteError}}
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Annulla</button>
      <button 
        mat-raised-button 
        color="primary" 
        (click)="invitaUtenti()" 
        [disabled]="emailsList.length === 0 || inviteSuccess"
      >
        Invia Inviti ({{emailsList.length}})
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .invite-section {
      min-width: 500px;
      padding: 20px 0;

      p {
        margin-bottom: 20px;
        color: #666;
      }

      .email-input-section {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 20px;

        .email-field {
          flex: 1;
        }

        button {
          margin-top: 8px;
        }
      }

      .emails-list {
        margin-bottom: 20px;

        mat-chip-set {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        mat-chip {
          background-color: #e3f2fd;
          color: #1976d2;
          
          button[matChipRemove] {
            background: none;
            border: none;
            cursor: pointer;
            padding: 0;
            margin-left: 8px;
            
            mat-icon {
              font-size: 18px;
              width: 18px;
              height: 18px;
              color: #1976d2;
            }
          }
        }
      }

      .invite-success {
        margin-bottom: 20px;

        .success-card {
          background-color: #e8f5e9;
          padding: 12px;
          
          mat-card-content {
            color: #2e7d32;
            font-weight: 500;
            padding: 0;
          }
        }
      }

      .invite-error {
        margin-bottom: 20px;

        .error-card {
          background-color: #ffebee;
          padding: 12px;
          
          mat-card-content {
            color: #c62828;
            font-weight: 500;
            padding: 0;
          }
        }
      }
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
