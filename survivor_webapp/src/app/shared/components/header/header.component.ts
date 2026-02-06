import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
    MatTooltipModule,
    TranslateModule,
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-content">
        <div class="left-section">
          <div class="title-logo-container">
            <mat-label class="header-title" *ngIf="title">{{ title }}</mat-label>
            <img src="assets/survivor-logo-simple.svg" alt="Survivor Logo" class="header-logo" />
          </div>
        </div>
        <ng-content select=".config-user"></ng-content>
        <div class="actions" *ngIf="!hideActions">
          <button
            *ngIf="visHome === 'S'"
            mat-button
            (click)="back.emit()"
            class="btn-back"
          >
            ← {{ 'HEADER.BACK_TO_HOME' | translate }}
          </button>


          <mat-icon
            *ngIf="visLogout === 'S'"
            class="logout-icon"
            (click)="logout.emit()"
            [matTooltip]="'HEADER.LOGOUT' | translate"
            >logout</mat-icon
          >
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      :host {
        display: block;
        width: 100%;
      }
      .header {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        min-height: 80px;
      }
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
      }
      .left-section {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-right: auto;
      }
      .title-logo-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        margin-left: 0;
        padding-left: 0;
      }
      .header-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        font-family: 'Poppins', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
      .header-logo {
        height: 28px;
        width: auto;
        filter: brightness(0) invert(1);
        opacity: 0.85;
      }


      /* Logo SURVIVOR 90px nella home quando title è vuoto */
      :host-context(.home-container) .title-logo-container:not(:has(.header-title:not(:empty))) .header-logo {
        height: 90px;
      }

      .header-content ::ng-deep .config-user {
        margin-left: auto;
      }
      .actions {
        display: flex;
        gap: 15px;
        align-items: center;
      }
      .btn-back {
        font-size: 0.8rem !important;
        font-weight: 600 !important;
        color: white !important;
        font-family: 'Poppins', sans-serif !important;
        background: rgba(255, 255, 255, 0.15) !important;
        border: 1.5px solid rgba(255, 255, 255, 0.3) !important;
        border-radius: 8px !important;
        padding: 6px 14px !important;
        transition: all 0.2s ease !important;
        min-height: 32px !important;
        text-transform: none !important;
        letter-spacing: 0.3px !important;
      }
      .btn-back:hover {
        background: rgba(255, 255, 255, 0.25) !important;
        border-color: rgba(255, 255, 255, 0.5) !important;
        transform: none !important;
        box-shadow: none !important;
      }
      .logout-icon {
        color: white;
        cursor: pointer;
        font-size: 18px;
        width: 18px;
        height: 18px;
        transition: all 0.2s ease;
      }

      .logout-icon:hover {
        transform: scale(1.1);
        opacity: 0.8;
      }


      /* RESPONSIVE - Breakpoint intermedio tablet */
      @media (max-width: 1024px) {
        :host-context(.home-container) .title-logo-container:not(:has(.header-title:not(:empty))) .header-logo {
          height: 55px;
        }
      }

      @media (max-width: 768px) {
        .header {
          min-height: 75px;
        }
        .header-content {
          flex-wrap: wrap;
          padding: 0 16px;
        }
        .header-logo {
          height: 22px;
        }
        /* Logo 50px nella home (tablet/mobile) */
        :host-context(.home-container) .title-logo-container:not(:has(.header-title:not(:empty))) .header-logo {
          height: 50px;
        }
        .header-title {
          font-size: 1.1rem;
        }
        .btn-back {
          font-size: 0.7rem !important;
          padding: 4px 10px !important;
          white-space: nowrap !important;
          min-height: 30px !important;
        }
      }

      @media (max-width: 480px) {
        .header {
          min-height: 70px;
        }
        .header-content {
          padding: 0 12px;
        }
        .header-title {
          font-size: 0.9rem;
        }
        .header-logo {
          height: 18px;
        }
        /* Logo 42px nella home (mobile piccolo) */
        :host-context(.home-container) .title-logo-container:not(:has(.header-title:not(:empty))) .header-logo {
          height: 42px;
        }
        .btn-back {
          font-size: 0.65rem !important;
          padding: 3px 8px !important;
          min-height: 28px !important;
        }
      }

      @media (max-width: 360px) {
        .header {
          min-height: 65px;
        }
        /* Logo 38px nella home (molto piccolo) */
        :host-context(.home-container) .title-logo-container:not(:has(.header-title:not(:empty))) .header-logo {
          height: 38px;
        }
      }
    `,
  ],
})
export class HeaderComponent {
  @Input() title = '';
  @Input() visHome = 'S';
  @Input() visLogout = 'N';
  @Input() hideActions = false;
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
