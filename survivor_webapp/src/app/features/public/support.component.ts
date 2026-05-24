import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, RouterModule, TranslateModule],
  template: `
    <div class="page-container">

      <header class="support-header">
        <div class="header-content">
          <img src="assets/logo.png" alt="Survivor Logo" class="logo" />
          <div class="header-text">
            <h1>Survivor</h1>
            <p class="tagline">Win or Go Home</p>
          </div>
        </div>
      </header>

      <main class="content">

        <!-- CHI SIAMO / ABOUT -->
        <mat-card class="support-card">
          <mat-card-content>
            <div class="section-header">
              <mat-icon>info</mat-icon>
              <h2>{{ 'DIALOGS.ABOUT_TITLE' | translate }}</h2>
            </div>
            <p><strong>Survivor</strong> <span [innerHTML]="'DIALOGS.ABOUT_INTRO_1' | translate"></span></p>
            <p>{{ 'DIALOGS.ABOUT_INTRO_2' | translate }}</p>
            <p>{{ 'DIALOGS.ABOUT_NOTICE' | translate }}</p>
          </mat-card-content>
        </mat-card>

        <!-- COME FUNZIONA / HOW IT WORKS -->
        <mat-card class="support-card">
          <mat-card-content>
            <div class="section-header">
              <mat-icon>help_outline</mat-icon>
              <h2>{{ 'GUIDE.SECTION_PLAY' | translate }}</h2>
            </div>
            <ul class="how-list">
              <li><mat-icon class="list-icon">sports_soccer</mat-icon><span>{{ 'GUIDE.S0_MODE_SURVIVOR_LI1' | translate }}</span></li>
              <li><mat-icon class="list-icon">check_circle</mat-icon><span>{{ 'GUIDE.S0_MODE_SURVIVOR_LI2' | translate }}</span></li>
              <li><mat-icon class="list-icon">favorite</mat-icon><span>{{ 'GUIDE.S0_MODE_SURVIVOR_LI3' | translate }}</span></li>
              <li><mat-icon class="list-icon">emoji_events</mat-icon><span>{{ 'GUIDE.S0_MODE_SURVIVOR_LI5' | translate }}</span></li>
            </ul>
          </mat-card-content>
        </mat-card>

        <!-- CONTATTI -->
        <mat-card class="support-card">
          <mat-card-content>
            <div class="section-header">
              <mat-icon>email</mat-icon>
              <h2>{{ 'DIALOGS.CONTACT_TITLE' | translate }}</h2>
            </div>
            <p>{{ 'DIALOGS.CONTACT_INTRO' | translate }}</p>
            <a href="mailto:survivorwinorgohome@gmail.com" class="email-link">
              <mat-icon>mail_outline</mat-icon>
              <span>survivorwinorgohome&#64;gmail.com</span>
            </a>
            <p class="response-note">{{ 'SUPPORT.CONTACT_NOTE' | translate }}</p>
          </mat-card-content>
        </mat-card>

        <!-- LINK UTILI -->
        <mat-card class="support-card">
          <mat-card-content>
            <div class="section-header">
              <mat-icon>link</mat-icon>
              <h2>{{ 'SUPPORT.LINKS_TITLE' | translate }}</h2>
            </div>
            <div class="links-grid">
              <a routerLink="/privacy" class="link-btn">
                <mat-icon>security</mat-icon>
                <span>{{ 'FOOTER.PRIVACY' | translate }}</span>
              </a>
              <a routerLink="/terms" class="link-btn">
                <mat-icon>description</mat-icon>
                <span>{{ 'FOOTER.TERMS' | translate }}</span>
              </a>
              <a routerLink="/guida" class="link-btn">
                <mat-icon>menu_book</mat-icon>
                <span>{{ 'FOOTER.GUIDE' | translate }}</span>
              </a>
            </div>
          </mat-card-content>
        </mat-card>

        <p class="copyright">© {{ currentYear }} DDL Solutions — Survivor</p>

      </main>
    </div>
  `,
  styles: [`
    .page-container {
      min-height: 100vh;
      background: #F4F6F8;
      display: flex;
      flex-direction: column;
      font-family: 'Poppins', sans-serif;
    }
    .support-header {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      padding: 32px 24px;
      color: #fff;
    }
    .header-content {
      max-width: 800px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .logo {
      width: 72px;
      height: 72px;
      border-radius: 16px;
      object-fit: cover;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    }
    .header-text { flex: 1; }
    .lang-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,0.2);
      border: 1px solid rgba(255,255,255,0.4);
      border-radius: 20px;
      color: #fff;
      padding: 6px 14px;
      cursor: pointer;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      font-weight: 600;
      transition: background 0.2s;
      flex-shrink: 0;
      mat-icon { font-size: 1.1rem; width: 1.1rem; height: 1.1rem; }
      &:hover { background: rgba(255,255,255,0.3); }
    }
    h1 {
      margin: 0;
      font-size: 2rem;
      font-weight: 700;
      letter-spacing: 1px;
    }
    .tagline {
      margin: 4px 0 0;
      font-size: 0.95rem;
      opacity: 0.85;
      font-style: italic;
    }
    .content {
      flex: 1;
      padding: 24px 16px;
      max-width: 800px;
      width: 100%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .support-card {
      border-radius: 16px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.07);
      background: #fff;
      mat-card-content { padding: 24px; }
    }
    .section-header {
      display: flex;
      align-items: center;
      gap: 10px;
      margin-bottom: 16px;
      mat-icon { color: #0A3D91; font-size: 1.6rem; width: 1.6rem; height: 1.6rem; }
      h2 { margin: 0; font-size: 1.15rem; font-weight: 700; color: #0A3D91; text-transform: uppercase; letter-spacing: 0.5px; }
    }
    p { color: #444; line-height: 1.6; margin: 0 0 10px; font-size: 0.95rem; }
    .how-list {
      list-style: none;
      padding: 0;
      margin: 0;
      display: flex;
      flex-direction: column;
      gap: 12px;
      li { display: flex; align-items: flex-start; gap: 10px; color: #444; font-size: 0.95rem; line-height: 1.5; }
      .list-icon { color: #4FC3F7; flex-shrink: 0; margin-top: 2px; }
    }
    .email-link {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      color: #0A3D91;
      font-weight: 600;
      text-decoration: none;
      font-size: 1rem;
      margin: 8px 0;
      padding: 8px 16px;
      background: rgba(10, 61, 145, 0.06);
      border-radius: 8px;
      transition: background 0.2s;
      mat-icon { color: #0A3D91; }
      &:hover { background: rgba(10, 61, 145, 0.12); }
    }
    .response-note { margin-top: 10px; font-size: 0.85rem; color: #888; }
    .links-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      @media (max-width: 480px) { grid-template-columns: 1fr; }
    }
    .link-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 16px;
      border-radius: 10px;
      background: rgba(10, 61, 145, 0.06);
      color: #0A3D91;
      text-decoration: none;
      font-weight: 600;
      font-size: 0.9rem;
      transition: all 0.2s;
      mat-icon { color: #4FC3F7; }
      &:hover { background: rgba(10, 61, 145, 0.12); transform: translateY(-1px); }
    }
    .copyright { text-align: center; font-size: 0.8rem; color: #aaa; margin: 8px 0 16px; }
  `]
})
export class SupportComponent {
  currentYear = new Date().getFullYear();
}
