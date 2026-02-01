import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  email = '';
  message = '';
  isSuccess = false;
  termsAccepted = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Inserisci un indirizzo email valido';
      this.isSuccess = false;
      return;
    }

    if (!this.termsAccepted) {
      this.message = 'Devi accettare i Termini e Condizioni per continuare';
      this.isSuccess = false;
      return;
    }

    this.authService.requestMagicLink(this.email, environment.mobile).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isSuccess = response.success;
      },
      error: (error) => {
        this.message = 'Errore durante l\'invio del magic link';
        this.isSuccess = false;
      }
    });
  }
}
