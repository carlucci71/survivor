import { Component, OnDestroy, OnInit } from '@angular/core';
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

        <!-- 3. Modalità di gioco -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_MODE_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_MODE_P1' | translate }}</p>
          <h4>{{ 'RULES.SECTION_MODE_SURVIVOR_TITLE' | translate }}</h4>
          <p>{{ 'RULES.SECTION_MODE_SURVIVOR_TEXT' | translate }}</p>
          <h4>{{ 'RULES.SECTION_MODE_CAMPIONATO_TITLE' | translate }}</h4>
          <p>{{ 'RULES.SECTION_MODE_CAMPIONATO_TEXT' | translate }}</p>
        </div>

        <!-- 4. Sistema delle vite -->
        <div class="regola">
          <h3>{{ 'RULES.SECTION_LIVES_TITLE' | translate }}</h3>
          <p>{{ 'RULES.SECTION_LIVES_P1' | translate }}</p>
          <p>{{ 'RULES.SECTION_LIVES_P2' | translate }}</p>
        </div>

        <!-- 5. Eliminazione -->
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
          <p>{{ 'RULES.SECTION_4_P3' | translate }}</p>
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

// ── EASTER EGG: Liquid Glass Shader ────────────────────────────────────────
const EASTER_EGG_SHADER = `
  precision highp float;
  uniform sampler2D src;
  uniform vec2 resolution;
  uniform vec2 offset;
  uniform vec2 lag;
  uniform float time;
  out vec4 outColor;

  const float SPHERE_R = 0.12;
  const float DISP = 0.025;
  const int   DISP_STEPS = 12;
  const float DISP_LO = 0.0;
  const float DISP_HI = 1.0;
  const float SCATTER = 0.025;
  const int N_BUBBLES = 8;
  const float BUBBLE_SMOOTH = 0.025;
  uniform float bubbleData[32];
  const vec3 ABSORB = vec3(1.0, 0.7, 0.5) * 2.0;

  float smin(float a, float b, float k) {
    float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
    return mix(b, a, h) - k * h * (1.0 - h);
  }

  vec2 hash22(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(0.1031, 0.1030, 0.0973));
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
  }

  mat2 rot(float t) {
    float c = cos(t), s = sin(t);
    return mat2(c, -s, s, c);
  }

  float sdSphere(vec3 p, float r) { return length(p) - r; }

  float map(vec3 p, vec3 c) {
    vec3 q = p - c;
    vec3 sp = q;
    sp.y += sin(sp.z * 29.0 + time * 6.5) * 0.01;
    sp.z += sin(sp.x * 23.0 + sp.y * 11.0 + time * 7.0) * 0.01;
    sp.xy *= rot(time * 1.3);
    sp.xz *= rot(time * 1.1);
    float d = sdSphere(sp, SPHERE_R);
    for (int i = 0; i < N_BUBBLES; i++) {
      int b = i * 4;
      vec3 bPos = vec3(bubbleData[b], bubbleData[b+1], bubbleData[b+2]);
      float r = bubbleData[b+3];
      d = smin(d, sdSphere(q - bPos, max(r, 0.001)), BUBBLE_SMOOTH);
    }
    return d;
  }

  vec3 calcNormal(vec3 p, vec3 c) {
    vec2 e = vec2(0.001, 0.0);
    return normalize(vec3(
      map(p + e.xyy, c) - map(p - e.xyy, c),
      map(p + e.yxy, c) - map(p - e.yxy, c),
      map(p + e.yyx, c) - map(p - e.yyx, c)
    ));
  }

  vec3 spectrum(float x) {
    return clamp(vec3(
      1.5 - abs(4.0 * x - 1.0),
      1.5 - abs(4.0 * x - 2.0),
      1.5 - abs(4.0 * x - 3.0)
    ), 0.0, 1.0);
  }

  vec4 getSrc(vec2 uv) {
    // Ritorna il pixel così com'è (trasparente dove non c'è sorgente)
    return texture(src, uv);
  }

  void main() {
    vec2 uv = (gl_FragCoord.xy - offset) / resolution;
    float aspect = resolution.y / resolution.x;
    vec2 p = (uv - 0.5) * vec2(1.0, aspect);
    vec2 mp = (lag / resolution - 0.5) * vec2(1.0, aspect);
    vec3 ro = vec3(0.0, 0.0, -2.0);
    float focal = 2.0;
    vec3 rd = normalize(vec3(p, focal));
    vec3 c = vec3(mp, 0.0);
    vec3 firstN = vec3(0.0);
    vec3 lastN = vec3(0.0);
    int hitCount = 0;
    float thickness = 0.0;
    float tEntry = 0.0;
    float t = 0.0;
    bool inside = false;
    for (int i = 0; i < 50; i++) {
      if (t > 10.0) break;
      vec3 pos = ro + rd * t;
      float d = map(pos, c);
      float step = inside ? -d : d;
      if (step < 3e-4) {
        vec3 n = calcNormal(pos, c);
        if (hitCount == 0) firstN = n;
        lastN = n;
        if (!inside) { tEntry = t; } else { thickness += t - tEntry; }
        hitCount++;
        if (hitCount >= 4) { break; }
        inside = !inside;
        t += 0.01;
      } else { t += step; }
    }
    if (hitCount > 0) {
      vec2 baseDisp = -(firstN.xy + lastN.xy) * 0.5 * DISP;
      float NdotR = max(dot(firstN, -rd), 0.0);
      float scatter = pow((1.0 - NdotR), 2.0) * SCATTER;
      vec3 acc = vec3(0.0);
      vec3 wsum = vec3(0.0);
      for (int i = 0; i < DISP_STEPS; i++) {
        float wl = float(i) / float(DISP_STEPS - 1);
        float k = mix(DISP_LO, DISP_HI, wl) * (1.3 + float(hitCount) * 0.2);
        vec2 h = hash22(uv * 1000.0 + float(i) * 7.13 + time) * scatter;
        vec3 w = spectrum(wl);
        acc += getSrc(uv + baseDisp * k + h).rgb * w;
        wsum += w;
      }
      vec3 col = acc / wsum * 0.99;
      col -= float(hitCount) * 0.05;
      col += 0.1;
      float fres = pow(1.0 - NdotR, 5.0);
      col *= 1.0 + fres;
      float f2 = 1.0 - pow(NdotR, 3.0);
      col *= mix(vec3(1), exp(-ABSORB * thickness), f2);
      col *= 1.0 + f2;
      vec3 ld = normalize(vec3(0.5, 0.9, -0.3));
      float spec = pow(max(dot(reflect(-ld, firstN), -rd), 0.0), 200.0);
      col += spec * 30.0;
      ld = normalize(vec3(-0.9, 0.4, -0.3));
      spec = pow(max(dot(reflect(-ld, firstN), -rd), 0.0), 300.0);
      col += spec * 3.0;
      ld = normalize(vec3(-0.1, -0.9, -0.1));
      spec = pow(max(dot(reflect(-ld, firstN), -rd), 0.0), 30.0);
      col += spec * 0.5;
      col = min(col, 1.0);
      col = 1.0 - abs(col + fres * 0.5 - 1.0);
      outColor = vec4(col, 1.0);
    } else {
      // Nessuna bolla qui: pixel trasparente → l'app si vede attraverso
      outColor = vec4(0.0);
    }
  }
`;

// MODAL PROFILO UTENTE
@Component({
  selector: 'app-profilo-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatSnackBarModule, TranslateModule],
  template: `
    <div class="modal-container">

      <!-- HEADER: Avatar (sinistra) + Nickname (destra) -->
      <div class="profile-header">
        <div class="avatar" [style.background]="getAvatarGradient()"
          (pointerdown)="onAvatarPointerDown($event)"
          (pointerup)="onAvatarPointerUp()"
          (pointerleave)="onAvatarPointerLeave()"
          (pointercancel)="onAvatarPointerLeave()"
          (contextmenu)="$event.preventDefault()">
          <span class="avatar-initials">{{ getInitials() }}</span>
          <svg *ngIf="easterEggProgress > 0 || easterEggComplete" class="egg-ring"
               [class.egg-ring--burst]="easterEggComplete"
               viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="47" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="6"/>
            <circle cx="50" cy="50" r="47" fill="none"
              [attr.stroke]="getRingColor()"
              stroke-width="6"
              stroke-dasharray="295.31"
              [attr.stroke-dashoffset]="295.31 * (1 - easterEggProgress)"
              stroke-linecap="round"
              transform="rotate(-90 50 50)"
              style="filter: drop-shadow(0 0 3px currentColor)"/>
          </svg>
        </div>
        <div class="nickname-wrap">
          <label class="field-label">{{ 'PROFILE.NICKNAME' | translate }}</label>
          <input type="text" class="nickname-input"
            [(ngModel)]="userProfile.nickname"
            [placeholder]="'PROFILE.NICKNAME' | translate"
            autocomplete="off" required>
        </div>
        <button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <!-- FAVORITES -->
      <div class="favorites-section">

        <!-- 3 chip sport in riga -->
        <div class="sport-chips">
          <button class="chip" [class.chip--active]="activeSport === 'calcio'" [class.chip--has]="userProfile.squadraCalcio" (click)="setActiveSport('calcio')">
            <span class="chip-check" *ngIf="userProfile.squadraCalcio">✓</span>
            <span class="chip-emoji">⚽</span>
            <span class="chip-label">{{ 'COMMON.SOCCER' | translate }}</span>
            <span class="chip-value chip-value--set" *ngIf="userProfile.squadraCalcio">{{ userProfile.squadraCalcio }}</span>
            <span class="chip-value chip-value--empty" *ngIf="!userProfile.squadraCalcio">—</span>
          </button>
          <button class="chip" [class.chip--active]="activeSport === 'basket'" [class.chip--has]="userProfile.squadraBasket" (click)="setActiveSport('basket')">
            <span class="chip-check" *ngIf="userProfile.squadraBasket">✓</span>
            <span class="chip-emoji">🏀</span>
            <span class="chip-label">{{ 'COMMON.BASKETBALL' | translate }}</span>
            <span class="chip-value chip-value--set" *ngIf="userProfile.squadraBasket">{{ userProfile.squadraBasket }}</span>
            <span class="chip-value chip-value--empty" *ngIf="!userProfile.squadraBasket">—</span>
          </button>
          <button class="chip" [class.chip--active]="activeSport === 'tennis'" [class.chip--has]="userProfile.tennista" (click)="setActiveSport('tennis')">
            <span class="chip-check" *ngIf="userProfile.tennista">✓</span>
            <span class="chip-emoji">🎾</span>
            <span class="chip-label">{{ 'COMMON.TENNIS' | translate }}</span>
            <span class="chip-value chip-value--set" *ngIf="userProfile.tennista">{{ userProfile.tennista }}</span>
            <span class="chip-value chip-value--empty" *ngIf="!userProfile.tennista">—</span>
          </button>
        </div>

        <!-- AREA EDIT per lo sport attivo -->
        <div class="edit-area">

          <!-- CALCIO -->
          <ng-container *ngIf="activeSport === 'calcio'">
            <div class="edit-selected" *ngIf="userProfile.squadraCalcio; else searchCalcio">
              <span class="edit-emoji">⚽</span>
              <span class="edit-team">{{ userProfile.squadraCalcio }}</span>
              <button class="edit-clear" (click)="clearSport('calcio')"><mat-icon>close</mat-icon></button>
            </div>
            <ng-template #searchCalcio>
              <div class="edit-search">
                <input type="text" class="search-input"
                  [placeholder]="'PROFILE.SEARCH_SOCCER_TEAM' | translate"
                  [(ngModel)]="inputs.calcio"
                  (input)="onInput('calcio')"
                  (focus)="onFocusSport('calcio')"
                  (blur)="onBlurSport('calcio')"
                  autocomplete="off">
                <div class="suggestions-list" *ngIf="showSugg.calcio && suggestions.calcio.length > 0">
                  <div class="suggestion-item" *ngFor="let item of suggestions.calcio" (mousedown)="onSelectItem(item, 'calcio')">
                    <span>⚽</span><span>{{ item.nome }}</span>
                  </div>
                </div>
                <div class="team-error-banner" *ngIf="teamErrors.calcio">
                  <span>{{ teamErrors.calcio.emoji }}</span><span>{{ teamErrors.calcio.msg }}</span>
                </div>
              </div>
            </ng-template>
          </ng-container>

          <!-- BASKET -->
          <ng-container *ngIf="activeSport === 'basket'">
            <div class="edit-selected" *ngIf="userProfile.squadraBasket; else searchBasket">
              <span class="edit-emoji">🏀</span>
              <span class="edit-team">{{ userProfile.squadraBasket }}</span>
              <button class="edit-clear" (click)="clearSport('basket')"><mat-icon>close</mat-icon></button>
            </div>
            <ng-template #searchBasket>
              <div class="edit-search">
                <input type="text" class="search-input"
                  [placeholder]="'PROFILE.SEARCH_BASKET_TEAM' | translate"
                  [(ngModel)]="inputs.basket"
                  (input)="onInput('basket')"
                  (focus)="onFocusSport('basket')"
                  (blur)="onBlurSport('basket')"
                  autocomplete="off">
                <div class="suggestions-list" *ngIf="showSugg.basket && suggestions.basket.length > 0">
                  <div class="suggestion-item" *ngFor="let item of suggestions.basket" (mousedown)="onSelectItem(item, 'basket')">
                    <span>🏀</span><span>{{ item.nome }}</span>
                  </div>
                </div>
                <div class="team-error-banner" *ngIf="teamErrors.basket">
                  <span>{{ teamErrors.basket.emoji }}</span><span>{{ teamErrors.basket.msg }}</span>
                </div>
              </div>
            </ng-template>
          </ng-container>

          <!-- TENNIS -->
          <ng-container *ngIf="activeSport === 'tennis'">
            <div class="edit-selected" *ngIf="userProfile.tennista; else searchTennis">
              <span class="edit-emoji">🎾</span>
              <span class="edit-team">{{ userProfile.tennista }}</span>
              <button class="edit-clear" (click)="clearSport('tennis')"><mat-icon>close</mat-icon></button>
            </div>
            <ng-template #searchTennis>
              <div class="edit-search">
                <input type="text" class="search-input"
                  [placeholder]="'PROFILE.SEARCH_TENNIS_PLAYER' | translate"
                  [(ngModel)]="inputs.tennis"
                  (input)="onInput('tennis')"
                  (focus)="onFocusSport('tennis')"
                  (blur)="onBlurSport('tennis')"
                  autocomplete="off">
                <div class="suggestions-list" *ngIf="showSugg.tennis && suggestions.tennis.length > 0">
                  <div class="suggestion-item" *ngFor="let item of suggestions.tennis" (mousedown)="onSelectItem(item, 'tennis')">
                    <span>🎾</span><span>{{ item.nome }}</span>
                  </div>
                </div>
                <div class="team-error-banner" *ngIf="teamErrors.tennis">
                  <span>{{ teamErrors.tennis.emoji }}</span><span>{{ teamErrors.tennis.msg }}</span>
                </div>
              </div>
            </ng-template>
          </ng-container>

        </div>
      </div>

      <!-- FEEDBACK -->
      <div *ngIf="feedbackMessage" class="feedback-message"
        [class.success]="feedbackType === 'success'"
        [class.error]="feedbackType === 'error'">
        <mat-icon>{{ feedbackType === 'success' ? 'check_circle' : 'error' }}</mat-icon>
        <span>{{ feedbackMessage }}</span>
      </div>

      <!-- ACTIONS -->
      <div class="actions-section">
        <button type="submit" class="btn-primary" [disabled]="!isFormValid() || isSaving" (click)="onSubmit()">
          {{ isSaving ? ('PROFILE.SAVING' | translate) : ('PROFILE.SAVE' | translate) }}
        </button>
      </div>

      <!-- DANGER ZONE -->
      <div class="danger-zone">
        <button type="button" class="btn-danger-link" (click)="openDeleteAccountDialog()">
          {{ 'PROFILE.DELETE_ACCOUNT' | translate }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    :host { display: block; width: 100%; }
    * { box-sizing: border-box; }

    /* ─── CONTAINER ─── */
    .modal-container {
      background: #F4F7FC;
      border-radius: 20px;
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      font-family: 'Poppins', sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }

    /* ─── HEADER ─── */
    .profile-header {
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 60%, #4FC3F7 100%);
      padding: 20px 20px 24px;
      display: flex;
      align-items: center;
      gap: 14px;
    }

    .avatar {
      width: 52px;
      height: 52px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0 0 3px rgba(255,255,255,0.25);
      flex-shrink: 0;
      position: relative;
      overflow: visible;
      cursor: pointer;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
    }

    .egg-ring {
      /* inset:0 → SVG esattamente della stessa dimensione dell'avatar.
         viewBox 0 0 100 100 con r=47 e stroke-width=6:
         il bordo esterno del tratto è a 47+3=50 unità viewBox = 100% del raggio dell'avatar.
         Il ring è interamente DENTRO il cerchio → nessun problema con overflow:hidden. */
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      border-radius: 50%;
      overflow: hidden;
    }

    @keyframes egg-burst {
      0%   { transform: scale(1);    opacity: 1; }
      30%  { transform: scale(1.18); opacity: 1; filter: brightness(2) saturate(1.8); }
      100% { transform: scale(1.6);  opacity: 0; }
    }

    @keyframes egg-avatar-glow {
      0%   { box-shadow: 0 0 0 3px rgba(255,255,255,0.25); }
      40%  { box-shadow: 0 0 0 6px rgba(255,235,59,0.7), 0 0 18px rgba(255,152,0,0.6); }
      100% { box-shadow: 0 0 0 3px rgba(255,255,255,0.25); }
    }

    .egg-ring--burst {
      animation: egg-burst 0.55s ease-out forwards;
    }

    .avatar:has(.egg-ring--burst) {
      animation: egg-avatar-glow 0.55s ease-out forwards;
    }

    .avatar-initials {
      font-size: 1.3rem;
      font-weight: 700;
      color: #fff;
      line-height: 1;
    }

    .nickname-wrap {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .close-btn {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: rgba(0,0,0,0.18);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;

      mat-icon { color: #fff; font-size: 17px; width: 17px; height: 17px; pointer-events: none; }
      &:hover, &:active { background: rgba(0,0,0,0.35); }
    }

    .field-label {
      font-size: 0.63rem;
      font-weight: 600;
      color: rgba(255,255,255,0.65);
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .nickname-input {
      width: 100%;
      padding: 8px 12px;
      border-radius: 10px;
      background: rgba(255,255,255,0.15);
      border: 1.5px solid rgba(255,255,255,0.3);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 600;
      transition: all 0.2s;
      -webkit-text-size-adjust: 100%;

      &::placeholder { color: rgba(255,255,255,0.4); font-weight: 400; }
      &:focus {
        outline: none;
        background: rgba(255,255,255,0.22);
        border-color: rgba(255,255,255,0.7);
      }
    }

    /* ─── BODY ─── */
    .favorites-section {
      padding: 16px 16px 0;
    }

    /* ─── CHIP (3 colonne) ─── */
    .sport-chips {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }

    .chip {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      padding: 10px 6px;
      border-radius: 14px;
      border: none;
      background: #fff;
      cursor: pointer;
      transition: all 0.18s ease;
      min-height: 72px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.07);
      -webkit-tap-highlight-color: transparent;

      &:active { transform: scale(0.97); }

      &.chip--active {
        background: #EBF2FF;
        box-shadow: 0 0 0 2px #1565C0, 0 2px 8px rgba(10,61,145,0.12);
      }

      &.chip--has:not(.chip--active) {
        box-shadow: 0 0 0 2px #7CB9F4, 0 1px 4px rgba(0,0,0,0.07);
      }

      &.chip--active.chip--has {
        background: #E8F0FE;
        box-shadow: 0 0 0 2px #0A3D91, 0 2px 10px rgba(10,61,145,0.15);
      }
    }

    .chip-check {
      position: absolute;
      top: 5px;
      right: 7px;
      font-size: 0.6rem;
      font-weight: 800;
      color: #16A34A;
    }

    .chip-emoji { font-size: 1.4rem; line-height: 1; }

    .chip-label {
      font-size: 0.58rem;
      font-weight: 600;
      color: #94A3B8;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .chip-value {
      font-size: 0.66rem;
      font-weight: 700;
      width: 100%;
      text-align: center;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      padding: 0 4px;
    }

    .chip-value--set { color: #1565C0; }
    .chip-value--empty { color: #CBD5E1; }

    /* ─── EDIT AREA ─── */
    .edit-area { margin-top: 10px; position: relative; }

    .edit-selected {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      background: #fff;
      border: none;
      border-radius: 12px;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
    }

    .edit-emoji { font-size: 1.1rem; flex-shrink: 0; }

    .edit-team {
      flex: 1;
      font-size: 0.88rem;
      font-weight: 600;
      color: #1E293B;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .edit-clear {
      background: transparent;
      border: none;
      cursor: pointer;
      padding: 3px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;

      mat-icon { font-size: 15px; width: 15px; height: 15px; color: #CBD5E1; }
      &:hover mat-icon, &:active mat-icon { color: #DC2626; }
    }

    .edit-search { position: relative; }

    .search-input {
      width: 100%;
      padding: 10px 14px;
      border-radius: 12px;
      border: none;
      background: #fff;
      color: #1E293B;
      font-family: 'Poppins', sans-serif;
      font-size: 15px;
      font-weight: 500;
      box-shadow: 0 1px 4px rgba(0,0,0,0.08);
      transition: box-shadow 0.2s;
      -webkit-text-size-adjust: 100%;

      &::placeholder { color: #94A3B8; font-size: 0.88rem; }
      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px #1565C0, 0 2px 8px rgba(10,61,145,0.1);
      }
    }

    .suggestions-list {
      position: absolute;
      top: calc(100% + 4px);
      left: 0; right: 0;
      z-index: 50;
      background: #fff;
      border: none;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .suggestion-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 14px;
      cursor: pointer;
      font-size: 0.88rem;
      color: #374151;
      font-weight: 500;
      border-bottom: 1px solid #F8FAFC;
      transition: background 0.12s;

      &:last-child { border-bottom: none; }
      &:hover, &:active { background: #F0F5FF; color: #0A3D91; }
    }

    .team-error-banner {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      border-radius: 10px;
      margin-top: 6px;
      background: #FFF7ED;
      border: none;
      box-shadow: 0 1px 3px rgba(0,0,0,0.06);
      color: #C2410C;
      font-size: 0.78rem;
      font-weight: 600;
    }

    /* ─── FEEDBACK ─── */
    .feedback-message {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 14px;
      font-size: 0.8rem;
      font-weight: 500;
      margin: 12px 16px 0;
      border-radius: 10px;
      border: none;

      &.success { background: #F0FDF4; color: #166534; box-shadow: 0 1px 3px rgba(22,163,74,0.1); }
      &.error   { background: #FEF2F2; color: #991B1B; box-shadow: 0 1px 3px rgba(153,27,27,0.1); }
      mat-icon { font-size: 15px; width: 15px; height: 15px; flex-shrink: 0; }
    }

    /* ─── ACTIONS ─── */
    .actions-section {
      padding: 16px;
    }

    .btn-primary {
      display: block;
      width: 100%;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 13px;
      border-radius: 12px;
      cursor: pointer;
      font-size: 0.82rem;
      border: none;
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      color: #fff;
      box-shadow: 0 4px 14px rgba(10,61,145,0.25);
      transition: opacity 0.2s, box-shadow 0.2s;
      -webkit-tap-highlight-color: transparent;

      &:hover:not(:disabled), &:active:not(:disabled) { opacity: 0.88; box-shadow: 0 2px 8px rgba(10,61,145,0.2); }
      &:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; }
    }

    /* ─── ANNULLA ─── */
    .btn-cancel {
      display: block;
      width: 100%;
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      font-size: 0.82rem;
      padding: 11px;
      border-radius: 12px;
      cursor: pointer;
      border: none;
      background: #E8EDF5;
      color: #475569;
      margin-top: 8px;
      transition: background 0.15s;
      -webkit-tap-highlight-color: transparent;

      &:hover, &:active { background: #DCE3EF; }
    }

    /* ─── DANGER ─── */
    .danger-zone {
      padding: 0 16px 16px;
      text-align: center;
    }

    .btn-danger-link {
      background: none;
      border: none;
      font-family: 'Poppins', sans-serif;
      font-size: 0.74rem;
      font-weight: 500;
      color: #94A3B8;
      cursor: pointer;
      padding: 4px 8px;
      text-decoration: underline;
      text-underline-offset: 2px;
      transition: color 0.15s;
      -webkit-tap-highlight-color: transparent;

      &:hover, &:active { color: #DC2626; }
    }

    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 480px) {
      .profile-header { padding: 16px 16px 20px; gap: 12px; }
      .avatar { width: 46px; height: 46px; }
      .avatar-initials { font-size: 1.15rem; }
      .favorites-section { padding: 14px 12px 0; }
      .chip { min-height: 66px; }
      .actions-section { padding: 12px; }
      .danger-zone { padding: 0 12px 12px; }
    }

    @media (max-width: 360px) {
      .profile-header { padding: 12px 12px 16px; gap: 10px; }
      .avatar { width: 42px; height: 42px; }
      .sport-chips { gap: 6px; }
      .chip { min-height: 60px; padding: 8px 4px; }
      .chip-emoji { font-size: 1.2rem; }
      .chip-label { font-size: 0.54rem; }
    }
  `]
})
export class ProfiloDialogComponent implements OnInit, OnDestroy {
  userProfile = {
    nickname: '',
    squadraCalcio: '',
    squadraBasket: '',
    tennista: ''
  };

  // ── Easter egg state ─────────────────────────────────────────────────────
  easterEggProgress = 0;
  easterEggComplete  = false;
  private _eggInterval: ReturnType<typeof setInterval> | null = null;
  private _eggStartTime = 0;
  private readonly EGG_DURATION = 5000;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _eggVfx: any = null;
  private _eggOverlay: HTMLElement | null = null;
  private _eggBgCanvas: HTMLCanvasElement | null = null;

  activeSport: 'calcio' | 'basket' | 'tennis' = 'calcio';

  inputs = { calcio: '', basket: '', tennis: '' };
  suggestions: { calcio: Squadra[]; basket: Squadra[]; tennis: Squadra[] } = { calcio: [], basket: [], tennis: [] };
  showSugg = { calcio: false, basket: false, tennis: false };
  teamErrors: { calcio: { emoji: string; msg: string } | null; basket: { emoji: string; msg: string } | null; tennis: { emoji: string; msg: string } | null } = { calcio: null, basket: null, tennis: null };
  private squadreAll: { calcio: Squadra[]; basket: Squadra[]; tennis: Squadra[] } = { calcio: [], basket: [], tennis: [] };
  isSaving = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  private readonly teamNotFoundEmojis = [
    '🤡', '😂', '🧠', '😐', '🕵️', '🦗', '🤦', '🎭',
    '🧩', '🚫', '🤔', '😅', '🎪', '🔍', '🤨', '💀',
    '🤯', '🦆', '📖', '🏆'
  ];

  private squadreSelezionate: { calcio: Squadra | null; basket: Squadra | null; tennis: Squadra | null } = {
    calcio: null, basket: null, tennis: null
  };

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
    this.loadAllSquadre();
  }

  // ── Avatar ─────────────────────────────────────────────────────────────────

  getInitials(): string {
    const n = (this.userProfile.nickname || '').trim();
    if (!n) return '?';
    return n.substring(0, 2).toUpperCase();
  }

  getAvatarGradient(): string {
    const n = (this.userProfile.nickname || 'A').trim();
    const palettes = [
      'linear-gradient(135deg, #6366F1, #8B5CF6)',
      'linear-gradient(135deg, #EC4899, #F43F5E)',
      'linear-gradient(135deg, #0EA5E9, #06B6D4)',
      'linear-gradient(135deg, #10B981, #059669)',
      'linear-gradient(135deg, #F59E0B, #EF4444)',
      'linear-gradient(135deg, #8B5CF6, #EC4899)',
      'linear-gradient(135deg, #14B8A6, #0EA5E9)',
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) { hash = (hash * 31 + n.charCodeAt(i)) % palettes.length; }
    return palettes[Math.abs(hash) % palettes.length];
  }

  // ── Load data ──────────────────────────────────────────────────────────────

  loadProfile() {
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.userProfile.nickname = giocatore.nickname || '';
        this.userProfile.squadraCalcio = giocatore.squadraCuore?.nome || '';
        this.userProfile.squadraBasket = giocatore.squadraBasketCuore?.nome || '';
        this.userProfile.tennista = giocatore.tennistaCuore?.nome || '';
        this.squadreSelezionate.calcio = giocatore.squadraCuore || null;
        this.squadreSelezionate.basket = giocatore.squadraBasketCuore || null;
        this.squadreSelezionate.tennis = giocatore.tennistaCuore || null;
      },
      error: () => this.showFeedback('Errore nel caricamento del profilo', 'error')
    });
  }

  private loadAllSquadre() {
    const sports: Array<{ key: 'calcio' | 'basket' | 'tennis'; id: string }> = [
      { key: 'calcio', id: 'CALCIO' },
      { key: 'basket', id: 'BASKET' },
      { key: 'tennis', id: 'TENNIS' }
    ];
    sports.forEach(s => {
      this.squadraService.getSquadreBySport(s.id).subscribe({
        next: (squadre) => { this.squadreAll[s.key] = squadre || []; },
        error: () => { this.squadreAll[s.key] = []; }
      });
    });
  }

  // ── Search / autocomplete ──────────────────────────────────────────────────

  onInput(sport: 'calcio' | 'basket' | 'tennis') {
    this.teamErrors[sport] = null;
    const query = (this.inputs[sport] || '').toLowerCase().trim();
    if (query.length >= 3) {
      const filtered = this.squadreAll[sport].filter(s => s.nome.toLowerCase().includes(query)).slice(0, 4);
      if (filtered.length > 0) {
        this.suggestions[sport] = filtered;
        this.showSugg[sport] = true;
      } else {
        this.suggestions[sport] = [];
        this.showSugg[sport] = false;
        const idx = Math.floor(Math.random() * this.teamNotFoundEmojis.length);
        this.teamErrors[sport] = {
          emoji: this.teamNotFoundEmojis[idx],
          msg: this.translate.instant(`PROFILE.TEAM_NOT_FOUND.MSG_${idx + 1}`)
        };
      }
    } else if (query.length === 0) {
      this.suggestions[sport] = [];
      this.showSugg[sport] = false;
    } else {
      this.suggestions[sport] = [];
      this.showSugg[sport] = false;
    }
  }

  onFocusSport(sport: 'calcio' | 'basket' | 'tennis') {
    this.showSugg[sport] = false;
  }

  onBlurSport(sport: 'calcio' | 'basket' | 'tennis') {
    setTimeout(() => { this.showSugg[sport] = false; }, 200);
  }

  onSelectItem(item: Squadra, sport: 'calcio' | 'basket' | 'tennis') {
    this.squadreSelezionate[sport] = item;
    if (sport === 'calcio') { this.userProfile.squadraCalcio = item.nome; }
    else if (sport === 'basket') { this.userProfile.squadraBasket = item.nome; }
    else { this.userProfile.tennista = item.nome; }
    this.inputs[sport] = '';
    this.suggestions[sport] = [];
    this.showSugg[sport] = false;
    this.teamErrors[sport] = null;
  }

  clearSport(sport: 'calcio' | 'basket' | 'tennis') {
    this.squadreSelezionate[sport] = null;
    if (sport === 'calcio') { this.userProfile.squadraCalcio = ''; }
    else if (sport === 'basket') { this.userProfile.squadraBasket = ''; }
    else { this.userProfile.tennista = ''; }
    this.inputs[sport] = '';
    this.suggestions[sport] = [];
    this.showSugg[sport] = false;
    this.teamErrors[sport] = null;
  }

  setActiveSport(sport: 'calcio' | 'basket' | 'tennis') {
    this.activeSport = sport;
    this.teamErrors[sport] = null;
    // Se lo sport attivo non ha già una squadra, reset del campo di ricerca
    const hasTeam = sport === 'calcio' ? this.userProfile.squadraCalcio
      : sport === 'basket' ? this.userProfile.squadraBasket
      : this.userProfile.tennista;
    if (!hasTeam) {
      this.inputs[sport] = '';
      this.suggestions[sport] = [];
      this.showSugg[sport] = false;
    }
  }

  // ── Validation & feedback ──────────────────────────────────────────────────

  isFormValid(): boolean {
    return !!(this.userProfile.nickname && this.userProfile.nickname.trim().length > 0);
  }

  showFeedback(message: string, type: 'success' | 'error') {
    this.feedbackMessage = message;
    this.feedbackType = type;
    setTimeout(() => { this.feedbackMessage = null; this.feedbackType = null; }, 3000);
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  onSubmit() {
    if (!this.isFormValid()) { this.showFeedback('Inserisci un nickname valido', 'error'); return; }
    this.isSaving = true;
    this.feedbackMessage = null;
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        const giocatoreAggiornato: any = {
          id: giocatore.id,
          nome: giocatore.nickname,
          nickname: this.userProfile.nickname.trim(),
          user: giocatore.user,
          squadraCuore: this.squadreSelezionate.calcio || null,
          squadraBasketCuore: this.squadreSelezionate.basket || null,
          tennistaCuore: this.squadreSelezionate.tennis || null
        };
        this.saveProfile(giocatoreAggiornato);
      },
      error: () => { this.isSaving = false; this.showFeedback('Errore nel caricamento del profilo', 'error'); }
    });
  }

  private saveProfile(giocatoreAggiornato: any) {
    this.giocatoreService.aggiornaMe(giocatoreAggiornato).subscribe({
      next: () => {
        this.isSaving = false;
        this.showFeedback(this.translate.instant('PROFILE.SUCCESS'), 'success');
        this.resetIOSZoom();
        setTimeout(() => {
          this.dialog.closeAll();
          window.dispatchEvent(new CustomEvent('profile-updated'));
        }, 2000);
      },
      error: () => {
        this.isSaving = false;
        this.showFeedback(this.translate.instant('PROFILE.ERROR'), 'error');
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
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container' // CENTRATO
    });
  }

  // ── Easter Egg: long press sulle iniziali ─────────────────────────────────

  onAvatarPointerDown(event: PointerEvent): void {
    event.preventDefault();
    this._eggStartTime = Date.now();
    this.easterEggProgress = 0;
    this.easterEggComplete  = false;
    this._eggInterval = setInterval(() => {
      const elapsed = Date.now() - this._eggStartTime;
      this.easterEggProgress = Math.min(elapsed / this.EGG_DURATION, 1);
      if (this.easterEggProgress >= 1) {
        // Ferma l'intervallo e congela il ring a 1 per la burst animation
        if (this._eggInterval) { clearInterval(this._eggInterval); this._eggInterval = null; }
        this.easterEggComplete = true;
        // Breve delay per far vedere la burst, poi lancia la bolla
        setTimeout(() => {
          this.easterEggComplete  = false;
          this.easterEggProgress  = 0;
          this._activateEasterEgg();
        }, 600);
      }
    }, 50);
  }

  onAvatarPointerUp(): void    { this._clearEasterEggProgress(); }
  onAvatarPointerLeave(): void { this._clearEasterEggProgress(); }

  private _clearEasterEggProgress(): void {
    if (this._eggInterval) { clearInterval(this._eggInterval); this._eggInterval = null; }
    this.easterEggProgress = 0;
    this.easterEggComplete  = false;
  }

  /** Colore arcobaleno del ring interpolato sul progresso (0→1) */
  getRingColor(): string {
    const p = this.easterEggProgress;
    // cyan → blue → violet → pink → orange → gold
    const stops: [number, number, number][] = [
      [ 79, 195, 247],  // 0.00 cyan
      [ 33, 150, 243],  // 0.20 blue
      [156,  39, 176],  // 0.45 violet
      [233,  30,  99],  // 0.65 pink
      [255, 152,   0],  // 0.82 orange
      [255, 235,  59],  // 1.00 gold
    ];
    const t = p * (stops.length - 1);
    const i = Math.min(Math.floor(t), stops.length - 2);
    const f = t - i;
    const [r1, g1, b1] = stops[i];
    const [r2, g2, b2] = stops[i + 1];
    return `rgb(${Math.round(r1+(r2-r1)*f)},${Math.round(g1+(g2-g1)*f)},${Math.round(b1+(b2-b1)*f)})`;
  }

  private async _activateEasterEgg(): Promise<void> {
    try {
      const { VFX } = await import('@vfx-js/core');

      const W = window.innerWidth;
      const H = window.innerHeight;

      // ── 1. srcDiv: div trasparente full-screen necessario per attivare
      //    il post-effect VFX-JS (serve almeno un elemento tracciato)
      const srcDiv = document.createElement('div');
      srcDiv.style.cssText = [
        'position:fixed', 'inset:0',
        'z-index:-1', 'pointer-events:none',
        'background:transparent',
      ].join(';');
      document.body.appendChild(srcDiv);

      // ── 2. uiLayer: bottone ✕ + hint + tracking touch ────────────────────
      // z-index 99999: sempre sopra il canvas VFX (9998).
      // Questo elemento NON viene mai toccato da VFX → close button funziona.
      const uiLayer = document.createElement('div');
      uiLayer.style.cssText = [
        'position:fixed', 'inset:0', 'z-index:99999',
        'touch-action:none',  // blocca scroll sotto
      ].join(';');

      const closeBtn = document.createElement('button');
      closeBtn.setAttribute('aria-label', 'Chiudi easter egg');
      closeBtn.style.cssText = [
        'position:absolute',
        'top:calc(env(safe-area-inset-top, 0px) + 14px)', 'right:14px',
        'width:44px', 'height:44px', 'border-radius:50%',
        'background:rgba(255,255,255,0.22)',
        'border:1.5px solid rgba(255,255,255,0.45)',
        'color:white', 'font-size:20px', 'line-height:1',
        'display:flex', 'align-items:center', 'justify-content:center',
        'cursor:pointer', 'touch-action:manipulation',
        '-webkit-tap-highlight-color:transparent',
        'font-family:system-ui,sans-serif',
        'backdrop-filter:blur(8px)',
      ].join(';');
      closeBtn.textContent = '✕';
      uiLayer.appendChild(closeBtn);

      // hint rimosso

      document.body.appendChild(uiLayer);
      this._eggOverlay = uiLayer;

      // ── 3. Bubble state ───────────────────────────────────────────────────
      const N = 8;
      const bubbles = new Float32Array(N * 4);
      const t0 = performance.now() / 1000;
      const p0 = { x: W / 2, y: H / 2 };
      const p1 = { x: W / 2, y: H / 2 };
      const p2 = { x: W / 2, y: H / 2 };

      const fract = (x: number) => x - Math.floor(x);
      const rot2d = (x: number, y: number, ang: number): [number, number] => {
        const c = Math.cos(ang), s = Math.sin(ang);
        return [x * c - y * s, x * s + y * c];
      };

      // Tracking sul uiLayer: pointerdown setta posizione iniziale e cattura
      // il puntatore (setPointerCapture) → pointermove arriva su uiLayer anche
      // durante il drag veloce su iOS senza perdere l'evento.
      const onPointerDown = (e: PointerEvent) => {
        if (closeBtn.contains(e.target as Node)) return; // non interferire col close
        p0.x = e.clientX;
        p0.y = H - e.clientY;
      };
      const onPointerMove = (e: PointerEvent) => {
        p0.x = e.clientX;
        p0.y = H - e.clientY; // flip Y per WebGL (0 = basso)
      };
      uiLayer.addEventListener('pointerdown', onPointerDown);
      uiLayer.addEventListener('pointermove', onPointerMove);

      // ── 4. Animazione bolle ───────────────────────────────────────────────
      let animId = 0;
      const tick = () => {
        const time = performance.now() / 1000 - t0;
        const sm = 0.10;
        p1.x += (p0.x - p1.x) * sm;
        p1.y += (p0.y - p1.y) * sm;
        p2.x += (p1.x - p2.x) * sm;
        p2.y += (p1.y - p2.y) * sm;
        for (let i = 0; i < N; i++) {
          const life = fract(time * 0.7 + i / N);
          const orbitR = 0.12 * (0.3 + life * 0.8);
          const orbitAngle = time * (0.8 + fract(i * 0.618) * 0.7) + i * 1.256;
          let bx = Math.cos(orbitAngle) * orbitR;
          let by = 0;
          let bz = Math.sin(orbitAngle) * orbitR;
          [bx, by] = rot2d(bx, by, i * 2.3);
          [by, bz] = rot2d(by, bz, i * 1.8);
          by += life * 0.1;
          bx += Math.sin(time * 2.7 + i * 4.1) * 0.008 * life;
          bz += Math.cos(time * 3.1 + i * 3.7) * 0.008 * life;
          bx += ((p2.x - p1.x) / W) * (H / W);
          by += (p2.y - p1.y) / H;
          const maxR = 0.03 + 0.04 * fract(i * 0.618);
          const j = i * 4;
          bubbles[j] = bx;     bubbles[j + 1] = by;
          bubbles[j + 2] = bz; bubbles[j + 3] = maxR * Math.sin(life * Math.PI);
        }
        animId = requestAnimationFrame(tick);
      };
      tick();

      // ── 5. VFX ────────────────────────────────────────────────────────────
      // fixedCanvas:true → canvas position:fixed
      // zIndex:9998 → sotto uiLayer(99999), sopra l'app
      // Il canvas WebGL è trasparente dove non c'è bolla → app visibile sotto
      const vfx = new VFX({
        zIndex: 9998,
        scrollPadding: false,
        postEffect: {
          shader: EASTER_EGG_SHADER,
          uniforms: {
            lag: () => [
              p2.x * devicePixelRatio,
              p2.y * devicePixelRatio,
            ],
            bubbleData: () => bubbles,
          },
        },
      });
      this._eggVfx = vfx;

      // srcDiv trasparente come sorgente: attiva il post-effect senza coprire nulla
      await vfx.add(srcDiv, { shader: 'none' });
      vfx.play();

      // ── 6. Dismiss ────────────────────────────────────────────────────────
      let dismissed = false;
      const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        cancelAnimationFrame(animId);
        uiLayer.removeEventListener('pointerdown', onPointerDown);
        uiLayer.removeEventListener('pointermove', onPointerMove);
        uiLayer.style.transition = 'opacity 0.22s ease';
        uiLayer.style.opacity = '0';
        setTimeout(() => {
          try { vfx.destroy(); } catch (_) { /* noop */ }
          srcDiv.remove();
          uiLayer.remove();
          this._eggOverlay = null;
          this._eggVfx     = null;
        }, 240);
      };

      // Auto-close dopo 8 secondi
      setTimeout(dismiss, 8000);

      // Tasto chiudi: usa 'click' (affidabile sia desktop che mobile)
      closeBtn.addEventListener('click', dismiss, { once: true });

    } catch (err) {
      console.error('[EasterEgg] VFX error:', err);
    }
  }

  ngOnDestroy(): void {
    this._clearEasterEggProgress();
    if (this._eggVfx) { try { this._eggVfx.destroy(); } catch (_) {} this._eggVfx = null; }
    if (this._eggOverlay)  { this._eggOverlay.remove();  this._eggOverlay  = null; }
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
      maxHeight: '90vh',
      panelClass: 'regolamento-dialog-container',
      autoFocus: false,
      restoreFocus: false // CENTRATO
    });
  }

  openAlboOro() {
    this.dialog.open(AlboOroDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'albo-oro-dialog-container',
      autoFocus: false,
      restoreFocus: false // CENTRATO
    });
  }

  openProfilo() {
    this.dialog.open(ProfiloDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'profilo-dialog-container',
      autoFocus: false,
      restoreFocus: false // CENTRATO
    });
  }
}
