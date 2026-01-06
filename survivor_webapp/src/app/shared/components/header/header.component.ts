import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatLabel } from '@angular/material/form-field';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatLabel,
  ],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-content">
        <mat-label>{{ title }}</mat-label>
        <ng-content select=".config-user"></ng-content>
        <div class="actions" *ngIf="!hideActions">
          <button
            *ngIf="visHome === 'S'"
            mat-button
            (click)="back.emit()"
            class="btn-back"
          >
            ← Torna alla Home
          </button>

          <mat-icon
            *ngIf="visLogout === 'S'"
            class="logout-icon"
            (click)="logout.emit()"
            matTooltip="Logout"
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
      .header-content ::ng-deep .config-user {
        margin-left: auto;
      }
      .header-content ::ng-deep .config-user { margin-left: auto; }
      .actions {
        display: flex;
        gap: 15px;
        align-items: center;
      }
      .logout-icon {
        color: white;
        cursor: pointer;
        font-size: 20px;
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
