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

    if (!token) {
      this.message = 'Token non trovato';
      this.isSuccess = false;
      return;
    }

    // CONTROLLO SE L'UTENTE È GIÀ LOGGATO
    if (this.authService.isAuthenticated()) {
      console.log('[VerifyComponent] Utente già autenticato, skip verifica magic link');
      this.isSuccess = true;

      // Se è un link di JOIN, prova a estrarre il legaId dall'addInfo
      const joinMatch = codiceTipoMagicLink.match(/JOIN/i);
      if (joinMatch) {
        // Prova a estrarre dal token se possibile (formato addInfo: "JOIN:123")
        // Per semplicità, se il token era già nel localStorage come magicTokenSurvivor, usiamolo
        const savedToken = localStorage.getItem('magicTokenSurvivor');
        if (savedToken === token) {
          // Token già usato in precedenza, probabilmente per questa stessa lega
          // Proviamo a fare il parsing dall'URL o andiamo alla home
          this.message = 'Sei già autenticato! Reindirizzamento...';
          setTimeout(() => {
            this.router.navigate(['/home']);
          }, 1000);
          return;
        }

        // Altrimenti chiamiamo il backend per ottenere l'addInfo
        // ma senza usare il token (che potrebbe essere scaduto)
        this.message = 'Sei già autenticato! Verifica del link...';

        // Chiamata al backend per ottenere addInfo
        this.authService.verifyMagicLink(token, codiceTipoMagicLink).subscribe({
          next: (response) => {
            if (response.addInfo) {
              const joinMatchDetail = response.addInfo.match(/^JOIN:(\d+)$/i);
              if (joinMatchDetail) {
                localStorage.setItem('magicTokenSurvivor', token);
                this.message = 'Reindirizzamento alla lega...';
                setTimeout(() => {
                  this.router.navigate([`/join/${joinMatchDetail[1]}`]);
                }, 1000);
                return;
              }
            }
            // Fallback
            this.router.navigate(['/home']);
          },
          error: () => {
            // Anche in caso di errore, se l'utente è già loggato, vai alla home
            console.warn('[VerifyComponent] Errore verifica link ma utente già loggato, vai alla home');
            this.router.navigate(['/home']);
          }
        });
        return;
      }

      // Se non è un link JOIN, vai semplicemente alla home
      this.message = 'Sei già autenticato! Reindirizzamento...';
      setTimeout(() => {
        this.router.navigate(['/home']);
      }, 1000);
      return;
    }

    // SE NON È LOGGATO, PROCEDI CON LA VERIFICA DEL MAGIC LINK
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
