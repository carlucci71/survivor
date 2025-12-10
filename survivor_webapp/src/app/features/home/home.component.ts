import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { User } from '../../core/models/auth.model';
import { Lega } from '../../core/models/lega.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatChipsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  leghe: Lega[] = [];
  isLoading = true;

  constructor(
    private authService: AuthService,
    private legaService: LegaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeghe();
  }

  loadLeghe(): void {
    this.legaService.mieLeghe().subscribe({
      next: (leghe) => {
        this.leghe = leghe;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle leghe:', error);
        this.isLoading = false;
      }
    });
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToLega(id: number): void {
    this.router.navigate(['/lega', id]);
  }

}
