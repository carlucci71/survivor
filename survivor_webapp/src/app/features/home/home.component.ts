import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { LegaService } from '../../core/services/lega.service';
import { User } from '../../core/models/auth.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Giocatore, Lega, StatoLega } from '../../core/models/interfaces.model';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { InvitaUtentiDialogComponent } from '../../shared/components/invita-utenti-dialog/invita-utenti-dialog.component';
import { InfoBannerComponent } from '../../shared/components/info-banner/info-banner.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroThreeComponent } from '../../shared/components/hero-three/hero-three.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PushService } from '../../core/services/push.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    HeaderComponent,
    InfoBannerComponent,
    HeroThreeComponent,
    MatToolbarModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    MatTooltip,
    MatDialogModule,
    TranslateModule
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  isMobile = false;
  private resizeHandler: (() => void) | null = null;
  currentUser: User | null = null;
  leghe: Lega[] = [];
  groupedLeghe: { name: string; des: string; edizioni: Lega[] }[] = [];
  me: Giocatore | null = null;
  environmentName = environment.ambiente;
  isProd = environment.production;

  constructor(
    private authService: AuthService,
    private legaService: LegaService,
    private giocatoreService: GiocatoreService,
    private router: Router,
    private dialog: MatDialog
    ,
    private sanitizer: DomSanitizer
    ,
    private pushService: PushService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadMe();
    this.loadLeghe();

    // detect mobile breakpoint
    this.isMobile = window.innerWidth <= 768;
    this.resizeHandler = () => {
      this.isMobile = window.innerWidth <= 768;
    };
    window.addEventListener('resize', this.resizeHandler);

    // Ascolta l'evento profile-updated per ricaricare me
    window.addEventListener('profile-updated', () => {
      this.loadMe();
    });
    // Avvia la registrazione push qui: Home è protetta da `authGuard`, quindi
    // l'utente è autenticato e possiamo procedere in sicurezza.
    void this.pushService.initPush();
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
      this.resizeHandler = null;
    }
  }

  private loadMe(): void {
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.me = giocatore;
      },
    });
  }

  getNome(): string {
    // Mostra nickname se disponibile, altrimenti il nome
    const displayName = this.me?.nickname || this.me?.nome || '';
    // return name with newlines between words
    return displayName.replaceAll(' ', '\n');
  }

  getNomeHtml(): SafeHtml {
    // Mostra nickname se disponibile, altrimenti il nome
    const nome = this.me?.nickname || this.me?.nome || '';
    // Greedy pack words into lines up to 20 characters.
    // If a word exceeds 20 chars, truncate to 17 + '...'.
    const maxChars = 20;
    const truncateLen = 17;
    const tokens = nome.split(/\s+/).filter(Boolean);
    const lines: string[] = [];
    let cur = '';
    let overflow = false;

    for (let w of tokens) {
      if (w.length > maxChars) {
        w = w.slice(0, truncateLen) + '...';
      }
      if (!cur) {
        cur = w;
        continue;
      }
      // try to append to current line (with a space)
      if ((cur.length + 1 + w.length) <= maxChars) {
        cur = cur + ' ' + w;
      } else {
        lines.push(cur);
        cur = w;
        if (lines.length >= 2) {
          // We would be creating a third line -> mark overflow and stop
          overflow = true;
          break;
        }
      }
    }
    if (!overflow && cur) lines.push(cur);

    // If overflow occurred, we need to ensure we have two lines and append '...' to the second
    if (overflow) {
      // ensure at least two lines exist
      if (lines.length === 0) {
        lines.push('');
      }
      if (lines.length === 1) {
        // place current as second line but trimmed if necessary
        let second = cur;
        if (second.length > maxChars) second = second.slice(0, truncateLen) + '...';
        lines.push(second + '...');
      } else {
        // we already have two full lines; append ellipsis to the second
        lines[1] = lines[1].slice(0, Math.max(0, truncateLen)) + '...';
      }
    }

    // limit to exactly 2 lines for output
    if (lines.length > 2) lines.length = 2;

    const raw = lines.join('<br/>');
    return this.sanitizer.bypassSecurityTrustHtml(raw);
  }
  visualizzaInvito(lega: Lega): boolean {
    return lega.stato.value === StatoLega.DA_AVVIARE.value;
  }

  isTerminata(lega: Lega): boolean {
    return lega!.stato.value === StatoLega.TERMINATA.value;
  }

  notExistsNuovaEdizione(lega: Lega): boolean {
    if (!lega) {
      return true;
    }
    // Ensure groups are available
    if (!this.groupedLeghe || this.groupedLeghe.length === 0) {
      return true;
    }
    const group = this.groupedLeghe.find((g) => g.name === lega.name);
    if (!group || !group.edizioni || group.edizioni.length === 0) {
      return true;
    }
    const currentEd = Number(lega.edizione ?? 0);
    // If any edition in the same group has a greater 'edizione' value, then a next edition exists
    const hasLater = group.edizioni.some(
      (e) => Number(e.edizione ?? 0) > currentEd
    );
    return !hasLater;
  }

  nuovaEdizione(lega: Lega): void {
    this.legaService.nuovaEdizione(lega.id).subscribe({
      next: (leghe) => {
        this.loadLeghe();
      },
      error: (error) => {
        console.error('Errore in nuova edizione:' + lega.id, error);
      },
    });
  }

  loadLeghe(): void {
    this.legaService.mieLeghe().subscribe({
      next: (leghe) => {
        this.leghe = leghe;
        this.groupLegheByName(leghe);
      },
      error: (error) => {
        console.error('Errore nel caricamento delle leghe:', error);
      },
    });
  }

  private groupLegheByName(leghe: Lega[]): void {
    const map = new Map<string, Lega[]>();
    (leghe || []).forEach((l) => {
      const key = l.name || '';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(l);
    });
    this.groupedLeghe = Array.from(map.entries()).map(([name, edizioni]) => ({
      name,
      des:edizioni[0].campionato?.sport?.nome + ' - ' + edizioni[0].campionato?.nome,
      edizioni: edizioni.sort((a, b) =>
        (a.edizione || '')
          .toString()
          .localeCompare((b.edizione || '').toString())
      ),
    }));
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    // Naviga solo se non già su login
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToMe(): void {
    this.router.navigate(['/me']);
  }

  goToLega(id: number): void {
    this.router.navigate(['/lega', id]);
  }

  goToCreaLega(): void {
    this.router.navigate(['/creaLega']);
  }

  goToUniscitiLega(): void {
    this.router.navigate(['/joinLega']);
  }

  openInvitaDialog(lega: Lega): void {
    this.dialog.open(InvitaUtentiDialogComponent, {
      data: {
        legaId: lega.id,
        legaNome: lega.name,
      },
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '85vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }
}
