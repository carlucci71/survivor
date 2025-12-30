import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { LegaService } from '../../core/services/lega.service';
import { User } from '../../core/models/auth.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Giocatore, Lega } from '../../core/models/interfaces.model';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatChipsModule, MatIcon, MatTooltip],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  leghe: Lega[] = [];
  me: Giocatore | null = null;
  environmentName = environment.ambiente;
  isProd = environment.production;

  constructor(
    private authService: AuthService,
    private legaService: LegaService,
    private giocatoreService: GiocatoreService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.giocatoreService.me().subscribe(
      { next: (giocatore)=> {
        this.me=giocatore;
      }}
    );
    this.loadLeghe();
  }

  loadLeghe(): void {
    this.legaService.mieLeghe().subscribe({ 
      next: (leghe) => {
        this.leghe = leghe;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle leghe:', error);
      }
    });
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    // Naviga solo se non già su login
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToMe(): void {
    this.router.navigate(['/me']);
  }

  goToLega(id: number): void {
    this.router.navigate(['/lega', id]);
  }

  goToCreaLega(): void {
    this.router.navigate(['/creaLega']);
  }

  goToUniscitiLega(): void {
    this.router.navigate(['/joinLega']);
  }

}
