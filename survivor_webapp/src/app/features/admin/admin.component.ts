import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { UtilService } from '../../core/services/util.service';
import { environment } from '../../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, forkJoin, Observable, of } from 'rxjs';

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
  externalHtml: SafeHtml | null = null;
  versioneBEHtml: SafeHtml | null = null;

  constructor(
    private authService: AuthService,
    private utilService: UtilService,
    private router: Router,
    private http: HttpClient,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.getProfilo();
    this.getCalendario();
    this.loadStaticHtmlFromAssets();
    this.getVersionBE();
  }

  loadStaticHtmlFromAssets(): void {
    const path = 'assets/build_fe.html';

    // Fetch the file as text. Some dev servers return `index.html` for unknown assets
    // (status 200) — detect that fallback by checking for HTML doctype/root and
    // treat it as missing so we return 'N/D'.
    this.http.get(path, { responseType: 'text' }).subscribe({
      next: (text) => {
        const trimmed = (text || '').trim().toLowerCase();
        const looksLikeIndex = trimmed.startsWith('<!doctype') || trimmed.startsWith('<html') || trimmed.includes('<app-root') || trimmed.includes('<base href=') || trimmed.includes('<script');
        if (looksLikeIndex) {
          console.debug('Static admin HTML appears to be index.html fallback, treating as missing:', path);
          this.externalHtml = 'N/D';
          return;
        }
        this.externalHtml = this.sanitizer.bypassSecurityTrustHtml(text);
      },
      error: (err) => {
        console.debug('Static admin HTML not found at', path, err);
        this.externalHtml = 'N/D';
      }
    });
  }


  getProfilo(): void {
    this.utilService.profilo().subscribe({
      next: (profilo) => {
        this.profilo = profilo.profilo;
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



  getVersionBE(): void {

    this.http.get(`${environment.apiUrl}/versione`, { responseType: 'text' }).subscribe({
      next: (text) => {
        this.versioneBEHtml = this.sanitizer.bypassSecurityTrustHtml(text);
      },
      error: (err) => {
        console.debug('Versione BE non trovata: ', err);
      }
    });




  }


}
