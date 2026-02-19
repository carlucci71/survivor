import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { environment } from '../../../environments/environment';

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
  sourceMobile = false;

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';
    this.codiceTipoMagicLink = this.route.snapshot.queryParamMap.get('codiceTipoMagicLink') || '';
    this.sourceMobile = this.route.snapshot.queryParamMap.get('sourceMobile') === 'true';
    this.survivorUrl = `survivor://auth/verify?token=${encodeURIComponent(this.token)}&codiceTipoMagicLink=${encodeURIComponent(this.codiceTipoMagicLink)}`;

    if (this.sourceMobile){
      this.openApp();
    } else if (!environment.production) {
      this.continuaNelBrowser();
    }
  }


  openApp(): void {
    setTimeout(() => {
      window.location.href = this.survivorUrl;
    }, 400);
  }

continuaNelBrowser() {
  this.router.navigate(['/auth/verify'], { 
    queryParams: { 
      token: this.token, 
      codiceTipoMagicLink: this.codiceTipoMagicLink 
    } 
  });
}  
}
