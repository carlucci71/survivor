import { Component, OnInit, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './core/components/loading-overlay.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { PushService } from './core/services/push.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'survivor_webapp';

  constructor(
    private readonly pushService: PushService,
    @Inject(DOCUMENT) private readonly document: Document
  ) {}

  ngOnInit() {
    // Applica la classe CSS al body in base all'ambiente
    const envTheme = (environment as any).envTheme || 'blue';
    this.document.body.classList.add(`env-${envTheme}`);

    // Cambia il favicon in base all'ambiente
    this.setFavicon(envTheme);
  }

  private setFavicon(theme: string): void {
    // Determina il nome del file in base al tema
    let faviconName = 'favicon-prod.png'; // default
    if (theme === 'green') {
      faviconName = 'favicon-local.png';
    } else if (theme === 'red') {
      faviconName = 'favicon-system.png';
    }

    // Rimuovi TUTTI i favicon esistenti (icon, shortcut icon, etc)
    const existingFavicons = this.document.querySelectorAll("link[rel*='icon']");
    existingFavicons.forEach(favicon => favicon.remove());

    // Timestamp unico per evitare cache
    const timestamp = Date.now();

    // Aggiungi il nuovo favicon PNG ad alta risoluzione
    const link: HTMLLinkElement = this.document.createElement('link');
    link.rel = 'icon';
    link.type = 'image/png';
    link.href = `assets/${faviconName}?v=${timestamp}`;
    this.document.head.appendChild(link);

    // Aggiungi anche come shortcut icon per compatibilità
    const shortcutLink: HTMLLinkElement = this.document.createElement('link');
    shortcutLink.rel = 'shortcut icon';
    shortcutLink.type = 'image/png';
    shortcutLink.href = `assets/${faviconName}?v=${timestamp}`;
    this.document.head.appendChild(shortcutLink);
  }
}
