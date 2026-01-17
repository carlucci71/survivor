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
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TerminiDialogComponent, PrivacyDialogComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatProgressSpinnerModule, MatDialogModule],
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
    private router: Router,
    private dialog: MatDialog
  ) {}

  openTermini(event: Event): void {
    event.preventDefault();
    this.dialog.open(TerminiDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openPrivacy(event: Event): void {
    event.preventDefault();
    this.dialog.open(PrivacyDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

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

        this.authService.requestMagicLink(this.email).subscribe({
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
