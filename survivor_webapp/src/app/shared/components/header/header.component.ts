import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { NotificationBellComponent } from '../notification-bell/notification-bell.component';

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
    NotificationBellComponent,
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-content">
        <div class="left-section">
          <div class="title-logo-container">
            <mat-label
              class="header-title"
              *ngIf="title"
              [matTooltip]="title"
              matTooltipShowDelay="400"
            >{{ title }}</mat-label>
            <img src="assets/logo.png" alt="Survivor Logo" class="header-logo" />
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

          <app-notification-bell *ngIf="visLogout === 'S'" class="notification-bell"></app-notification-bell>

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
        position: sticky;
        top: 0;
        z-index: 1000;
      }
      .header {
        display: flex;
        width: 100%;
        box-sizing: border-box;
        min-height: 80px;
        /* Safe area per notch (iOS standalone/fullscreen): applicata solo
           in modalità app nativa, con fallback 0 per non alterare il browser */
        padding-top: 0;
      }

      /* In modalità standalone (app installata iOS/Android con overlay statusbar) */
      @media all and (display-mode: standalone) {
        .header {
          padding-top: env(safe-area-inset-top, 0px);
        }
      }
      .header-content {
        max-width: 1200px;
        margin: 0 auto;
        padding: 0 20px;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        gap: 12px;
        min-width: 0;
      }
      .left-section {
        display: flex;
        align-items: center;
        gap: 16px;
        flex: 1 1 auto;
        min-width: 0;
        overflow: hidden;
      }
      .title-logo-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
        margin-left: 0;
        padding-left: 0;
        min-width: 0;
        overflow: hidden;
        max-width: 100%;
      }
      .header-title {
        font-size: 1.5rem;
        font-weight: 700;
        color: white;
        font-family: 'Poppins', sans-serif;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        display: block;
        cursor: default;
      }
      .header-logo {
        height: 100px;
        width: auto;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));
        opacity: 0.95;
      }

      ::ng-deep .mat-toolbar-row,
      ::ng-deep .mat-toolbar-single-row {
        padding: 0 0px;
      }

      .header-content ::ng-deep .config-user {
        margin-left: auto;
      }
      .actions {
        display: flex;
        gap: 12px;
        align-items: center;
        flex-shrink: 0;
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

      ::ng-deep .notification-bell {
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .logout-icon {
        color: white;
        cursor: pointer;
        font-size: 18px;
        width: 18px;
        height: 18px;
        padding: 9px;
        border-radius: 50%;
        transition: all 0.2s ease;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        box-sizing: content-box;
      }

      .logout-icon:hover {
        transform: scale(1.1);
        opacity: 0.8;
        background: rgba(255, 255, 255, 0.1);
      }


      /* RESPONSIVE */
      @media (max-width: 768px) {
        .header-content {
          flex-wrap: nowrap;
          padding: 0 16px;
        }
        .actions {
          gap: 8px;
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
        .logout-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
          padding: 8px;
        }
      }

      @media (max-width: 480px) {
        .header-content {
          padding: 0 8px;
          gap: 2px;
        }
        .actions {
          gap: 0px;
        }
        .header-title {
          font-size: 0.9rem;
        }
        .btn-back {
          font-size: 0.65rem !important;
          padding: 3px 8px !important;
          min-height: 28px !important;
        }
        .logout-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          padding: 9px;
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
