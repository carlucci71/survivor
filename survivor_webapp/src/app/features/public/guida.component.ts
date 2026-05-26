import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-guida',
  standalone: true,
  imports: [CommonModule, HeaderComponent, TranslateModule],
  template: `
    <div class="guida-page">
      <app-header
        [title]="'FOOTER.GUIDE' | translate"
        visHome="S"
        (back)="goBack()"
        [hideActions]="false"
      ></app-header>

      <div class="guida-layout">
        <!-- SIDEBAR desktop -->
        <nav class="guida-nav" [class.open]="sidebarOpen">
          <div class="nav-header">
            <div class="nav-logo">SURVIVOR</div>
            <div class="nav-tagline">{{ 'GUIDE.TAGLINE' | translate }}</div>
          </div>

          <div class="nav-section">{{ 'GUIDE.SECTION_INTRO' | translate }}</div>
          <ul>
            <li><a (click)="scrollTo('intro')"><span class="nav-num">0</span> {{ 'GUIDE.NAV_0' | translate }}</a></li>
          </ul>

          <div class="nav-section">First Steps</div>
          <ul>
            <li><a (click)="scrollTo('login')"><span class="nav-num">1</span> {{ 'GUIDE.NAV_1' | translate }}</a></li>
            <li><a (click)="scrollTo('home-section')"><span class="nav-num">2</span> {{ 'GUIDE.NAV_2' | translate }}</a></li>
            <li><a (click)="scrollTo('join')"><span class="nav-num">3</span> {{ 'GUIDE.NAV_3' | translate }}</a></li>
          </ul>

          <div class="nav-section">{{ 'GUIDE.SECTION_PLAY' | translate }}</div>
          <ul>
            <li><a (click)="scrollTo('giocata')"><span class="nav-num">4</span> {{ 'GUIDE.NAV_4' | translate }}</a></li>
            <li><a (click)="scrollTo('recap')"><span class="nav-num">5</span> {{ 'GUIDE.NAV_5' | translate }}</a></li>
            <li><a (click)="scrollTo('classifica')"><span class="nav-num">6</span> {{ 'GUIDE.NAV_6' | translate }}</a></li>
          </ul>

          <div class="nav-section">{{ 'GUIDE.SECTION_ADVANCED' | translate }}</div>
          <ul>
            <li><a (click)="scrollTo('crea')"><span class="nav-num">7</span> {{ 'GUIDE.NAV_7' | translate }}</a></li>
            <li><a (click)="scrollTo('tips')"><span class="nav-num">8</span> {{ 'GUIDE.NAV_8' | translate }}</a></li>
            <li><a (click)="scrollTo('faq')"><span class="nav-num">9</span> FAQ</a></li>
          </ul>
        </nav>

        <!-- Overlay mobile per chiudere sidebar -->
        <div class="nav-overlay" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>

        <!-- MAIN CONTENT -->
        <main class="guida-main">

          <!-- FAB menu mobile -->
          <button class="menu-fab" (click)="sidebarOpen = !sidebarOpen" aria-label="Menu">
            <span class="material-icons">menu_book</span>
          </button>

          <!-- HERO -->
          <div class="hero">
            <div class="hero-badge">
              <span class="material-icons" style="font-size:13px">menu_book</span>
              {{ 'GUIDE.HERO_BADGE' | translate }}
            </div>
            <h1>SURVIVOR</h1>
            <p>{{ 'GUIDE.HERO_DESC' | translate }}</p>
          </div>

          <!-- 0 — What is Survivor -->
          <section class="chapter" id="intro">
            <div class="chapter-header">
              <div class="chapter-num">0</div>
              <h2>{{ 'GUIDE.S0_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S0_P1' | translate"></p>
            <p [innerHTML]="'GUIDE.S0_P2' | translate"></p>

            <div class="compare">
              <div class="mode-card">
                <h3><span class="material-icons" style="font-size:16px;vertical-align:middle">favorite</span> Survivor <span class="badge-mode">CLASSIC</span></h3>
                <ul>
                  <li>{{ 'GUIDE.S0_MODE_SURVIVOR_LI1' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_SURVIVOR_LI2' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_SURVIVOR_LI3' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_SURVIVOR_LI4' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_SURVIVOR_LI5' | translate }}</li>
                </ul>
              </div>
              <div class="mode-card alt">
                <h3><span class="material-icons" style="font-size:16px;vertical-align:middle">emoji_events</span> Campionato <span class="badge-mode">PUNTI</span></h3>
                <ul>
                  <li>{{ 'GUIDE.S0_MODE_CHAMP_LI1' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_CHAMP_LI2' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_CHAMP_LI3' | translate }}</li>
                  <li>{{ 'GUIDE.S0_MODE_CHAMP_LI4' | translate }}</li>
                </ul>
              </div>
            </div>

            <div class="tip">
              <span class="callout-icon">💡</span>
              {{ 'GUIDE.S0_TIP' | translate }}
            </div>
          </section>

          <!-- 1 — Login -->
          <section class="chapter" id="login">
            <div class="chapter-header">
              <div class="chapter-num">1</div>
              <h2>{{ 'GUIDE.S1_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S1_P1' | translate"></p>
            <ul class="steps">
              <li><div class="step-icon">📧</div><div class="step-body"><strong>{{ 'GUIDE.S1_LI1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S1_LI1_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">📨</div><div class="step-body"><strong>{{ 'GUIDE.S1_LI2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S1_LI2_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">✅</div><div class="step-body"><strong>{{ 'GUIDE.S1_LI3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S1_LI3_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🎨</div><div class="step-body"><strong>{{ 'GUIDE.S1_LI4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S1_LI4_TEXT' | translate }}</span></div></li>
            </ul>
            <div class="info">
              <span class="callout-icon">ℹ️</span>
              {{ 'GUIDE.S1_INFO' | translate }}
            </div>
          </section>

          <!-- 2 — Home -->
          <section class="chapter" id="home-section">
            <div class="chapter-header">
              <div class="chapter-num">2</div>
              <h2>{{ 'GUIDE.S2_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S2_P1' | translate"></p>
            <div class="card-grid">
              <div class="card"><div class="card-icon">🔒</div><strong>{{ 'GUIDE.S2_CARD1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S2_CARD1_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">🌐</div><strong>{{ 'GUIDE.S2_CARD2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S2_CARD2_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">➕</div><strong>{{ 'GUIDE.S2_CARD3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S2_CARD3_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">🔔</div><strong>{{ 'GUIDE.S2_CARD4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S2_CARD4_TEXT' | translate }}</span></div>
            </div>
            <p [innerHTML]="'GUIDE.S2_P2' | translate"></p>
            <div class="tip"><span class="callout-icon">💡</span>{{ 'GUIDE.S2_TIP' | translate }}</div>
          </section>

          <!-- 3 — Join -->
          <section class="chapter" id="join">
            <div class="chapter-header">
              <div class="chapter-num">3</div>
              <h2>{{ 'GUIDE.S3_TITLE' | translate }}</h2>
            </div>
            <p>{{ 'GUIDE.S3_P1' | translate }}</p>
            <ul class="steps">
              <li><div class="step-icon">🔗</div><div class="step-body"><strong>{{ 'GUIDE.S3_LI1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S3_LI1_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🌐</div><div class="step-body"><strong>{{ 'GUIDE.S3_LI2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S3_LI2_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🔑</div><div class="step-body"><strong>{{ 'GUIDE.S3_LI3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S3_LI3_TEXT' | translate }}</span></div></li>
            </ul>
            <p [innerHTML]="'GUIDE.S3_P2' | translate"></p>
            <div class="warn"><span class="callout-icon">⚠️</span>{{ 'GUIDE.S3_WARN' | translate }}</div>
          </section>

          <!-- 4 — Giocata -->
          <section class="chapter" id="giocata">
            <div class="chapter-header">
              <div class="chapter-num">4</div>
              <h2>{{ 'GUIDE.S4_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S4_P1' | translate"></p>
            <ul class="steps">
              <li><div class="step-icon">1️⃣</div><div class="step-body"><strong>{{ 'GUIDE.S4_LI1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S4_LI1_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">📋</div><div class="step-body"><strong>{{ 'GUIDE.S4_LI2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S4_LI2_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🤖</div><div class="step-body"><strong>{{ 'GUIDE.S4_LI3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S4_LI3_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">✔️</div><div class="step-body"><strong>{{ 'GUIDE.S4_LI4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S4_LI4_TEXT' | translate }}</span></div></li>
            </ul>
            <div class="table-wrap">
              <table>
                <tr><th>{{ 'GUIDE.S4_TABLE_TH1' | translate }}</th><th>{{ 'GUIDE.S4_TABLE_TH2' | translate }}</th><th>{{ 'GUIDE.S4_TABLE_TH3' | translate }}</th></tr>
                <tr><td>{{ 'GUIDE.S4_TABLE_R1_TD1' | translate }}</td><td class="ok">{{ 'GUIDE.S4_TABLE_R1_TD2' | translate }}</td><td class="ok">{{ 'GUIDE.S4_TABLE_R1_TD3' | translate }}</td></tr>
                <tr><td>{{ 'GUIDE.S4_TABLE_R2_TD1' | translate }}</td><td class="ko">{{ 'GUIDE.S4_TABLE_R2_TD2' | translate }}</td><td class="neu">{{ 'GUIDE.S4_TABLE_R2_TD3' | translate }}</td></tr>
                <tr><td>{{ 'GUIDE.S4_TABLE_R3_TD1' | translate }}</td><td class="ko">{{ 'GUIDE.S4_TABLE_R3_TD2' | translate }}</td><td class="neu">{{ 'GUIDE.S4_TABLE_R3_TD3' | translate }}</td></tr>
                <tr><td>{{ 'GUIDE.S4_TABLE_R4_TD1' | translate }}</td><td class="ko">{{ 'GUIDE.S4_TABLE_R4_TD2' | translate }}</td><td class="neu">{{ 'GUIDE.S4_TABLE_R4_TD3' | translate }}</td></tr>
              </table>
            </div>
            <div class="warn"><span class="callout-icon">⚠️</span>{{ 'GUIDE.S4_WARN' | translate }}</div>
            <div class="tip"><span class="callout-icon">💡</span>{{ 'GUIDE.S4_TIP' | translate }}</div>
          </section>

          <!-- 5 — Recap -->
          <section class="chapter" id="recap">
            <div class="chapter-header">
              <div class="chapter-num">5</div>
              <h2>{{ 'GUIDE.S5_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S5_P1' | translate"></p>
            <div class="card-grid">
              <div class="card"><div class="card-icon">👁️</div><strong>{{ 'GUIDE.S5_CARD1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S5_CARD1_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">🏅</div><strong>{{ 'GUIDE.S5_CARD2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S5_CARD2_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">💬</div><strong>{{ 'GUIDE.S5_CARD3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S5_CARD3_TEXT' | translate }}</span></div>
              <div class="card"><div class="card-icon">☠️</div><strong>{{ 'GUIDE.S5_CARD4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S5_CARD4_TEXT' | translate }}</span></div>
            </div>
            <div class="info"><span class="callout-icon">ℹ️</span>{{ 'GUIDE.S5_INFO' | translate }}</div>
          </section>

          <!-- 6 — Classifica -->
          <section class="chapter" id="classifica">
            <div class="chapter-header">
              <div class="chapter-num">6</div>
              <h2>{{ 'GUIDE.S6_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S6_P1' | translate"></p>
            <p [innerHTML]="'GUIDE.S6_P2' | translate"></p>
            <div class="tip"><span class="callout-icon">💡</span>{{ 'GUIDE.S6_TIP' | translate }}</div>
          </section>

          <!-- 7 — Crea -->
          <section class="chapter" id="crea">
            <div class="chapter-header">
              <div class="chapter-num">7</div>
              <h2>{{ 'GUIDE.S7_TITLE' | translate }}</h2>
            </div>
            <p [innerHTML]="'GUIDE.S7_P1' | translate"></p>
            <ul class="steps">
              <li><div class="step-icon">🏅</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI1_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">📝</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI2_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🔢</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI3_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">❤️</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI4_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🔒</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI5_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI5_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">📨</div><div class="step-body"><strong>{{ 'GUIDE.S7_LI6_TITLE' | translate }}</strong><span>{{ 'GUIDE.S7_LI6_TEXT' | translate }}</span></div></li>
            </ul>
            <div class="info"><span class="callout-icon">ℹ️</span><span [innerHTML]="'GUIDE.S7_INFO' | translate"></span></div>
          </section>

          <!-- 8 — Tips -->
          <section class="chapter" id="tips">
            <div class="chapter-header">
              <div class="chapter-num">8</div>
              <h2>{{ 'GUIDE.S8_TITLE' | translate }}</h2>
            </div>
            <ul class="steps">
              <li><div class="step-icon">📅</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI1_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI1_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🤫</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI2_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI2_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">📉</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI3_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI3_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🤖</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI4_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI4_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">🔔</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI5_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI5_TEXT' | translate }}</span></div></li>
              <li><div class="step-icon">👀</div><div class="step-body"><strong>{{ 'GUIDE.S8_LI6_TITLE' | translate }}</strong><span>{{ 'GUIDE.S8_LI6_TEXT' | translate }}</span></div></li>
            </ul>
          </section>

          <!-- 9 — FAQ -->
          <section class="chapter" id="faq">
            <div class="chapter-header">
              <div class="chapter-num">9</div>
              <h2>{{ 'GUIDE.S9_TITLE' | translate }}</h2>
            </div>
            <div class="faq">
              <details *ngFor="let item of faqKeys">
                <summary>{{ 'GUIDE.FAQ_Q' + item | translate }} <span class="faq-toggle">+</span></summary>
                <p>{{ 'GUIDE.FAQ_A' + item | translate }}</p>
              </details>
            </div>
          </section>

          <footer class="guida-footer">
            <strong>SURVIVOR</strong> — Win or Go Home
          </footer>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    :host { display: block; font-family: 'Poppins', sans-serif; }

    .guida-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #F4F6F8;
    }

    /* ── LAYOUT ─────────────────────────────────────── */
    .guida-layout {
      display: flex;
      flex: 1;
      position: relative;
    }

    /* ── SIDEBAR ────────────────────────────────────── */
    .guida-nav {
      width: 256px;
      min-width: 256px;
      background: #fff;
      border-right: 1px solid #E2E8F0;
      height: calc(100vh - 72px);
      position: sticky;
      top: 72px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 1px 0 4px rgba(0,0,0,.04);
      z-index: 100;
      flex-shrink: 0;
    }
    .nav-header {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      padding: 24px 20px 18px;
      color: #fff;
    }
    .nav-logo { font-size: 20px; font-weight: 800; letter-spacing: 3px; }
    .nav-tagline { font-size: 11px; opacity: .8; margin-top: 2px; font-weight: 500; }
    .nav-section {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #718096;
      padding: 14px 20px 4px;
      text-transform: uppercase;
    }
    .guida-nav ul { list-style: none; padding: 4px 10px; margin: 0; }
    .guida-nav ul li { margin-bottom: 2px; }
    .guida-nav ul li a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: #4A5568;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all .18s;
      &:hover { background: rgba(79,195,247,.1); color: #0A3D91; }
    }
    .nav-num {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      width: 20px; height: 20px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── MAIN ───────────────────────────────────────── */
    .guida-main {
      flex: 1;
      padding: 36px 48px 48px;
      max-width: 820px;
      min-width: 0;
      position: relative;
    }

    /* FAB menu mobile */
    .menu-fab {
      display: none;
      position: fixed;
      bottom: 80px;
      right: 18px;
      z-index: 200;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 48px; height: 48px;
      box-shadow: 0 4px 16px rgba(10,61,145,.35);
      cursor: pointer;
      align-items: center; justify-content: center;
      .material-icons { font-size: 22px; }
    }

    /* ── HERO ───────────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 60%, #4FC3F7 100%);
      border-radius: 20px;
      padding: 40px 36px;
      margin-bottom: 40px;
      color: #fff;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(10,61,145,.22);
      &::after {
        content: '';
        position: absolute;
        right: -40px; bottom: -40px;
        width: 200px; height: 200px;
        background: rgba(255,255,255,.05);
        border-radius: 50%;
      }
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,.2);
      border: 1px solid rgba(255,255,255,.3);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .hero h1 {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 4px;
      margin-bottom: 10px;
      position: relative;
    }
    .hero p { font-size: 14px; opacity: .85; max-width: 500px; position: relative; }

    /* ── CHAPTERS ───────────────────────────────────── */
    .chapter {
      margin-bottom: 48px;
      scroll-margin-top: 84px;
    }
    .chapter-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 2px solid #E2E8F0;
    }
    .chapter-num {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      width: 34px; height: 34px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .chapter h2 { font-size: 1.35rem; font-weight: 700; color: #1A202C; margin: 0; }
    .chapter p { color: #4A5568; margin-bottom: 14px; font-size: 0.92rem; line-height: 1.75; }
    .chapter strong { color: #1A202C; }

    /* ── CALLOUTS ───────────────────────────────────── */
    .tip, .info, .warn {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin: 16px 0;
      line-height: 1.6;
    }
    .tip  { background: #FFF8E1; border-left: 4px solid #F59E0B; color: #78350F; }
    .info { background: #E3F2FD; border-left: 4px solid #2196F3; color: #1E3A5F; }
    .warn { background: #FFF3E0; border-left: 4px solid #FF6D00; color: #7C2D12; }
    .callout-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

    /* ── STEPS ──────────────────────────────────────── */
    .steps {
      list-style: none;
      padding: 0;
      margin: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .steps li {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .step-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 1px; }
    .step-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      strong { font-size: 0.88rem; color: #1A202C; }
      span   { font-size: 0.82rem; color: #64748B; line-height: 1.5; }
    }

    /* ── CARD GRID ──────────────────────────────────── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .card {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
      .card-icon { font-size: 1.5rem; }
      strong { font-size: 0.88rem; color: #1A202C; }
      span   { font-size: 0.8rem; color: #64748B; line-height: 1.5; }
    }

    /* ── COMPARE ────────────────────────────────────── */
    .compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 18px 0;
    }
    .mode-card {
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      border: 1.5px solid #BFDBFE;
      border-radius: 14px;
      padding: 18px 16px;
      h3 { font-size: 0.9rem; font-weight: 700; color: #0A3D91; margin-bottom: 10px; }
      ul { list-style: none; padding: 0; margin: 0; }
      ul li { font-size: 0.82rem; color: #1E3A5F; padding: 3px 0; padding-left: 16px; position: relative; }
      ul li::before { content: '•'; position: absolute; left: 0; color: #4FC3F7; font-weight: 700; }
      &.alt { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border-color: #BBF7D0; h3 { color: #14532D; } ul li { color: #14532D; } ul li::before { color: #16A34A; } }
    }
    .badge-mode {
      display: inline-block;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 20px;
      vertical-align: middle;
      margin-left: 6px;
    }
    .mode-card.alt .badge-mode { background: linear-gradient(135deg, #16A34A, #4ADE80); }

    /* ── TABLE ──────────────────────────────────────── */
    .table-wrap {
      overflow-x: auto;
      margin: 16px 0;
      border-radius: 12px;
      border: 1.5px solid #E2E8F0;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    th {
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      color: #fff;
      font-weight: 700;
      padding: 10px 14px;
      text-align: left;
      font-size: 0.78rem;
      letter-spacing: 0.3px;
    }
    td { padding: 10px 14px; border-bottom: 1px solid #F1F5F9; color: #374151; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #F8FAFF; }
    .ok  { color: #16A34A; font-weight: 700; }
    .ko  { color: #DC2626; font-weight: 700; }
    .neu { color: #64748B; }

    /* ── FAQ ────────────────────────────────────────── */
    .faq {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    details {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 0;
      overflow: hidden;
      transition: box-shadow .18s;
      &[open] { box-shadow: 0 4px 16px rgba(10,61,145,.08); border-color: #BFDBFE; }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        cursor: pointer;
        font-size: 0.88rem;
        font-weight: 600;
        color: #1A202C;
        list-style: none;
        &::-webkit-details-marker { display: none; }
      }
      p { padding: 0 16px 14px; font-size: 0.83rem; color: #4A5568; line-height: 1.65; margin: 0; }
    }
    .faq-toggle {
      font-size: 1.1rem;
      color: #0A3D91;
      font-weight: 700;
      flex-shrink: 0;
      margin-left: 8px;
    }
    details[open] .faq-toggle { transform: rotate(45deg); display: inline-block; }

    /* ── FOOTER ─────────────────────────────────────── */
    .guida-footer {
      margin-top: 48px;
      padding: 20px 0;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #718096;
      text-align: center;
      strong { color: #0A3D91; }
    }

    /* ── RESPONSIVE ─────────────────────────────────── */
    @media (max-width: 900px) {
      .guida-nav { display: none; position: fixed; top: 72px; left: 0; height: calc(100vh - 72px); z-index: 300; transition: transform .25s; transform: translateX(-100%); overflow-y: auto; }
      .guida-nav.open { display: flex; transform: translateX(0); }
      .nav-overlay { position: fixed; top: 72px; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,.35); z-index: 299; }
      .guida-main { padding: 20px 16px 80px; }
      .hero { padding: 26px 20px; }
      .hero h1 { font-size: 26px; }
      .compare, .card-grid { grid-template-columns: 1fr; }
      .menu-fab { display: flex; }
    }

    @media (max-width: 480px) {
      .guida-main { padding: 16px 12px 80px; }
      .chapter h2 { font-size: 1.1rem; }
    }
  `]
})
export class GuidaComponent {
  sidebarOpen = false;
  faqKeys = [1, 2, 3, 4, 5, 6, 7, 8];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  scrollTo(id: string): void {
    this.sidebarOpen = false;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}
