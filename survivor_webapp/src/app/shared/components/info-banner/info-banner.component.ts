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
import { PlayerBadgesComponent } from '../player-badges/player-badges.component';

// MODAL REGOLAMENTO (stesso del footer)
@Component({
  selector: 'app-regolamento-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="regolamento-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <div class="rules-orb"><mat-icon>menu_book</mat-icon></div>
          <h2 class="dialog-title">{{ 'RULES.TITLE' | translate }}</h2>
        </div>
        <button type="button" class="close-btn" (click)="closeDialog()" [attr.aria-label]="'COMMON.CLOSE' | translate">
          <svg class="close-x" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path d="M2 2 L12 12 M12 2 L2 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
        </button>
        <span class="read-progress" [style.width.%]="scrollProgress" aria-hidden="true"></span>
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
          <p>{{ 'RULES.SECTION_2_P2' | translate }}</p>
          <p>{{ 'RULES.SECTION_2_P3' | translate }}</p>
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

        <!-- 11. Badge storico giocatore -->
        <div class="regola">
          <h3>{{ 'BADGE.RULES_TITLE' | translate }}</h3>
          <p>{{ 'BADGE.RULES_TEXT' | translate }}</p>
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
      background: #F6F9FF;
      border-radius: 20px;
      box-shadow: 0 18px 60px rgba(10, 61, 145, 0.3);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    /* ── Header: blu con riflesso, luce che passa ogni tanto e barra di lettura in basso ── */
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 18px 16px;
      background:
        radial-gradient(circle at 10% 0%, rgba(255, 255, 255, 0.38), transparent 45%),
        linear-gradient(135deg, #0A3D91 0%, #1565C0 55%, #4FC3F7 135%);
      color: #FFFFFF;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      z-index: 2;
      box-sizing: border-box;
      box-shadow: 0 4px 16px rgba(10, 61, 145, 0.3);

      &::after {
        content: '';
        position: absolute;
        top: 0; left: -60%;
        width: 40%; height: 100%;
        background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.28), transparent);
        transform: skewX(-18deg);
        animation: rgHeaderSheen 7s ease-in-out infinite;
        pointer-events: none;
      }

      .header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 12px;
        flex: 1;
        min-width: 0;
      }

      .rules-orb {
        flex-shrink: 0;
        width: 38px;
        height: 38px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.45);
        box-shadow: 0 4px 10px rgba(4, 15, 46, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          color: #FFFFFF;
        }
      }

      .dialog-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        text-align: center;
        line-height: 1.2;
        text-shadow: 0 2px 6px rgba(4, 15, 46, 0.3);
      }

      .close-btn {
        position: absolute;
        z-index: 2;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.2);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.34);
          transform: translateY(-50%) rotate(90deg);
        }

        /* X come SVG inline: centrata dal flex del button, non dipende da padding Material o dal font delle icone */
        .close-x {
          display: block;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }
      }

      /* Quanto del regolamento hai già scorso */
      .read-progress {
        position: absolute;
        z-index: 2;
        left: 0;
        bottom: 0;
        height: 3px;
        background: linear-gradient(90deg, #4FC3F7, #FFFFFF);
        box-shadow: 0 0 8px rgba(255, 255, 255, 0.7);
        transition: width 0.12s linear;
      }
    }

    @keyframes rgHeaderSheen {
      0%, 55% { left: -60%; }
      100% { left: 140%; }
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
      background: linear-gradient(180deg, #EAF2FF 0%, #F6F9FF 220px);

      /* Scrollbar */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #B9C9E4;
        border-radius: 3px;

        &:hover {
          background: #4FC3F7;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #B9C9E4 transparent;

      .intro {
        color: #0A3D91;
        font-size: 1rem;
        font-weight: 500;
        margin-bottom: 24px;
        text-align: center;
        line-height: 1.6;
      }

      .good-luck {
        position: relative;
        overflow: hidden;
        color: #FFFFFF;
        font-size: 1.05rem;
        font-weight: 700;
        text-align: center;
        margin: 18px 0 4px;
        padding: 16px;
        background: linear-gradient(135deg, #0A3D91, #1565C0 60%, #4FC3F7 140%);
        border-radius: 16px;
        box-shadow: 0 8px 20px rgba(10, 61, 145, 0.28);
        text-shadow: 0 1px 4px rgba(4, 15, 46, 0.3);
      }

      /* ── Ogni sezione è una card con barra colorata a sinistra ── */
      .regola {
        position: relative;
        margin: 0 0 14px 0;
        padding: 16px 18px 10px 22px;
        background: #FFFFFF;
        border: 1px solid rgba(10, 61, 145, 0.08);
        border-radius: 16px;
        box-shadow: 0 3px 12px rgba(10, 61, 145, 0.06);
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
        overflow: hidden;
        animation: rgCardIn 0.45s ease both;

        &::before {
          content: '';
          position: absolute;
          left: 0; top: 0; bottom: 0;
          width: 4px;
          background: linear-gradient(180deg, #0A3D91, #4FC3F7);
        }

        &:nth-child(2) { animation-delay: 0.05s; }
        &:nth-child(3) { animation-delay: 0.1s; }
        &:nth-child(4) { animation-delay: 0.15s; }
        &:nth-child(5) { animation-delay: 0.2s; }
        &:nth-child(6) { animation-delay: 0.25s; }

        h3 {
          color: #0A3D91;
          font-weight: 700;
          font-size: 1rem;
          margin: 0 0 10px 0;
          line-height: 1.35;
          letter-spacing: 0.2px;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        /* Sottotitoli (modalità, 9.1, 9.2...): etichetta a pillola */
        h4 {
          display: inline-block;
          max-width: 100%;
          margin: 14px 0 8px 0;
          padding: 3px 11px;
          border-radius: 12px;
          background: rgba(79, 195, 247, 0.16);
          color: #0A6FB3;
          font-weight: 700;
          font-size: 0.74rem;
          letter-spacing: 0.06em;
          line-height: 1.4;
          text-transform: uppercase;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        p {
          color: #556070;
          font-size: 0.86rem;
          margin: 0 0 10px 0;
          line-height: 1.65;
          text-align: left;
          word-break: break-word;
          overflow-wrap: anywhere;
          max-width: 100%;
        }

        ul {
          list-style: none;
          margin: 8px 0 10px 0;
          padding: 0;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;

          li {
            position: relative;
            padding-left: 20px;
            margin-bottom: 7px;
            color: #556070;
            font-size: 0.86rem;
            line-height: 1.6;
            text-align: left;
            word-break: break-word;
            overflow-wrap: anywhere;
            max-width: 100%;

            &::before {
              content: '';
              position: absolute;
              left: 3px;
              top: 0.62em;
              width: 7px;
              height: 7px;
              border-radius: 50%;
              background: linear-gradient(135deg, #0A3D91, #4FC3F7);
            }
          }
        }

        strong {
          color: #0A3D91;
          font-weight: 700;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
      }
    }

    @keyframes rgCardIn {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 100vw;
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

          .close-x { width: 12px; height: 12px; }
        }
      }

      .dialog-content {
        padding: 16px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 12px;
          padding: 14px 14px 8px 18px;

          h3 { font-size: 0.95rem; margin-bottom: 8px; }
          h4 { font-size: 0.7rem; margin: 12px 0 8px 0; }
          p, li { font-size: 0.82rem; line-height: 1.55; }
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
        border-radius: 18px;
        box-sizing: border-box;
      }

      .dialog-header {
        padding: 13px 16px;
        box-sizing: border-box;

        .header-content { gap: 9px; }
        .rules-orb { width: 32px; height: 32px; mat-icon { font-size: 17px; width: 17px; height: 17px; } }

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

          .close-x { width: 11px; height: 11px; }
        }
      }

      .dialog-content {
        padding: 12px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 10px;
          padding: 12px 12px 6px 16px;
          border-radius: 14px;

          h3 { font-size: 0.9rem; margin-bottom: 6px; }
          h4 { font-size: 0.66rem; margin: 10px 0 6px 0; }
          p, li { font-size: 0.78rem; line-height: 1.5; }
          ul li { padding-left: 17px; }
        }

        .good-luck { font-size: 0.95rem; padding: 14px; }
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

    @media (prefers-reduced-motion: reduce) {
      .dialog-header::after { animation: none; }
      .regola { animation: none; }
      .read-progress, .close-btn { transition: none; }
    }
  `]
})
export class RegolamentoBannerDialogComponent {
  showBackToTop = false;
  /** 0-100: quanto del regolamento è stato scorso, mostrato come barra sul bordo del header. */
  scrollProgress = 0;
  private lastScrollTop = 0;
  private scrollTimeout: any;

  constructor(private dialog: MatDialog,
    private squadraService: SquadraService
  ) {


  }

  onScroll(event: any): void {
    const scrollTop = event.target.scrollTop;
    const isScrollingDown = scrollTop > this.lastScrollTop;
    const max = event.target.scrollHeight - event.target.clientHeight;
    this.scrollProgress = max > 0 ? Math.min(100, (scrollTop / max) * 100) : 0;

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
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule, PlayerBadgesComponent],
  template: `
    <div class="albo-oro-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <div class="trophy-orb"><mat-icon class="trophy-icon">emoji_events</mat-icon></div>
          <h2 class="dialog-title">{{ 'TROPHIES.YOUR_TROPHIES' | translate }}</h2>
        </div>
        <button type="button" class="close-btn" (click)="closeDialog()" [attr.aria-label]="'COMMON.CLOSE' | translate">
          <svg class="close-x" viewBox="0 0 14 14" aria-hidden="true" focusable="false">
            <path d="M2 2 L12 12 M12 2 L2 12" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
          </svg>
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

        <!-- Statistiche personali in alto: sono il riassunto, non vanno cercate in fondo a una lista lunga -->
        <div class="stats-block" *ngIf="!isLoading && hasTrofei && statistiche">
          <div class="section-label">{{ 'TROPHIES.YOUR_STATS' | translate }}</div>
          <div class="stats-strip">
            <div class="stat-tile">
              <mat-icon>sports_score</mat-icon>
              <span class="stat-number">{{ statistiche.torneiGiocati }}</span>
              <span class="stat-label">{{ 'TROPHIES.TOURNAMENTS_PLAYED' | translate }}</span>
            </div>
            <div class="stat-tile">
              <mat-icon>emoji_events</mat-icon>
              <span class="stat-number">{{ statistiche.vittorie }}</span>
              <span class="stat-label">{{ 'TROPHIES.VICTORIES' | translate }}</span>
            </div>
            <div class="stat-tile">
              <mat-icon>workspace_premium</mat-icon>
              <span class="stat-number">{{ statistiche.podi }}</span>
              <span class="stat-label">{{ 'TROPHIES.PODIUMS' | translate }}</span>
            </div>
            <div class="stat-tile">
              <mat-icon>trending_up</mat-icon>
              <span class="stat-number">{{ statistiche.winRate.toFixed(1) }}%</span>
              <span class="stat-label">{{ 'TROPHIES.WIN_RATE' | translate }}</span>
            </div>
          </div>
        </div>

        <!-- Lista trofei personali -->
        <div class="trophy-list" *ngIf="!isLoading && hasTrofei && statistiche">
          <div class="trophy-card" *ngFor="let trofeo of statistiche.trofei; let i = index"
               [ngClass]="'pos-' + (trofeo.posizioneFinale <= 3 ? trofeo.posizioneFinale : 'n')"
               [style.animation-delay]="(i * 70) + 'ms'">
            <div class="tc-medal">
              <span class="tc-medal-emoji">{{ getPosizioneEmoji(trofeo.posizioneFinale) }}</span>
            </div>
            <div class="tc-body">
              <div class="tc-head">
                <h3 class="tc-title">{{ trofeo.nomeLega }}</h3>
                <span class="tc-ed">{{ 'LEAGUE.EDITION' | translate }} {{ trofeo.edizione }}</span>
              </div>
              <span class="tc-pos">{{ getPosizioneLabel(trofeo.posizioneFinale) }}</span>
              <ul class="tc-meta">
                <li>
                  <mat-icon>sports</mat-icon>
                  <span>{{ trofeo.nomeSport }} · {{ trofeo.nomeCampionato }} {{ trofeo.anno }}</span>
                </li>
                <li>
                  <mat-icon>event_available</mat-icon>
                  <span>{{ 'TROPHIES.ROUNDS_SURVIVED' | translate }}: {{ trofeo.giornateGiocate }}</span>
                </li>
                <li *ngIf="trofeo.ultimaSquadraScelta">
                  <mat-icon>shield</mat-icon>
                  <span>{{ 'TROPHIES.FINAL_TEAM' | translate }}: {{ trofeo.ultimaSquadraScelta }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- Badge storico per categoria -->
        <div class="badges-section" *ngIf="!isLoading && hasBadges">
          <div class="badges-title-row">
            <h3>{{ 'TROPHIES.YOUR_BADGES' | translate }}</h3>
            <button type="button" class="badge-info-btn" (click)="showBadgeInfo = !showBadgeInfo" [attr.aria-label]="'BADGE.RULES_TITLE' | translate">ⓘ</button>
          </div>
          <div class="badge-info-bubble" *ngIf="showBadgeInfo">{{ 'BADGE.RULES_TEXT' | translate }}</div>
          <app-player-badges
            size="large"
            [vittorie1v1]="statistiche?.vittorie1v1"
            [vittorieSurvivor]="statistiche?.vittorieSurvivor"
            [vittorieCampionato]="statistiche?.vittorieCampionato">
          </app-player-badges>
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
      border-radius: 20px;
      box-shadow: 0 18px 60px rgba(180, 83, 9, 0.28);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      overflow: hidden;
    }

    /* ── Header dorato: riflesso in alto a sinistra + luce che passa ogni tanto ── */
    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 22px 20px;
      background:
        radial-gradient(circle at 12% 0%, rgba(255, 255, 255, 0.5), transparent 45%),
        linear-gradient(135deg, #FFD700 0%, #FFB300 55%, #FF8F00 100%);
      color: #FFFFFF;
      position: relative;
      flex-shrink: 0;
      overflow: hidden;
      box-shadow: 0 4px 16px rgba(255, 160, 0, 0.35);

      &::after {
        content: '';
        position: absolute;
        top: 0; left: -60%;
        width: 40%; height: 100%;
        background: linear-gradient(100deg, transparent, rgba(255, 255, 255, 0.38), transparent);
        transform: skewX(-18deg);
        animation: hdSheen 6s ease-in-out infinite;
        pointer-events: none;
      }

      .header-content {
        position: relative;
        z-index: 1;
        display: flex;
        align-items: center;
        gap: 14px;
        justify-content: center;
        flex: 1;

        .trophy-orb {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.24);
          border: 1px solid rgba(255, 255, 255, 0.55);
          box-shadow: 0 4px 12px rgba(180, 83, 9, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          animation: orbPulse 3s ease-in-out infinite;
        }

        .trophy-icon {
          font-size: 1.7rem;
          width: 1.7rem;
          height: 1.7rem;
          color: #FFFFFF;
          filter: drop-shadow(0 2px 3px rgba(180, 83, 9, 0.5));
        }

        .dialog-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
          text-shadow: 0 2px 6px rgba(180, 83, 9, 0.4);
        }
      }

      .close-btn {
        position: absolute;
        z-index: 2;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.22);
        border: 1px solid rgba(255, 255, 255, 0.4);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 0;
        margin: 0;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.36);
          transform: translateY(-50%) rotate(90deg);
        }

        /* X come SVG inline: centrata dal flex del button, non dipende da padding Material o dal font delle icone */
        .close-x {
          display: block;
          flex-shrink: 0;
          width: 14px;
          height: 14px;
          pointer-events: none;
        }
      }
    }

    @keyframes hdSheen {
      0%, 55% { left: -60%; }
      100% { left: 140%; }
    }
    @keyframes orbPulse {
      0%, 100% { box-shadow: 0 4px 12px rgba(180, 83, 9, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 0 0 0 rgba(255, 255, 255, 0.45); }
      50% { box-shadow: 0 4px 12px rgba(180, 83, 9, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.55), 0 0 0 8px rgba(255, 255, 255, 0); }
    }

    .dialog-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      width: 100%;
      background: linear-gradient(180deg, #FFFBEF 0%, #FFFFFF 160px);

      /* Scrollbar personalizzata */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: #E5D9B6;
        border-radius: 3px;

        &:hover {
          background: #FFB300;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #E5D9B6 transparent;

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
    }

    /* ── Statistiche: riga di 4 riquadri dorati in cima ── */
    .stats-block { margin-bottom: 18px; }

    .section-label {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 10px;
      font-size: 0.66rem;
      font-weight: 700;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      color: #B45309;

      &::before, &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, rgba(180, 83, 9, 0.35));
      }
      &::after { transform: scaleX(-1); }
    }

    .stats-strip {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 8px;
    }

    .stat-tile {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 2px;
      padding: 11px 4px 9px;
      border-radius: 14px;
      background: linear-gradient(160deg, #FFFDF2, #FFF3C9);
      border: 1px solid rgba(255, 179, 0, 0.4);
      box-shadow: 0 3px 10px rgba(255, 160, 0, 0.14), inset 0 1px 0 #FFFFFF;
      box-sizing: border-box;
      min-width: 0;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
        color: #F59E0B;
      }

      .stat-number {
        font-size: 1.3rem;
        font-weight: 800;
        line-height: 1.1;
        background: linear-gradient(135deg, #B45309, #F59E0B);
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      .stat-label {
        font-size: 0.58rem;
        font-weight: 600;
        line-height: 1.15;
        letter-spacing: 0.03em;
        text-transform: uppercase;
        text-align: center;
        color: #8A6D2B;
        word-break: break-word;
      }
    }

    /* ── Card trofeo: medaglia a sinistra, dettagli a destra ── */
    .trophy-card {
      --tc-a: #FFD700;
      --tc-b: #E69A00;
      --tc-glow: rgba(255, 193, 7, 0.45);
      --tc-tint: rgba(255, 215, 0, 0.14);
      position: relative;
      display: flex;
      align-items: center;
      gap: 14px;
      margin: 0 0 12px 0;
      padding: 14px 16px 14px 18px;
      border-radius: 18px;
      border: 1px solid rgba(15, 23, 42, 0.06);
      background: linear-gradient(135deg, var(--tc-tint), #FFFFFF 58%);
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.07), inset 0 1px 0 #FFFFFF;
      box-sizing: border-box;
      overflow: hidden;
      animation: tcIn 0.5s cubic-bezier(0.2, 0.9, 0.3, 1.15) both;
      transition: transform 0.2s ease, box-shadow 0.25s ease;

      /* Barra colorata a sinistra */
      &::before {
        content: '';
        position: absolute;
        left: 0; top: 0; bottom: 0;
        width: 5px;
        background: linear-gradient(180deg, var(--tc-a), var(--tc-b));
      }

      /* Coppa sfumata sullo sfondo, a destra */
      &::after {
        content: '🏆';
        position: absolute;
        right: -6px; bottom: -16px;
        font-size: 5.2rem;
        line-height: 1;
        opacity: 0.07;
        transform: rotate(-12deg);
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 24px rgba(15, 23, 42, 0.12), inset 0 1px 0 #FFFFFF;
      }
      &:hover .tc-medal { transform: scale(1.06) rotate(-4deg); }

      &.pos-2 { --tc-a: #E0E6EA; --tc-b: #8FA1AE; --tc-glow: rgba(143, 161, 174, 0.5); --tc-tint: rgba(176, 190, 197, 0.16); }
      &.pos-3 { --tc-a: #F0B56F; --tc-b: #B5651D; --tc-glow: rgba(181, 101, 29, 0.42); --tc-tint: rgba(224, 169, 109, 0.16); }
      &.pos-n { --tc-a: #90CAF9; --tc-b: #1565C0; --tc-glow: rgba(21, 101, 192, 0.35); --tc-tint: rgba(79, 195, 247, 0.12); }
    }

    @keyframes tcIn {
      from { opacity: 0; transform: translateY(14px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    .tc-medal {
      flex-shrink: 0;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2.5px solid transparent;
      background:
        radial-gradient(circle at 30% 25%, #FFFFFF, #FFFDF7 70%) padding-box,
        linear-gradient(135deg, var(--tc-a), var(--tc-b)) border-box;
      box-shadow: 0 6px 16px var(--tc-glow), inset 0 -3px 6px rgba(0, 0, 0, 0.05);
      transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      position: relative;
      z-index: 1;
    }
    .tc-medal-emoji { font-size: 1.95rem; line-height: 1; }
    .pos-n .tc-medal-emoji { font-size: 1.15rem; font-weight: 800; color: var(--tc-b); }

    .tc-body { flex: 1; min-width: 0; position: relative; z-index: 1; }

    .tc-head {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 6px 8px;
      margin-bottom: 6px;
    }

    .tc-title {
      margin: 0;
      font-size: 1rem;
      font-weight: 700;
      color: #0A3D91;
      line-height: 1.25;
      word-break: break-word;
    }

    .tc-ed {
      padding: 1px 9px;
      border-radius: 999px;
      font-size: 0.66rem;
      font-weight: 700;
      letter-spacing: 0.02em;
      color: #475569;
      background: rgba(100, 116, 139, 0.12);
      white-space: nowrap;
    }

    .tc-pos {
      display: inline-block;
      margin-bottom: 8px;
      padding: 3px 12px;
      border-radius: 999px;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: #FFFFFF;
      background: linear-gradient(135deg, var(--tc-a), var(--tc-b));
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
      box-shadow: 0 3px 8px var(--tc-glow);
    }

    .tc-meta {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      gap: 4px;

      li {
        display: flex;
        align-items: center;
        gap: 7px;
        font-size: 0.78rem;
        font-weight: 500;
        color: #64748B;
        line-height: 1.3;
        word-break: break-word;
      }

      mat-icon {
        flex-shrink: 0;
        font-size: 15px;
        width: 15px;
        height: 15px;
        color: var(--tc-b);
      }
    }

    /* ── Badge storico ── */
    .badges-section {
      margin: 18px auto 0 auto;
      padding: 16px;
      background: linear-gradient(135deg, #FFFDF2, #FFFFFF);
      border-radius: 16px;
      border: 1px solid rgba(255, 179, 0, 0.35);
      box-shadow: 0 3px 10px rgba(255, 160, 0, 0.1);
      text-align: center;

      h3 {
        color: #0A3D91;
        font-weight: 600;
        font-size: 0.95rem;
        margin: 0;
      }
    }

    .badges-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      margin: 0 0 14px 0;
    }

    .badge-info-btn {
      width: 18px;
      height: 18px;
      flex-shrink: 0;
      padding: 0;
      border-radius: 50%;
      border: 1.5px solid #CBD5E1;
      background: none;
      color: #94A3B8;
      font-size: 0.66rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;

      &:hover, &:active { background: #0A3D91; border-color: #0A3D91; color: #fff; }
    }

    .badge-info-bubble {
      position: relative;
      margin: -4px 0 14px;
      padding: 10px 12px;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: 10px;
      color: #1E3A8A;
      font-size: 0.76rem;
      font-weight: 500;
      line-height: 1.5;
      text-align: left;
      animation: badgeBubbleIn 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background: #EFF6FF;
        border-left: 1px solid #BFDBFE;
        border-top: 1px solid #BFDBFE;
      }
    }

    @keyframes badgeBubbleIn {
      from { opacity: 0; transform: translateY(-4px); }
      to   { opacity: 1; transform: translateY(0); }
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
          .trophy-orb { width: 42px; height: 42px; }
          .trophy-icon { font-size: 1.5rem; width: 1.5rem; height: 1.5rem; }
          .dialog-title { font-size: 1.2rem; }
        }

        .close-btn {
          right: 16px;
          width: 30px;
          height: 30px;
        }
      }

      .dialog-content { padding: 16px; }
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
          gap: 10px;
          .trophy-orb { width: 38px; height: 38px; }
          .trophy-icon { font-size: 1.3rem; width: 1.3rem; height: 1.3rem; }
          .dialog-title { font-size: 1.05rem; letter-spacing: 0.3px; }
        }

        .close-btn {
          right: 14px;
          width: 28px;
          height: 28px;

          .close-x { width: 12px; height: 12px; }
        }
      }

      .dialog-content { padding: 12px; }

      .stats-strip { gap: 6px; }
      .stat-tile { padding: 9px 2px 8px; border-radius: 12px; }
      .stat-tile .stat-number { font-size: 1.1rem; }
      .stat-tile .stat-label { font-size: 0.52rem; }

      .trophy-card { gap: 11px; padding: 12px 12px 12px 15px; border-radius: 16px; }
      .tc-medal { width: 48px; height: 48px; }
      .tc-medal-emoji { font-size: 1.6rem; }
      .tc-title { font-size: 0.9rem; }
      .tc-meta li { font-size: 0.72rem; }
    }

    @media (prefers-reduced-motion: reduce) {
      .dialog-header::after, .trophy-orb, .trophy-card, .empty-emoji { animation: none; }
      .trophy-card, .tc-medal { transition: none; }
    }
  `]
})
export class AlboOroDialogComponent implements OnInit {
  hasTrofei = false;
  statistiche: any = null;
  isLoading = true;
  showBadgeInfo = false;

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

  get hasBadges(): boolean {
    return !!this.statistiche && (
      (this.statistiche.vittorie1v1 ?? 0) > 0 ||
      (this.statistiche.vittorieSurvivor ?? 0) > 0 ||
      (this.statistiche.vittorieCampionato ?? 0) > 0
    );
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
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule, MatSnackBarModule, TranslateModule, PlayerBadgesComponent],
  template: `
    <div class="modal-container">

      <!-- HEADER: Avatar (sinistra) + Nickname (destra) -->
      <div class="profile-header">
        <span class="ph-bubble ph-b1" aria-hidden="true"></span>
        <span class="ph-bubble ph-b2" aria-hidden="true"></span>
        <span class="ph-bubble ph-b3" aria-hidden="true"></span>
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
            <span class="chip-emoji-wrap"><span class="chip-emoji">⚽</span></span>
            <span class="chip-label">{{ 'COMMON.SOCCER' | translate }}</span>
            <span class="chip-value chip-value--set" *ngIf="userProfile.squadraCalcio">{{ userProfile.squadraCalcio }}</span>
            <span class="chip-value chip-value--empty" *ngIf="!userProfile.squadraCalcio">—</span>
          </button>
          <button class="chip" [class.chip--active]="activeSport === 'basket'" [class.chip--has]="userProfile.squadraBasket" (click)="setActiveSport('basket')">
            <span class="chip-check" *ngIf="userProfile.squadraBasket">✓</span>
            <span class="chip-emoji-wrap"><span class="chip-emoji">🏀</span></span>
            <span class="chip-label">{{ 'COMMON.BASKETBALL' | translate }}</span>
            <span class="chip-value chip-value--set" *ngIf="userProfile.squadraBasket">{{ userProfile.squadraBasket }}</span>
            <span class="chip-value chip-value--empty" *ngIf="!userProfile.squadraBasket">—</span>
          </button>
          <button class="chip" [class.chip--active]="activeSport === 'tennis'" [class.chip--has]="userProfile.tennista" (click)="setActiveSport('tennis')">
            <span class="chip-check" *ngIf="userProfile.tennista">✓</span>
            <span class="chip-emoji-wrap"><span class="chip-emoji">🎾</span></span>
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

      <!-- BADGE VINTI: sempre visibile, così l'utente sa che c'è un posto riservato
           anche prima di aver vinto qualcosa -->
      <div class="badges-section">
        <div class="badges-title-row">
          <h3 class="badges-title">{{ 'PROFILE.YOUR_BADGES' | translate }}</h3>
          <button type="button" class="badge-info-btn" (click)="showBadgeInfo = !showBadgeInfo" [attr.aria-label]="'BADGE.RULES_TITLE' | translate">ⓘ</button>
        </div>
        <div class="badge-info-bubble" *ngIf="showBadgeInfo">{{ 'BADGE.RULES_TEXT' | translate }}</div>
        <app-player-badges
          *ngIf="hasBadges"
          size="large"
          [vittorie1v1]="statistiche?.vittorie1v1"
          [vittorieSurvivor]="statistiche?.vittorieSurvivor"
          [vittorieCampionato]="statistiche?.vittorieCampionato">
        </app-player-badges>
        <div class="badges-placeholder" *ngIf="!hasBadges">
          <span class="badge-slot">⚔️</span>
          <span class="badge-slot">🛡️</span>
          <span class="badge-slot">🏆</span>
          <p class="badges-placeholder-text">{{ 'PROFILE.NO_BADGES_YET' | translate }}</p>
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

  @if (showMatchEgg) {
    <div class="match-egg-overlay"
         [class.lit]="matchEggLit"
         [class.extinguished]="matchEggExtinguished"
         (mousemove)="handleMatchMove($event)"
         (touchmove)="handleMatchMove($event)"
         (click)="handleMatchClick()">
      <div class="match-egg-scene">
        <div class="match-egg-match" [style.transform]="matchTransform">
          <div class="match-egg-smoke-container">
            <div class="match-egg-smoke match-egg-smoke-1"></div>
            <div class="match-egg-smoke match-egg-smoke-2"></div>
            <div class="match-egg-smoke match-egg-smoke-3"></div>
          </div>
          <div class="match-egg-flame-container">
            <div class="match-egg-flame"></div>
            <div class="match-egg-sparkles"></div>
          </div>
          <div class="match-egg-head"></div>
          <div class="match-egg-stick"></div>
        </div>
      </div>
      <button class="match-egg-close" (click)="onCloseMatchEgg($event)">✕</button>
      @if (matchEggMessage && matchEggMessageVisible) {
        <div class="match-egg-msg" [class.visible]="matchEggMessageVisible">
          <span class="match-egg-msg-text">{{ matchEggMessage }}</span>
        </div>
      }
    </div>
  }
  `,
  styles: [`
    :host { display: block; width: 100%; }
    * { box-sizing: border-box; }

    /* ─── CONTAINER ─── */
    .modal-container {
      background: #F4F7FC;
      border-radius: 22px;
      /* clip-path oltre a overflow:hidden: gli elementi animati (bolle, sweep) a volte
         vengono promossi su un layer GPU a parte e "sbordano" dall'angolo arrotondato
         se si affida solo a overflow:hidden. */
      clip-path: inset(0 round 22px);
      width: 100% !important;
      max-width: 100% !important;
      padding: 0 !important;
      font-family: 'Poppins', sans-serif;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 24px 60px rgba(10, 61, 145, 0.22);
    }

    /* ─── HEADER ─── */
    .profile-header {
      position: relative;
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 60%, #4FC3F7 100%);
      padding: 22px 20px 26px;
      display: flex;
      align-items: center;
      gap: 14px;
      overflow: hidden;
    }

    .ph-bubble {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.12);
      pointer-events: none;
    }
    .ph-b1 { width: 90px; height: 90px; right: -24px; top: -44px; }
    .ph-b2 { width: 46px; height: 46px; right: 64px; bottom: -26px; background: rgba(255, 255, 255, 0.08); }
    .ph-b3 { width: 22px; height: 22px; right: 18px; bottom: 10px; background: rgba(255, 255, 255, 0.16); }

    .avatar {
      width: 54px;
      height: 54px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      border: 2px solid rgba(255, 255, 255, 0.55);
      box-shadow: 0 0 0 3px rgba(255,255,255,0.2), 0 4px 14px rgba(4, 15, 46, 0.35);
      flex-shrink: 0;
      position: relative;
      z-index: 1;
      overflow: visible;
      cursor: pointer;
      touch-action: none;
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      -webkit-user-select: none;
      transition: transform 0.2s ease;

      &:hover { transform: scale(1.05); }
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
      position: relative;
      z-index: 1;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 4px;
      min-width: 0;
    }

    .close-btn {
      position: relative;
      z-index: 1;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      background: rgba(255, 255, 255, 0.14);
      border: 1.5px solid rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;

      mat-icon { color: #fff; font-size: 17px; width: 17px; height: 17px; pointer-events: none; }
      &:hover, &:active { background: rgba(255, 255, 255, 0.26); border-color: rgba(255, 255, 255, 0.55); transform: rotate(90deg); }
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
        background: rgba(255,255,255,0.24);
        border-color: rgba(255,255,255,0.75);
        box-shadow: 0 0 0 3px rgba(255,255,255,0.14);
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
      gap: 5px;
      padding: 12px 6px 10px;
      border-radius: 16px;
      border: none;
      background: #fff;
      cursor: pointer;
      transition: all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
      min-height: 78px;
      box-shadow: 0 2px 8px rgba(15, 23, 42, 0.07);
      -webkit-tap-highlight-color: transparent;

      &:active { transform: scale(0.97); }

      &.chip--active {
        background: #EBF2FF;
        transform: translateY(-2px);
        box-shadow: 0 0 0 2px #1565C0, 0 6px 16px rgba(10,61,145,0.18);
      }

      &.chip--has:not(.chip--active) {
        box-shadow: 0 0 0 2px #7CB9F4, 0 2px 8px rgba(15, 23, 42, 0.07);
      }

      &.chip--active.chip--has {
        background: #E8F0FE;
        box-shadow: 0 0 0 2px #0A3D91, 0 8px 18px rgba(10,61,145,0.2);
      }
    }

    .chip-check {
      position: absolute;
      top: 6px;
      right: 8px;
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background: #16A34A;
      font-size: 0.52rem;
      font-weight: 800;
      color: #fff;
      box-shadow: 0 1px 3px rgba(22, 163, 74, 0.4);
    }

    .chip-emoji-wrap {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, rgba(10, 61, 145, 0.08), rgba(79, 195, 247, 0.14));
      transition: transform 0.2s ease, background 0.2s ease;

      .chip--active & { background: linear-gradient(135deg, rgba(10, 61, 145, 0.14), rgba(79, 195, 247, 0.24)); }
      .chip:hover & { transform: scale(1.08) rotate(-6deg); }
    }

    .chip-emoji { font-size: 1.2rem; line-height: 1; }

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

    /* ─── BADGE VINTI (sempre visibile, anche vuoto) ─── */
    .badges-section {
      margin: 14px 16px 0;
      padding: 16px;
      background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
      border: 1px solid #E5EAF2;
      border-radius: 14px;
      text-align: center;
    }

    .badges-title-row {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      margin: 0 0 12px;
    }

    .badges-title {
      margin: 0;
      font-size: 0.68rem;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.6px;
    }

    .badge-info-btn {
      width: 17px;
      height: 17px;
      flex-shrink: 0;
      padding: 0;
      border-radius: 50%;
      border: 1.5px solid #CBD5E1;
      background: none;
      color: #94A3B8;
      font-size: 0.62rem;
      line-height: 1;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      -webkit-tap-highlight-color: transparent;

      &:hover, &:active { background: #0A3D91; border-color: #0A3D91; color: #fff; }
    }

    .badge-info-bubble {
      position: relative;
      margin: -2px 0 14px;
      padding: 10px 12px;
      background: #EFF6FF;
      border: 1px solid #BFDBFE;
      border-radius: 10px;
      color: #1E3A8A;
      font-size: 0.72rem;
      font-weight: 500;
      line-height: 1.5;
      text-align: left;
      animation: fadeIn 0.2s ease;

      &::before {
        content: '';
        position: absolute;
        top: -6px;
        left: 50%;
        transform: translateX(-50%) rotate(45deg);
        width: 10px;
        height: 10px;
        background: #EFF6FF;
        border-left: 1px solid #BFDBFE;
        border-top: 1px solid #BFDBFE;
      }
    }

    .badges-placeholder {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }

    .badge-slot {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      font-size: 1.15rem;
      background: #F1F5F9;
      border: 2px dashed #CBD5E1;
      filter: grayscale(1);
      opacity: 0.55;
    }

    .badges-placeholder-text {
      flex-basis: 100%;
      margin: 6px 0 0;
      font-size: 0.72rem;
      font-weight: 500;
      color: #94A3B8;
      line-height: 1.4;
    }

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
      position: relative;
      display: block;
      width: 100%;
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 14px;
      border-radius: 14px;
      cursor: pointer;
      font-size: 0.82rem;
      border: none;
      overflow: hidden;
      background: linear-gradient(135deg, #0A3D91, #1565C0, #4FC3F7);
      background-size: 200% 200%;
      color: #fff;
      box-shadow: 0 6px 18px rgba(10,61,145,0.3);
      transition: transform 0.2s ease, box-shadow 0.2s ease, opacity 0.2s ease;
      -webkit-tap-highlight-color: transparent;

      &::before {
        content: '';
        position: absolute;
        top: 0; left: -75%;
        width: 45%; height: 100%;
        background: linear-gradient(120deg, transparent 0%, rgba(255,255,255,0.35) 50%, transparent 100%);
        animation: btnPrimarySheen 3.2s ease-in-out infinite;
      }

      &:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 24px rgba(10,61,145,0.36); }
      &:active:not(:disabled) { transform: translateY(0); box-shadow: 0 3px 10px rgba(10,61,145,0.25); }
      &:disabled { opacity: 0.4; cursor: not-allowed; box-shadow: none; &::before { display: none; } }
    }

    @keyframes btnPrimarySheen {
      0%, 40%  { left: -75%; }
      100%     { left: 130%; }
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
      .chip { min-height: 70px; }
      .chip-emoji-wrap { width: 30px; height: 30px; }
      .actions-section { padding: 12px; }
      .danger-zone { padding: 0 12px 12px; }
    }

    @media (max-width: 360px) {
      .profile-header { padding: 12px 12px 16px; gap: 10px; }
      .avatar { width: 42px; height: 42px; }
      .sport-chips { gap: 6px; }
      .chip { min-height: 62px; padding: 8px 4px; }
      .chip-emoji-wrap { width: 26px; height: 26px; }
      .chip-emoji { font-size: 1.05rem; }
      .chip-label { font-size: 0.54rem; }
    }

    /* ─── MATCH EASTER EGG ─── */
    .match-egg-overlay {
      position: fixed;
      top: 0; left: 0; right: 0; bottom: 0;
      z-index: 99999;
      background-color: rgba(18, 18, 18, 0.78);
      color: rgba(255,255,255,0.5);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      overflow: hidden;
      touch-action: none;
      cursor: crosshair;
    }
    .match-egg-overlay::before {
      content: '';
      position: absolute;
      top: 0; left: 0; right: 0; bottom: 0;
      background: radial-gradient(circle at 50% 40%, rgba(74,37,17,0.45) 0%, transparent 65%);
      opacity: 0;
      transition: opacity 0.5s ease;
      z-index: -1;
      pointer-events: none;
    }
    .match-egg-overlay.lit::before { opacity: 1; }
    .match-egg-overlay.lit { color: rgba(255,255,255,0.85); }
    .match-egg-instruction {
      position: absolute;
      top: 15%;
      font-size: 1.2rem;
      font-weight: 300;
      letter-spacing: 2px;
      text-transform: uppercase;
      user-select: none;
      pointer-events: none;
      transition: opacity 0.5s ease;
      color: inherit;
      text-shadow: none;
    }
    .match-egg-scene {
      position: relative;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .match-egg-match {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 100px;
      z-index: 10;
    }
    .match-egg-head {
      width: 32px; height: 48px;
      background: linear-gradient(135deg, #a31515, #5e0b0b);
      border-radius: 40% 40% 30% 30%;
      margin-bottom: -10px;
      z-index: 2;
      box-shadow: inset -3px -3px 6px rgba(0,0,0,0.4), inset 3px 3px 6px rgba(255,255,255,0.1);
      transition: background 0.3s ease;
    }
    .match-egg-overlay.lit .match-egg-head,
    .match-egg-overlay.extinguished .match-egg-head {
      background: linear-gradient(135deg, #111, #000);
      box-shadow: inset -3px -3px 6px rgba(0,0,0,0.8), inset 2px 2px 4px rgba(255,255,255,0.05);
    }
    .match-egg-stick {
      width: 18px; height: 250px;
      background: linear-gradient(90deg, #d2a679, #e6c299 30%, #b88654 80%, #8c6239);
      border-radius: 2px 2px 8px 8px;
      z-index: 1;
      box-shadow: inset -2px 0 5px rgba(0,0,0,0.2), 5px 5px 15px rgba(0,0,0,0.5);
      position: relative;
      overflow: hidden;
    }
    .match-egg-stick::after {
      content: '';
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 0%;
      background: linear-gradient(to bottom, #111 0%, #333 70%, transparent 100%);
      transition: height 0s;
    }
    .match-egg-overlay.lit .match-egg-stick::after {
      height: 60%;
      transition: height 15s linear;
    }
    .match-egg-overlay.extinguished .match-egg-stick::after {
      height: 60%;
      transition: none;
    }
    .match-egg-flame-container {
      position: absolute;
      top: 10px; left: 50%;
      transform: translateX(-50%);
      width: 100px; height: 150px;
      opacity: 0;
      pointer-events: none;
      z-index: 3;
      transition: opacity 0.2s ease, transform 0s;
      display: flex;
      justify-content: center;
      align-items: flex-end;
    }
    .match-egg-overlay.lit .match-egg-flame-container {
      opacity: 1;
      transform: translateX(-50%) translateY(140px);
      transition: opacity 0.2s ease, transform 15s linear;
    }
    .match-egg-flame {
      width: 60px; height: 120px;
      background: radial-gradient(ellipse at bottom, #fff 5%, #ffeb99 20%, #ff9900 50%, #ff3300 80%, transparent 100%);
      border-radius: 50% 50% 20% 20%;
      box-shadow: 0 -10px 40px #ff3300, 0 0 80px #ff9900;
      animation: matchFlicker 0.1s infinite alternate, matchSway 3s ease-in-out infinite alternate;
      transform-origin: bottom center;
      filter: blur(2px);
    }
    .match-egg-sparkles {
      position: absolute;
      bottom: 20px;
      width: 10px; height: 10px;
      border-radius: 50%;
    }
    .match-egg-overlay.lit .match-egg-sparkles {
      animation: matchExplode 0.5s ease-out forwards;
    }
    .match-egg-smoke-container {
      position: absolute;
      top: 60px; left: 50%;
      transform: translateX(-50%);
      width: 50px; height: 50px;
      pointer-events: none;
      z-index: 5;
      display: flex;
      justify-content: center;
      align-items: center;
    }
    .match-egg-smoke {
      position: absolute;
      width: 30px; height: 30px;
      background: radial-gradient(circle, rgba(180,180,180,0.4) 0%, transparent 70%);
      border-radius: 50%;
      filter: blur(5px);
      opacity: 0;
    }
    .match-egg-overlay.extinguished .match-egg-smoke-1 { animation: matchSmokeRise 2.5s ease-out forwards; }
    .match-egg-overlay.extinguished .match-egg-smoke-2 { animation: matchSmokeRise 3s ease-out 0.3s forwards; }
    .match-egg-overlay.extinguished .match-egg-smoke-3 { animation: matchSmokeRise 3.5s ease-out 0.6s forwards; }
    .match-egg-close {
      position: absolute;
      top: 20px; right: 20px;
      background: rgba(255,255,255,0.1);
      border: 1px solid rgba(255,255,255,0.3);
      color: rgba(255,255,255,0.75);
      border-radius: 50%;
      width: 36px; height: 36px;
      font-size: 1rem;
      cursor: pointer;
      z-index: 100;
      transition: background 0.2s;
    }
    .match-egg-close:hover { background: rgba(255,255,255,0.22); }
    .match-egg-msg {
      position: absolute;
      top: 12%; left: 50%; transform: translateX(-50%);
      display: flex; flex-direction: column; align-items: center; gap: 4px;
      text-align: center;
      opacity: 0; transition: opacity 0.6s ease;
      pointer-events: none;
      width: 90%; max-width: 340px;
    }
    .match-egg-msg.visible { opacity: 1; }
    .match-egg-msg-text {
      font-size: 1.05rem; font-weight: 700; color: #fff;
      text-shadow: 0 0 12px rgba(255,120,0,0.9), 0 2px 6px rgba(0,0,0,0.6);
      letter-spacing: 0.5px; text-align: center;
      line-height: 1.4; word-break: break-word;
    }
    @media (max-width: 480px) {
      .match-egg-msg { top: 10%; width: 88%; }
      .match-egg-msg-text { font-size: 0.9rem; letter-spacing: 0.3px; }
    }
    @media (max-width: 360px) {
      .match-egg-msg { top: 8%; width: 85%; }
      .match-egg-msg-text { font-size: 0.8rem; }
    }
    @keyframes matchFlicker {
      0% { transform: scaleX(0.98) scaleY(1.02); opacity: 0.9; }
      100% { transform: scaleX(1.02) scaleY(0.98); opacity: 1; }
    }
    @keyframes matchSway {
      0% { transform: rotate(-5deg); }
      100% { transform: rotate(5deg); }
    }
    @keyframes matchExplode {
      0% { box-shadow: 0 0 0 #fff, 0 0 0 #ff9900, 0 0 0 #ff3300; }
      50% { box-shadow: -20px -30px 10px #ff9900, 30px -40px 15px #ff3300, -10px -60px 5px #fff; }
      100% { box-shadow: -40px -60px 20px transparent, 50px -80px 30px transparent, -20px -100px 10px transparent; }
    }
    @keyframes matchSmokeRise {
      0% { transform: translateY(0) scale(1) translateX(0); opacity: 0.8; }
      50% { transform: translateY(-100px) scale(2.5) translateX(-20px); opacity: 0.5; }
      100% { transform: translateY(-250px) scale(4) translateX(20px); opacity: 0; }
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

  // ── Match easter egg state ─────────────────────────────────────────────────
  showMatchEgg = false;
  matchEggLit = false;
  matchEggExtinguished = false;
  matchEggInstructionOpacity = '0';
  matchTransform = 'translate(0px) rotate(0deg)';
  matchEggMessage: string | null = null;
  matchEggMessageVisible = false;
  private readonly _matchEggMessages: { it: string; en: string }[] = [
    { it: 'Sei letteralmente in fiamme. Qualcuno chiami i pompieri. 🔥', en: 'You\'re literally on fire. Someone call 911. 🔥' },
    { it: 'Un genio assoluto. Tua madre sarebbe fiera. 👏', en: 'An absolute genius. Your mother would be proud. 👏' },
    { it: 'admin_fire? Ci hai pensato a lungo, eh? 🤔', en: 'admin_fire? That took some serious brainpower. 🤔' },
    { it: 'Complimenti. Ora torna a perdere come al solito. 😈', en: 'Congrats. Now go back to losing like usual. 😈' },
    { it: 'Hai trovato il segreto. Peccato non serva assolutamente a niente. 💀', en: 'You found the secret. Too bad it\'s completely useless. 💀' },
    { it: 'Secondi preziosi della tua vita sprecati per accendere un cerino virtuale. 🎉', en: 'Precious seconds of your life wasted lighting a virtual match. 🎉' },
    { it: 'Sì, funziona. No, non sblocca niente. Vai a fare qualcosa di utile. 💼', en: 'Yes, it works. No, it unlocks nothing. Go touch grass. 💼' },
    { it: 'Aspettavi una ricompensa? Eccola: 👋', en: 'Were you expecting a reward? Here it is: 👋' },
    { it: 'Riesci ad accendere un cerino digitale. Candidati al Nobel. 🥇', en: 'You lit a digital match. Nobel Prize incoming. 🥇' },
    { it: 'Non hai niente di meglio da fare? Nemmeno noi. 🤝', en: 'Nothing better to do? Neither do we. 🤝' },
    { it: 'Breaking news: utente accende fiammifero, guadagna zero punti. 📰', en: 'Breaking: user lights match, gains zero points. 📰' },
    { it: 'Sei on fire! Solo in senso figurato però. E letterale. Però basta. 🔥', en: 'You\'re on fire! Figuratively. And literally. But that\'s it. 🔥' },
    { it: 'Fiammifero acceso. QI: invariato. 🧠', en: 'Match lit. IQ: unchanged. 🧠' },
    { it: 'Hacker del profilo rilevato. Livello di minaccia: ridicolo. 👨‍💻', en: 'Profile hacker detected. Threat level: laughable. 👨‍💻' },
    { it: 'Potevi semplicemente giocare. Ma hai scelto questo. Rispetto. 🤷', en: 'You could\'ve just played the game. You chose this. Respect. 🤷' },
    { it: 'Easter egg trovato. Miglioramento della vita: 0%. 📊', en: 'Easter egg found. Life improvement: 0%. 📊' },
    { it: 'Sei speciale. Nel senso che nessun altro ha tempo per queste cose. ✨', en: 'You\'re special. As in, nobody else has time for this. ✨' },
    { it: 'Il fuoco è bello, vero? Pittoresco. Ora smettila e vai a giocare. 🎮', en: 'Fire is pretty, right? Lovely. Now stop and go play. 🎮' },
    { it: 'Tipo, c\'era tutto un campionato da seguire. Ma ok, il cerino. 😂', en: 'There was a whole championship to follow. But sure, the match. 😂' },
    { it: 'Se lo racconti agli amici, nessuno ti crederà. E fanno bene. 😏', en: 'If you tell your friends, nobody will believe you. Good call on their part. 😏' },
  ];
  private _matchIsLit = false;
  private _matchHeat = 0;
  private _matchLastTime = 0;
  private _matchLastX = 0;
  private _matchLastY = 0;
  private _matchLastStrikeTime = 0;
  private _matchResetTimeout: ReturnType<typeof setTimeout> | null = null;
  private _matchAudioCtx: AudioContext | null = null;
  private _matchFireNoiseSource: AudioBufferSourceNode | null = null;
  private _matchFireGainNode: GainNode | null = null;

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

  statistiche: any = null;
  showBadgeInfo = false;

  constructor(
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router,
    private giocatoreService: GiocatoreService,
    private squadraService: SquadraService,
    private trofeiService: TrofeiService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadAllSquadre();
    this.loadStatisticheTrofei();
  }

  private loadStatisticheTrofei(): void {
    this.trofeiService.getMieiTrofei().subscribe({
      next: (stats) => { this.statistiche = stats; },
      error: () => { /* il posto per i badge resta comunque visibile, con il placeholder */ }
    });
  }

  get hasBadges(): boolean {
    return !!this.statistiche && (
      (this.statistiche.vittorie1v1 ?? 0) > 0 ||
      (this.statistiche.vittorieSurvivor ?? 0) > 0 ||
      (this.statistiche.vittorieCampionato ?? 0) > 0
    );
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
    // Easter egg: se il nickname è "admin_fire" lancia il cerino
    if (this.userProfile.nickname.trim().toUpperCase() === 'ADMIN_FIRE') {
      this.openMatchEgg();
      return;
    }
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

      // Tasto chiudi: usa 'click' (affidabile sia desktop che mobile)
      closeBtn.addEventListener('click', dismiss, { once: true });

    } catch (err) {
      console.error('[EasterEgg] VFX error:', err);
    }
  }

  // ── Match Easter Egg ─────────────────────────────────────────────────────

  openMatchEgg(): void {
    this.showMatchEgg = true;
    this._matchIsLit = false;
    this._matchHeat = 0;
    this.matchEggLit = false;
    this.matchEggExtinguished = false;
    this.matchEggInstructionOpacity = '0';
    this.matchTransform = 'translate(0px) rotate(0deg)';
    this._matchLastTime = 0;
  }

  closeMatchEgg(): void {
    this.showMatchEgg = false;
    this._matchIsLit = false;
    this.matchEggLit = false;
    this.matchEggExtinguished = false;
    this._matchHeat = 0;
    this.matchEggInstructionOpacity = '0';
    this.matchEggMessage = null;
    this.matchEggMessageVisible = false;
    if (this._matchResetTimeout) { clearTimeout(this._matchResetTimeout); this._matchResetTimeout = null; }
    this._matchStopFireSound();
  }

  onCloseMatchEgg(e: MouseEvent): void {
    e.stopPropagation();
    this.closeMatchEgg();
  }

  handleMatchMove(e: MouseEvent | TouchEvent): void {
    if (this._matchIsLit) return;
    if (this.matchEggExtinguished) {
      this.matchEggExtinguished = false;
      if (this._matchResetTimeout) { clearTimeout(this._matchResetTimeout); this._matchResetTimeout = null; }
    }
    const pos = this._matchPos(e);
    const currentTime = Date.now();
    if (this._matchLastTime !== 0) {
      const deltaTime = currentTime - this._matchLastTime;
      if (deltaTime > 0) {
        const dx = pos.x - this._matchLastX;
        const dy = pos.y - this._matchLastY;
        const speed = Math.sqrt(dx * dx + dy * dy) / deltaTime;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const isOverMatch = Math.abs(pos.x - centerX) < 150 && Math.abs(pos.y - centerY) < 250;
        if (isOverMatch && speed > 0.5) {
          this._matchHeat += speed;
          if (currentTime - this._matchLastStrikeTime > 80) {
            this._matchPlayStrikeSound(speed);
            this._matchLastStrikeTime = currentTime;
          }
          const shakeX = (Math.random() - 0.5) * Math.min(speed * 2, 10);
          this.matchTransform = `translateX(${shakeX}px) rotate(${shakeX / 2}deg)`;
          if (this._matchHeat > 30) { this._matchIgnite(); }
        } else {
          this._matchHeat = Math.max(0, this._matchHeat - 2);
          if (this._matchHeat === 0) { this.matchTransform = 'translate(0px) rotate(0deg)'; }
        }
      }
    }
    this._matchLastX = pos.x;
    this._matchLastY = pos.y;
    this._matchLastTime = currentTime;
  }

  handleMatchClick(): void {
    this._matchInitAudio();
    if (this._matchIsLit) {
      this._matchIsLit = false;
      this._matchHeat = 0;
      this.matchEggLit = false;
      this.matchEggExtinguished = true;
      this._matchStopFireSound();
      this._matchPlayHissSound();
      if (this._matchResetTimeout) { clearTimeout(this._matchResetTimeout); }
      this._matchResetTimeout = setTimeout(() => { this.matchEggExtinguished = false; }, 4000);
    }
  }

  private _matchIgnite(): void {
    this._matchIsLit = true;
    this.matchEggExtinguished = false;
    this.matchEggLit = true;
    this.matchTransform = 'translate(0px) rotate(0deg)';
    this.matchEggInstructionOpacity = '0';
    this._matchPlayIgniteSound();
    // Messaggio sarcastico random nella lingua corrente
    const idx = Math.floor(Math.random() * this._matchEggMessages.length);
    const picked = this._matchEggMessages[idx];
    const lang = (this.translate.currentLang || this.translate.defaultLang || 'it');
    this.matchEggMessage = lang.startsWith('it') ? picked.it : picked.en;
    setTimeout(() => { this.matchEggMessageVisible = true; }, 800);
    setTimeout(() => { this.matchEggMessageVisible = false; }, 5000);
    if (this._matchResetTimeout) { clearTimeout(this._matchResetTimeout); }
    this._matchResetTimeout = setTimeout(() => { this.closeMatchEgg(); }, 15000);
  }

  private _matchPos(e: MouseEvent | TouchEvent): { x: number; y: number } {
    if ('touches' in e && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: (e as MouseEvent).clientX, y: (e as MouseEvent).clientY };
  }

  private _matchInitAudio(): void {
    if (!this._matchAudioCtx) {
      const AudioCtx = (window.AudioContext || (window as any).webkitAudioContext) as typeof AudioContext;
      this._matchAudioCtx = new AudioCtx();
    }
    if (this._matchAudioCtx.state === 'suspended') { this._matchAudioCtx.resume(); }
  }

  private _matchPlayStrikeSound(intensity: number): void {
    this._matchInitAudio();
    if (!this._matchAudioCtx) return;
    const sr = this._matchAudioCtx.sampleRate;
    const buf = this._matchAudioCtx.createBuffer(1, Math.floor(sr * 0.05), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    const src = this._matchAudioCtx.createBufferSource();
    src.buffer = buf;
    const filt = this._matchAudioCtx.createBiquadFilter();
    filt.type = 'bandpass';
    filt.frequency.value = 800 + Math.min(intensity, 5) * 400;
    const gain = this._matchAudioCtx.createGain();
    gain.gain.setValueAtTime(0.3, this._matchAudioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this._matchAudioCtx.currentTime + 0.04);
    src.connect(filt); filt.connect(gain); gain.connect(this._matchAudioCtx.destination);
    src.start();
  }

  private _matchPlayIgniteSound(): void {
    this._matchInitAudio();
    if (!this._matchAudioCtx) return;
    const ctx = this._matchAudioCtx;
    const osc = ctx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(150, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(10, ctx.currentTime + 0.5);
    const oscGain = ctx.createGain();
    oscGain.gain.setValueAtTime(1, ctx.currentTime);
    oscGain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.connect(oscGain); oscGain.connect(ctx.destination);
    osc.start(); osc.stop(ctx.currentTime + 0.5);
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * 2), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    this._matchFireNoiseSource = ctx.createBufferSource();
    this._matchFireNoiseSource.buffer = buf;
    this._matchFireNoiseSource.loop = true;
    const filt = ctx.createBiquadFilter();
    filt.type = 'lowpass'; filt.frequency.value = 300;
    this._matchFireGainNode = ctx.createGain();
    this._matchFireGainNode.gain.setValueAtTime(0, ctx.currentTime);
    this._matchFireGainNode.gain.linearRampToValueAtTime(0.4, ctx.currentTime + 1);
    this._matchFireNoiseSource.connect(filt); filt.connect(this._matchFireGainNode);
    this._matchFireGainNode.connect(ctx.destination);
    this._matchFireNoiseSource.start();
  }

  private _matchPlayHissSound(): void {
    this._matchInitAudio();
    if (!this._matchAudioCtx) return;
    const ctx = this._matchAudioCtx;
    const sr = ctx.sampleRate;
    const buf = ctx.createBuffer(1, Math.floor(sr * 0.3), sr);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) { data[i] = Math.random() * 2 - 1; }
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const filt = ctx.createBiquadFilter();
    filt.type = 'highpass'; filt.frequency.value = 2000;
    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0.3, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    src.connect(filt); filt.connect(gain); gain.connect(ctx.destination);
    src.start();
  }

  private _matchStopFireSound(): void {
    if (this._matchFireNoiseSource && this._matchFireGainNode && this._matchAudioCtx) {
      this._matchFireGainNode.gain.linearRampToValueAtTime(0, this._matchAudioCtx.currentTime + 0.3);
      setTimeout(() => {
        if (this._matchFireNoiseSource) { this._matchFireNoiseSource.stop(); this._matchFireNoiseSource = null; }
      }, 300);
    }
  }

  ngOnDestroy(): void {
    this._clearEasterEggProgress();
    if (this._eggVfx) { try { this._eggVfx.destroy(); } catch (_) {} this._eggVfx = null; }
    if (this._eggOverlay)  { this._eggOverlay.remove();  this._eggOverlay  = null; }
    this.closeMatchEgg();
    if (this._matchAudioCtx) { this._matchAudioCtx.close(); this._matchAudioCtx = null; }
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
          <span class="banner-icon-wrap"><mat-icon class="banner-icon">article</mat-icon></span>
          <span class="banner-text">{{ 'BANNER.RULES' | translate }}</span>
        </button>

        <button class="banner-item banner-item--trophy" (click)="openAlboOro()">
          <span class="banner-icon-wrap"><mat-icon class="banner-icon trophy">emoji_events</mat-icon></span>
          <span class="banner-text">{{ 'BANNER.TROPHIES' | translate }}</span>
        </button>

        <button class="banner-item" (click)="openProfilo()">
          <span class="banner-icon-wrap"><mat-icon class="banner-icon">person</mat-icon></span>
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
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 18px 8px 10px;
      background: linear-gradient(135deg, #FFFFFF, #FAFBFF);
      border-radius: 14px;
      box-shadow: 0 2px 8px rgba(10, 61, 145, 0.08);
      border: 1px solid #E5EAF2;
      cursor: pointer;
      overflow: hidden;
      transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
      height: 48px;
      flex: 1;
      justify-content: center;
      min-width: 0;
      font: inherit;
      -webkit-tap-highlight-color: transparent;

      /* Riflesso di luce che attraversa la pillola al passaggio del mouse */
      &::before {
        content: '';
        position: absolute;
        top: 0; left: -60%;
        width: 40%; height: 100%;
        background: linear-gradient(115deg, transparent, rgba(79, 195, 247, 0.22), transparent);
        transition: left 0.55s ease;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 20px rgba(10, 61, 145, 0.16);
        border-color: rgba(79, 195, 247, 0.5);

        &::before { left: 130%; }

        .banner-icon-wrap {
          transform: scale(1.08) rotate(-4deg);
          background: linear-gradient(135deg, rgba(10, 61, 145, 0.16), rgba(79, 195, 247, 0.28));
        }

        &.banner-item--trophy .banner-icon-wrap {
          background: linear-gradient(135deg, rgba(255, 165, 0, 0.2), rgba(255, 215, 0, 0.3));
        }

        .banner-text {
          color: #0A3D91;
        }
      }

      &:active { transform: translateY(0) scale(0.98); }

      .banner-icon-wrap {
        flex-shrink: 0;
        width: 30px;
        height: 30px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(10, 61, 145, 0.08), rgba(79, 195, 247, 0.16));
        transition: all 0.25s ease;
      }

      .banner-icon {
        font-size: 1.15rem;
        width: 1.15rem;
        height: 1.15rem;
        color: #0A3D91;
        transition: all 0.25s ease;
        flex-shrink: 0;

        &.trophy {
          color: #FFA500;
        }
      }

      .banner-text {
        color: #6B7280;
        font-weight: 600;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        transition: all 0.25s ease;
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
        padding: 6px 12px 6px 6px;
        height: 42px;

        .banner-icon-wrap {
          width: 26px;
          height: 26px;
        }

        .banner-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
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
        padding: 5px 8px 5px 5px;
        gap: 7px;
        flex: 1;
        justify-content: center;

        .banner-text {
          font-size: 0.6rem;
          letter-spacing: 0.2px;
        }

        .banner-icon-wrap {
          width: 24px;
          height: 24px;
        }

        .banner-icon {
          font-size: 0.92rem;
          width: 0.92rem;
          height: 0.92rem;
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
        padding: 4px 6px 4px 4px;
        gap: 5px;

        .banner-text {
          font-size: 0.55rem;
          letter-spacing: 0.1px;
        }

        .banner-icon-wrap {
          width: 22px;
          height: 22px;
        }

        .banner-icon {
          font-size: 0.85rem;
          width: 0.85rem;
          height: 0.85rem;
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
