import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GiocatoreService } from '../../../core/services/giocatore.service';
import { SquadraService } from '../../../core/services/squadra.service';
import { TrofeiService } from '../../../core/services/trofei.service';
import { Squadra } from '../../../core/models/interfaces.model';

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

      <div class="dialog-content" #dialogContent (scroll)="onScroll($event)">
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

        <!-- 7. Eliminazione totale -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_7_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_7_P1' | translate }}</p>
        </div>

        <!-- 8. Divisione anticipata (regola standard) -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_8_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_8_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_8_P2' | translate }}</p>
        </div>

        <!-- 9. Eventi rinviati, sospesi o annullati -->
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
          </ul>

          <h4>{{ 'RULES.SECTION_9_2_TITLE' | translate }}</h4>
          <p>{{ 'RULES.SECTION_9_2_P1' | translate }}</p>
          <ul>
            <li>{{ 'RULES.SECTION_9_2_L1' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L2' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L3' | translate }}</li>
            <li>{{ 'RULES.SECTION_9_2_L4' | translate }}</li>
          </ul>
        </div>

        <!-- 10. Gestione del montepremi -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_10_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_10_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_10_P2' | translate }}</p>
        </div>

        <p class="good-luck">{{ 'RULES.GOOD_LUCK' | translate }}</p>
      </div>

      <!-- BACK TO TOP BUTTON -->
      <button
        mat-fab
        class="back-to-top-btn"
        [class.visible]="showBackToTop"
        (click)="scrollToTop()"
        aria-label="Torna su">
        <mat-icon>arrow_upward</mat-icon>
      </button>
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

    /* BACK TO TOP BUTTON */
    .back-to-top-btn {
      position: absolute !important;
      bottom: 20px;
      right: 20px;
      background: linear-gradient(135deg, rgba(10, 61, 145, 0.75), rgba(79, 195, 247, 0.75)) !important;
      color: #FFFFFF !important;
      box-shadow: 0 4px 12px rgba(10, 61, 145, 0.2) !important;
      opacity: 0;
      visibility: hidden;
      transform: translateY(10px);
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1) !important;
      z-index: 100;
      width: 48px !important;
      height: 48px !important;
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50% !important;
      backdrop-filter: blur(8px);

      &.visible {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }

      &:hover {
        background: linear-gradient(135deg, rgba(10, 61, 145, 0.9), rgba(79, 195, 247, 0.9)) !important;
        box-shadow: 0 6px 20px rgba(10, 61, 145, 0.3) !important;
        transform: translateY(-3px) !important;
        border-color: rgba(255, 255, 255, 0.5);
      }

      &:active {
        transform: translateY(-1px) !important;
        box-shadow: 0 4px 12px rgba(10, 61, 145, 0.25) !important;
      }

      mat-icon {
        font-size: 22px;
        width: 22px;
        height: 22px;
        font-weight: 500;
      }
    }

    /* DESKTOP E TABLET - Centrato e senza scroll orizzontale */
    @media (min-width: 769px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 800px;
        margin: 0 auto;
        border-radius: 16px;
      }

      .dialog-content {
        max-width: 760px;
        margin: 0 auto;
        padding: 24px;
      }
    }

    @media (max-width: 768px) {
      .back-to-top-btn {
        bottom: 16px;
        right: 16px;
        width: 44px !important;
        height: 44px !important;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }

    @media (max-width: 480px) {
      .back-to-top-btn {
        bottom: 16px;
        right: 16px;
        width: 44px !important;
        height: 44px !important;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
        }
      }
    }
  `]
})
export class RegolamentoBannerDialogComponent {
  showBackToTop = false;
  private lastScrollTop = 0;
  private scrollTimeout: any;

  constructor(private dialog: MatDialog,
    private squadraService: SquadraService
  ) {


  }

  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const isScrollingDown = scrollTop > this.lastScrollTop;

    // Mostra il bottone solo se scrolli verso il basso e sei oltre i 300px
    if (isScrollingDown && scrollTop > 300) {
      this.showBackToTop = true;

      // Nascondi il bottone dopo 2 secondi di inattività
      clearTimeout(this.scrollTimeout);
      this.scrollTimeout = setTimeout(() => {
        this.showBackToTop = false;
      }, 2000);
    } else if (scrollTop <= 300) {
      this.showBackToTop = false;
    }

    this.lastScrollTop = scrollTop;
  }

  scrollToTop(): void {
    const dialogContent = document.querySelector('.regolamento-dialog .dialog-content');
    if (dialogContent) {
      dialogContent.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

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
        <!-- Loading state -->
        <div class="loading-state" *ngIf="isLoading" style="text-align: center; padding: 40px;">
          <mat-icon style="font-size: 48px; width: 48px; height: 48px; animation: spin 1s linear infinite;">autorenew</mat-icon>
          <p>{{ 'COMMON.LOADING' | translate }}...</p>
        </div>

        <!-- Messaggio simpatico se non ci sono trofei -->
        <div class="empty-state" *ngIf="!isLoading && !hasTrofei">
          <div class="empty-emoji">{{ currentEmoji }}</div>
          <p class="empty-message">{{ currentMessage }}</p>
          <p class="empty-subtitle">{{ currentSubtitle }}</p>
        </div>

        <!-- Lista trofei personali -->
        <div *ngIf="!isLoading && hasTrofei && statistiche">
          <div class="winner-card" *ngFor="let trofeo of statistiche.trofei">
            <div class="season">
              <h3>{{ getPosizioneEmoji(trofeo.posizioneFinale) }} {{ trofeo.nomeLega }} - Ed. {{ trofeo.edizione }}</h3>
              <div class="winner-info">
                <div class="winner-name">{{ getPosizioneLabel(trofeo.posizioneFinale) }}</div>
                <div class="winner-details">
                  <span class="detail">{{ trofeo.nomeSport }} - {{ trofeo.nomeCampionato }} {{ trofeo.anno }}</span>
                  <span class="detail">{{ 'TROPHIES.ROUNDS_SURVIVED' | translate }}: {{ trofeo.giornateGiocate }}</span>
                  <span class="detail" *ngIf="trofeo.ultimaSquadraScelta">{{ 'TROPHIES.FINAL_TEAM' | translate }}: {{ trofeo.ultimaSquadraScelta }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiche personali - solo se ci sono dati -->
        <div class="stats-section" *ngIf="!isLoading && hasTrofei && statistiche">
          <h3>📊 {{ 'TROPHIES.YOUR_STATS' | translate }}</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">{{ statistiche.torneiGiocati }}</span>
              <span class="stat-label">{{ 'TROPHIES.TOURNAMENTS_PLAYED' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ statistiche.vittorie }}</span>
              <span class="stat-label">{{ 'TROPHIES.VICTORIES' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ statistiche.podi }}</span>
              <span class="stat-label">{{ 'TROPHIES.PODIUMS' | translate }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ statistiche.winRate.toFixed(1) }}%</span>
              <span class="stat-label">Win Rate</span>
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
export class AlboOroDialogComponent implements OnInit {
  hasTrofei = false;
  statistiche: any = null;
  isLoading = true;

  currentEmoji = '';
  currentMessage = '';
  currentSubtitle = '';

  constructor(
    private dialog: MatDialog,
    private translate: TranslateService,
    private trofeiService: TrofeiService
  ) {
    this.pickRandomMessage();
  }

  ngOnInit(): void {
    this.loadTrofei();
  }

  private loadTrofei(): void {
    this.isLoading = true;
    this.trofeiService.getMieiTrofei().subscribe({
      next: (stats) => {
        this.statistiche = stats;
        this.hasTrofei = stats.trofei && stats.trofei.length > 0;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Errore caricamento trofei:', err);
        this.hasTrofei = false;
        this.isLoading = false;
      }
    });
  }

  getPosizioneEmoji(posizione: number): string {
    return this.trofeiService.getPosizioneEmoji(posizione);
  }

  getPosizioneLabel(posizione: number): string {
    return this.trofeiService.getPosizioneLabel(posizione);
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

        <div class="info-row" style="overflow: visible !important;">
          <div class="label">
            {{ 'PROFILE.FAVORITE_TEAMS' | translate }}
            <span class="info-hint">{{ 'PROFILE.ONE_PER_SPORT_HINT' | translate }}</span>
          </div>
          <div class="value" style="overflow: visible !important;">
            <!-- SPORT SELECTOR MODERNO CON SLIDER E BADGE -->
            <div class="sport-selector-modern">
              <div class="selector-background">
                <div class="selector-slider"
                  [class.pos-calcio]="selectedSport === 'calcio'"
                  [class.pos-basket]="selectedSport === 'basket'"
                  [class.pos-tennis]="selectedSport === 'tennis'"></div>
              </div>
              <button type="button"
                class="sport-option"
                [class.active]="selectedSport === 'calcio'"
                [class.has-selection]="userProfile.squadraCalcio"
                (click)="selectSport('calcio')">
                <span class="sport-emoji">⚽</span>
                <span class="sport-label">{{ 'COMMON.SOCCER' | translate }}</span>
                <span class="selection-badge" *ngIf="userProfile.squadraCalcio">✓</span>
              </button>
              <button type="button"
                class="sport-option"
                [class.active]="selectedSport === 'basket'"
                [class.has-selection]="userProfile.squadraBasket"
                (click)="selectSport('basket')">
                <span class="sport-emoji">🏀</span>
                <span class="sport-label">{{ 'COMMON.BASKETBALL' | translate }}</span>
                <span class="selection-badge" *ngIf="userProfile.squadraBasket">✓</span>
              </button>
              <button type="button"
                class="sport-option"
                [class.active]="selectedSport === 'tennis'"
                [class.has-selection]="userProfile.tennista"
                (click)="selectSport('tennis')">
                <span class="sport-emoji">🎾</span>
                <span class="sport-label">{{ 'COMMON.TENNIS' | translate }}</span>
                <span class="selection-badge" *ngIf="userProfile.tennista">✓</span>
              </button>
            </div>

            <!-- PREVIEW SQUADRA SELEZIONATA - COMPATTA -->
            <div class="selected-team-preview" *ngIf="getCurrentSelectedTeam()">
              <div class="preview-team">
                <span class="sport-icon-small">{{getSportEmoji()}}</span>
                <span class="team-name-large">{{getCurrentSelectedTeam()}}</span>
              </div>
              <button type="button" class="clear-btn" (click)="clearCurrentSelection()" [title]="'PROFILE.CHANGE_TEAM' | translate">
                <mat-icon>edit</mat-icon>
                <span>{{ 'PROFILE.CHANGE' | translate }}</span>
              </button>
            </div>

            <!-- AUTOCOMPLETE DINAMICO PER LO SPORT SELEZIONATO -->
            <div class="autocomplete-container" [class.hidden]="getCurrentSelectedTeam()">
              <div class="input-label">{{ getInputLabel() }}</div>
              <input type="text"
                [placeholder]="getPlaceholder()"
                [(ngModel)]="currentInput"
                (input)="onSearchInput()"
                (focus)="onFocusInput()"
                (blur)="onBlur()"
                class="custom-input"
                [class.has-value]="currentInput"
                autocomplete="off">
              <div class="suggestions-list" *ngIf="showSuggestions && filteredSquadre.length > 0">
                <div class="suggestion-item"
                  *ngFor="let item of filteredSquadre"
                  (mousedown)="selectItem(item)"
                  [attr.data-sport]="selectedSport">
                  <span class="sport-icon">{{getSportEmoji()}}</span>
                  <span class="team-name">{{item.nome}}</span>
                </div>
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
    /* FORZA IL DIALOG CONTAINER A NON AVERE SCROLL ORIZZONTALE */
    :host {
      display: block;
      width: 100%;
      max-width: 100%;
      overflow-x: hidden !important;
    }

    /* CONTAINER PRINCIPALE - COMPLETAMENTE RESPONSIVE */
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 20px;
      width: 100%;
      max-width: 600px;
      height: auto;
      max-height: none;
      overflow: visible !important;
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      margin: 0 auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;

      * {
        box-sizing: border-box;
        max-width: 100%;
      }
    }

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

    h2 {
      margin: 0 0 10px 0;
      font-size: 1.2rem;
      font-weight: 700;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      padding-right: 40px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;

      .title-icon {
        font-size: 1.4rem;
        width: 1.4rem;
        height: 1.4rem;
        color: #4FC3F7;
        flex-shrink: 0;
      }

      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .form-section {
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      overflow: hidden;
    }

    .info-row {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-bottom: 8px;
      padding: 10px 14px;
      background: transparent;
      border-radius: 12px;
      border: 1px solid rgba(10, 61, 145, 0.08);
      font-size: 0.95rem;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
      overflow: visible;

      .label {
        font-weight: 600;
        color: #0A3D91;
        font-size: 0.85rem;
        margin-bottom: 0;
        width: 100%;
        box-sizing: border-box;
      }

      .value {
        font-weight: 500;
        color: #6B7280;
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
      }
    }

    .custom-input,
    .custom-select {
      width: 100%;
      max-width: 100%;
      padding: 10px 12px;
      border-radius: 12px;
      background: #F4F6F8;
      border: 2px solid #E0E0E0;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      font-weight: 500;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      font-size: 16px; /* iOS FIX: Prevent auto-zoom on input focus */
      box-sizing: border-box;
      -webkit-text-size-adjust: 100%; /* iOS FIX: Prevent text size adjustment */

      &:focus {
        border-color: #4FC3F7;
        background: #FFFFFF;
        box-shadow: 0 0 0 4px rgba(79, 195, 247, 0.12),
                    0 4px 12px rgba(10, 61, 145, 0.08);
        outline: none;
        transform: translateY(-1px);
      }

      &::placeholder {
        color: #9CA3AF;
        font-weight: 400;
      }

      &.has-value {
        padding-right: 40px;
        background: #FFFFFF;
        border-color: #4FC3F7;
        font-weight: 600;
      }
    }

    /* SPORT SELECTOR MODERNO - Design pulito con slider */
    .sport-selector-modern {
      position: relative;
      display: flex;
      gap: 0;
      background: #F4F6F8;
      border-radius: 14px;
      padding: 4px;
      margin-bottom: 6px;
      width: 100%;
      box-sizing: border-box;

      .selector-background {
        position: absolute;
        top: 4px;
        bottom: 4px;
        left: 4px;
        right: 4px;
        pointer-events: none;
        z-index: 0;

        .selector-slider {
          position: absolute;
          top: 0;
          bottom: 0;
          width: calc(33.333% - 2.67px);
          background: linear-gradient(135deg, #0A3D91, #4FC3F7);
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(10, 61, 145, 0.2),
                      0 2px 4px rgba(79, 195, 247, 0.15);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

          &.pos-calcio {
            left: 0;
          }

          &.pos-basket {
            left: calc(33.333% + 1.33px);
          }

          &.pos-tennis {
            left: calc(66.666% + 2.67px);
          }
        }
      }

      .sport-option {
        flex: 1;
        position: relative;
        z-index: 1;
        background: transparent;
        border: none;
        padding: 12px 8px;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 10px;

        .sport-emoji {
          font-size: 1.5rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          filter: grayscale(0.5) opacity(0.7);
        }

        .sport-label {
          font-size: 0.75rem;
          font-weight: 600;
          color: #6B7280;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        &:hover:not(.active) {
          .sport-emoji {
            transform: scale(1.1);
            filter: grayscale(0.3) opacity(0.85);
          }

          .sport-label {
            color: #0A3D91;
          }
        }

        &.active {
          .sport-emoji {
            transform: scale(1.15);
            filter: grayscale(0) opacity(1);
            animation: bounce 0.5s ease;
          }

          .sport-label {
            color: #FFFFFF;
            font-weight: 700;
          }
        }

        &.has-selection {
          background: rgba(79, 195, 247, 0.08);
        }

        .selection-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          background: linear-gradient(135deg, #10B981, #34D399);
          color: white;
          font-size: 0.7rem;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(16, 185, 129, 0.3);
          animation: fadeInScale 0.3s ease;
        }
      }
    }

    @keyframes fadeInScale {
      from {
        opacity: 0;
        transform: scale(0.5);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes bounce {
      0%, 100% {
        transform: scale(1.15);
      }
      50% {
        transform: scale(1.25);
      }
    }

    /* INFO HINT */
    .info-hint {
      display: block;
      font-size: 0.75rem;
      color: #64748B;
      font-weight: 400;
      margin-top: 4px;
      font-style: italic;
    }

    /* SELECTED TEAM PREVIEW - COMPATTA E USER FRIENDLY */
    .selected-team-preview {
      background: linear-gradient(135deg, rgba(79, 195, 247, 0.06), rgba(10, 61, 145, 0.03));
      border: 1px solid rgba(79, 195, 247, 0.25);
      border-radius: 10px;
      padding: 8px 12px;
      margin-bottom: 10px;
      animation: slideIn 0.3s ease;
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 10px;

      .preview-team {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 0;

        .sport-icon-small {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .team-name-large {
          font-size: 0.9rem;
          font-weight: 600;
          color: #0A3D91;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }

      .clear-btn {
        background: transparent;
        border: 1px solid rgba(10, 61, 145, 0.2);
        border-radius: 6px;
        padding: 4px 6px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 3px;
        color: #0A3D91;
        font-size: 0.7rem;
        transition: all 0.2s ease;
        flex-shrink: 0;
        white-space: nowrap;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }

        &:hover {
          background: rgba(10, 61, 145, 0.08);
          border-color: #0A3D91;
          transform: translateY(-1px);
        }
      }
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

    /* INPUT LABEL */
    .input-label {
      font-size: 0.8rem;
      color: #0A3D91;
      font-weight: 600;
      margin-bottom: 8px;
      padding-left: 4px;
    }

    /* AUTOCOMPLETE CONTAINER */
    .autocomplete-container {
      &.hidden {
        display: none;
      }
    }

    /* RESPONSIVE SPORT SELECTOR */
    @media (max-width: 480px) {
      .sport-selector-modern {
        margin-bottom: 4px;
        padding: 3px;

        .sport-option {
          padding: 8px 6px;

          .sport-emoji {
            font-size: 1.2rem;
          }

          .sport-label {
            font-size: 0.6rem;
          }
        }
      }

      .selected-team-preview {
        padding: 6px 10px;
        margin-bottom: 8px;

        .preview-team {
          gap: 6px;

          .sport-icon-small {
            font-size: 1.1rem;
          }

          .team-name-large {
            font-size: 0.85rem;
          }
        }

        .clear-btn {
          padding: 3px 5px;
          font-size: 0.65rem;

          mat-icon {
            font-size: 12px;
            width: 12px;
            height: 12px;
          }

          span {
            display: none; /* Nascondi il testo "Modifica" su mobile, mostra solo l'icona */
          }
        }
      }

      .suggestions-list {
        max-height: 200px;
      }

      .info-row {
        margin-bottom: 4px;
        padding: 6px 10px;
        gap: 2px;

        .label {
          margin-bottom: 0;
          font-size: 0.75rem;
        }
      }

      .modal-container {
        padding: 12px;
        max-width: 96%;
        min-height: 85vh;
        overflow: visible;
      }

      h2 {
        margin: 0 0 8px 0;
        font-size: 1.1rem;
        gap: 8px;

        .title-icon {
          font-size: 1.3rem;
          width: 1.3rem;
          height: 1.3rem;
        }
      }

      .actions-section {
        margin-top: 12px;
        padding-top: 10px;
        gap: 8px;
      }

      .suggestion-item {
        padding: 10px 14px;
        font-size: 0.9rem;
      }
    }

    @media (min-width: 481px) and (max-width: 768px) {
      .suggestions-list {
        max-height: 190px;
      }

      .info-row {
        margin-bottom: 7px;
        padding: 9px 12px;
      }

      .modal-container {
        max-width: 550px;
        overflow: visible;
      }
    }


    .autocomplete-container {
      position: relative;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
    }


    .suggestions-list {
      position: relative;
      background: #FFFFFF;
      border: 2px solid rgba(79, 195, 247, 0.3);
      border-radius: 12px;
      max-height: 200px;
      overflow-y: auto;
      overflow-x: hidden;
      box-shadow: 0 4px 12px rgba(10, 61, 145, 0.08);
      width: 100%;
      box-sizing: border-box;
      margin-top: 8px;
      animation: fadeIn 0.2s ease-out;

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
        margin: 8px 0;
      }

      &::-webkit-scrollbar-thumb {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        border-radius: 10px;

        &:hover {
          background: linear-gradient(135deg, #4FC3F7, #0A3D91);
        }
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }


    .suggestion-item {
      padding: 12px 18px;
      cursor: pointer;
      font-size: 0.95rem;
      color: #334155;
      font-weight: 500;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      border-bottom: 1px solid rgba(10, 61, 145, 0.06);
      width: 100%;
      box-sizing: border-box;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      position: relative;
      display: flex;
      align-items: center;
      gap: 12px;

      .sport-icon {
        font-size: 1.1rem;
        opacity: 0.7;
        transition: all 0.25s ease;
        flex-shrink: 0;
      }

      .team-name {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      &:first-child {
        border-radius: 16px 16px 0 0;
      }

      &:last-child {
        border-bottom: none;
        border-radius: 0 0 16px 16px;
      }

      &:only-child {
        border-radius: 16px;
      }

      &:hover {
        background: linear-gradient(135deg,
          rgba(10, 61, 145, 0.06),
          rgba(79, 195, 247, 0.08));
        color: #0A3D91;
        padding-left: 24px;
        font-weight: 600;
        box-shadow: inset 4px 0 0 #4FC3F7;

        .sport-icon {
          transform: scale(1.2) rotate(10deg);
          opacity: 1;
        }

        .team-name {
          font-weight: 600;
        }
      }

      &:active {
        background: linear-gradient(135deg,
          rgba(10, 61, 145, 0.12),
          rgba(79, 195, 247, 0.15));
        transform: scale(0.98);
      }
    }

    .actions-section {
      display: flex;
      gap: 10px;
      margin-top: 14px;
      padding-top: 10px;
      border-top: 1px solid rgba(10, 61, 145, 0.08);
      justify-content: flex-end;
      width: 100%;
      max-width: 100%;
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
      min-width: 120px;
      box-sizing: border-box;
    }

    .btn-secondary {
      background: transparent;
      color: #6B7280;
      border-color: #E0E0E0;

      &:hover {
        background: #F8F9FA;
        border-color: #4FC3F7;
        color: #4FC3F7;
        transform: translateY(-1px);
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      border-color: transparent;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10, 61, 145, 0.25);
      }

      &:disabled {
        opacity: 0.5;
        background: #E0E0E0;
        color: #9CA3AF;
        cursor: not-allowed;
        transform: none;
      }
    }

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
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;

      &.success {
        background: linear-gradient(135deg, #E8F5E9, #C8E6C9);
        color: #2E7D32;
        border: 1px solid #81C784;
      }

      &.error {
        background: linear-gradient(135deg, #FFEBEE, #FFCDD2);
        color: #C62828;
        border: 1px solid #EF5350;
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        flex-shrink: 0;
      }

      span {
        overflow: hidden;
        text-overflow: ellipsis;
      }
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

    .danger-zone {
      margin-top: 6px;
      padding-top: 14px;
      border-top: 1px dashed rgba(220, 38, 38, 0.3);
      text-align: center;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;
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
      max-width: 100%;
      box-sizing: border-box;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        flex-shrink: 0;
      }

      &:hover {
        background: rgba(220, 38, 38, 0.08);
        border-color: #DC2626;
      }
    }

    /* DESKTOP E TABLET - Centrato e senza scroll orizzontale */
    @media (min-width: 769px) {
      .modal-container {
        width: 90vw;
        max-width: 800px;
        padding: 28px;
      }

      h2 {
        font-size: 1.4rem;
      }

      .info-row {
        padding: 18px;
      }

      .actions-section {
        .btn-primary,
        .btn-secondary {
          min-width: 140px;
        }
      }
    }

    /* TABLET */
    @media (max-width: 768px) and (min-width: 481px) {
      .modal-container {
        width: 95vw;
        max-width: 95vw;
        padding: 20px;
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
        padding: 14px;
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

    /* MOBILE */
    @media (max-width: 480px) {
      .modal-container {
        width: 95vw;
        max-width: 95vw;
        padding: 16px;
        border-radius: 16px;
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
        padding: 12px;
        margin-bottom: 12px;

        .label {
          font-size: 0.85rem;
        }
      }

      .custom-input {
        padding: 10px;
        font-size: 16px; /* iOS FIX: Keep 16px to prevent auto-zoom */
      }

      .actions-section {
        margin-top: 20px;
        padding-top: 16px;
        flex-direction: column;

        .btn-primary,
        .btn-secondary {
          width: 100%;
          min-width: auto;
          padding: 10px 16px;
          font-size: 0.85rem;
        }
      }
    }

    /* EXTRA SMALL MOBILE */
    @media (max-width: 360px) {
      .modal-container {
        padding: 12px;
        width: 98vw;
      }

      h2 {
        font-size: 1rem;
      }

      .info-row {
        padding: 10px;
        margin-bottom: 10px;

        .label {
          font-size: 0.8rem;
        }
      }

      .custom-input {
        padding: 8px;
        font-size: 16px; /* iOS FIX: Keep 16px to prevent auto-zoom */
      }

      .actions-section {
        gap: 8px;

        .btn-primary,
        .btn-secondary {
          padding: 8px 12px;
          font-size: 0.8rem;
        }
      }

      .btn-danger {
        font-size: 0.8rem;
        padding: 8px 12px;
      }
    }
  `]
})
export class ProfiloDialogComponent implements OnInit {
  userProfile = {
    nickname: '',
    squadraCalcio: '',
    squadraBasket: '',
    tennista: ''
  };

  selectedSport: 'calcio' | 'basket' | 'tennis' = 'calcio';
  currentInput = '';
  showSuggestions = false;
  filteredSquadre: Squadra[] = [];
  squadrePerSport: Squadra[] = []; // Squadre filtrate per lo sport corrente
  isSaving = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

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

  selectSport(sport: 'calcio' | 'basket' | 'tennis') {
    this.selectedSport = sport;

    // Carica il valore corrente per lo sport selezionato
    if (sport === 'calcio') {
      this.currentInput = this.userProfile.squadraCalcio || '';
    } else if (sport === 'basket') {
      this.currentInput = this.userProfile.squadraBasket || '';
    } else {
      this.currentInput = this.userProfile.tennista || '';
    }

    // Reset suggerimenti quando si cambia sport
    this.showSuggestions = false;
    this.filteredSquadre = [];

    // Carica le squadre filtrate per questo sport dal backend
    this.loadSquadreForSport(sport);
  }

  private loadSquadreForSport(sport: 'calcio' | 'basket' | 'tennis') {
    let sportId: string;

    if (sport === 'calcio') {
      sportId = 'CALCIO';
    } else if (sport === 'basket') {
      sportId = 'BASKET';
    } else {
      sportId = 'TENNIS';
    }

    this.squadraService.getSquadreBySport(sportId).subscribe({
      next: (squadre) => {
        this.squadrePerSport = squadre || [];

        // Mostra automaticamente le prime 10 squadre quando cambia sport
        if (this.squadrePerSport.length > 0) {
          this.filteredSquadre = this.squadrePerSport.slice(0, 10);
          // NON mostrare i suggerimenti automaticamente, aspetta il focus
          this.showSuggestions = false;
        } else {
          this.filteredSquadre = [];
          this.showSuggestions = false;
        }
      },
      error: (error) => {
        console.error(`Errore caricamento squadre per sport ${sport}:`, error);
        this.squadrePerSport = [];
        this.filteredSquadre = [];
        this.showSuggestions = false;
      }
    });
  }

  getPlaceholder(): string {
    if (this.selectedSport === 'calcio') {
      return this.translate.instant('PROFILE.SEARCH_SOCCER_TEAM');
    } else if (this.selectedSport === 'basket') {
      return this.translate.instant('PROFILE.SEARCH_BASKET_TEAM');
    } else {
      return this.translate.instant('PROFILE.SEARCH_TENNIS_PLAYER');
    }
  }

  getSportEmoji(): string {
    if (this.selectedSport === 'calcio') {
      return '⚽';
    } else if (this.selectedSport === 'basket') {
      return '🏀';
    } else {
      return '🎾';
    }
  }

  loadProfile() {
    // Carica il profilo dell'utente
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.userProfile.nickname = giocatore.nickname || '';
        this.userProfile.squadraCalcio = giocatore.squadraCuore?.nome || '';
        this.userProfile.squadraBasket = giocatore.squadraBasketCuore?.nome || '';
        this.userProfile.tennista = giocatore.tennistaCuore?.nome || '';

        // Imposta l'input corrente e carica le squadre del calcio (sport di default)
        this.currentInput = this.userProfile.squadraCalcio;
        this.loadSquadreForSport('calcio');
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo:', error);
        this.showFeedback('Errore nel caricamento del profilo', 'error');
      }
    });
  }

  onSearchInput() {
    const query = (this.currentInput || '').toLowerCase().trim();

    if (query.length >= 3) {
      // Mostra suggerimenti solo dopo 3 caratteri
      this.filteredSquadre = this.squadrePerSport
        .filter(s => s.nome.toLowerCase().includes(query))
        .slice(0, 3); // Max 3 suggerimenti

      // Nascondi la lista se non ci sono risultati
      this.showSuggestions = this.filteredSquadre.length > 0;
    } else {
      // Non mostrare suggerimenti se meno di 3 caratteri
      this.filteredSquadre = [];
      this.showSuggestions = false;
    }
  }

  onFocusInput() {
    // Non mostrare suggerimenti automaticamente al focus
    // L'utente deve digitare almeno 2 caratteri
    this.showSuggestions = false;
    this.filteredSquadre = [];
  }


  selectItem(item: Squadra) {
    this.currentInput = item.nome;

    // Salva nel campo giusto in base allo sport selezionato
    if (this.selectedSport === 'calcio') {
      this.userProfile.squadraCalcio = item.nome;
    } else if (this.selectedSport === 'basket') {
      this.userProfile.squadraBasket = item.nome;
    } else {
      this.userProfile.tennista = item.nome;
    }

    this.showSuggestions = false;
    this.filteredSquadre = [];
  }

  getCurrentSelectedTeam(): string {
    if (this.selectedSport === 'calcio') {
      return this.userProfile.squadraCalcio;
    } else if (this.selectedSport === 'basket') {
      return this.userProfile.squadraBasket;
    } else {
      return this.userProfile.tennista;
    }
  }

  clearCurrentSelection(): void {
    if (this.selectedSport === 'calcio') {
      this.userProfile.squadraCalcio = '';
    } else if (this.selectedSport === 'basket') {
      this.userProfile.squadraBasket = '';
    } else {
      this.userProfile.tennista = '';
    }
    this.currentInput = '';
    this.showSuggestions = false;
    this.filteredSquadre = [];
  }

  getInputLabel(): string {
    if (this.selectedSport === 'calcio') {
      return this.translate.instant('PROFILE.SOCCER_FAVORITE');
    } else if (this.selectedSport === 'basket') {
      return this.translate.instant('PROFILE.BASKET_FAVORITE');
    } else {
      return this.translate.instant('PROFILE.TENNIS_FAVORITE');
    }
  }


  onBlur() {
    // Aggiorna il campo corretto prima di chiudere
    if (this.selectedSport === 'calcio') {
      this.userProfile.squadraCalcio = this.currentInput;
    } else if (this.selectedSport === 'basket') {
      this.userProfile.squadraBasket = this.currentInput;
    } else {
      this.userProfile.tennista = this.currentInput;
    }

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
          nome: giocatore.nickname,
          nickname: this.userProfile.nickname.trim(),
          user: giocatore.user,
          squadraCuore: null,
          squadraBasketCuore: null,
          tennistaCuore: null
        };

        // Conta quante squadre dobbiamo cercare
        let squadreDaCercare = 0;
        let squadreTrovate = 0;

        if (this.userProfile.squadraCalcio && this.userProfile.squadraCalcio.trim()) {
          squadreDaCercare++;
        }
        if (this.userProfile.squadraBasket && this.userProfile.squadraBasket.trim()) {
          squadreDaCercare++;
        }
        if (this.userProfile.tennista && this.userProfile.tennista.trim()) {
          squadreDaCercare++;
        }

        // Se non ci sono squadre da cercare, salva subito
        if (squadreDaCercare === 0) {
          this.saveProfile(giocatoreAggiornato);
          return;
        }

        // Cerca squadra calcio
        if (this.userProfile.squadraCalcio && this.userProfile.squadraCalcio.trim()) {
          this.squadraService.searchByNome(this.userProfile.squadraCalcio.trim()).subscribe({
            next: (squadra) => {
              giocatoreAggiornato.squadraCuore = squadra;
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            },
            error: () => {
              console.warn('Squadra calcio non trovata');
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            }
          });
        }

        // Cerca squadra basket
        if (this.userProfile.squadraBasket && this.userProfile.squadraBasket.trim()) {
          this.squadraService.searchByNome(this.userProfile.squadraBasket.trim()).subscribe({
            next: (squadra) => {
              giocatoreAggiornato.squadraBasketCuore = squadra;
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            },
            error: () => {
              console.warn('Squadra basket non trovata');
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            }
          });
        }

        // Cerca tennista
        if (this.userProfile.tennista && this.userProfile.tennista.trim()) {
          this.squadraService.searchByNome(this.userProfile.tennista.trim()).subscribe({
            next: (squadra) => {
              giocatoreAggiornato.tennistaCuore = squadra;
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            },
            error: () => {
              console.warn('Tennista non trovato');
              squadreTrovate++;
              if (squadreTrovate === squadreDaCercare) {
                this.saveProfile(giocatoreAggiornato);
              }
            }
          });
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

        // FIX iOS: Reset dello zoom dopo il salvataggio
        this.resetIOSZoom();

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

        // FIX iOS: Reset dello zoom anche in caso di errore
        this.resetIOSZoom();
      }
    });
  }

  /**
   * FIX iOS: Resetta lo zoom forzando un blur su tutti gli input e rimuovendo il focus
   */
  private resetIOSZoom(): void {
    // Rimuovi il focus da tutti gli input
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach((input: any) => {
      if (input && typeof input.blur === 'function') {
        input.blur();
      }
    });

    // Forza il reset del viewport
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
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
