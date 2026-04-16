import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, style, animate, transition } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';

interface TutorialSlide {
  icon: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  accent: string;
  gradient: string;
  demoType?: string;
}

@Component({
  selector: 'app-leader-tutorial',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, TranslateModule],
  animations: [
    trigger('slideAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(32px)' }),
        animate('320ms cubic-bezier(0.35, 0, 0.25, 1)')
      ])
    ])
  ],
  template: `
    <div class="ob-backdrop" (click)="onBackdropClick($event)">
      <div class="ob-card" role="dialog" aria-modal="true" aria-label="Leader Tutorial">

        <!-- Badge ruolo -->
        <div class="ob-role-badge">
          <mat-icon class="ob-role-icon">star</mat-icon>
          <span>{{ 'LEADER_TUTORIAL.ROLE_BADGE' | translate }}</span>
        </div>

        <!-- Progress dots -->
        <div class="ob-dots">
          @for (s of slides; track $index) {
            <span class="ob-dot" [class.active]="$index === current"></span>
          }
        </div>

        <!-- Slide content -->
        @for (slide of slides; track $index) {
          @if ($index === current) {
            <div class="ob-slide" [@slideAnim]>
              @if (slide.demoType === 'forza-risultati') {
                <div class="ob-demo-wrapper">
                  <!-- forza-risultati content unchanged -->
                  <div class="ob-demo-mockup">
                    <div class="demo-mostra-btn" [class.demo-hl]="demoStep === 0">
                      <mat-icon class="demo-icon">bar_chart</mat-icon>
                      <span>{{ 'LEADER_TUTORIAL.DEMO_FORZA.BTN' | translate }}</span>
                      <span class="demo-step-inline" [class.demo-step-inline--visible]="demoStep === 0">①</span>
                    </div>
                    <div class="demo-dialog" [class.demo-dialog--open]="demoStep >= 1">
                      <div class="demo-dialog-header">{{ 'LEADER_TUTORIAL.DEMO_FORZA.HEADER' | translate }}</div>
                      <div class="demo-match-row" [class.demo-hl]="demoStep === 1">
                        <span class="demo-team">Juventus</span>
                        <span class="demo-badge-rinviata">{{ 'LEADER_TUTORIAL.DEMO_FORZA.BADGE_RINVIATA' | translate }}</span>
                        <span class="demo-team">Roma</span>
                        <span class="demo-step-inline demo-step-inline--row" [class.demo-step-inline--visible]="demoStep === 1">②</span>
                      </div>
                      <div class="demo-match-row demo-match-dim">
                        <span class="demo-team">Milan</span>
                        <span class="demo-score">2-1</span>
                        <span class="demo-team">Napoli</span>
                      </div>
                      <div class="demo-forza-btn" [class.demo-hl]="demoStep === 2">
                        <mat-icon class="demo-icon">check_circle</mat-icon>
                        <span>{{ 'LEADER_TUTORIAL.DEMO_FORZA.APPLY_BTN' | translate }}</span>
                        <span class="demo-step-inline" [class.demo-step-inline--visible]="demoStep === 2">③</span>
                      </div>
                    </div>
                  </div>
                  <div class="demo-stepper">
                    <div class="demo-stepper-item" [class.demo-stepper-item--active]="demoStep === 0">
                      <span class="demo-stepper-num">①</span>
                      <span class="demo-stepper-lbl">{{ 'LEADER_TUTORIAL.DEMO_FORZA.BTN' | translate }}</span>
                    </div>
                    <mat-icon class="demo-stepper-arrow">chevron_right</mat-icon>
                    <div class="demo-stepper-item" [class.demo-stepper-item--active]="demoStep === 1">
                      <span class="demo-stepper-num">②</span>
                      <span class="demo-stepper-lbl">{{ 'LEADER_TUTORIAL.DEMO_FORZA.STEP_SELECT' | translate }}</span>
                    </div>
                    <mat-icon class="demo-stepper-arrow">chevron_right</mat-icon>
                    <div class="demo-stepper-item" [class.demo-stepper-item--active]="demoStep === 2">
                      <span class="demo-stepper-num">③</span>
                      <span class="demo-stepper-lbl">{{ 'LEADER_TUTORIAL.DEMO_FORZA.STEP_FORCE' | translate }}</span>
                    </div>
                  </div>
                </div>
              } @else if (slide.demoType === 'pubblica-privata') {
                <div class="ob-demo-wrapper">
                  <div class="ob-demo-mockup demo-pp-mockup">
                    <div class="demo-pp-option" [class.demo-pp-option--active]="demoStep === 0">
                      <div class="demo-pp-icon demo-pp-icon--pub">
                        <mat-icon>public</mat-icon>
                      </div>
                      <div class="demo-pp-text">
                        <span class="demo-pp-label">{{ 'LEADER_TUTORIAL.DEMO_PP.PUBLIC_LABEL' | translate }}</span>
                        <span class="demo-pp-sub">{{ 'LEADER_TUTORIAL.DEMO_PP.PUBLIC_SUB' | translate }}</span>
                      </div>
                      <mat-icon class="demo-pp-check" [class.demo-pp-check--visible]="demoStep === 0">check_circle</mat-icon>
                    </div>
                    <div class="demo-pp-option" [class.demo-pp-option--active]="demoStep === 1">
                      <div class="demo-pp-icon demo-pp-icon--priv">
                        <mat-icon>lock</mat-icon>
                      </div>
                      <div class="demo-pp-text">
                        <span class="demo-pp-label">{{ 'LEADER_TUTORIAL.DEMO_PP.PRIVATE_LABEL' | translate }}</span>
                        <span class="demo-pp-sub">{{ 'LEADER_TUTORIAL.DEMO_PP.PRIVATE_SUB' | translate }}</span>
                      </div>
                      <mat-icon class="demo-pp-check" [class.demo-pp-check--visible]="demoStep === 1">check_circle</mat-icon>
                    </div>
                  </div>
                </div>
              } @else if (slide.demoType === 'avvia-lega') {
                <div class="ob-demo-wrapper">
                  <div class="ob-demo-mockup demo-avvia-mockup">
                    <div class="demo-players-row">
                      <div class="demo-player-chip">🧑 Marco</div>
                      <div class="demo-player-chip">🧑 Sara</div>
                      <div class="demo-player-chip">🧑 Luca</div>
                    </div>
                    <div class="demo-avvia-arrow">
                      <mat-icon>arrow_downward</mat-icon>
                    </div>
                    <div class="demo-avvia-btn" [class.demo-avvia-btn--pulse]="demoStep === 0" [class.demo-avvia-btn--done]="demoStep === 1">
                      @if (demoStep < 1) {
                        <mat-icon class="demo-icon">rocket_launch</mat-icon>
                        <span>{{ 'LEADER_TUTORIAL.DEMO_AVVIA.BTN_START' | translate }}</span>
                      } @else {
                        <mat-icon class="demo-icon">check_circle</mat-icon>
                        <span>{{ 'LEADER_TUTORIAL.DEMO_AVVIA.BTN_DONE' | translate }}</span>
                      }
                    </div>
                    @if (demoStep === 1) {
                      <div class="demo-avvia-status">
                        <mat-icon class="demo-avvia-status-icon">sports_soccer</mat-icon>
                        <span>{{ 'LEADER_TUTORIAL.DEMO_AVVIA.STATUS' | translate }}</span>
                      </div>
                    }
                  </div>
                </div>
              } @else {
                <div class="ob-illustration" [style.background]="slide.gradient">
                  <div class="ob-emoji-ring" [style.borderColor]="slide.accent + '44'">
                    <span class="ob-emoji">{{ slide.emoji }}</span>
                  </div>
                  <mat-icon class="ob-bg-icon" [style.color]="slide.accent + '22'">{{ slide.icon }}</mat-icon>
                </div>
              }
              <div class="ob-text">
                <h2 class="ob-title">{{ slide.titleKey | translate }}</h2>
                <p class="ob-desc">{{ slide.descKey | translate }}</p>
              </div>
            </div>
          }
        }

        <!-- Actions -->
        <div class="ob-actions">
          <button class="ob-btn ob-btn--skip" (click)="skip()">
            {{ 'LEADER_TUTORIAL.SKIP' | translate }}
          </button>
          <div class="ob-nav-btns">
            @if (current > 0) {
              <button class="ob-btn ob-btn--back" (click)="prev()">
                <mat-icon>arrow_back</mat-icon>
              </button>
            }
            @if (current < slides.length - 1) {
              <button class="ob-btn ob-btn--next" (click)="next()">
                {{ 'LEADER_TUTORIAL.NEXT' | translate }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            } @else {
              <button class="ob-btn ob-btn--finish" (click)="finish()">
                {{ 'LEADER_TUTORIAL.FINISH' | translate }}
                <mat-icon>sports_score</mat-icon>
              </button>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .ob-backdrop {
      position: fixed;
      inset: 0;
      background: rgba(10, 29, 80, 0.72);
      backdrop-filter: blur(6px);
      -webkit-backdrop-filter: blur(6px);
      z-index: 9000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      box-sizing: border-box;
    }

    .ob-card {
      background: #FFFFFF;
      border-radius: 24px;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 24px 80px rgba(10, 61, 145, 0.30);
      display: flex;
      flex-direction: column;
      overflow: hidden;
      animation: cardIn 0.4s cubic-bezier(0.35, 0, 0.25, 1);
    }

    @keyframes cardIn {
      from { opacity: 0; transform: scale(0.92) translateY(24px); }
      to   { opacity: 1; transform: scale(1)   translateY(0); }
    }

    .ob-role-badge {
      display: flex;
      align-items: center;
      gap: 6px;
      justify-content: center;
      padding: 12px 24px 0;
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 700;
      color: #F59E0B;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .ob-role-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #F59E0B;
    }

    .ob-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 10px 24px 0;
    }

    .ob-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #E2E8F0;
      transition: all 0.25s ease;

      &.active {
        width: 24px;
        border-radius: 4px;
        background: linear-gradient(90deg, #F59E0B, #FBBF24);
      }
    }

    .ob-slide {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .ob-illustration {
      width: calc(100% - 48px);
      height: 180px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      margin-top: 12px;
      border-radius: 16px;
      margin-left: 24px;
      margin-right: 24px;
      flex-shrink: 0;
    }

    .ob-emoji-ring {
      width: 100px;
      height: 100px;
      border-radius: 50%;
      border: 3px solid;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(255,255,255,0.55);
      backdrop-filter: blur(4px);
      z-index: 1;
      box-shadow: 0 8px 24px rgba(0,0,0,0.12);
    }

    .ob-emoji {
      font-size: 3.2rem;
      line-height: 1;
      animation: bob 3s ease-in-out infinite;
    }

    @keyframes bob {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(-8px); }
    }

    .ob-bg-icon {
      position: absolute;
      font-size: 140px;
      width: 140px;
      height: 140px;
      opacity: 0.08;
      right: -20px;
      bottom: -20px;
      pointer-events: none;
    }

    .ob-text {
      padding: 16px 28px 8px;
      text-align: center;
    }

    .ob-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.3rem;
      font-weight: 800;
      color: #92400E;
      margin: 0 0 10px;
      line-height: 1.3;
    }

    .ob-desc {
      font-family: 'Poppins', sans-serif;
      font-size: 0.91rem;
      color: #4A5568;
      line-height: 1.65;
      margin: 0;
    }

    .ob-actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 24px 24px;
      margin-top: 4px;
    }

    .ob-nav-btns {
      display: flex;
      gap: 8px;
      align-items: center;
    }

    .ob-btn {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      border: none;
      cursor: pointer;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      border-radius: 12px;

      mat-icon {
        font-size: 18px;
        width: 18px;
        height: 18px;
      }
    }

    .ob-btn--skip {
      font-size: 0.82rem;
      color: #A0AEC0;
      background: transparent;
      padding: 8px 4px;

      &:hover { color: #718096; }
    }

    .ob-btn--back {
      background: #F4F6F8;
      color: #92400E;
      padding: 10px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      justify-content: center;

      &:hover { background: #FEF3C7; }
    }

    .ob-btn--next {
      background: linear-gradient(135deg, #D97706, #FBBF24);
      color: #fff;
      padding: 10px 20px;
      font-size: 0.88rem;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);

      &:hover {
        box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
        transform: translateY(-1px);
      }
    }

    .ob-btn--finish {
      background: linear-gradient(135deg, #D97706, #F59E0B);
      color: #fff;
      padding: 10px 20px;
      font-size: 0.88rem;
      box-shadow: 0 4px 14px rgba(217, 119, 6, 0.35);
      border-radius: 12px;

      &:hover {
        box-shadow: 0 6px 20px rgba(217, 119, 6, 0.45);
        transform: translateY(-1px);
      }
    }

    @media (max-width: 480px) {
      .ob-card {
        border-radius: 20px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .ob-illustration {
        height: 150px;
        margin-left: 16px;
        margin-right: 16px;
        width: calc(100% - 32px);
      }

      .ob-emoji-ring { width: 85px; height: 85px; }
      .ob-emoji { font-size: 2.6rem; }
      .ob-title { font-size: 1.1rem; }
      .ob-desc { font-size: 0.84rem; }
      .ob-text { padding: 14px 20px 6px; }
      .ob-actions { padding: 12px 20px 20px; }
      .ob-btn--next,
      .ob-btn--finish { padding: 9px 16px; font-size: 0.82rem; }
    }

    @media (max-width: 360px) {
      .ob-illustration { height: 130px; }
      .ob-emoji-ring { width: 76px; height: 76px; }
      .ob-emoji { font-size: 2.2rem; }
      .ob-title { font-size: 1rem; }
    }

    /* ── Demo mockup: Forza Risultati ── */
    .ob-demo-wrapper {
      width: calc(100% - 48px);
      margin: 12px 24px 0;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }

    .ob-demo-mockup {
      background: #EEF2FF;
      border-radius: 12px;
      padding: 10px 12px;
      display: flex;
      flex-direction: column;
      gap: 7px;
    }

    /* ── Mostra Risultati pill (matches app action button style) ── */
    .demo-mostra-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      align-self: flex-start;
      background: #0A3D91;
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      padding: 5px 11px;
      border-radius: 20px;
      transition: box-shadow 0.3s, transform 0.3s;

      .demo-icon { font-size: 13px; width: 13px; height: 13px; }

      &.demo-hl {
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.35), 0 2px 8px rgba(10,61,145,0.25);
        transform: scale(1.04);
      }
    }

    /* ── Dialog card ── */
    .demo-dialog {
      background: #fff;
      border-radius: 10px;
      box-shadow: 0 4px 14px rgba(0,0,0,0.13);
      overflow: hidden;
      max-height: 0;
      opacity: 0;
      transition: max-height 0.4s ease, opacity 0.3s ease;

      &.demo-dialog--open {
        max-height: 200px;
        opacity: 1;
      }
    }

    .demo-dialog-header {
      background: linear-gradient(135deg, #0A3D91 0%, #4FC3F7 100%);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 0.67rem;
      font-weight: 700;
      padding: 5px 10px;
      text-align: center;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }

    .demo-match-row {
      display: flex;
      align-items: center;
      gap: 5px;
      padding: 5px 10px;
      border-bottom: 1px solid #F1F5F9;
      transition: background 0.25s;

      &.demo-hl { background: #DBEAFE; }
      &.demo-match-dim { opacity: 0.4; }
    }

    .demo-team {
      font-family: 'Poppins', sans-serif;
      font-weight: 700;
      color: #0F172A;
      font-size: 0.67rem;
      min-width: 0;
      flex-shrink: 1;
    }

    .demo-badge-rinviata {
      background: #FEF9C3;
      color: #854D0E;
      font-size: 0.56rem;
      font-weight: 800;
      padding: 2px 5px;
      border-radius: 5px;
      border: 1px solid #FDE047;
      flex: 1;
      text-align: center;
      letter-spacing: 0.04em;
    }

    .demo-score {
      font-family: 'Poppins', sans-serif;
      font-weight: 800;
      color: #0A3D91;
      font-size: 0.7rem;
      flex: 1;
      text-align: center;
    }

    /* ── Applica forzatura full-width button (matches real app) ── */
    .demo-forza-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      width: calc(100% - 20px);
      margin: 5px 10px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 6px 10px;
      border-radius: 20px;
      transition: box-shadow 0.3s, transform 0.3s;
      box-sizing: border-box;

      .demo-icon { font-size: 13px; width: 13px; height: 13px; }

      &.demo-hl {
        box-shadow: 0 0 0 3px rgba(79,195,247, 0.45), 0 2px 10px rgba(10,61,145,0.3);
        transform: scale(1.02);
      }
    }

    /* ── Inline step badge ── */
    .demo-step-inline {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background: #EF4444;
      color: #fff;
      font-size: 0.58rem;
      font-weight: 900;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      flex-shrink: 0;
      opacity: 0;
      transform: scale(0.5);
      transition: opacity 0.25s ease, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);

      &.demo-step-inline--row {
        margin-left: auto;
      }

      &.demo-step-inline--visible {
        opacity: 1;
        transform: scale(1);
        animation: badge-pop 0.7s ease-in-out infinite alternate;
      }
    }

    @keyframes badge-pop {
      from { transform: scale(1); }
      to   { transform: scale(1.2); }
    }

    /* ── Bottom stepper ── */
    .demo-stepper {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 2px;
    }

    .demo-stepper-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1px;
      opacity: 0.4;
      transition: opacity 0.3s;
      min-width: 0;

      &.demo-stepper-item--active {
        opacity: 1;
      }
    }

    .demo-stepper-num {
      font-size: 0.75rem;
      font-weight: 800;
      color: #0A3D91;
      line-height: 1;
    }

    .demo-stepper-lbl {
      font-size: 0.55rem;
      font-weight: 600;
      color: #64748B;
      white-space: nowrap;

      .demo-stepper-item.demo-stepper-item--active & {
        color: #0A3D91;
        font-weight: 800;
      }
    }

    .demo-stepper-arrow {
      font-size: 14px !important;
      width: 14px !important;
      height: 14px !important;
      color: #CBD5E1;
      flex-shrink: 0;
    }

    @media (max-width: 480px) {
      .ob-demo-wrapper {
        width: calc(100% - 32px);
        margin-left: 16px;
        margin-right: 16px;
      }
    }

    /* ── Demo: Pubblica vs Privata ── */
    .demo-pp-mockup {
      gap: 10px;
      padding: 12px;
    }

    .demo-pp-option {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 10px 12px;
      border-radius: 10px;
      border: 2px solid #E2E8F0;
      background: #fff;
      transition: border-color 0.3s, background 0.3s, transform 0.2s;

      &.demo-pp-option--active {
        border-color: #0A3D91;
        background: #EFF6FF;
        transform: scale(1.02);
      }
    }

    .demo-pp-icon {
      width: 34px;
      height: 34px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      mat-icon { font-size: 18px; width: 18px; height: 18px; color: #fff; }

      &.demo-pp-icon--pub  { background: linear-gradient(135deg, #10B981, #6EE7B7); }
      &.demo-pp-icon--priv { background: linear-gradient(135deg, #0A3D91, #4FC3F7); }
    }

    .demo-pp-text {
      display: flex;
      flex-direction: column;
      flex: 1;
      min-width: 0;
    }

    .demo-pp-label {
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      color: #0F172A;
    }

    .demo-pp-sub {
      font-family: 'Poppins', sans-serif;
      font-size: 0.62rem;
      color: #64748B;
      font-weight: 500;
    }

    .demo-pp-check {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
      color: #E2E8F0;
      transition: color 0.3s, transform 0.3s;

      &.demo-pp-check--visible {
        color: #0A3D91;
        transform: scale(1.2);
      }
    }

    /* ── Demo: Avvia Lega ── */
    .demo-avvia-mockup {
      align-items: center;
      gap: 8px;
      padding: 14px 12px;
    }

    .demo-players-row {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;
      justify-content: center;
    }

    .demo-player-chip {
      background: #fff;
      border: 1px solid #E2E8F0;
      border-radius: 20px;
      padding: 3px 10px;
      font-size: 0.65rem;
      font-weight: 600;
      color: #374151;
      font-family: 'Poppins', sans-serif;
    }

    .demo-avvia-arrow {
      color: #94A3B8;
      mat-icon { font-size: 18px; width: 18px; height: 18px; animation: bounce-down 1s ease-in-out infinite; }
    }

    @keyframes bounce-down {
      0%, 100% { transform: translateY(0); }
      50%       { transform: translateY(4px); }
    }

    .demo-avvia-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 20px;
      border-radius: 24px;
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      color: #fff;
      background: linear-gradient(135deg, #10B981, #34D399);
      transition: background 0.4s, box-shadow 0.3s, transform 0.2s;
      .demo-icon { font-size: 16px; width: 16px; height: 16px; }

      &.demo-avvia-btn--pulse {
        animation: avvia-pulse 1s ease-in-out infinite alternate;
      }
      &.demo-avvia-btn--done {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        box-shadow: 0 0 0 4px rgba(10, 61, 145, 0.2);
      }
    }

    @keyframes avvia-pulse {
      from { box-shadow: 0 0 0 0px rgba(16, 185, 129, 0.5); transform: scale(1); }
      to   { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0);   transform: scale(1.04); }
    }

    .demo-avvia-status {
      display: flex;
      align-items: center;
      gap: 5px;
      background: #ECFDF5;
      border: 1px solid #6EE7B7;
      border-radius: 8px;
      padding: 5px 10px;
      animation: status-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);

      .demo-avvia-status-icon {
        font-size: 14px; width: 14px; height: 14px; color: #10B981;
      }

      span {
        font-family: 'Poppins', sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        color: #065F46;
      }
    }

    @keyframes status-in {
      from { opacity: 0; transform: scale(0.8) translateY(6px); }
      to   { opacity: 1; transform: scale(1) translateY(0); }
    }
  `]
})
export class LeaderTutorialComponent implements OnDestroy {
  @Output() dismissed = new EventEmitter<void>();

  demoStep = 0;
  private _current = 0;
  private _demoInterval: any = null;

  get current(): number { return this._current; }
  set current(val: number) {
    this._current = val;
    this._manageDemoInterval();
  }

  readonly slides: TutorialSlide[] = [
    { emoji: '👑', icon: 'star',         titleKey: 'LEADER_TUTORIAL.SLIDE_1.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_1.DESC', accent: '#F59E0B', gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
    { emoji: '�', icon: 'lock',         titleKey: 'LEADER_TUTORIAL.SLIDE_2.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_2.DESC', accent: '#6366F1', gradient: '',                                          demoType: 'pubblica-privata' },
    { emoji: '🚀', icon: 'rocket_launch', titleKey: 'LEADER_TUTORIAL.SLIDE_3.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_3.DESC', accent: '#10B981', gradient: '',                                         demoType: 'avvia-lega' },
    { emoji: '📨', icon: 'group_add',    titleKey: 'LEADER_TUTORIAL.SLIDE_4.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_4.DESC', accent: '#3B82F6', gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
    { emoji: '⏳', icon: 'how_to_reg',   titleKey: 'LEADER_TUTORIAL.SLIDE_5.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_5.DESC', accent: '#8B5CF6', gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
    { emoji: '⚽', icon: 'calculate',    titleKey: 'LEADER_TUTORIAL.SLIDE_6.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_6.DESC', accent: '#10B981', gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
    { emoji: '🟡', icon: 'pause_circle', titleKey: 'LEADER_TUTORIAL.SLIDE_7.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_7.DESC', accent: '#EF4444', gradient: 'linear-gradient(135deg, #FFF5F5, #FEE2E2)' },
    { emoji: '🎯', icon: 'tune',         titleKey: 'LEADER_TUTORIAL.SLIDE_8.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_8.DESC', accent: '#0891B2', gradient: '', demoType: 'forza-risultati' },
    { emoji: '✏️', icon: 'edit_note',    titleKey: 'LEADER_TUTORIAL.SLIDE_9.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_9.DESC', accent: '#7C3AED', gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
    { emoji: '🏆', icon: 'emoji_events', titleKey: 'LEADER_TUTORIAL.SLIDE_10.TITLE', descKey: 'LEADER_TUTORIAL.SLIDE_10.DESC', accent: '#F59E0B', gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)' },
  ];

  private _manageDemoInterval(): void {
    if (this._demoInterval) { clearInterval(this._demoInterval); this._demoInterval = null; }
    const demoType = this.slides[this._current]?.demoType;
    if (demoType === 'forza-risultati') {
      this.demoStep = 0;
      this._demoInterval = setInterval(() => { this.demoStep = (this.demoStep + 1) % 3; }, 2200);
    } else if (demoType === 'pubblica-privata') {
      this.demoStep = 0;
      this._demoInterval = setInterval(() => { this.demoStep = (this.demoStep + 1) % 2; }, 2000);
    } else if (demoType === 'avvia-lega') {
      this.demoStep = 0;
      this._demoInterval = setInterval(() => { this.demoStep = (this.demoStep + 1) % 2; }, 2500);
    }
  }

  ngOnDestroy(): void {
    if (this._demoInterval) clearInterval(this._demoInterval);
  }

  next(): void {
    if (this._current < this.slides.length - 1) this.current++;
  }

  prev(): void {
    if (this._current > 0) this.current--;
  }

  finish(): void {
    this.markSeen();
    this.dismissed.emit();
  }

  skip(): void {
    this.markSeen();
    this.dismissed.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    // Non chiudere sul click del backdrop — forza l'utente a leggere
    void event;
  }

  private markSeen(): void {
    localStorage.setItem('survivor_leader_tutorial_seen', '1');
  }
}
