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

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  email = '';
  message = '';
  isSuccess = false;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    if (!this.email) {
      this.message = 'Inserisci un indirizzo email valido';
      this.isSuccess = false;
      return;
    }

    this.isLoading = true;
    this.authService.requestMagicLink(this.email).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isSuccess = response.success;
        this.isLoading = false;
      },
      error: (error) => {
        this.message = 'Errore durante l\'invio del magic link';
        this.isSuccess = false;
        this.isLoading = false;
      }
    });
  }
}
