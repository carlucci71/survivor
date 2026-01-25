import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'app-magic-redirect',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule],
  templateUrl: './magic-redirect.component.html'
})
export class MagicRedirectComponent implements OnInit {
  survivorUrl = '';
  token = '';
  codiceTipoMagicLink = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.codiceTipoMagicLink = this.route.snapshot.queryParamMap.get('codiceTipoMagicLink') || '';
    this.survivorUrl = `survivor://auth/verify?token=${encodeURIComponent(this.token)}&codiceTipoMagicLink=${encodeURIComponent(this.codiceTipoMagicLink)}`;

    // Try to open the app; if it fails, fall back to the web verify page
    this.openApp();
    setTimeout(() => {
      this.router.navigate(['/auth/verify'], {
        queryParams: {
          token: this.token,
          codiceTipoMagicLink: this.codiceTipoMagicLink
        }
      });
    }, 120000);
  }

  openApp(): void {
    window.location.href = this.survivorUrl;
  }
}
