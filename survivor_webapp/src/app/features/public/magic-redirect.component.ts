import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';

@Component({
  standalone: true,
  selector: 'app-magic-redirect',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, TranslateModule],
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

    // Se questa pagina si apre già DENTRO l'app nativa (es. tramite Universal/App Link toccato
    // dall'app di posta), non ha senso proporre "apri l'app": siamo già lì. Si procede subito
    // alla verifica del token restando nell'app.
    if (Capacitor.isNativePlatform()) {
      this.continuaNelBrowser();
      return;
    }

    if (this.sourceMobile) {
      this.openApp();
    } else {
      // Richiesta arrivata da un browser web "puro" (non dall'app): non ha senso provare ad
      // aprire l'app (sourceMobile=false), quindi si procede direttamente alla verifica invece
      // di restare fermi su questa pagina in attesa di un click manuale.
      this.continuaNelBrowser();
    }
  }


  openApp(): void {
    // Nessun setTimeout: Safari su iOS a volte ignora la navigazione verso uno schema
    // personalizzato se non avviene in modo sincrono nello stesso tap dell'utente.
    window.location.href = this.survivorUrl;
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
