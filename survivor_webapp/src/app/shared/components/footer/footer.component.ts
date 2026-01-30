import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { LanguageService } from '../../../core/services/language.service';
import { FaqDialogComponent } from '../faq-dialog/faq-dialog.component';

// DIALOG CONTATTI
@Component({
  selector: 'app-contatti-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">email</mat-icon>
        <span class="value">{{ 'DIALOGS.CONTACT_TITLE' | translate }}</span>
      </h2>
      <div class="content-section">
        <p class="intro-text">{{ 'DIALOGS.CONTACT_INTRO' | translate }}</p>
        <a href="mailto:fantasurvivorddl@gmail.com" class="email-link">
          <mat-icon>mail_outline</mat-icon>
          <span>fantasurvivorddl&#64;gmail.com</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 85vw;
      max-width: 500px;
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
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px 0;
    }
    .intro-text {
      color: #6B7280;
      font-size: 0.95rem;
      margin-bottom: 24px;
      max-width: 300px;
    }
    .email-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 20px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 10px;
      font-weight: 600;
      font-size: 0.95rem;
      transition: all 0.3s ease;
      mat-icon { font-size: 18px; width: 18px; height: 18px; }
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(10, 61, 145, 0.3);
      }
    }
  `]
})
export class ContattiDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG TERMINI E CONDIZIONI
@Component({
  selector: 'app-termini-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">gavel</mat-icon>
        <span class="value">{{ 'DIALOGS.TERMS_TITLE' | translate }}</span>
      </h2>
      <div class="content-section">
        <h3>{{ 'DIALOGS.TERMS_HEADING' | translate }}</h3>
        <p class="subtitle">{{ 'DIALOGS.TERMS_SUBTITLE' | translate }}</p>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_1_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_1_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_2_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_2_TEXT_1' | translate }}</p>
          <p>{{ 'DIALOGS.TERMS_2_TEXT_2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_3_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_3_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_4_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_4_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_5_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_5_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_6_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_6_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_7_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_7_TEXT_1' | translate }}</p>
          <p>{{ 'DIALOGS.TERMS_7_TEXT_2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_8_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_8_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_9_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_9_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_10_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_10_TEXT' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'DIALOGS.TERMS_11_TITLE' | translate }}</h4>
          <p>{{ 'DIALOGS.TERMS_11_TEXT' | translate }} <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
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
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        margin-bottom: 24px;
      }
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;
          &:hover { text-decoration: underline; }
        }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .section h4 { font-size: 0.9rem; }
      .section p { font-size: 0.85rem; }
    }
  `]
})
export class TerminiDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG PRIVACY POLICY
@Component({
  selector: 'app-privacy-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">security</mat-icon>
        <span class="value">{{ 'DIALOGS.PRIVACY_TITLE' | translate }}</span>
      </h2>
      <div class="content-section">
        <h3>{{ 'DIALOGS.PRIVACY_HEADING' | translate }}</h3>
        <p class="subtitle">{{ 'DIALOGS.PRIVACY_SUBTITLE' | translate }}</p>
        <p class="intro-text">{{ 'DIALOGS.PRIVACY_INTRO' | translate }}</p>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_1_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_1_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_1_P2' | translate }} <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_2_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_2_INTRO' | translate }}</p>
          <ul>
            <li>{{ 'PRIVACY.SECTION_2_L1' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_2_L2' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_2_L3' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_2_L4' | translate }}</li>
          </ul>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_3_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_3_INTRO' | translate }}</p>
          <ul>
            <li>{{ 'PRIVACY.SECTION_3_L1' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_3_L2' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_3_L3' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_3_L4' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_3_L5' | translate }}</li>
          </ul>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_4_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_4_INTRO' | translate }}</p>
          <ul>
            <li>{{ 'PRIVACY.SECTION_4_L1' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_4_L2' | translate }}</li>
          </ul>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_5_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_5_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_5_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_6_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_6_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_6_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_7_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_7_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_7_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_8_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_8_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_8_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_9_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_9_INTRO' | translate }}</p>
          <ul>
            <li>{{ 'PRIVACY.SECTION_9_L1' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_9_L2' | translate }}</li>
            <li>{{ 'PRIVACY.SECTION_9_L3' | translate }}</li>
          </ul>
          <p>{{ 'PRIVACY.SECTION_9_P' | translate }} <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_10_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_10_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_10_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_11_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_11_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_11_P2' | translate }}</p>
        </div>

        <div class="section">
          <h4>{{ 'PRIVACY.SECTION_12_TITLE' | translate }}</h4>
          <p>{{ 'PRIVACY.SECTION_12_P1' | translate }}</p>
          <p>{{ 'PRIVACY.SECTION_12_P2' | translate }}</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
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
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        margin-bottom: 16px;
      }
      .intro-text {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 24px;
        text-align: center;
        padding: 0 16px;
      }
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;
          &:hover { text-decoration: underline; }
        }
      }
      ul {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.8;
        margin: 8px 0;
        padding-left: 20px;
        li { margin-bottom: 4px; }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .content-section .intro-text { font-size: 0.85rem; padding: 0 8px; }
      .section h4 { font-size: 0.9rem; }
      .section p, .section ul { font-size: 0.85rem; }
    }
  `]
})
export class PrivacyDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG CHI SIAMO
@Component({
  selector: 'app-chi-siamo-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">groups</mat-icon>
        <span class="value">{{ 'DIALOGS.ABOUT_TITLE' | translate }}</span>
      </h2>
      <div class="content-section">
        <div class="intro-block">
          <p class="main-text" [innerHTML]="'DIALOGS.ABOUT_INTRO_1' | translate"></p>
          <p class="main-text">{{ 'DIALOGS.ABOUT_INTRO_2' | translate }}</p>
          <p class="main-text">{{ 'DIALOGS.ABOUT_INTRO_3' | translate }}</p>
        </div>

        <div class="notice-block">
          <mat-icon class="notice-icon">info</mat-icon>
          <p>
            {{ 'DIALOGS.ABOUT_NOTICE' | translate }}
            <a href="#" (click)="openTermini($event)">{{ 'DIALOGS.ABOUT_TERMS_LINK' | translate }}</a> {{ 'DIALOGS.ABOUT_AND' | translate }}
            <a href="#" (click)="openPrivacy($event)">{{ 'DIALOGS.ABOUT_PRIVACY_LINK' | translate }}</a>.
          </p>
        </div>

        <div class="contact-block">
          <p>{{ 'DIALOGS.ABOUT_CONTACT' | translate }}</p>
          <a href="mailto:fantasurvivorddl@gmail.com" class="email-link">
            <mat-icon>email</mat-icon>
            <span>fantasurvivorddl&#64;gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
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
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 24px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      text-align: center;
    }
    .intro-block {
      margin-bottom: 24px;
      .main-text {
        color: #6B7280;
        font-size: 1rem;
        line-height: 1.7;
        margin: 0 0 12px 0;
        &:last-child { margin-bottom: 0; }
        strong {
          color: #0A3D91;
          font-weight: 600;
        }
      }
    }
    .notice-block {
      background: linear-gradient(135deg, rgba(10, 61, 145, 0.05), rgba(79, 195, 247, 0.08));
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      text-align: left;
      .notice-icon {
        color: #4FC3F7;
        font-size: 24px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0;
        a {
          color: #0A3D91;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          &:hover {
            color: #4FC3F7;
            text-decoration: underline;
          }
        }
      }
    }
    .contact-block {
      p {
        color: #6B7280;
        font-size: 0.9rem;
        margin: 0 0 12px 0;
      }
      .email-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        color: #FFFFFF;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        mat-icon { font-size: 20px; width: 20px; height: 20px; }
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 61, 145, 0.3);
        }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .intro-block .main-text { font-size: 0.9rem; }
      .notice-block { padding: 12px 16px; }
      .notice-block p { font-size: 0.85rem; }
      .contact-block .email-link { padding: 10px 20px; font-size: 0.9rem; }
    }
  `]
})
export class ChiSiamoDialogComponent {
  constructor(private dialog: MatDialog) {}

  closeDialog() { this.dialog.closeAll(); }

  openTermini(event: Event) {
    event.preventDefault();
    this.dialog.open(TerminiDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openPrivacy(event: Event) {
    event.preventDefault();
    this.dialog.open(PrivacyDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openChiSiamo(event: Event) {
    event.preventDefault();
    this.dialog.open(ChiSiamoDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule, MatButtonModule, MatMenuModule, TranslateModule],
  template: `
    <footer class="survivor-footer">
      <div class="footer-container">
        <div class="footer-content">
          <!-- LOGO SURVIVOR -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-text">SURVIVOR</span>
              <span class="subtitle">WIN OR GO HOME</span>
            </div>
          </div>

          <!-- LINK NAVIGAZIONE -->
          <nav class="footer-nav">
            <a href="#" class="footer-link" (click)="openTermini($event)">{{ 'FOOTER.TERMS' | translate }}</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openPrivacy($event)">{{ 'FOOTER.PRIVACY' | translate }}</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openFaq($event)">{{ 'FOOTER.FAQ' | translate }}</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openChiSiamo($event)">{{ 'FOOTER.ABOUT' | translate }}</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openContatti($event)">{{ 'FOOTER.CONTACT' | translate }}</a>
          </nav>

          <!-- SELETTORE LINGUA -->
          <div class="language-selector">
            <button mat-button [matMenuTriggerFor]="langMenu" class="lang-btn">
              <span class="lang-text">{{ getCurrentLangName() }}</span>
              <mat-icon>arrow_drop_down</mat-icon>
            </button>

            <mat-menu #langMenu="matMenu" class="lang-menu">
              <button mat-menu-item (click)="changeLanguage('it')" [class.active]="currentLang === 'it'">
                <span>Italiano</span>
                <mat-icon *ngIf="currentLang === 'it'" class="check-icon">check</mat-icon>
              </button>
              <button mat-menu-item (click)="changeLanguage('en')" [class.active]="currentLang === 'en'">
                <span>English</span>
                <mat-icon *ngIf="currentLang === 'en'" class="check-icon">check</mat-icon>
              </button>
            </mat-menu>
          </div>

          <!-- COPYRIGHT -->
          <div class="footer-copyright">
            <span>© {{ currentYear }} DDL Solutions</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* FOOTER COMPATTO ORIZZONTALE */
    .survivor-footer {
      background: linear-gradient(135deg, #0A3D91 0%, #4FC3F7 100%);
      color: #FFFFFF;
      margin-top: auto;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 -2px 8px rgba(10, 61, 145, 0.1);
      position: relative;
      overflow: hidden;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 24px;
      flex-wrap: wrap;
      text-align: center;
    }

    /* LOGO COMPATTO */
    .footer-brand {
      .footer-logo {
        .logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subtitle {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-left: 8px;
        }
      }
    }

    /* NAVIGAZIONE ORIZZONTALE */
    .footer-nav {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }
    }

    .separator {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 300;
    }

    /* COPYRIGHT */
    .footer-copyright {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .footer-container {
        padding: 14px 20px;
      }

      .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .footer-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1.1rem;
        }

        .subtitle {
          font-size: 0.65rem;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .footer-container {
        padding: 12px 16px;
      }

      .footer-content {
        gap: 12px;
      }

      .footer-nav {
        gap: 12px;

        .footer-link {
          font-size: 0.8rem;
          padding: 6px 10px;
        }

        .separator {
          display: none;
        }
      }

      .footer-copyright {
        font-size: 0.75rem;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1rem;
        }

        .subtitle {
          font-size: 0.6rem;
        }
      }
    }

    /* LANGUAGE SELECTOR */
    .language-selector {
      display: flex;
      align-items: center;

      .lang-btn {
        background: rgba(255, 255, 255, 0.15) !important;
        color: white !important;
        border: 1.5px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 8px !important;
        padding: 6px 12px !important;
        font-family: 'Poppins', sans-serif !important;
        font-weight: 600 !important;
        display: flex !important;
        align-items: center !important;
        gap: 8px !important;
        transition: all 0.2s ease !important;
        min-height: auto !important;

        &:hover {
          background: rgba(255, 255, 255, 0.25) !important;
          border-color: rgba(255, 255, 255, 0.5) !important;
        }

        .flag {
          font-size: 1.2rem;
          line-height: 1;
        }

        .lang-text {
          font-size: 0.85rem;
        }

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          margin-left: 0 !important;
        }
      }
    }

    ::ng-deep .lang-menu {
      margin-top: 8px;

      .mat-mdc-menu-content {
        padding: 8px 0;
        background: white;
        border-radius: 12px;
        box-shadow: 0 8px 32px rgba(10, 61, 145, 0.2);
      }

      button {
        padding: 12px 20px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
        color: #0A3D91;
        transition: all 0.2s ease;

        .flag {
          font-size: 1.3rem;
        }

        .check-icon {
          margin-left: auto;
          color: #4FC3F7;
          font-size: 20px;
        }

        &.active {
          background: rgba(79, 195, 247, 0.1);
          font-weight: 600;
        }

        &:hover {
          background: rgba(79, 195, 247, 0.15);
        }
      }
    }
  `]
})
export class FooterComponent {
  currentLang: string = 'it';
  currentYear: number = new Date().getFullYear();

  constructor(
    private dialog: MatDialog,
    private languageService: LanguageService
  ) {
    this.currentLang = this.languageService.getCurrentLanguage();
    this.languageService.currentLang$.subscribe(lang => {
      this.currentLang = lang;
    });
  }

  changeLanguage(lang: string): void {
    this.languageService.changeLanguage(lang);
  }

  getCurrentFlag(): string {
    return '';
  }

  getCurrentLangName(): string {
    return this.currentLang === 'it' ? 'Italiano' : 'English';
  }

  openFaq(event: Event) {
    event.preventDefault();
    this.dialog.open(FaqDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openContatti(event: Event) {
    event.preventDefault();
    this.dialog.open(ContattiDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
      panelClass: 'custom-dialog-container'
    });
  }

  openTermini(event: Event) {
    event.preventDefault();
    this.dialog.open(TerminiDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openPrivacy(event: Event) {
    event.preventDefault();
    this.dialog.open(PrivacyDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openChiSiamo(event: Event) {
    event.preventDefault();
    this.dialog.open(ChiSiamoDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }
}

