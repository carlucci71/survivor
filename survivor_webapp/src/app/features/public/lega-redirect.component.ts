import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { TranslateModule } from '@ngx-translate/core';
import { Capacitor } from '@capacitor/core';

/**
 * Pagina "ponte" per i link di invito lega condivisi (vedi InvitaUtentiDialogComponent.shareLink).
 * Stesso schema del MagicRedirectComponent usato per il login via magic link: gli Universal Link
 * https:// dipendono dal file apple-app-site-association servito dal dominio (verifica Apple,
 * cache aggressiva, e attualmente non affidabile lato server) mentre lo schema custom survivor://
 * apre l'app in modo diretto e immediato se installata, senza bisogno di alcuna verifica.
 */
@Component({
  standalone: true,
  selector: 'app-lega-redirect',
  imports: [CommonModule, RouterModule, MatButtonModule, MatCardModule, TranslateModule],
  templateUrl: './lega-redirect.component.html'
})
export class LegaRedirectComponent implements OnInit {
  survivorUrl = '';
  legaId = '';

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.legaId = this.route.snapshot.queryParamMap.get('legaId') || '';
    this.survivorUrl = `survivor://joinLega?legaId=${encodeURIComponent(this.legaId)}`;

    // Se questa pagina si apre già DENTRO l'app nativa, non ha senso proporre "apri l'app":
    // siamo già lì. Si procede subito alla pagina di join restando nell'app.
    if (Capacitor.isNativePlatform()) {
      this.continuaNelBrowser();
      return;
    }

    // A differenza del magic-redirect (dove sourceMobile decide se tentare l'apertura), un link
    // di invito lega viene condiviso apposta per essere aperto da telefono: tentiamo sempre
    // l'apertura automatica dell'app via schema custom, con fallback visibile a schermo per chi
    // non ha l'app installata (il tentativo fallisce in silenzio, senza errori per l'utente).
    this.openApp();
  }

  openApp(): void {
    // Nessun setTimeout: Safari su iOS a volte ignora la navigazione verso uno schema
    // personalizzato se non avviene in modo sincrono nello stesso tap dell'utente.
    window.location.href = this.survivorUrl;
  }

  continuaNelBrowser(): void {
    this.router.navigate(['/joinLega'], { queryParams: { legaId: this.legaId } });
  }
}
