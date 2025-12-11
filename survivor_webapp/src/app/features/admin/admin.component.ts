import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilService } from '../../core/services/util.service';
 
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss'
})
export class AdminComponent implements OnInit {
  profilo: {} = {};
  calendario: {} = {};
  isLoading = true;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getProfilo();
    this.getCalendario();
  }


  getProfilo(): void {
    this.utilService.profilo().subscribe({
      next: (profilo) => {
        this.profilo = profilo.profilo;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo:', error);
        this.isLoading = false;
      }
    });
  }

  getCalendario(): void {
    this.utilService.calendario().subscribe({
      next: (calendario) => {
        this.calendario = calendario.url;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento del calendario:', error);
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
