import { Component, OnDestroy, OnInit } from '@angular/core';
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
export class ServiceUnavailableComponent implements OnDestroy, OnInit {
  checking = false;
  private pollingInterval: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startPolling();
  }

  refresh(): void {
    // original behaviour: reload the page
    window.location.reload();
  }

  private startPolling(): void {
    if (this.pollingInterval) return;
    this.checking = true;

    const tryProbe = () => {
      this.auth.probeMyData(true).subscribe({
        next: () => {
          this.clearPolling();
          this.checking = false;
          this.router.navigate(['/home']).catch(() => { window.location.href = '/home'; });
        },
        error: () => {
          // ignore; next interval will retry
        }
      });
    };

    this.pollingInterval = setInterval(tryProbe, 10000);
    tryProbe();
  }

  private clearPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.checking = false;
  }

  ngOnDestroy(): void {
    this.clearPolling();
  }

  goBack(): void {
    window.history.back();
  }
}
