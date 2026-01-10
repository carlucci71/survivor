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
    <div class="dialog-container">
      <div class="dialog-header">
        <h2 class="dialog-title">Invita Utenti a {{ data.legaNome }}</h2>
        <button mat-icon-button class="close-btn" (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="invite-section">
          <p class="instructions">Inserisci gli indirizzi email degli utenti che vuoi invitare:</p>

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
            <button class="add-btn" (click)="addEmail()" [disabled]="!isValidEmail(emailInput)">
              Aggiungi
            </button>
          </div>

          <div class="emails-list" *ngIf="emailsList.length > 0">
            <div class="emails-header">Email da invitare:</div>
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
            <div class="success-message">
              <mat-icon>check_circle</mat-icon>
              <span>Inviti inviati con successo!</span>
            </div>
          </div>

          <div class="invite-error" *ngIf="inviteError">
            <div class="error-message">
              <mat-icon>error</mat-icon>
              <span>{{inviteError}}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="dialog-actions">
        <button class="cancel-btn" (click)="onCancel()">Annulla</button>
        <button
          class="send-btn"
          (click)="invitaUtenti()"
          [disabled]="emailsList.length === 0 || inviteSuccess"
        >
          Invia Inviti ({{emailsList.length}})
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* DIALOG RESPONSIVE CONTAINER */
    .dialog-container {
      max-width: 90vw;
      width: 100%;
      max-height: 85vh;
      overflow: hidden;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      font-family: 'Poppins', sans-serif;
    }

    /* HEADER CON TITOLO E X CHIUSURA */
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 20px 24px;
      border-bottom: 1px solid #E0E0E0;
      background: linear-gradient(135deg, #F4F6F8, #FFFFFF);

      .dialog-title {
        margin: 0;
        font-size: 1.3rem;
        font-weight: 700;
        color: #0A3D91;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        flex: 1;
        padding-right: 20px;
      }

      .close-btn {
        background: rgba(10, 61, 145, 0.08);
        color: #0A3D91;
        border-radius: 50%;
        width: 40px;
        height: 40px;

        &:hover {
          background: rgba(10, 61, 145, 0.15);
        }

        mat-icon {
          font-size: 20px;
        }
      }
    }

    /* CONTENUTO PRINCIPALE */
    .dialog-content {
      padding: 24px;
      max-height: 60vh;
      overflow-y: auto;

      .instructions {
        margin: 0 0 20px 0;
        color: #6B7280;
        font-weight: 500;
        font-size: 0.95rem;
      }

      /* SEZIONE INPUT EMAIL */
      .email-input-section {
        display: flex;
        gap: 12px;
        align-items: flex-start;
        margin-bottom: 24px;

        .email-field {
          flex: 1;
          min-width: 0;

          ::ng-deep .mat-mdc-text-field-wrapper {
            border-radius: 12px;
            background: #F4F6F8;
            border: 2px solid #E0E0E0;

            &:focus-within {
              border-color: #0A3D91;
              background: #FFFFFF;
            }
          }

          ::ng-deep .mat-mdc-form-field-flex {
            padding: 12px 16px !important;
            min-height: 48px !important;
          }

          ::ng-deep .mat-mdc-form-field-infix {
            padding: 12px 0 !important;
            min-height: 24px !important;
            border-top: none !important;
          }

          ::ng-deep input {
            font-size: 0.95rem !important;
            font-family: 'Poppins', sans-serif !important;
            color: #0A3D91 !important;
            padding: 0 !important;
          }

          ::ng-deep .mat-mdc-form-field-label {
            color: #6B7280 !important;
            font-size: 0.9rem !important;
            font-family: 'Poppins', sans-serif !important;
          }

          ::ng-deep .mat-mdc-floating-label {
            top: 24px !important;
          }

          ::ng-deep .mat-mdc-floating-label.mdc-floating-label--float-above {
            top: 8px !important;
          }
        }

        .add-btn {
          background: linear-gradient(135deg, #0A3D91, #4FC3F7) !important;
          color: #FFFFFF !important;
          border: none !important;
          border-radius: 10px !important;
          padding: 12px 20px !important;
          font-weight: 600 !important;
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.9rem !important;
          box-shadow: 0 4px 16px rgba(10, 61, 145, 0.15) !important;
          transition: all 0.2s ease !important;
          cursor: pointer;
          margin-top: 8px;
          min-width: 100px;

          &:hover:not(:disabled) {
            transform: translateY(-2px);
            box-shadow: 0 6px 24px rgba(10, 61, 145, 0.25) !important;
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: linear-gradient(135deg, #E0E0E0, #F4F6F8) !important;
            color: #6B7280 !important;
          }
        }
      }

      /* LISTA EMAIL AGGIUNTE */
      .emails-list {
        margin-bottom: 24px;

        .emails-header {
          font-weight: 600;
          color: #0A3D91;
          font-size: 0.9rem;
          margin-bottom: 12px;
        }

        ::ng-deep mat-chip-set {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          mat-chip {
            background: linear-gradient(135deg, #E3F2FD, #BBDEFB) !important;
            color: #0A3D91 !important;
            border-radius: 8px !important;
            font-weight: 500 !important;
            padding: 8px 12px !important;

            button[matChipRemove] {
              background: none !important;
              border: none !important;
              cursor: pointer !important;
              padding: 0 !important;
              margin-left: 8px !important;

              mat-icon {
                font-size: 18px !important;
                width: 18px !important;
                height: 18px !important;
                color: #0A3D91 !important;
              }

              &:hover mat-icon {
                color: #EF4444 !important;
              }
            }
          }
        }
      }

      /* MESSAGGIO SUCCESSO */
      .invite-success {
        margin-bottom: 20px;

        .success-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #10B981, #34D399);
          color: #FFFFFF;
          border-radius: 12px;
          font-weight: 600;

          mat-icon {
            font-size: 24px;
          }
        }
      }

      /* MESSAGGIO ERRORE */
      .invite-error {
        margin-bottom: 20px;

        .error-message {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 16px;
          background: linear-gradient(135deg, #EF4444, #F87171);
          color: #FFFFFF;
          border-radius: 12px;
          font-weight: 600;

          mat-icon {
            font-size: 24px;
          }
        }
      }
    }

    /* AZIONI DIALOG - BOTTONI */
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding: 20px 24px;
      border-top: 1px solid #E0E0E0;
      background: #F4F6F8;

      .cancel-btn {
        background: #FFFFFF !important;
        color: #6B7280 !important;
        border: 2px solid #E0E0E0 !important;
        border-radius: 10px !important;
        padding: 12px 24px !important;
        font-weight: 600 !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 0.9rem !important;
        transition: all 0.2s ease !important;
        cursor: pointer;

        &:hover {
          border-color: #6B7280 !important;
          color: #374151 !important;
        }
      }

      .send-btn {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 10px !important;
        padding: 12px 24px !important;
        font-weight: 700 !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 0.9rem !important;
        box-shadow: 0 4px 16px rgba(10, 61, 145, 0.15) !important;
        transition: all 0.2s ease !important;
        cursor: pointer;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 24px rgba(10, 61, 145, 0.25) !important;
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: linear-gradient(135deg, #E0E0E0, #F4F6F8) !important;
          color: #6B7280 !important;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 768px) {
      .dialog-container {
        max-width: 95vw;
        max-height: 90vh;
      }

      .dialog-header {
        padding: 16px 20px;

        .dialog-title {
          font-size: 1.1rem;
          padding-right: 16px;
        }

        .close-btn {
          width: 36px;
          height: 36px;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          padding: 0 !important;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
          }
        }
      }

      .dialog-content {
        padding: 20px;

        .email-input-section {
          flex-direction: column;
          gap: 16px;

          .email-field {
            ::ng-deep .mat-mdc-form-field-flex {
              padding: 10px 14px !important;
              min-height: 44px !important;
            }

            ::ng-deep input {
              font-size: 0.9rem !important;
            }

            ::ng-deep .mat-mdc-floating-label {
              top: 22px !important;
            }

            ::ng-deep .mat-mdc-floating-label.mdc-floating-label--float-above {
              top: 6px !important;
            }
          }

          .add-btn {
            margin-top: 0;
            align-self: flex-start;
            width: 120px;
          }
        }
      }

      .dialog-actions {
        padding: 16px 20px;
        flex-direction: column-reverse;

        .cancel-btn,
        .send-btn {
          width: 100%;
          justify-content: center;
        }
      }
    }

    @media (max-width: 480px) {
      .dialog-container {
        max-width: 98vw;
      }

      .dialog-header {
        padding: 14px 16px;

        .dialog-title {
          font-size: 1rem;
          padding-right: 12px;
        }
      }

      .dialog-content {
        padding: 16px;

        .instructions {
          font-size: 0.9rem;
        }

        .email-input-section {
          .email-field {
            ::ng-deep .mat-mdc-form-field-flex {
              padding: 8px 12px !important;
              min-height: 40px !important;
            }

            ::ng-deep input {
              font-size: 0.85rem !important;
            }

            ::ng-deep .mat-mdc-form-field-label {
              font-size: 0.85rem !important;
            }

            ::ng-deep .mat-mdc-floating-label {
              top: 20px !important;
            }

            ::ng-deep .mat-mdc-floating-label.mdc-floating-label--float-above {
              top: 4px !important;
            }
          }

          .add-btn {
            width: 100px;
            padding: 8px 16px !important;
            font-size: 0.8rem !important;
          }
        }

        .emails-list .emails-header {
          font-size: 0.85rem;
        }
      }

      .dialog-actions {
        padding: 14px 16px;

        .cancel-btn,
        .send-btn {
          padding: 10px 20px !important;
          font-size: 0.85rem !important;
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
