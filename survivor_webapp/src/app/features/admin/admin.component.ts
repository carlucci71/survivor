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
  profilo: {} = {};
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
        // determine if profile contains CALENDARIO_MOCK
        try {
          const p = this.profilo as any;
          const flag = 'CALENDARIO_MOCK';
          let ok = false;
          if (!p) ok = false;
          else if (typeof p === 'string') ok = p.indexOf(flag) !== -1;
          else if (Array.isArray(p)) ok = p.indexOf(flag) !== -1 || p.includes(flag);
          else if (typeof p === 'object') {
            // common shapes: {roles:[]}, {privileges:[]}, {authorities:[]}
            const arr = p.roles ?? p.privileges ?? p.authorities ?? Object.values(p);
            if (Array.isArray(arr)) ok = arr.indexOf(flag) !== -1 || arr.includes(flag);
            else if (typeof arr === 'string') ok = String(arr).indexOf(flag) !== -1;
          }
          this.canAccessMock = ok;
        } catch (e) {
          this.canAccessMock = false;
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
