import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
})
export class VerifyComponent implements OnInit {
  message = '';
  isSuccess = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');
    const codiceTipoMagicLink = this.route.snapshot.queryParamMap.get('codiceTipoMagicLink') || '';

    console.info('[Verify] init with', { token, codiceTipoMagicLink });

    if (!token) {
      this.message = 'Token non trovato';
      this.isSuccess = false;
      return;
    }

    this.authService.verifyMagicLink(token,codiceTipoMagicLink).subscribe({
      next: (response) => {
        this.isSuccess = true; 
        let destinazione = 'home';
        if (response.addInfo) {
          // Check if addInfo contains JOIN:x pattern
          const joinMatch = response.addInfo.match(/^JOIN:(\d+)$/i);
          if (joinMatch) {
            // Extract the league ID and navigate to join page
            destinazione = `join/${joinMatch[1]}`;
            localStorage.setItem('magicTokenSurvivor', token);
            this.message = 'Autenticazione riuscita! Reindirizzamento alla lega...';
          } else {
            destinazione = response.addInfo;
            this.message = 'Autenticazione riuscita! Reindirizzamento...' + destinazione;
          }
        } else {
          this.message = 'Autenticazione riuscita! Reindirizzamento...';
        }
        setTimeout(() => {
          this.router.navigate(['/' + destinazione]);
        }, 2000);
      },
      error: (error) => {
        this.isSuccess = false;
        this.message = 'Token non valido o scaduto';
      },
    });
  }
}
