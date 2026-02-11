import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilService } from '../../core/services/util.service';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, HeaderComponent, TranslateModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  profilo: string | null = null;
  profiloFe  = environment.ambiente + " - " + environment.mobile;
  calendario: {} = {};
  canAccessMock = false;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
  ) {}

  goToMock(): void {
    this.router.navigate(['/mock']);
  }

  ngOnInit(): void {
    this.getProfilo();
    this.getCalendario();
  }

  getProfilo(): void {
    this.utilService.profilo().subscribe({
      next: (profilo) => {
        this.profilo = profilo.profilo;
        if (this.profilo){
          const array = this.profilo.split(',').map(item => item.trim());
          this.canAccessMock = array.includes("CALENDARIO_MOCK");
        }
      },
      error: (error) => {
        console.error('Errore nel caricamento del profilo:', error);
      }
    });
  }

  getCalendario(): void {
    this.utilService.calendario().subscribe({
      next: (calendario) => {
        this.calendario = calendario.url;
      },
      error: (error) => {
        console.error('Errore nel caricamento del calendario:', error);
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
