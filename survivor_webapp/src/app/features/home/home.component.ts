import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { LegaService } from '../../core/services/lega.service';
import { User } from '../../core/models/auth.model';
import { Lega } from '../../core/models/lega.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  leghe: Lega[] = [];
  profilo: {} = {};
  isLoading = true;

  constructor(
    private authService: AuthService,
    private legaService: LegaService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadLeghe();
    this.getProfilo();
  }

  loadLeghe(): void {
    this.legaService.getLeghe().subscribe({
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

  getProfilo(): void {
    this.legaService.profilo().subscribe({
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


  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }
}
