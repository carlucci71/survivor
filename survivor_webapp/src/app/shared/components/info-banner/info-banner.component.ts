import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GiocatoreService } from '../../../core/services/giocatore.service';
import { SquadraService } from '../../../core/services/squadra.service';

// MODAL REGOLAMENTO (stesso del footer)
@Component({
  selector: 'app-regolamento-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="regolamento-dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">{{ 'RULES.TITLE' | translate }}</h2>
        <button mat-icon-button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <!-- 1. Scelta settimanale -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_1_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_1_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_1_P2' | translate }}</p>
        </div>

        <!-- 2. Squadre non ripetibili -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_2_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_2_TEXT' | translate }}</p>
        </div>

        <!-- 3. Eliminazione -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_3_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_3_TEXT' | translate }}</p>
        </div>

        <!-- 4. Durata del torneo -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_4_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_4_P1' | translate }}</p>
          <ul>
            <li>{{ 'RULES.SECTION_4_L1' | translate }}</li>
            <li>{{ 'RULES.SECTION_4_L2' | translate }}</li>
          </ul>
          <p>{{ 'RULES.SECTION_4_P2' | translate }}</p>
        </div>

        <!-- 5. Tempistiche di scelta -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_5_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_5_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_5_P2' | translate }}</p>
        </div>

        <!-- 6. Calendario -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_6_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_6_TEXT' | translate }}</p>
        </div>

        <!-- 7. Eliminazione totale ed equità del montepremi -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_7_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_7_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_7_P2' | translate }}</p>
          <p>{{ 'RULES.SECTION_7_P3' | translate }}</p>
        </div>

        <!-- 8. Divisione anticipata del montepremi -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_8_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_8_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_8_P2' | translate }}</p>
          <p><strong>{{ 'RULES.SECTION_8_EXAMPLE_TITLE' | translate }}</strong></p>
          <p>{{ 'RULES.SECTION_8_EXAMPLE' | translate }}</p>
          <p>{{ 'RULES.SECTION_8_P3' | translate }}</p>
        </div>

        <!-- 9. Giornate con partite rinviate o sospese -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_9_TITLE' | translate }}</h3>

          <h4>{{ 'RULES.SECTION_9_1_TITLE' | translate }}</h4>
          <p>{{ 'RULES.SECTION_9_1_P1' | translate }}</p>
          <ul>
            <li>{{ 'RULES.SECTION_9_1_L1' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_1_L2' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_1_L3' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_1_L4' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_1_L5' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_1_L6' | translate }}</li>
          </ul>

          <h4>{{ 'RULES.SECTION_9_2_TITLE' | translate }}</h4>
          <p>{{ 'RULES.SECTION_9_2_P1' | translate }}</p>
          <ul>
            <li>{{ 'RULES.SECTION_9_2_L1' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L2' | translate }}</li>
          </ul>
          <p>{{ 'RULES.SECTION_9_2_P2' | translate }}</p>
          <ul>
            <li>{{ 'RULES.SECTION_9_2_L3' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L4' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L5' | translate }}</li>
          </ul>
          <p>{{ 'RULES.SECTION_9_2_P3' | translate }}</p>
        </div>

        <p class="good-luck">{{ 'RULES.GOOD_LUCK' | translate }}</p>
      </div>
    </div>
  `,
  styles: [`
    .regolamento-dialog {
      width: 90vw;
      max-width: 100vw;
      max-height: 90vh;
      background: #FFFFFF;
      border-radius: 0;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      flex-shrink: 0;
      position: relative;
      box-sizing: border-box;

      .dialog-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        text-align: center;
        flex: 1;
        line-height: 1.2;
      }

      .close-btn {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.05);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .dialog-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      line-height: 1.6;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;

      /* Scrollbar */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F8F9FA;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #C1C9D2;
        border-radius: 3px;

        &:hover {
          background: #4FC3F7;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #C1C9D2 #F8F9FA;

      .intro {
        color: #0A3D91;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 24px;
        text-align: center;
        line-height: 1.6;
      }

      .good-luck {
        color: #4FC3F7;
        font-size: 1.1rem;
        font-weight: 600;
        text-align: center;
        margin-top: 24px;
        padding: 16px;
        background: linear-gradient(135deg, rgba(10, 61, 145, 0.05), rgba(79, 195, 247, 0.08));
        border-radius: 12px;
      }

      .regola {
        margin: 0 0 24px 0;
        padding-bottom: 20px;
        border-bottom: 1px solid #E5E7EB;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;

        &:last-child {
          border-bottom: none;
          margin-bottom: 0;
        }

        h3 {
          color: #0A3D91;
          font-weight: 600;
          font-size: 1rem;
          margin: 0 0 12px 0;
          line-height: 1.4;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
          hyphens: auto;
        }

        h4 {
          color: #4FC3F7;
          font-weight: 600;
          font-size: 0.9rem;
          margin: 16px 0 10px 0;
          line-height: 1.4;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
          hyphens: auto;
        }

        p {
          color: #6B7280;
          font-size: 0.85rem;
          margin: 0 0 12px 0;
          line-height: 1.6;
          text-align: justify;
          word-break: break-word;
          overflow-wrap: anywhere;
          hyphens: auto;
          max-width: 100%;
        }

        ul {
          margin: 10px 0 12px 0;
          padding-left: 20px;
          padding-right: 0;
          color: #6B7280;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;

          li {
            font-size: 0.85rem;
            margin-bottom: 8px;
            line-height: 1.6;
            text-align: justify;
            word-break: break-word;
            overflow-wrap: anywhere;
            hyphens: auto;
            max-width: 100%;
          }
        }

        strong {
          color: #0A3D91;
          font-weight: 600;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 100vw;
        border-radius: 0;
        margin: 0;
        box-sizing: border-box;
      }

      .dialog-header {
        padding: 16px 20px;
        box-sizing: border-box;

        .dialog-title {
          font-size: 1rem;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .close-btn {
          width: 28px;
          height: 28px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .dialog-content {
        padding: 16px 20px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 20px;
          padding-bottom: 16px;

          h3 {
            font-size: 0.95rem;
            margin-bottom: 10px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          h4 {
            font-size: 0.85rem;
            margin: 12px 0 8px 0;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p, li {
            font-size: 0.8rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          ul {
            padding-left: 18px;
            margin: 8px 0 10px 0;

            li {
              margin-bottom: 6px;
            }
          }
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 100vw;
        max-height: 100vh;
        margin: 0;
        border-radius: 0;
        box-sizing: border-box;
      }

      .dialog-header {
        padding: 12px 16px;
        box-sizing: border-box;

        .dialog-title {
          font-size: 0.95rem;
          letter-spacing: 0.1px;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .close-btn {
          right: 12px;
          width: 26px;
          height: 26px;

          mat-icon {
            font-size: 12px;
            width: 12px;
            height: 12px;
          }
        }
      }

      .dialog-content {
        padding: 12px 16px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 16px;
          padding-bottom: 12px;

          h3 {
            font-size: 0.9rem;
            margin-bottom: 8px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          h4 {
            font-size: 0.8rem;
            margin: 10px 0 6px 0;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p, li {
            font-size: 0.75rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          ul {
            padding-left: 16px;
            margin: 6px 0 8px 0;

            li {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  `]
})
export class RegolamentoBannerDialogComponent {
  constructor(private dialog: MatDialog) {}

  closeDialog() {
    this.dialog.closeAll();
  }
}

// MODAL ALBO D'ORO
@Component({
  selector: 'app-albo-oro-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="albo-oro-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="trophy-icon">emoji_events</mat-icon>
          <h2 class="dialog-title">{{ 'TROPHIES.YOUR_TROPHIES' | translate }}</h2>
        </div>
        <button mat-icon-button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <!-- Messaggio simpatico se non ci sono trofei -->
        <div class="empty-state" *ngIf="!hasTrofei">
          <div class="empty-emoji">{{ currentEmoji }}</div>
          <p class="empty-message">{{ currentMessage }}</p>
          <p class="empty-subtitle">{{ currentSubtitle }}</p>
        </div>

        <!-- Lista trofei personali -->
        <div class="winner-card" *ngIf="hasTrofei">
          <div class="season">
            <h3>🏆 {{ 'TROPHIES.SEASON' | translate }} 2024-2025</h3>
            <div class="winner-info">
              <div class="winner-name">{{ 'TROPHIES.FIRST_PLACE' | translate }}</div>
              <div class="winner-details">
                <span class="detail">{{ 'TROPHIES.ROUNDS_SURVIVED' | translate }}: 8</span>
                <span class="detail">{{ 'TROPHIES.FINAL_TEAM' | translate }}: Napoli</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiche personali - solo se ci sono dati -->
        <div class="stats-section" *ngIf="hasTrofei">
          <h3>📊 {{ 'TROPHIES.YOUR_STATS' | translate }}</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">5</span>
              <span class="stat-label">{{ 'TROPHIES.TOURNAMENTS_PLAYED' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2</span>
              <span class="stat-label">{{ 'TROPHIES.VICTORIES' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">35</span>
              <span class="stat-label">{{ 'TROPHIES.TOTAL_ROUNDS' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">78%</span>
              <span class="stat-label">% Successo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .albo-oro-dialog {
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #FFFFFF;
      position: relative;
      flex-shrink: 0;

      .header-content {
        display: flex;
        align-items: center;
        gap: 15px;
        justify-content: center;
        flex: 1;

        .trophy-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          color: #FFFFFF;
        }

        .dialog-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }
      }

      .close-btn {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.05);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .dialog-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      width: 100%;

      /* Scrollbar personalizzata */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F8F9FA;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #C1C9D2;
        border-radius: 3px;

        &:hover {
          background: #FFD700;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #C1C9D2 #F8F9FA;

      /* Stato vuoto - nessun trofeo con messaggi simpatici */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;

        .empty-emoji {
          font-size: 4rem;
          margin-bottom: 16px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-message {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A3D91;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .empty-subtitle {
          font-size: 0.95rem;
          color: #6B7280;
          margin: 0;
          font-style: italic;
        }
      }

      .winner-card {
        background: #F8F9FA;
        border-radius: 12px;
        padding: 16px;
        margin: 0 auto 16px auto;
        border-left: 4px solid #FFD700;
        max-width: 100%;
        box-sizing: border-box;

        .season {
          width: 100%;

          h3 {
            color: #0A3D91;
            font-weight: 600;
            font-size: 1rem;
            margin: 0 0 12px 0;
            text-align: center;
            word-break: break-word;
          }

          .winner-info {
            text-align: center;

            .winner-name {
              font-size: 0.95rem;
              font-weight: 700;
              color: #0A3D91;
              margin-bottom: 10px;
              word-break: break-word;
            }

            .winner-details {
              display: flex;
              flex-direction: column;
              gap: 4px;
              align-items: center;

              .detail {
                color: #6B7280;
                font-size: 0.8rem;
                font-weight: 500;
                word-break: break-word;
              }
            }
          }
        }
      }

      .stats-section {
        margin: 20px auto 0 auto;
        padding: 16px;
        background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
        border-radius: 12px;
        border: 1px solid #E0E0E0;
        max-width: 100%;
        box-sizing: border-box;

        h3 {
          color: #0A3D91;
          font-weight: 600;
          font-size: 0.95rem;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
          max-width: 100%;

          .stat-item {
            text-align: center;
            padding: 12px 8px;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #E0E0E0;
            box-sizing: border-box;

            .stat-number {
              display: block;
              font-size: 1.3rem;
              font-weight: 700;
              color: #FFD700;
              margin-bottom: 4px;
              word-break: break-word;
            }

            .stat-label {
              color: #6B7280;
              font-size: 0.7rem;
              font-weight: 500;
              word-break: break-word;
              line-height: 1.2;
            }
          }
        }
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .albo-oro-dialog {
        width: 90vw;
        max-width: 95vw;
      }

      .dialog-header {
        padding: 18px;

        .header-content {
          .trophy-icon {
            font-size: 1.7rem;
            width: 1.7rem;
            height: 1.7rem;
          }

          .dialog-title {
            font-size: 1.2rem;
          }
        }

        .close-btn {
          right: 16px;
          width: 30px;
          height: 30px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .dialog-content {
        padding: 16px;

        .winner-card {
          padding: 14px;
          margin-bottom: 14px;

          .season h3 {
            font-size: 0.9rem;
            margin-bottom: 10px;
          }

          .winner-info {
            .winner-name {
              font-size: 0.85rem;
            }

            .winner-details .detail {
              font-size: 0.75rem;
            }
          }
        }

        .stats-section {
          margin-top: 16px;
          padding: 14px;

          h3 {
            font-size: 0.85rem;
            margin-bottom: 12px;
          }

          .stats-grid {
            gap: 10px;

            .stat-item {
              padding: 10px 6px;

              .stat-number {
                font-size: 1.1rem;
              }

              .stat-label {
                font-size: 0.65rem;
              }
            }
          }
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .albo-oro-dialog {
        width: 90vw;
        max-width: 98vw;
        max-height: 95vh;
      }

      .dialog-header {
        padding: 16px;

        .header-content {
          .trophy-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }

          .dialog-title {
            font-size: 1.1rem;
            letter-spacing: 0.3px;
          }
        }

        .close-btn {
          right: 14px;
          width: 28px;
          height: 28px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .dialog-content {
        padding: 12px;

        .winner-card {
          padding: 12px;
          margin-bottom: 12px;

          .season h3 {
            font-size: 0.8rem;
            margin-bottom: 8px;
          }

          .winner-info {
            .winner-name {
              font-size: 0.75rem;
              margin-bottom: 8px;
            }

            .winner-details .detail {
              font-size: 0.7rem;
            }
          }
        }

        .stats-section {
          margin-top: 12px;
          padding: 12px;

          h3 {
            font-size: 0.75rem;
            margin-bottom: 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;

            .stat-item {
              padding: 8px 4px;

              .stat-number {
                font-size: 1rem;
              }

              .stat-label {
                font-size: 0.6rem;
              }
            }
          }
        }
      }
    }
  `]
})
export class AlboOroDialogComponent {
  // TODO: Collegare ai dati reali dell'utente dal backend
  hasTrofei = false; // Imposta a true quando ci sono dati dal DB


  currentEmoji = '';
  currentMessage = '';
  currentSubtitle = '';

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService
  ) {
    this.pickRandomMessage();
  }

  private pickRandomMessage() {
    // Scegli un messaggio casuale da 1 a 17
    const randomNum = Math.floor(Math.random() * 17) + 1;
    const msgKey = `MSG_${randomNum}`;
    const subKey = `SUB_${randomNum}`;

    // Carica i messaggi tradotti
    this.translate.get(`TROPHIES.FUNNY_MESSAGES.${msgKey}`).subscribe(msg => {
      this.currentMessage = msg;
    });
    this.translate.get(`TROPHIES.FUNNY_MESSAGES.${subKey}`).subscribe(sub => {
      this.currentSubtitle = sub;
    });

    // Emoji rimangono le stesse per tutte le lingue
    const emojis = ['🎲', '😅', '🤷', '😎', '🤠', '🚀', '🥶', '🎯', '📉', '👑', '🐌', '🤡', '🧹', '🐌', '🎪', '🧊', '🦴'];
    this.currentEmoji = emojis[randomNum - 1];
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}

// MODAL PROFILO UTENTE
@Component({
  selector: 'app-profilo-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatSnackBarModule, TranslateModule],
  template: `
    <div class="modal-container">
      <!-- CLOSE BUTTON -->
      <button mat-icon-button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>

      <!-- TITLE -->
      <h2>
        <mat-icon class="title-icon">account_circle</mat-icon>
        <span class="value">{{ 'PROFILE.TITLE' | translate }}</span>
      </h2>


      <!-- FORM FIELDS -->
      <div class="form-section">
        <div class="info-row">
          <div class="label">{{ 'PROFILE.NICKNAME' | translate }}</div>
          <div class="value">
            <input type="text"
              [placeholder]="'PROFILE.NICKNAME' | translate"
              [(ngModel)]="userProfile.nickname"
              name="nickname"
              class="custom-input"
              required>
          </div>
        </div>

        <div class="info-row">
          <div class="label">{{ 'PROFILE.FAVORITE_TEAM' | translate }}</div>
          <div class="value autocomplete-container">
            <input type="text"
              [placeholder]="'PROFILE.SEARCH_TEAM' | translate"
              [(ngModel)]="userProfile.squadraPreferita"
              (input)="onSearchInput()"
              (focus)="onInputFocus()"
              (blur)="onBlur()"
              class="custom-input"
              [class.has-value]="userProfile.squadraPreferita"
              autocomplete="off">
            <button type="button"
              class="clear-input-btn"
              *ngIf="userProfile.squadraPreferita && !showSuggestions"
              (mousedown)="clearSquadra()">
              ×
            </button>
            <div class="suggestions-list" *ngIf="showSuggestions && filteredSquadre.length > 0">
              <div class="suggestion-item"
                *ngFor="let squadra of filteredSquadre"
                (mousedown)="selectSquadra(squadra)">
                {{ squadra }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="actions-section">
        <button type="button"
          class="btn-secondary"
          (click)="closeDialog()">
          {{ 'PROFILE.CANCEL' | translate }}
        </button>
        <button type="submit"
          class="btn-primary"
          [disabled]="!isFormValid() || isSaving"
          (click)="onSubmit()">
          {{ isSaving ? ('PROFILE.SAVING' | translate) : ('PROFILE.SAVE' | translate) }}
        </button>
      </div>

      <!-- FEEDBACK MESSAGE -->
      <div *ngIf="feedbackMessage" class="feedback-message" [class.success]="feedbackType === 'success'" [class.error]="feedbackType === 'error'">
        <mat-icon>{{ feedbackType === 'success' ? 'check_circle' : 'error' }}</mat-icon>
        <span>{{ feedbackMessage }}</span>
      </div>

      <!-- DANGER ZONE -->
      <div class="danger-zone">
        <button type="button" class="btn-danger" (click)="openDeleteAccountDialog()">
          <mat-icon>delete_forever</mat-icon>
          {{ 'PROFILE.DELETE_ACCOUNT' | translate }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* CONTAINER PRINCIPALE - STESSO STILE DEL MODAL GIOCA ORA */
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 20px 24px;
      width: 85vw;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      margin: 0 auto;

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

    /* CLOSE BUTTON - X CENTRATA */
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      cursor: pointer;

      mat-icon {
        color: #0A3D91;
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      &:hover {
        background: rgba(10, 61, 145, 0.15);
        transform: scale(1.1);
      }
    }

    /* TITOLO H2 */
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      padding-right: 40px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        color: #4FC3F7;
      }

      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    /* INFO ROWS - OTTIMIZZATE PER LAYOUT VERTICALE SENZA SCROLL ORIZZONTALE */
    .info-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background: transparent;
      border-radius: 12px;
      border: 1px solid rgba(10, 61, 145, 0.08);
      font-size: 0.95rem;
      width: 100%;
      box-sizing: border-box;

      .label {
        font-weight: 600;
        color: #0A3D91;
        font-size: 0.9rem;
        margin-bottom: 4px;
      }

      .value {
        font-weight: 500;
        color: #6B7280;
        width: 100%;
        box-sizing: border-box;
      }
    }

    /* INPUT E SELECT PERSONALIZZATI */
    .custom-input,
    .custom-select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 12px;
      background: #F4F6F8;
      border: 2px solid #E0E0E0;
      transition: all 0.3s ease;
      font-weight: 500;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      box-sizing: border-box;

      &:focus {
        border-color: #0A3D91;
        background: #FFFFFF;
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.08);
        outline: none;
      }

      &::placeholder {
        color: #9CA3AF;
        font-weight: 400;
      }

      &.has-value {
        padding-right: 40px; /* Spazio per il pulsante clear */
        background: #FFFFFF;
        border-color: #4FC3F7;
        font-weight: 600;
      }
    }

    .custom-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230A3D91' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }

    /* AUTOCOMPLETE CONTAINER */
    .autocomplete-container {
      position: relative;
    }

    /* PULSANTE CLEAR DENTRO L'INPUT */
    .clear-input-btn {
      position: absolute;
      right: 12px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(10, 61, 145, 0.08);
      border: none;
      border-radius: 50%;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      font-size: 16px;
      line-height: 1;
      color: #0A3D91;
      transition: all 0.2s ease;
      padding: 0;
      z-index: 10;

      &:hover {
        background: rgba(10, 61, 145, 0.15);
        transform: translateY(-50%) scale(1.1);
      }
    }

    .suggestions-list {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      background: #FFFFFF;
      border: 2px solid #0A3D91;
      border-top: none;
      border-radius: 0 0 12px 12px;
      max-height: 200px;
      overflow-y: auto;
      z-index: 1000;
      box-shadow: 0 8px 24px rgba(10, 61, 145, 0.15);

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F4F6F8;
      }

      &::-webkit-scrollbar-thumb {
        background: #0A3D91;
        border-radius: 3px;
      }
    }

    .suggestion-item {
      padding: 12px 16px;
      cursor: pointer;
      font-size: 0.9rem;
      color: #0A3D91;
      font-weight: 500;
      transition: all 0.2s ease;
      border-bottom: 1px solid #F4F6F8;

      &:last-child {
        border-bottom: none;
      }

      &:hover {
        background: linear-gradient(135deg, rgba(10, 61, 145, 0.08), rgba(79, 195, 247, 0.08));
        padding-left: 20px;
      }
    }


    /* ACTIONS SECTION */
    .actions-section {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(10, 61, 145, 0.08);
      justify-content: flex-end;
      width: 100%;
      box-sizing: border-box;
    }

    .btn-primary,
    .btn-secondary {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 12px 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 2px solid;
      cursor: pointer;
      font-size: 0.9rem;
      min-width: 100px;
    }

    .btn-secondary {
      background: transparent;
      color: #6B7280;
      border-color: #E0E0E0;
    }

    .btn-secondary:hover {
      background: #F8F9FA;
      border-color: #4FC3F7;
      color: #4FC3F7;
      transform: translateY(-1px);
    }

    .btn-primary {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      border-color: transparent;
    }

    .btn-primary:hover:not(:disabled) {
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(10, 61, 145, 0.25);
    }

    .btn-primary:disabled {
      opacity: 0.5;
      background: #E0E0E0;
      color: #9CA3AF;
      cursor: not-allowed;
      transform: none;
    }

    /* FEEDBACK MESSAGE */
    .feedback-message {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 8px;
      margin-top: 16px;
      font-size: 0.9rem;
      font-weight: 500;
      animation: slideIn 0.3s ease;
    }

    .feedback-message.success {
      background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
      color: #2E7D32;
      border: 1px solid #81C784;
    }

    .feedback-message.error {
      background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
      color: #C62828;
      border: 1px solid #EF5350;
    }

    .feedback-message mat-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    @keyframes slideIn {
      from {
        opacity: 0;
        transform: translateY(-10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    /* DANGER ZONE */
    .danger-zone {
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px dashed rgba(220, 38, 38, 0.3);
      text-align: center;
    }

    .btn-danger {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      font-family: 'Poppins', sans-serif;
      font-weight: 500;
      font-size: 0.85rem;
      padding: 10px 16px;
      border-radius: 8px;
      border: 1px solid rgba(220, 38, 38, 0.3);
      background: transparent;
      color: #DC2626;
      cursor: pointer;
      transition: all 0.3s ease;
    }

    .btn-danger mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }

    .btn-danger:hover {
      background: rgba(220, 38, 38, 0.08);
      border-color: #DC2626;
    }

    /* RESPONSIVE */
    @media (max-width: 480px) {
      .modal-container {
        padding: 16px;
        width: 95vw;
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .modal-container {
        width: 95vw;
        max-width: 95vw;
        padding: 16px;
        box-sizing: border-box;
      }

      h2 {
        font-size: 1.2rem;

        .title-icon {
          font-size: 1.3rem;
          width: 1.3rem;
          height: 1.3rem;
        }
      }

      .info-row {
        padding: 12px;
        margin-bottom: 14px;

        .label {
          font-size: 0.85rem;
        }

        .value {
          width: 100%;
        }
      }

      .custom-input,
      .custom-select {
        padding: 10px;
        font-size: 0.85rem;
      }

      .custom-select {
        background-size: 14px;
        padding-right: 35px;
      }

      .actions-section {
        flex-direction: column;

        .btn-primary,
        .btn-secondary {
          width: 100%;
          min-width: auto;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .modal-container {
        width: 90vw;
        max-width: 100vw;
        padding: 16px;
        margin: 0;
        border-radius: 0;
        box-sizing: border-box;
      }

      h2 {
        font-size: 1.1rem;
        padding-right: 35px;

        .title-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }

      .close-btn {
        width: 28px;
        height: 28px;
        top: 10px;
        right: 10px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }

      .info-row {
        padding: 10px;
        margin-bottom: 12px;

        .label {
          font-size: 0.8rem;
        }
      }

      .custom-input,
      .custom-select {
        padding: 10px;
        font-size: 0.8rem;
      }

      .custom-select {
        background-size: 14px;
        padding-right: 35px;
      }

      .actions-section {
        margin-top: 20px;
        padding-top: 16px;

        .btn-primary,
        .btn-secondary {
          padding: 10px 16px;
          font-size: 0.85rem;
        }
      }
    }

    @media (max-width: 360px) {
      .modal-container {
        padding: 12px;
      }

      h2 {
        font-size: 1rem;
      }

      .info-row {
        padding: 8px;
        margin-bottom: 10px;

        .label {
          font-size: 0.75rem;
        }
      }

      .custom-input,
      .custom-select {
        padding: 8px;
        font-size: 0.75rem;
      }

      .actions-section {
        gap: 8px;

        .btn-primary,
        .btn-secondary {
          padding: 8px 12px;
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class ProfiloDialogComponent implements OnInit {
  userProfile = {
    nickname: '',
    squadraPreferita: ''
  };

  showSuggestions = false;
  filteredSquadre: string[] = [];
  isSaving = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  // Lista completa squadre italiane (Serie A, B, C, D)
  tutteLeSquadre = [
    // Serie A
    'Atalanta', 'Bologna', 'Cagliari', 'Como', 'Empoli', 'Fiorentina',
    'Genoa', 'Hellas Verona', 'Inter', 'Juventus', 'Lazio', 'Lecce',
    'Milan', 'Monza', 'Napoli', 'Parma', 'Roma', 'Torino', 'Udinese', 'Venezia',
    // Serie B
    'Bari', 'Brescia', 'Catanzaro', 'Cesena', 'Cittadella', 'Cosenza',
    'Cremonese', 'Frosinone', 'Juve Stabia', 'Mantova', 'Modena', 'Palermo',
    'Pisa', 'Reggiana', 'Salernitana', 'Sampdoria', 'Sassuolo', 'Spezia',
    'Südtirol', 'Carrarese',
    // Serie C - Gruppo A
    'Albinoleffe', 'Alessandria', 'Arzignano', 'Atalanta U23', 'Feralpisalò',
    'Juventus Next Gen', 'Lecco', 'Lumezzane', 'Novara', 'Padova', 'Pergolettese',
    'Pro Patria', 'Pro Vercelli', 'Renate', 'Trento', 'Triestina', 'Vicenza', 'Virtus Verona',
    // Serie C - Gruppo B
    'Arezzo', 'Ascoli', 'Campobasso', 'Carpi', 'Entella', 'Gubbio',
    'Lucchese', 'Milan Futuro', 'Perugia', 'Pescara', 'Pianese', 'Pineto',
    'Pontedera', 'Rimini', 'SPAL', 'Ternana', 'Torres', 'Vis Pesaro',
    // Serie C - Gruppo C
    'ACR Messina', 'Altamura', 'Audace Cerignola', 'Avellino', 'Benevento',
    'Casertana', 'Catania', 'Cavese', 'Crotone', 'Foggia', 'Giugliano',
    'Latina', 'Monopoli', 'Picerno', 'Potenza', 'Sorrento', 'Taranto', 'Trapani', 'Turris',
    // Altre squadre storiche/Serie D
    'Ancona', 'Barletta', 'Brindisi', 'Casale', 'Fano', 'Fermana',
    'Francavilla', 'Gela', 'Grosseto', 'Imolese', 'L\'Aquila', 'Legnago',
    'Maceratese', 'Matera', 'Messina', 'Nocerina', 'Piacenza', 'Prato',
    'Pro Piacenza', 'Ravenna', 'Reggina', 'Rieti', 'Siena', 'Siracusa',
    'Terni', 'Vibonese', 'Vigor Lamezia', 'Viterbese'
  ].sort();


  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private giocatoreService: GiocatoreService,
    private squadraService: SquadraService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.userProfile.nickname = giocatore.nickname || '';
        this.userProfile.squadraPreferita = giocatore.squadraCuore?.nome || '';
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo:', error);
        this.showFeedback('Errore nel caricamento del profilo', 'error');
      }
    });
  }

  onSearchInput() {
    const query = (this.userProfile.squadraPreferita || '').toLowerCase();
    if (query.length >= 2) {
      this.filteredSquadre = this.tutteLeSquadre
        .filter(s => s.toLowerCase().includes(query))
        .slice(0, 10);
      this.showSuggestions = true;
    } else {
      this.filteredSquadre = [];
      this.showSuggestions = false;
    }
  }

  onInputFocus() {
    // Se c'è già un valore, mostra i suggerimenti
    if (this.userProfile.squadraPreferita && this.userProfile.squadraPreferita.length >= 2) {
      this.onSearchInput();
    } else {
      this.showSuggestions = true;
    }
  }

  selectSquadra(squadra: string) {
    this.userProfile.squadraPreferita = squadra;
    this.showSuggestions = false;
    this.filteredSquadre = [];
  }

  clearSquadra() {
    this.userProfile.squadraPreferita = '';
    this.filteredSquadre = [];
    this.showSuggestions = false;
  }

  onBlur() {
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
  }

  isFormValid(): boolean {
    return !!(this.userProfile.nickname && this.userProfile.nickname.trim().length > 0);
  }

  showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => {
      this.feedbackMessage = null;
      this.feedbackType = null;
    }, 3000);
  }

  onSubmit() {
    if (!this.isFormValid()) {
      this.showFeedback('Inserisci un nickname valido', 'error');
      return;
    }

    this.isSaving = true;
    this.feedbackMessage = null;

    // Prima ottieni i dati del giocatore corrente
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        // Prepara l'oggetto aggiornato
        const giocatoreAggiornato: any = {
          id: giocatore.id,
          nome: giocatore.nome,
          nickname: this.userProfile.nickname.trim(),
          user: giocatore.user
        };

        // Se c'è una squadra preferita, cercala e aggiungila
        if (this.userProfile.squadraPreferita && this.userProfile.squadraPreferita.trim()) {
          this.squadraService.searchByNome(this.userProfile.squadraPreferita.trim()).subscribe({
            next: (squadra) => {
              giocatoreAggiornato.squadraCuore = squadra;
              this.saveProfile(giocatoreAggiornato);
            },
            error: (error) => {
              console.warn('Squadra non trovata, salvo senza squadra del cuore');
              giocatoreAggiornato.squadraCuore = null;
              this.saveProfile(giocatoreAggiornato);
            }
          });
        } else {
          // Nessuna squadra preferita, salva senza
          giocatoreAggiornato.squadraCuore = null;
          this.saveProfile(giocatoreAggiornato);
        }
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Errore nel caricamento del profilo:', error);
        this.showFeedback('Errore nel caricamento del profilo', 'error');
      }
    });
  }

  private saveProfile(giocatoreAggiornato: any) {
    this.giocatoreService.aggiornaMe(giocatoreAggiornato).subscribe({
      next: (result) => {
        this.isSaving = false;
        this.showFeedback(this.translate.instant('PROFILE.SUCCESS'), 'success');

        setTimeout(() => {
          // Chiudi il dialog e ritorna true per indicare che il profilo è stato aggiornato
          this.dialog.closeAll();
          // Emetti un evento per ricaricare il nome nella home
          window.dispatchEvent(new CustomEvent('profile-updated'));
        }, 2000);
      },
      error: (error) => {
        this.isSaving = false;
        console.error('Errore nel salvataggio del profilo:', error);
        this.showFeedback(this.translate.instant('PROFILE.ERROR'), 'error');
      }
    });
  }

  closeDialog() {
    this.dialog.closeAll();
  }

  openDeleteAccountDialog() {
    // Chiudi il dialog profilo e apri quello di conferma eliminazione
    this.dialog.closeAll();
    this.dialog.open(DeleteAccountDialogComponent, {
      width: '90vw',
      maxWidth: '450px',
      panelClass: 'custom-dialog-container'
    });
  }
}

// DIALOG ELIMINAZIONE ACCOUNT
@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>

      <div class="warning-header">
        <mat-icon class="warning-icon">warning</mat-icon>
        <h2>{{ 'PROFILE.DELETE_DIALOG_TITLE' | translate }}</h2>
      </div>

      <p class="warning-message" [innerHTML]="'PROFILE.DELETE_DIALOG_MESSAGE' | translate">
      </p>

      <p class="warning-sub">{{ 'PROFILE.DELETE_DIALOG_CONFIRM' | translate }}</p>

      <div class="actions">
        <button class="btn-cancel" (click)="closeDialog()">
          {{ 'PROFILE.DELETE_DIALOG_CANCEL' | translate }}
        </button>
        <button class="btn-delete" (click)="confirmDelete()" [disabled]="isDeleting">
          {{ isDeleting ? ('PROFILE.DELETE_DIALOG_DELETING' | translate) : ('PROFILE.DELETE_DIALOG_DELETE' | translate) }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 28px;
      width: 85vw;
      max-width: 450px;
      font-family: 'Poppins', sans-serif;
    }

    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
    }

    .close-btn mat-icon {
      color: #0A3D91;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }

    .close-btn:hover {
      background: rgba(10, 61, 145, 0.15);
      transform: scale(1.1);
    }

    .warning-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 20px;
    }

    .warning-header .warning-icon {
      color: #EF4444;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }

    .warning-header h2 {
      margin: 0;
      color: #EF4444;
      font-size: 1.4rem;
      font-weight: 700;
    }

    .warning-message {
      color: #6B7280;
      font-size: 1rem;
      line-height: 1.6;
      margin: 0 0 12px 0;
    }

    .warning-message strong {
      color: #EF4444;
    }

    .warning-sub {
      color: #374151;
      font-size: 1rem;
      font-weight: 600;
      margin: 0 0 28px 0;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
    }

    .btn-cancel {
      padding: 12px 24px;
      background: #F4F6F8;
      color: #6B7280;
      border: 1px solid #E0E0E0;
      border-radius: 12px;
      font-weight: 600;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }

    .btn-cancel:hover {
      background: #E0E0E0;
      color: #333;
    }

    .btn-delete {
      padding: 12px 24px;
      background: linear-gradient(135deg, #EF4444, #DC2626);
      color: #FFFFFF;
      border: none;
      border-radius: 12px;
      font-weight: 700;
      font-size: 0.95rem;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: 'Poppins', sans-serif;
    }

    .btn-delete:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 8px 24px rgba(239, 68, 68, 0.4);
    }

    .btn-delete:disabled {
      opacity: 0.6;
      cursor: not-allowed;
      transform: none;
    }

    @media (max-width: 480px) {
      .modal-container {
        padding: 20px;
      }

      .warning-header h2 {
        font-size: 1.2rem;
      }

      .warning-message {
        font-size: 0.9rem;
      }

      .actions {
        flex-direction: column;
      }

      .actions .btn-cancel,
      .actions .btn-delete {
        width: 100%;
        text-align: center;
      }
    }
  `]
})
export class DeleteAccountDialogComponent {
  isDeleting = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  closeDialog() {
    this.dialog.closeAll();
  }

  confirmDelete() {
    this.isDeleting = true;
    this.authService.deleteAccount().subscribe({
      next: () => {
        this.isDeleting = false;
        this.closeDialog();
        this.router.navigate(['/auth/login']);
      },
      error: (error) => {
        this.isDeleting = false;
        console.error('Errore durante l\'eliminazione dell\'account:', error);
      }
    });
  }
}

// COMPONENTE BANNER PRINCIPALE
@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="info-banner">
      <div class="banner-container">
        <button class="banner-item" (click)="openRegolamento()">
          <mat-icon class="banner-icon">article</mat-icon>
          <span class="banner-text">{{ 'BANNER.RULES' | translate }}</span>
        </button>

        <button class="banner-item" (click)="openAlboOro()">
          <mat-icon class="banner-icon trophy">emoji_events</mat-icon>
          <span class="banner-text">{{ 'BANNER.TROPHIES' | translate }}</span>
        </button>

        <button class="banner-item" (click)="openProfilo()">
          <mat-icon class="banner-icon">person</mat-icon>
          <span class="banner-text">{{ 'BANNER.PROFILE' | translate }}</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .info-banner {
      background: #FFFFFF;
      border-bottom: 1px solid #E0E0E0;
      padding: 12px 20px;
      font-family: 'Poppins', sans-serif;
    }

    .banner-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      flex-wrap: nowrap;
      width: 100%;
    }

    .banner-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(10, 61, 145, 0.08);
      border: 1px solid #E0E0E0;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 44px;
      flex: 1;
      justify-content: center;
      min-width: 0;
      font: inherit;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(10, 61, 145, 0.15);
        border-color: #4FC3F7;

        .banner-icon {
          transform: scale(1.1);
          color: #0A3D91;

          &.trophy {
            color: #FFD700;
          }
        }

        .banner-text {
          color: #0A3D91;
        }
      }

      .banner-icon {
        font-size: 1.3rem;
        width: 1.3rem;
        height: 1.3rem;
        color: #4FC3F7;
        transition: all 0.3s ease;
        flex-shrink: 0;

        &.trophy {
          color: #FFA500;
        }
      }

      .banner-text {
        color: #6B7280;
        font-weight: 500;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        transition: all 0.3s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .info-banner {
        padding: 10px 16px;
      }

      .banner-container {
        gap: 16px;
        justify-content: space-between;
      }

      .banner-item {
        padding: 8px 10px;
        height: 38px;

        .banner-icon {
          font-size: 1.1rem;
          width: 1.1rem;
          height: 1.1rem;
        }

        .banner-text {
          font-size: 0.7rem;
          letter-spacing: 0.2px;
        }
      }
    }

    @media (max-width: 480px) {
      .banner-container {
        gap: 12px;
        padding: 0 8px;
      }

      .banner-item {
        padding: 6px 8px;
        flex: 1;
        justify-content: center;

        .banner-text {
          font-size: 0.6rem;
          letter-spacing: 0.2px;
        }

        .banner-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    @media (max-width: 360px) {
      .info-banner {
        padding: 8px 12px;
      }

      .banner-container {
        gap: 8px;
      }

      .banner-item {
        padding: 5px 6px;
        gap: 4px;

        .banner-text {
          font-size: 0.55rem;
          letter-spacing: 0.1px;
        }

        .banner-icon {
          font-size: 0.9rem;
          width: 0.9rem;
          height: 0.9rem;
        }
      }
    }
  `]
})
export class InfoBannerComponent {
  constructor(private dialog: MatDialog) {}

  openRegolamento() {
    this.dialog.open(RegolamentoBannerDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '85vh',
      panelClass: 'regolamento-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }

  openAlboOro() {
    this.dialog.open(AlboOroDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '85vh',
      panelClass: 'albo-oro-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }

  openProfilo() {
    this.dialog.open(ProfiloDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '85vh',
      panelClass: 'profilo-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }
}
