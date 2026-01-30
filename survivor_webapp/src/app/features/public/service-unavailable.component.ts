import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, HeaderComponent, TranslateModule],
  template: `
    <div class="page-container">
      <app-header [title]="'SERVICE_UNAVAILABLE.TITLE' | translate" (back)="goBack()" [hideActions]="true"></app-header>

      <main class="content">
        <mat-card class="info-card">
          <mat-card-content>
            <h2>{{ 'SERVICE_UNAVAILABLE.HEADING' | translate }}</h2>
            <p>{{ 'SERVICE_UNAVAILABLE.MESSAGE' | translate }}</p>

            <div class="actions">
              <button mat-raised-button color="primary" (click)="refresh()">{{ 'COMMON.REFRESH' | translate }}</button>
            </div>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `,
  styles: [`
    .page-container { min-height: 100vh; display:flex; flex-direction:column; background: #F4F6F8; }
    .content { flex: 1; display:flex; align-items:center; justify-content:center; padding: 20px; }
    .info-card { max-width: 720px; width:100%; text-align:center; padding: 24px; }
    .actions { margin-top: 16px; }
  `]
})
export class ServiceUnavailableComponent {
  checking = false;

  constructor(private auth: AuthService, private router: Router) {}

  refresh(): void {
    if (this.checking) return;
    this.checking = true;
    this.auth.probeMyData(true).subscribe({
      next: () => {
        this.router.navigate(['/home']).catch(() => { window.location.href = '/home'; });
      },
        error: () => {
          // keep user on this page; re-enable button
          this.checking = false;
        }
    });
  }

  goBack(): void {
    window.history.back();
  }
}
