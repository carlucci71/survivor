import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { AfterViewInit, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements AfterViewInit {
  @ViewChild('emailInput') emailInput!: ElementRef<HTMLInputElement>;

  ngAfterViewInit(): void {
    if (this.emailInput) {
      this.emailInput.nativeElement.addEventListener('blur', () => {
        // iOS workaround: reset zoom/scale after keyboard closes
        if (document.activeElement !== this.emailInput.nativeElement) {
          document.body.style.transform = 'scale(1)';
          document.body.style.zoom = 'reset';
          setTimeout(() => {
            document.body.style.transform = '';
            document.body.style.zoom = '';
          }, 100);
        }
      });
    }
  }

  email = '';
  message = '';
  isSuccess = false;
  termsAccepted = false;
  activeTab: 'login' | 'register' = 'login';

  setTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
    this.message = '';
  }

  constructor(
    private authService: AuthService,
    private translate: TranslateService
  ) { }

  onSubmit(): void {
    if (!this.email) {
      this.message = this.translate.instant('AUTH.EMAIL_INVALID');
      this.isSuccess = false;
      return;
    }

    if (!this.termsAccepted) {
      this.message = this.translate.instant('AUTH.TERMS_REQUIRED');
      this.isSuccess = false;
      return;
    }

    if (this.activeTab === 'register') {
      this.authService.requestMagicLink(this.email, environment.mobile).subscribe({
        next: (response) => {
          this.message = response.message;
          this.isSuccess = response.success;
          window.location.href = `${environment.baseUrl}/auth/magic-link-sent`;
        },
        error: (error) => {
          this.message = this.translate.instant('AUTH.MAGIC_LINK_SEND_ERROR');
          this.isSuccess = false;
        }
      });
    } else {
      this.authService.login(this.email, environment.mobile).subscribe({
        next: (response) => {
          this.message = response.message;
          this.isSuccess = response.success;
          window.location.href = `${environment.baseUrl}/auth/magic-link-sent`;
        },
        error: (error) => {
          if (error.status === 404) {
            this.message = this.translate.instant('AUTH.EMAIL_NOT_FOUND');
          } else {
            this.message = error.error?.message || this.translate.instant('AUTH.LOGIN_ERROR_GENERIC');
          }
          this.isSuccess = false;
        }
      });
    }
  }
}
