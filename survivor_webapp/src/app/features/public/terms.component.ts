import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        HeaderComponent,
        TranslateModule
    ],
    template: `
    <div class="page-container">
      <app-header
        [title]="'FOOTER.TERMS' | translate"
        visHome="S"
        (back)="goBack()"
        [hideActions]="false"
      ></app-header>

      <main class="content">
        <mat-card class="policy-card">
          <mat-card-content #cardContent (scroll)="onScroll($event)">
            <div class="content-section">
              <!-- Content from TerminiDialogComponent -->
              <h3>{{ 'TERMS.TITLE' | translate }}</h3>
              <p class="subtitle">{{ 'TERMS.SUBTITLE' | translate }}</p>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_1_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_1_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_2_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_2_P1' | translate }}</p>
                <p>{{ 'TERMS.SECTION_2_P2' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_3_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_3_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_4_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_4_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_5_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_5_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_6_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_6_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_7_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_7_P1' | translate }}</p>
                <p>{{ 'TERMS.SECTION_7_P2' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_8_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_8_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_9_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_9_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_10_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_10_TEXT' | translate }}</p>
              </div>

              <div class="section">
                <h4>{{ 'TERMS.SECTION_11_TITLE' | translate }}</h4>
                <p>{{ 'TERMS.SECTION_11_TEXT' | translate }} <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
              </div>
            </div>

            <!-- BACK TO TOP BUTTON -->
            <button
              mat-mini-fab
              class="back-to-top-btn"
              [class.visible]="showBackToTop"
              (click)="scrollToTop()"
              aria-label="Torna su">
              <mat-icon>arrow_upward</mat-icon>
            </button>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `,
    styles: [`
    .page-container {
      min-height: 100vh;
      background: #F4F6F8;
      display: flex;
      flex-direction: column;
    }
    .content {
      flex: 1;
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    .policy-card {
      max-width: 800px;
      width: 100%;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      background: #FFFFFF;
      padding: 0;
      position: relative;

      mat-card-content {
        max-height: 70vh;
        overflow-y: auto;
        padding: 24px;
        position: relative;

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
        }
      }
    }

    // Copying styles from PrivacyComponent for consistency
    .content-section {
      font-family: 'Poppins', sans-serif;

      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 32px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
    .section {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 12px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.95rem;
        line-height: 1.7;
        margin: 0 0 10px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          &:hover { text-decoration: underline; color: #0288D1; }
        }
      }
    }

    @media (max-width: 600px) {
      .content { padding: 16px; }
      .policy-card { padding: 16px; border-radius: 12px; }
      .content-section h3 { font-size: 1.3rem; }
      .content-section .subtitle { font-size: 1rem; margin-bottom: 24px; }
      .section h4 { font-size: 1rem; }
      .section p { font-size: 0.9rem; }
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

    @media (max-width: 600px) {
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
export class TermsComponent implements OnInit, OnDestroy {
    showBackToTop = false;
    private lastScrollTop = 0;
    private scrollTimeout: any;

    constructor(private router: Router) { }

    ngOnInit() {
        // Non serve più il window scroll listener
    }

    ngOnDestroy() {
        // Pulisci il timeout se esiste
        if (this.scrollTimeout) {
            clearTimeout(this.scrollTimeout);
        }
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
        const cardContent = document.querySelector('.policy-card mat-card-content');
        if (cardContent) {
            cardContent.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    goBack() {
        this.router.navigate(['/auth/login']);
    }
}
