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
  selector: 'app-player-tutorial',
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
      <div class="ob-card" role="dialog" aria-modal="true" [attr.aria-label]="'PLAYER_TUTORIAL.ARIA_LABEL' | translate">

        <!-- Badge ruolo -->
        <div class="ob-role-badge">
          <mat-icon class="ob-role-icon">sports</mat-icon>
          <span>{{ 'PLAYER_TUTORIAL.ROLE_BADGE' | translate }}</span>
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
              @if (slide.demoType === 'modifica-giocata') {
                <div class="ob-demo-wrapper">
                  <div class="ob-demo-mockup demo-modifica-mockup">
                    <div class="demo-pick-card" [class.demo-pick-card--selected]="demoStep >= 0">
                      <span class="demo-pick-logo">🏆</span>
                      <div class="demo-pick-info">
                        <span class="demo-pick-name">Juventus</span>
                        <span class="demo-pick-round">{{ 'PLAYER_TUTORIAL.DEMO_ROUND' | translate }}</span>
                      </div>
                      <mat-icon class="demo-pick-check">check_circle</mat-icon>
                    </div>
                    <div class="demo-modifica-btn" [class.demo-modifica-btn--visible]="demoStep === 1">
                      <mat-icon class="demo-icon">edit</mat-icon>
                      <span>{{ 'COMMON.EDIT' | translate }}</span>
                    </div>
                    <div class="demo-pick-card demo-pick-card--new" [class.demo-pick-card--visible]="demoStep === 2">
                      <span class="demo-pick-logo">⚽</span>
                      <div class="demo-pick-info">
                        <span class="demo-pick-name">Inter</span>
                        <span class="demo-pick-round">{{ 'PLAYER_TUTORIAL.DEMO_NEW_PICK' | translate }}</span>
                      </div>
                      <mat-icon class="demo-pick-check demo-pick-check--green">check_circle</mat-icon>
                    </div>
                  </div>
                </div>
              } @else if (slide.demoType === 'storico-colori') {
                <div class="ob-demo-wrapper">
                  <div class="ob-demo-mockup demo-storico-mockup">
                    <div class="demo-storico-header">{{ 'PLAYER_TUTORIAL.DEMO_HISTORY_TITLE' | translate }} — Mario</div>
                    <div class="demo-storico-row demo-storico-row--win" [class.demo-storico-row--active]="demoStep === 0">
                      <span class="demo-storico-g">G27</span>
                      <span class="demo-storico-team">Napoli</span>
                      <span class="demo-storico-badge demo-storico-badge--win">✓ {{ 'PLAYER_TUTORIAL.DEMO_WON' | translate }}</span>
                    </div>
                    <div class="demo-storico-row demo-storico-row--loss" [class.demo-storico-row--active]="demoStep === 1">
                      <span class="demo-storico-g">G28</span>
                      <span class="demo-storico-team">Juventus</span>
                      <span class="demo-storico-badge demo-storico-badge--loss">✗ {{ 'PLAYER_TUTORIAL.DEMO_LOST' | translate }}</span>
                    </div>
                    <div class="demo-storico-row demo-storico-row--win" [class.demo-storico-row--active]="demoStep === 2">
                      <span class="demo-storico-g">G29</span>
                      <span class="demo-storico-team">Milan</span>
                      <span class="demo-storico-badge demo-storico-badge--win">✓ {{ 'PLAYER_TUTORIAL.DEMO_WON' | translate }}</span>
                    </div>
                    <div class="demo-storico-legend">
                      <span class="demo-legend-item demo-legend-item--win">🟢 {{ 'PLAYER_TUTORIAL.DEMO_SURVIVED' | translate }}</span>
                      <span class="demo-legend-item demo-legend-item--loss">🔴 {{ 'PLAYER_TUTORIAL.DEMO_ELIMINATED' | translate }}</span>
                    </div>
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
            {{ 'PLAYER_TUTORIAL.SKIP' | translate }}
          </button>
          <div class="ob-nav-btns">
            @if (current > 0) {
              <button class="ob-btn ob-btn--back" (click)="prev()">
                <mat-icon>arrow_back</mat-icon>
              </button>
            }
            @if (current < slides.length - 1) {
              <button class="ob-btn ob-btn--next" (click)="next()">
                {{ 'PLAYER_TUTORIAL.NEXT' | translate }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            } @else {
              <button class="ob-btn ob-btn--finish" (click)="finish()">
                {{ 'PLAYER_TUTORIAL.FINISH' | translate }}
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
      color: #0A3D91;
      text-transform: uppercase;
      letter-spacing: 0.08em;
    }

    .ob-role-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      color: #0A3D91;
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
        background: linear-gradient(90deg, #0A3D91, #4FC3F7);
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
      color: #0A3D91;
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
      color: #0A3D91;
      padding: 10px;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      justify-content: center;

      &:hover { background: #E2E8F0; }
    }

    .ob-btn--next {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      padding: 10px 20px;
      font-size: 0.88rem;
      box-shadow: 0 4px 14px rgba(10, 61, 145, 0.30);

      &:hover {
        box-shadow: 0 6px 20px rgba(10, 61, 145, 0.40);
        transform: translateY(-1px);
      }
    }

    .ob-btn--finish {
      background: linear-gradient(135deg, #1B5E20, #4CAF50);
      color: #fff;
      padding: 10px 20px;
      font-size: 0.88rem;
      box-shadow: 0 4px 14px rgba(27, 94, 32, 0.30);
      border-radius: 12px;

      &:hover {
        box-shadow: 0 6px 20px rgba(27, 94, 32, 0.40);
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

    /* ── Demo wrapper shared ── */
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

    /* ── Demo: Modifica giocata ── */
    .demo-modifica-mockup { align-items: center; }

    .demo-pick-card {
      display: flex;
      align-items: center;
      gap: 10px;
      width: 100%;
      background: #fff;
      border: 2px solid #0A3D91;
      border-radius: 10px;
      padding: 8px 12px;
      box-sizing: border-box;
      transition: border-color 0.3s, opacity 0.4s;

      &.demo-pick-card--new {
        border-color: #10B981;
        opacity: 0;
        transform: translateY(6px);
        transition: opacity 0.4s ease, transform 0.4s ease;

        &.demo-pick-card--visible {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }

    .demo-pick-logo { font-size: 1.4rem; line-height: 1; flex-shrink: 0; }

    .demo-pick-info {
      display: flex;
      flex-direction: column;
      flex: 1;
    }

    .demo-pick-name {
      font-family: 'Poppins', sans-serif;
      font-size: 0.75rem;
      font-weight: 800;
      color: #0F172A;
    }

    .demo-pick-round {
      font-family: 'Poppins', sans-serif;
      font-size: 0.58rem;
      color: #64748B;
    }

    .demo-pick-check {
      font-size: 20px !important;
      width: 20px !important;
      height: 20px !important;
      color: #0A3D91;

      &.demo-pick-check--green { color: #10B981; }
    }

    .demo-modifica-btn {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      background: #F1F5F9;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      font-size: 0.68rem;
      font-weight: 700;
      padding: 5px 12px;
      border-radius: 20px;
      border: 1.5px solid #0A3D91;
      opacity: 0;
      transform: scale(0.8);
      transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);

      .demo-icon { font-size: 13px; width: 13px; height: 13px; }

      &.demo-modifica-btn--visible {
        opacity: 1;
        transform: scale(1);
      }
    }

    /* ── Demo: Storico colori ── */
    .demo-storico-mockup { padding: 0; overflow: hidden; }

    .demo-storico-header {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: 0.67rem;
      font-weight: 700;
      padding: 6px 12px;
      letter-spacing: 0.05em;
    }

    .demo-storico-row {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border-bottom: 1px solid #F1F5F9;
      transition: background 0.3s;

      &.demo-storico-row--win  { background: #F0FDF4; }
      &.demo-storico-row--loss { background: #FFF5F5; }
      &.demo-storico-row--active { filter: brightness(0.93); }
    }

    .demo-storico-g {
      font-family: 'Poppins', sans-serif;
      font-size: 0.6rem;
      font-weight: 700;
      color: #94A3B8;
      min-width: 26px;
    }

    .demo-storico-team {
      font-family: 'Poppins', sans-serif;
      font-size: 0.7rem;
      font-weight: 700;
      color: #0F172A;
      flex: 1;
    }

    .demo-storico-badge {
      font-family: 'Poppins', sans-serif;
      font-size: 0.58rem;
      font-weight: 800;
      padding: 2px 7px;
      border-radius: 6px;

      &.demo-storico-badge--win  { background: #DCFCE7; color: #166534; }
      &.demo-storico-badge--loss { background: #FEE2E2; color: #991B1B; }
    }

    .demo-storico-legend {
      display: flex;
      justify-content: center;
      gap: 12px;
      padding: 6px 12px;
      background: #F8FAFC;
    }

    .demo-legend-item {
      font-family: 'Poppins', sans-serif;
      font-size: 0.6rem;
      font-weight: 600;
      color: #475569;
      &.demo-legend-item--win  { color: #166534; }
      &.demo-legend-item--loss { color: #991B1B; }
    }

    .demo-icon { font-size: 13px; width: 13px; height: 13px; }

    @media (max-width: 480px) {
      .ob-demo-wrapper {
        width: calc(100% - 32px);
        margin-left: 16px;
        margin-right: 16px;
      }
    }
  `]
})
export class PlayerTutorialComponent implements OnDestroy {
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
    { emoji: '🎮', icon: 'sports',    titleKey: 'PLAYER_TUTORIAL.SLIDE_1.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_1.DESC', accent: '#0A3D91', gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' },
    { emoji: '👆', icon: 'touch_app', titleKey: 'PLAYER_TUTORIAL.SLIDE_2.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_2.DESC', accent: '#4FC3F7', gradient: 'linear-gradient(135deg, #F0F9FF, #E0F2FE)' },
    { emoji: '✏️', icon: 'edit',      titleKey: 'PLAYER_TUTORIAL.SLIDE_3.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_3.DESC', accent: '#10B981', gradient: '', demoType: 'modifica-giocata' },
    { emoji: '⏱️', icon: 'schedule',  titleKey: 'PLAYER_TUTORIAL.SLIDE_4.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_4.DESC', accent: '#EF4444', gradient: 'linear-gradient(135deg, #FFF5F5, #FEE2E2)' },
    { emoji: '🚫', icon: 'block',     titleKey: 'PLAYER_TUTORIAL.SLIDE_5.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_5.DESC', accent: '#8B5CF6', gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)' },
    { emoji: '👁️', icon: 'visibility', titleKey: 'PLAYER_TUTORIAL.SLIDE_6.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_6.DESC', accent: '#6366F1', gradient: 'linear-gradient(135deg, #EEF2FF, #E0E7FF)' },
    { emoji: '📊', icon: 'bar_chart', titleKey: 'PLAYER_TUTORIAL.SLIDE_7.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_7.DESC', accent: '#10B981', gradient: '', demoType: 'storico-colori' },
    { emoji: '🎉', icon: 'thumb_up',  titleKey: 'PLAYER_TUTORIAL.SLIDE_8.TITLE', descKey: 'PLAYER_TUTORIAL.SLIDE_8.DESC', accent: '#10B981', gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)' },
  ];

  private _manageDemoInterval(): void {
    if (this._demoInterval) { clearInterval(this._demoInterval); this._demoInterval = null; }
    const demoType = this.slides[this._current]?.demoType;
    if (demoType === 'modifica-giocata') {
      this.demoStep = 0;
      this._demoInterval = setInterval(() => { this.demoStep = (this.demoStep + 1) % 3; }, 2000);
    } else if (demoType === 'storico-colori') {
      this.demoStep = 0;
      this._demoInterval = setInterval(() => { this.demoStep = (this.demoStep + 1) % 3; }, 1500);
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
    localStorage.setItem('survivor_player_tutorial_seen', '1');
  }
}
