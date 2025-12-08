import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  message = '';
  isLoading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.testAdminEndpoint();
  }

  testAdminEndpoint(): void {
    this.http.get('/admin', { responseType: 'text' })
      .subscribe({
        next: (response) => {
          this.message = response;
          this.isLoading = false;
        },
        error: (error) => {
          this.message = 'Accesso negato o errore nel caricamento';
          this.isLoading = false;
        }
      });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
