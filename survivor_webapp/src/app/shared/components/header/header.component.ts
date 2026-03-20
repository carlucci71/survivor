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
            <div class="logo-row">
              <img src="assets/logo.png" alt="Survivor Logo" class="header-logo" />
              <span *ngIf="showSlogan" class="glitch-text" [attr.data-text]="sloganFull">{{ sloganFull }}</span>
            </div>
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
        min-height: 72px;
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
        min-width: 0;
        overflow: hidden;
        max-width: 100%;
      }
      .logo-row {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 2px;
      }
      @keyframes glitch-skew {
        0%, 100% { transform: skew(0deg); }
        2%  { transform: skew(1.5deg); }
        4%  { transform: skew(-1.5deg); }
        6%  { transform: skew(0.7deg); }
        8%  { transform: skew(-0.7deg); }
        10%, 90% { transform: skew(0deg); }
      }
      @keyframes glitch-1 {
        0%, 100% { clip-path: inset(0 0 100% 0); transform: translate(0); opacity: 0.8; }
        10% { clip-path: inset(20% 0 30% 0); transform: translate(-2px, 1px); opacity: 1; }
        20% { clip-path: inset(10% 0 60% 0); transform: translate(2px, -1px); opacity: 0.6; }
        30% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 2px); opacity: 1; }
        40% { clip-path: inset(70% 0 10% 0); transform: translate(2px, -2px); opacity: 0.7; }
        50% { clip-path: inset(30% 0 50% 0); transform: translate(-1px, 1px); opacity: 0.9; }
        60% { clip-path: inset(50% 0 30% 0); transform: translate(1px, -1px); opacity: 0.5; }
        70% { clip-path: inset(80% 0 10% 0); transform: translate(-2px, 2px); opacity: 0.8; }
        80% { clip-path: inset(15% 0 70% 0); transform: translate(2px, -2px); opacity: 1; }
      }
      @keyframes glitch-2 {
        0%, 100% { clip-path: inset(100% 0 0 0); transform: translate(0); opacity: 0.8; }
        10% { clip-path: inset(60% 0 20% 0); transform: translate(2px, -1px); opacity: 0.6; }
        20% { clip-path: inset(30% 0 50% 0); transform: translate(-2px, 1px); opacity: 1; }
        30% { clip-path: inset(10% 0 70% 0); transform: translate(2px, -2px); opacity: 0.7; }
        40% { clip-path: inset(40% 0 40% 0); transform: translate(-2px, 2px); opacity: 0.9; }
        50% { clip-path: inset(70% 0 10% 0); transform: translate(1px, -1px); opacity: 0.5; }
        60% { clip-path: inset(20% 0 60% 0); transform: translate(-1px, 1px); opacity: 1; }
        70% { clip-path: inset(50% 0 30% 0); transform: translate(2px, -2px); opacity: 0.8; }
        80% { clip-path: inset(80% 0 10% 0); transform: translate(-2px, 2px); opacity: 0.6; }
      }
      .glitch-text {
        font-family: 'Courier New', Courier, monospace;
        font-size: 0.65rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.92);
        letter-spacing: 2px;
        white-space: nowrap;
        text-transform: uppercase;
        position: relative;
        display: inline-block;
        animation: glitch-skew 4s infinite;
        text-shadow: 0 0 8px rgba(255,255,255,0.3);
      }
      .glitch-text::before,
      .glitch-text::after {
        content: attr(data-text);
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
      .glitch-text::before {
        animation: glitch-1 0.9s infinite linear alternate-reverse;
        color: #e94560;
        text-shadow: 1px 0 0 #4e9eff;
        z-index: -1;
      }
      .glitch-text::after {
        animation: glitch-2 0.9s infinite linear alternate-reverse;
        color: #4e9eff;
        text-shadow: -1px 0 0 #e94560;
        z-index: -2;
      }
      .header-title {
        font-size: 1rem;
        font-weight: 700;
        color: white;
        font-family: 'Poppins', sans-serif;
        text-transform: uppercase;
        letter-spacing: 1px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
        display: block;
        cursor: default;
        padding: 0;
        text-align: left;
        line-height: 1.2;
        text-shadow: 0 1px 4px rgba(0,0,0,0.18);
      }
      .header-logo {
        height: 100px;
        width: auto;
        filter: drop-shadow(0 1px 3px rgba(0,0,0,0.25));
        opacity: 0.95;
      }

      /* Pagine con titolo: logo piccolo e lasciato */
      .title-logo-container:has(.header-title) .header-logo {
        height: 36px;
        opacity: 0.85;
      }

      ::ng-deep .mat-toolbar-row,
      ::ng-deep .mat-toolbar-single-row {
        padding: 0 0px;
        height: auto !important;
        min-height: 64px;
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
          font-size: 0.9rem;
          letter-spacing: 0.8px;
        }
        .title-logo-container:has(.header-title) .header-logo {
          height: 30px;
        }
        .header-svg-anim {
          height: 22px;
          min-width: 120px;
        }
        .glitch-text {
          font-size: 0.6rem;
          letter-spacing: 1.5px;
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
          gap: 4px;
        }
        .actions {
          gap: 0px;
        }
        .header-title {
          font-size: 0.8rem;
          letter-spacing: 0.6px;
        }
        .title-logo-container:has(.header-title) .header-logo {
          height: 26px;
        }
        .header-svg-anim {
          height: 18px;
          min-width: 100px;
        }
        .glitch-text {
          font-size: 0.55rem;
          letter-spacing: 1px;
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
  @Input() showSlogan = false;
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  readonly sloganFull = 'WIN OR GO HOME';
}
