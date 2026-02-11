import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';

// FAQ DIALOG COMPONENT
@Component({
  selector: 'app-faq-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, TranslateModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">help</mat-icon>
        <span class="value">{{ 'FAQ.TITLE' | translate }}</span>
      </h2>
      <div class="content-section">
        <div class="faq-item">
          <h4>{{ 'FAQ.Q1' | translate }}</h4>
          <p>{{ 'FAQ.A1' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q2' | translate }}</h4>
          <p>{{ 'FAQ.A2' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q3' | translate }}</h4>
          <p>{{ 'FAQ.A3' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q4' | translate }}</h4>
          <p>{{ 'FAQ.A4' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q5' | translate }}</h4>
          <p>{{ 'FAQ.A5' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q6' | translate }}</h4>
          <p>{{ 'FAQ.A6' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q7' | translate }}</h4>
          <p>{{ 'FAQ.A7' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q8' | translate }}</h4>
          <p>{{ 'FAQ.A8' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q9' | translate }}</h4>
          <p>{{ 'FAQ.A9' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q10' | translate }}</h4>
          <p>{{ 'FAQ.A10' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q11' | translate }}</h4>
          <p>{{ 'FAQ.A11' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q12' | translate }}</h4>
          <p>{{ 'FAQ.A12' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q13' | translate }}</h4>
          <p>{{ 'FAQ.A13' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q14' | translate }}</h4>
          <p>{{ 'FAQ.A14' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q15' | translate }}</h4>
          <p>{{ 'FAQ.A15' | translate }}</p>
        </div>

        <div class="faq-item">
          <h4>{{ 'FAQ.Q16' | translate }}</h4>
          <p>{{ 'FAQ.A16' | translate }} <a href="mailto:survivorwinorgohome@gmail.com">survivorwinorgohome&#64;gmail.com</a>.</p>
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

      mat-icon {
        color: #0A3D91;
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: rgba(10, 61, 145, 0.15);
        transform: scale(1.1);
      }
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

      .title-icon {
        font-size: 1.5rem;
        color: #4FC3F7;
      }

      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .content-section {
      padding-top: 8px;
    }

    .faq-item {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

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
        margin: 0;

        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media (max-width: 480px) {
      .modal-container {
        padding: 16px;
      }

      h2 {
        font-size: 1.1rem;
      }

      .faq-item h4 {
        font-size: 0.9rem;
      }

      .faq-item p {
        font-size: 0.85rem;
      }
    }
  `]
})
export class FaqDialogComponent {
  constructor(private dialog: MatDialog) {}


  closeDialog() {
    this.dialog.closeAll();
  }
}
