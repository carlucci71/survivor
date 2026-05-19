import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, state, style, animate, transition } from '@angular/animations';
import { TranslateModule } from '@ngx-translate/core';

interface OnboardingSlide {
  icon: string;
  emoji: string;
  titleKey: string;
  descKey: string;
  accent: string;
  gradient: string;
}

@Component({
  selector: 'app-onboarding',
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
      <div class="ob-card" role="dialog" aria-modal="true">

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

              <!-- Illustration -->
              <div class="ob-illustration" [style.background]="slide.gradient">
                <div class="ob-emoji-ring" [style.borderColor]="slide.accent + '44'">
                  <span class="ob-emoji" [class.multi]="slide.emoji.length > 4">{{ slide.emoji }}</span>
                </div>
                <mat-icon class="ob-bg-icon" [style.color]="slide.accent + '22'">{{ slide.icon }}</mat-icon>
              </div>

              <!-- Text -->
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
            {{ 'ONBOARDING.SKIP' | translate }}
          </button>

          <div class="ob-nav-btns">
            @if (current > 0) {
              <button class="ob-btn ob-btn--back" (click)="prev()">
                <mat-icon>arrow_back</mat-icon>
              </button>
            }

            @if (current < slides.length - 1) {
              <button class="ob-btn ob-btn--next" (click)="next()">
                {{ 'ONBOARDING.NEXT' | translate }}
                <mat-icon>arrow_forward</mat-icon>
              </button>
            } @else {
              <button class="ob-btn ob-btn--finish" (click)="finish()">
                {{ 'ONBOARDING.FINISH' | translate }}
                <mat-icon>sports_score</mat-icon>
              </button>
            }
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    /* ── Backdrop ── */
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

    /* ── Card ── */
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

    /* ── Progress dots ── */
    .ob-dots {
      display: flex;
      justify-content: center;
      gap: 8px;
      padding: 20px 24px 0;
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

    /* ── Slide ── */
    .ob-slide {
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    /* ── Illustration ── */
    .ob-illustration {
      width: 100%;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      overflow: hidden;
      margin-top: 16px;
      border-radius: 16px;
      margin-left: 24px;
      margin-right: 24px;
      width: calc(100% - 48px);
      flex-shrink: 0;
    }

    .ob-emoji-ring {
      width: 110px;
      height: 110px;
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
      font-size: 3.6rem;
      line-height: 1;
      animation: bob 3s ease-in-out infinite;
      letter-spacing: -2px;

      &.multi {
        font-size: 1.9rem;
        letter-spacing: 2px;
      }
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

    /* ── Text ── */
    .ob-text {
      padding: 20px 28px 8px;
      text-align: center;
    }

    .ob-title {
      font-family: 'Poppins', sans-serif;
      font-size: 1.35rem;
      font-weight: 800;
      color: #0A3D91;
      margin: 0 0 10px;
      line-height: 1.3;
    }

    .ob-desc {
      font-family: 'Poppins', sans-serif;
      font-size: 0.92rem;
      color: #4A5568;
      line-height: 1.65;
      margin: 0;
    }

    /* ── Actions ── */
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

    /* ── Responsive ── */
    @media (max-width: 480px) {
      .ob-card {
        border-radius: 20px;
        max-height: 90vh;
        overflow-y: auto;
      }

      .ob-illustration {
        height: 160px;
        margin-left: 16px;
        margin-right: 16px;
        width: calc(100% - 32px);
      }

      .ob-emoji-ring {
        width: 90px;
        height: 90px;
      }

      .ob-emoji { font-size: 2.8rem; }
      .ob-emoji.multi { font-size: 1.5rem; }

      .ob-title  { font-size: 1.15rem; }
      .ob-desc   { font-size: 0.85rem; }

      .ob-text   { padding: 16px 20px 6px; }
      .ob-actions { padding: 12px 20px 20px; }

      .ob-btn--next,
      .ob-btn--finish { padding: 9px 16px; font-size: 0.82rem; }
    }

    @media (max-width: 360px) {
      .ob-illustration { height: 140px; }
      .ob-emoji-ring { width: 80px; height: 80px; }
      .ob-emoji { font-size: 2.4rem; }
      .ob-emoji.multi { font-size: 1.3rem; }
      .ob-title { font-size: 1rem; }
    }
  `]
})
export class OnboardingComponent {
  @Output() dismissed = new EventEmitter<void>();

  current = 0;

  readonly slides: OnboardingSlide[] = [
    {
      emoji: '🏆',
      icon: 'emoji_events',
      titleKey: 'ONBOARDING.SLIDE_1.TITLE',
      descKey: 'ONBOARDING.SLIDE_1.DESC',
      accent: '#0A3D91',
      gradient: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)'
    },
    {
      emoji: '⚽🏀🎾',
      icon: 'sports',
      titleKey: 'ONBOARDING.SLIDE_2.TITLE',
      descKey: 'ONBOARDING.SLIDE_2.DESC',
      accent: '#1a6bcc',
      gradient: 'linear-gradient(135deg, #EFF6FF, #E0F2FE)'
    },
    {
      emoji: '🎯',
      icon: 'track_changes',
      titleKey: 'ONBOARDING.SLIDE_3.TITLE',
      descKey: 'ONBOARDING.SLIDE_3.DESC',
      accent: '#E53935',
      gradient: 'linear-gradient(135deg, #FFF5F5, #FEE2E2)'
    },
    {
      emoji: '🔗',
      icon: 'groups',
      titleKey: 'ONBOARDING.SLIDE_4.TITLE',
      descKey: 'ONBOARDING.SLIDE_4.DESC',
      accent: '#8B5CF6',
      gradient: 'linear-gradient(135deg, #F5F3FF, #EDE9FE)'
    },
    {
      emoji: '🚪',
      icon: 'login',
      titleKey: 'ONBOARDING.SLIDE_5.TITLE',
      descKey: 'ONBOARDING.SLIDE_5.DESC',
      accent: '#10B981',
      gradient: 'linear-gradient(135deg, #ECFDF5, #D1FAE5)'
    },
    {
      emoji: '👑',
      icon: 'star',
      titleKey: 'ONBOARDING.SLIDE_6.TITLE',
      descKey: 'ONBOARDING.SLIDE_6.DESC',
      accent: '#F59E0B',
      gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
    },
    {
      emoji: '🦁',
      icon: 'military_tech',
      titleKey: 'ONBOARDING.SLIDE_7.TITLE',
      descKey: 'ONBOARDING.SLIDE_7.DESC',
      accent: '#F59E0B',
      gradient: 'linear-gradient(135deg, #FFFBEB, #FEF3C7)'
    }
  ];

  next(): void {
    if (this.current < this.slides.length - 1) this.current++;
  }

  prev(): void {
    if (this.current > 0) this.current--;
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
    if ((event.target as HTMLElement).classList.contains('ob-backdrop')) {
      // Don't close on backdrop click — force the user to read at least a bit
    }
  }

  private markSeen(): void {
    localStorage.setItem('survivor_onboarding_v2_seen', '1');
  }
}
