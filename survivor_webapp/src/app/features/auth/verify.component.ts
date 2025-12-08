import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './verify.component.html',
  styleUrl: './verify.component.scss'
})
export class VerifyComponent implements OnInit {
  isLoading = true;
  message = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.message = 'Token non trovato';
      this.isSuccess = false;
      this.isLoading = false;
      return;
    }

    this.authService.verifyMagicLink(token).subscribe({
      next: (response) => {
        this.isSuccess = true;
        this.message = 'Autenticazione riuscita! Reindirizzamento...';
        this.isLoading = false;
        
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 2000);
      },
      error: (error) => {
        this.isSuccess = false;
        this.message = 'Token non valido o scaduto';
        this.isLoading = false;
      }
    });
  }
}
