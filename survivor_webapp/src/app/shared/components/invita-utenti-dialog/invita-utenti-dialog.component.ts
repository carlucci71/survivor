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

      <div class="dialog-content" [class.scroll-enabled]="shouldEnableScroll()">
        <div class="invite-section">
          <p class="instructions">Inserisci gli indirizzi email degli utenti che vuoi invitare:</p>

          <div class="email-input-section">
            <mat-form-field appearance="outline" class="email-field">
              <input
                matInput
                placeholder="Inserisci indirizzo email (es. utente@esempio.com)"
                [(ngModel)]="emailInput"
                (keyup.enter)="addEmail()"
              />
            </mat-form-field>
            <button class="add-btn"
                    (click)="addEmail()"
                    [disabled]="!isValidEmail(emailInput)"
                    type="button"
                    aria-label="Aggiungi indirizzo email alla lista">
              <span>Aggiungi</span>
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
      max-height: 90vh;
      overflow: hidden;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.2);
      font-family: 'Poppins', sans-serif;
      position: relative;
    }

    /* HEADER CON TITOLO E X CHIUSURA */
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px 60px 20px 24px; /* Più spazio a destra per la X */
      border-bottom: none;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      border-radius: 16px 16px 0 0;
      position: relative;
      min-height: 70px;

      .dialog-title {
        margin: 0;
        font-size: 1.1rem;
        font-weight: 700;
        color: #FFFFFF;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        text-align: center;
        line-height: 1.3;
        width: 100%;
        word-wrap: break-word;
        hyphens: auto;
      }

      .close-btn {
        position: absolute;
        right: 20px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        color: #FFFFFF;
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.1);
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
        }
      }
    }

    /* CONTENUTO PRINCIPALE */
    .dialog-content {
      padding: 28px;

      /* Scroll dinamico - attivato solo quando necessario */
      &.scroll-enabled {
        max-height: 50vh;
        overflow-y: auto;
        overflow-x: hidden;

        /* Scrollbar personalizzata */
        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #F4F6F8;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #0A3D91;
          border-radius: 3px;

          &:hover {
            background: #4FC3F7;
          }
        }
      }

      .instructions {
        margin: 0 0 24px 0;
        color: #6B7280;
        font-weight: 500;
        font-size: 0.9rem;
        line-height: 1.5;
        text-align: center;
        padding: 16px 20px;
        background: rgba(248, 250, 252, 0.5);
        border-radius: 12px;
        border: none;
      }

      /* SEZIONE INPUT EMAIL - COMPLETAMENTE RIDISEGNATA */
      .email-input-section {
        display: flex;
        gap: 20px;
        align-items: flex-end;
        margin-bottom: 32px;
        flex-wrap: wrap;

        .email-field {
          flex: 1;
          min-width: 280px;

          ::ng-deep .mat-mdc-text-field-wrapper {
            border-radius: 12px;
            background: #FFFFFF;
            border: 1px solid #E5E7EB;
            transition: all 0.3s ease;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

            &:focus-within {
              border-color: #0A3D91;
              background: #FFFFFF;
              box-shadow: 0 4px 16px rgba(10, 61, 145, 0.15);
              transform: translateY(-1px);
            }

            &:hover:not(:focus-within) {
              border-color: #4FC3F7;
              box-shadow: 0 3px 12px rgba(10, 61, 145, 0.08);
            }
          }

          ::ng-deep .mat-mdc-form-field-flex {
            padding: 16px 20px !important;
            min-height: 60px !important;
          }

          ::ng-deep .mat-mdc-form-field-infix {
            padding: 14px 0 !important;
            min-height: 28px !important;
            border-top: none !important;
          }

          ::ng-deep input {
            font-size: 1rem !important;
            font-family: 'Poppins', sans-serif !important;
            color: #1F2937 !important;
            padding: 0 !important;
            font-weight: 500 !important;

            &::placeholder {
              color: #9CA3AF !important;
              font-weight: 400 !important;
              font-size: 0.95rem !important;
            }
          }

          /* NASCONDO COMPLETAMENTE LA LABEL FLOATING PER EVITARE SOVRAPPOSIZIONI */
          ::ng-deep .mat-mdc-form-field-label {
            display: none !important;
          }

          ::ng-deep .mat-mdc-floating-label {
            display: none !important;
          }

          ::ng-deep .mat-mdc-form-field-label-wrapper {
            display: none !important;
          }
        }

        .add-btn {
          background: #FFFFFF !important;
          color: #6B7280 !important;
          border: 2px solid #E5E7EB !important;
          border-radius: 12px !important;
          padding: 16px 24px !important;
          font-weight: 600 !important;
          font-family: 'Poppins', sans-serif !important;
          font-size: 0.9rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.5px !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;
          transition: all 0.3s ease !important;
          cursor: pointer;
          min-width: 120px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;

          &:hover:not(:disabled) {
            border-color: #6B7280 !important;
            color: #374151 !important;
            transform: translateY(-1px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            background: #F9FAFB !important;
            color: #9CA3AF !important;
            border-color: #E5E7EB !important;
            transform: none !important;
            box-shadow: 0 1px 4px rgba(0,0,0,0.03) !important;
          }

          span {
            position: relative;
            z-index: 1;
          }
        }
      }

      /* LISTA EMAIL AGGIUNTE - DESIGN PULITO */
      .emails-list {
        margin-bottom: 24px;
        padding: 16px;
        background: rgba(248, 250, 252, 0.3);
        border-radius: 12px;
        border: none;

        ::ng-deep mat-chip-set {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          min-height: auto;

          mat-chip {
            background: #FFFFFF !important;
            color: #374151 !important;
            border: none !important;
            border-radius: 16px !important;
            font-weight: 500 !important;
            font-family: 'Poppins', sans-serif !important;
            padding: 8px 12px !important;
            font-size: 0.8rem !important;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1) !important;
            transition: all 0.2s ease !important;

            &:hover {
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12) !important;
            }

            button[matChipRemove] {
              background: rgba(220, 38, 38, 0.1) !important;
              border: none !important;
              border-radius: 50% !important;
              cursor: pointer !important;
              padding: 2px !important;
              margin-left: 8px !important;
              width: 16px !important;
              height: 16px !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              transition: all 0.2s ease !important;

              mat-icon {
                font-size: 10px !important;
                width: 10px !important;
                height: 10px !important;
                color: #DC2626 !important;
                font-weight: bold !important;
              }

              &:hover {
                background: rgba(220, 38, 38, 0.2) !important;
                transform: scale(1.1) !important;

                mat-icon {
                  color: #B91C1C !important;
                }
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

    /* AZIONI DIALOG - BOTTONI MODERNI */
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 16px;
      padding: 24px 28px;
      border-top: none;
      background: linear-gradient(135deg, #F8FAFC, #F1F5F9);
      border-radius: 0 0 16px 16px;

      .cancel-btn {
        background: #FFFFFF !important;
        color: #6B7280 !important;
        border: 2px solid #E5E7EB !important;
        border-radius: 12px !important;
        padding: 14px 28px !important;
        font-weight: 600 !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 0.9rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        transition: all 0.3s ease !important;
        cursor: pointer;
        box-shadow: 0 2px 8px rgba(0,0,0,0.05) !important;

        &:hover {
          border-color: #6B7280 !important;
          color: #374151 !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(0,0,0,0.1) !important;
        }
      }

      .send-btn {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7) !important;
        color: #FFFFFF !important;
        border: none !important;
        border-radius: 12px !important;
        padding: 14px 28px !important;
        font-weight: 700 !important;
        font-family: 'Poppins', sans-serif !important;
        font-size: 0.9rem !important;
        text-transform: uppercase !important;
        letter-spacing: 0.5px !important;
        box-shadow: 0 8px 24px rgba(10, 61, 145, 0.2) !important;
        transition: all 0.3s ease !important;
        cursor: pointer;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #4FC3F7, #0A3D91);
          opacity: 0;
          transition: all 0.3s ease;
          transform: scale(0);
          border-radius: inherit;
        }

        &:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(10, 61, 145, 0.3) !important;

          &::before {
            opacity: 1;
            transform: scale(1);
          }
        }

        &:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: linear-gradient(135deg, #E5E7EB, #F3F4F6) !important;
          color: #9CA3AF !important;
          transform: none !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1) !important;

          &::before {
            display: none;
          }
        }

        span {
          position: relative;
          z-index: 1;
        }
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .dialog-container {
        max-width: 95vw;
        max-height: 90vh;
        padding: 20px;
      }

      .dialog-header {
        padding: 20px 16px;

        .dialog-title {
          font-size: 1.1rem;
          max-width: calc(100% - 60px);
          letter-spacing: 0.4px;
        }

        .close-btn {
          right: 16px;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 20px;
            width: 20px;
            height: 20px;
            line-height: 20px;
          }
        }
      }

      .dialog-content {
        padding: 0;

        .instructions {
          font-size: 0.9rem;
          margin-bottom: 16px;
        }

        .email-input-section {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;

          .email-field {
            min-width: auto;
            width: 100%;

            ::ng-deep .mat-mdc-form-field-flex {
              min-height: 52px !important;
            }
          }

          .add-btn {
            width: 100%;
            height: 52px;
            font-size: 0.85rem !important;
            padding: 12px 18px !important;
          }
        }

        .emails-list {
          padding: 8px;
          margin-bottom: 16px;

          ::ng-deep mat-chip-set {
            gap: 6px;

            mat-chip {
              font-size: 0.7rem !important;
              padding: 3px 6px !important;

              button[matChipRemove] {
                width: 12px !important;
                height: 12px !important;
                margin-left: 4px !important;

                mat-icon {
                  font-size: 8px !important;
                  width: 8px !important;
                  height: 8px !important;
                }
              }
            }
          }
        }
      }

      .dialog-actions {
        flex-direction: column;
        gap: 8px;

        .cancel-btn,
        .send-btn {
          width: 100%;
          padding: 12px 20px !important;
          font-size: 0.85rem !important;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .dialog-container {
        max-width: 98vw;
        max-height: 95vh;
        padding: 16px;
        margin: 0;
        border-radius: 12px;
      }

      .dialog-header {
        padding: 16px 12px;

        .dialog-title {
          font-size: 1rem;
          max-width: calc(100% - 50px);
          letter-spacing: 0.3px;
          line-height: 1.2;
        }

        .close-btn {
          right: 12px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 18px;
            width: 18px;
            height: 18px;
            line-height: 18px;
          }
        }
      }

      .dialog-content {
        padding: 0;

        .instructions {
          font-size: 0.85rem;
          margin-bottom: 14px;
        }

        .email-input-section {
          flex-direction: column;
          gap: 12px;
          align-items: stretch;

          .email-field {
            min-width: auto;

            ::ng-deep .mat-mdc-form-field-flex {
              padding: 10px 14px !important;
              min-height: 48px !important;
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
            width: 100%;
            height: 48px;
            font-size: 0.8rem !important;
            padding: 12px 16px !important;
          }
        }

        .emails-list {
          padding: 8px;
          margin-bottom: 12px;

          ::ng-deep mat-chip-set {
            gap: 6px;

            mat-chip {
              font-size: 0.65rem !important;
              padding: 2px 6px !important;

              button[matChipRemove] {
                width: 12px !important;
                height: 12px !important;
                margin-left: 3px !important;

                mat-icon {
                  font-size: 7px !important;
                  width: 7px !important;
                  height: 7px !important;
                }
              }
            }
          }
        }
      }

      .dialog-actions {
        padding: 16px 0;
        flex-direction: column;
        gap: 8px;

        .cancel-btn,
        .send-btn {
          width: 100%;
          padding: 12px 16px !important;
          font-size: 0.8rem !important;
        }
      }
    }

    @media (max-width: 360px) {
      .dialog-container {
        max-width: 100vw;
        max-height: 100vh;
        padding: 12px;
        margin: 0;
        border-radius: 0;
      }

      .dialog-content {
        .instructions {
          font-size: 0.8rem;
          margin-bottom: 12px;
        }

        .email-input-section {
          gap: 10px;

          .add-btn {
            height: 44px;
            font-size: 0.75rem !important;
          }
        }
      }
    }

    @media (max-width: 320px) {
      .dialog-header {
        padding: 12px 12px;

        .dialog-title {
          font-size: 0.9rem;
          max-width: calc(100% - 45px);
          letter-spacing: 0.2px;
          line-height: 1.1;
        }

        .close-btn {
          right: 12px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
            line-height: 16px;
          }
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

  // ...existing code...

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

    this.legaService.invitaUtenti(this.data.legaId, this.emailsList, environment.mobile).subscribe({
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
