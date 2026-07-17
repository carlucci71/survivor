import { Component, OnInit, Inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { LoadingOverlayComponent } from './core/components/loading-overlay.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { ForceUpdateDialogComponent } from './shared/components/force-update-dialog/force-update-dialog.component';
import { PushService } from './core/services/push.service';
import { DOCUMENT } from '@angular/common';
import { environment } from '../environments/environment';
import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingOverlayComponent, FooterComponent, MatDialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'survivor_webapp';

  constructor(
    private readonly pushService: PushService,
    @Inject(DOCUMENT) private readonly document: Document,
    private readonly router: Router,
    private readonly http: HttpClient,
    private readonly dialog: MatDialog
  ) {}

  ngOnInit() {
    // Applica la classe CSS al body in base all'ambiente
    const envTheme = (environment as any).envTheme || 'blue';
    this.document.body.classList.add(`env-${envTheme}`);

    // Cambia il favicon in base all'ambiente
    this.setFavicon(envTheme);

    // Force update: controlla se la versione nativa è obsoleta
    this.checkForceUpdate();

    // Deep link handling (solo su app nativa Capacitor)
    if ((window as any).Capacitor) {
      // Cold start: app era chiusa quando è stato cliccato il link
      App.getLaunchUrl().then((result) => {
        if (result?.url) {
          this.handleDeepLinkUrl(result.url);
        }
      }).catch(() => {});

      // Warm start: app era in background
      App.addListener('appUrlOpen', ({ url }: { url: string }) => {
        this.handleDeepLinkUrl(url);
      });
    }
  }

  private checkForceUpdate(): void {
    if (!Capacitor.isNativePlatform()) return;

    const platform = Capacitor.getPlatform();

    App.getInfo().then(appInfo => {
      this.http.get<{ minVersionCode: number }>(`${environment.apiUrl}/versione/minima`).subscribe({
        next: (response) => {
          if (parseInt(appInfo.build, 10) < response.minVersionCode) {
            const isIos = platform === 'ios';
            // L'app non è ancora pubblicata su App Store: niente link ufficiale su cui reindirizzare.
            const storeUrl = isIos ? null : 'https://play.google.com/store/apps/details?id=com.survivor.app';
            this.dialog.open(ForceUpdateDialogComponent, {
              data: { storeUrl, dismissible: true },
              disableClose: false,
              panelClass: 'custom-dialog-container'
            });
          }
        },
        error: () => {}
      });
    }).catch(() => {});
  }

  private handleDeepLinkUrl(url: string): void {
    try {
      const parsed = new URL(url);
      const path = parsed.pathname.toLowerCase();
      const host = parsed.host.toLowerCase();
      // survivor://auth/verify → host='auth', path='/verify'
      const isVerify = (host === 'auth' && path.startsWith('/verify')) || path.startsWith('/auth/verify');
      if (isVerify) {
        const token = parsed.searchParams.get('token');
        const codiceTipoMagicLink = parsed.searchParams.get('codiceTipoMagicLink') || '';
        this.router.navigate(['/auth/verify'], { queryParams: { token, codiceTipoMagicLink } });
      }
    } catch (e) {
      console.error('Failed to handle deep link', e);
    }
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
