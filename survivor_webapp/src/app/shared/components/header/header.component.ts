import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatToolbarModule, MatButtonModule],
  template: `
    <mat-toolbar color="primary" class="header">
      <div class="header-content">
        <h1>{{ title }}</h1>
        <div class="actions" *ngIf="!hideActions">
          <button mat-button (click)="back.emit()" class="btn-back">← Torna alla Home</button>
          <!--
          <button mat-raised-button color="warn" (click)="logout.emit()" class="btn-logout">Logout</button>
-->
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [
    `
      :host { display: block; width: 100%; }
      .header { display: flex; width: 100%; box-sizing: border-box; }
      .header-content { max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%; display: flex; align-items: center; justify-content: space-between; }
      .actions { display: flex; gap: 15px; align-items: center; }
    `
  ]
})
export class HeaderComponent {
  @Input() title = '';
  @Input() hideActions = false;
  @Output() back = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
}
