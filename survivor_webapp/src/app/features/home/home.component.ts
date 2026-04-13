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
import { Giocatore, Lega, StatoGiocatore, StatoLega } from '../../core/models/interfaces.model';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { MatDialog } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { InvitaUtentiDialogComponent } from '../../shared/components/invita-utenti-dialog/invita-utenti-dialog.component';
import { InfoBannerComponent } from '../../shared/components/info-banner/info-banner.component';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { HeroThreeComponent } from '../../shared/components/hero-three/hero-three.component';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateModule } from '@ngx-translate/core';
import { PushService } from '../../core/services/push.service';
import { LegaCardSkeletonComponent } from '../../shared/components/lega-card-skeleton/lega-card-skeleton.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateLeagueDataPipe } from '../../shared/pipes/translate-league-data.pipe';


import { OnboardingComponent } from '../../shared/components/onboarding/onboarding.component';
import { GiocataRecapCardComponent } from '../../shared/components/giocata-recap-card/giocata-recap-card.component';
import { ProfiloDialogComponent } from '../../shared/components/info-banner/info-banner.component';


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
    MatDialogModule,
    MatIconModule,
    TranslateModule,
    LegaCardSkeletonComponent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    TranslateLeagueDataPipe,
    OnboardingComponent,
    GiocataRecapCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  isMobile = false;
  showOnboarding = !localStorage.getItem('survivor_onboarding_v2_seen');
  private resizeHandler: (() => void) | null = null;
  currentUser: User | null = null;
  leghe: Lega[] = [];
  groupedLeghe: { name: string; des: { sportId: string; campionatoId: string; modalita: string }; edizioni: Lega[]; pubblica: boolean; numPartecipanti: number; maxPartecipanti?: number }[] = [];
  filteredGroupedLeghe: { name: string; des: { sportId: string; campionatoId: string; modalita: string }; edizioni: Lega[]; pubblica: boolean; numPartecipanti: number; maxPartecipanti?: number }[] = [];
  searchText: string = '';
  private searchDebounceTimer: any;
  me: Giocatore | null = null;
  environmentName = environment.ambiente;
  isProd = environment.production;
  readonly currentYear = new Date().getFullYear();
  isLoadingLeghe = true;
  activeTab: 'private' | 'public' = 'private';
  private giocatoreSubscription: any;
  selectedLegaId: number | null = null;

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
    const navState = (window.history.state) as { activeTab?: 'private' | 'public'; selectedLegaId?: number };
    this.selectedLegaId = navState?.selectedLegaId ?? null;
    this.loadLeghe(navState?.activeTab);

    // Sottoscrivi agli aggiornamenti del profilo
    this.giocatoreSubscription = this.giocatoreService.giocatoreAggiornato.subscribe(
      giocatore => {
        if (giocatore) {
          this.me = giocatore;
        }
      }
    );

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
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }
    if (this.giocatoreSubscription) {
      this.giocatoreSubscription.unsubscribe();
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
    const displayName = this.me?.nickname || this.me?.nickname || '';
    // return name with newlines between words
    return displayName.replaceAll(' ', '\n');
  }

  getAvatarInitials(): string {
    const n = (this.me?.nickname || '').trim();
    if (!n) return '?';
    return n.substring(0, 2).toUpperCase();
  }

  getAvatarGradient(): string {
    const n = (this.me?.nickname || 'A').trim();
    const palettes = [
      'linear-gradient(135deg, #6366F1, #8B5CF6)',
      'linear-gradient(135deg, #EC4899, #F43F5E)',
      'linear-gradient(135deg, #0EA5E9, #06B6D4)',
      'linear-gradient(135deg, #10B981, #059669)',
      'linear-gradient(135deg, #F59E0B, #EF4444)',
      'linear-gradient(135deg, #8B5CF6, #EC4899)',
      'linear-gradient(135deg, #14B8A6, #0EA5E9)',
    ];
    let hash = 0;
    for (let i = 0; i < n.length; i++) { hash = (hash * 31 + n.charCodeAt(i)) % palettes.length; }
    return palettes[Math.abs(hash) % palettes.length];
  }

  getNomeHtml(): SafeHtml {
    // Mostra nickname se disponibile, altrimenti il nome
    const nome = this.me?.nickname || this.me?.nickname || '';
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

  getMioStatoInLega(edizione: Lega): string | null {
    if (edizione.stato.value === StatoLega.DA_AVVIARE.value) return null;
    const stato = this.me?.statiPerLega?.[edizione.id] as any;
    if (!stato) return null;
    // Il backend serializza l'enum come stringa: "ATTIVO", "ELIMINATO", "PENDING"
    return typeof stato === 'string' ? stato : (stato.value ?? null);
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

  loadLeghe(preferredTab?: 'private' | 'public'): void {
    this.isLoadingLeghe = true;
    this.legaService.mieLeghe().subscribe({
      next: (leghe) => {
        this.leghe = leghe;
        this.groupLegheByName(leghe);
        if (preferredTab) {
          this.activeTab = preferredTab;
        }
        this.isLoadingLeghe = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento delle leghe:', error);
        this.isLoadingLeghe = false;
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
    this.groupedLeghe = Array.from(map.entries()).map(([name, edizioni]) => {
      const sorted = edizioni.sort((a, b) =>
        (b.edizione || '').toString().localeCompare((a.edizione || '').toString())
      );
      const sportId = sorted[0].campionato?.sport?.id || '';
      const campionatoId = sorted[0].campionato?.id || '';
      const modalita = sorted[0].modalita || 'SURVIVOR';
      const pubblica = !!sorted[0].pubblica;
      const numPartecipanti = sorted[0].numPartecipanti ?? sorted[0].giocatori?.length ?? 0;
      const maxPartecipanti = sorted[0].maxPartecipanti;
      return { name, des: { sportId, campionatoId, modalita }, edizioni: sorted, pubblica, numPartecipanti, maxPartecipanti };
    }).sort((a, b) => {
      // Prima le leghe private, poi le pubbliche; a parità per ID ascendente (ordine di creazione)
      if (a.pubblica !== b.pubblica) return a.pubblica ? 1 : -1;
      const maxIdA = Math.max(...a.edizioni.map(e => e.id || 0));
      const maxIdB = Math.max(...b.edizioni.map(e => e.id || 0));
      return maxIdA - maxIdB;
    });
    this.filteredGroupedLeghe = [...this.groupedLeghe];
    // Se non ci sono leghe private ma ci sono pubbliche, apri il tab pubblico
    const hasPrivate = this.groupedLeghe.some(g => !g.pubblica);
    if (!hasPrivate) this.activeTab = 'public';
    else this.activeTab = 'private';
  }

  filterLeghe(): void {
    // Cancella il timer precedente se esiste
    if (this.searchDebounceTimer) {
      clearTimeout(this.searchDebounceTimer);
    }

    // Imposta un nuovo timer per ritardare la ricerca di 300ms
    this.searchDebounceTimer = setTimeout(() => {
      const search = this.searchText.toLowerCase().trim();

      if (!search) {
        this.filteredGroupedLeghe = [...this.groupedLeghe];
        return;
      }

      this.filteredGroupedLeghe = this.groupedLeghe
        .map(group => ({
          ...group,
          edizioni: group.edizioni.filter(edizione =>
            group.name.toLowerCase().includes(search) ||
            group.des.sportId.toLowerCase().includes(search) ||
            group.des.campionatoId.toLowerCase().includes(search) ||
            edizione.edizione?.toString().includes(search) ||
            edizione.anno?.toString().includes(search) ||
            edizione.stato.value.toLowerCase().includes(search)
          )
        }))
        .filter(group => group.edizioni.length > 0);
    }, 300);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  openProfilo(): void {
    this.dialog.open(ProfiloDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'profilo-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
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
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container',
      autoFocus: false,
      restoreFocus: false
      // CENTRATO
    });
  }

  get filteredPrivateLeghe() {
    return this.filteredGroupedLeghe.filter(g => !g.pubblica);
  }

  get filteredPublicLeghe() {
    return this.filteredGroupedLeghe
      .filter(g => g.pubblica)
      .sort((a, b) => b.numPartecipanti - a.numPartecipanti);
  }

  getPopolarityBadge(n: number): { icon: string; key: string; tier: string } {
    if (n >= 100) return { icon: 'diamond',               key: 'HOME.BADGE_HALL_OF_FAME', tier: 'hall-of-fame' };
    if (n >= 90)  return { icon: 'bolt',                  key: 'HOME.BADGE_FENOMENO',     tier: 'fenomeno' };
    if (n >= 70)  return { icon: 'workspace_premium',     key: 'HOME.BADGE_LEGGENDA',     tier: 'leggenda' };
    if (n >= 50)  return { icon: 'military_tech',         key: 'HOME.BADGE_ELITE',        tier: 'elite' };
    if (n >= 30)  return { icon: 'emoji_events',          key: 'HOME.BADGE_TOP',          tier: 'top' };
    if (n >= 15)  return { icon: 'local_fire_department', key: 'HOME.BADGE_HOT',          tier: 'hot' };
    if (n >= 5)   return { icon: 'trending_up',           key: 'HOME.BADGE_GROWING',      tier: 'growing' };
    return              { icon: 'fiber_new',              key: 'HOME.BADGE_NEW',          tier: 'new' };
  }

  getTorneoLogo(campionatoId: string): string | null {
    const map: Record<string, string> = {
      'SERIE_A': 'assets/logos/calcio/tornei/serie_A.png',
      'SERIE_B': 'assets/logos/calcio/tornei/serie_b.png',
      'LIGA': 'assets/logos/calcio/tornei/liga.png',
      'MONDIALI_2026': 'assets/logos/calcio/tornei/mondiali.jpg',
      'NBA_RS': 'assets/logos/basket/tornei/NBA.png',
      'AUS_OPEN': 'assets/logos/tennis/tornei/Australian Open.png',
      'ROLAND_GARROS': 'assets/logos/tennis/tornei/Roland Garros.png',
      'US_OPEN': 'assets/logos/tennis/tornei/US Open.png',
      'WIMBLEDON': 'assets/logos/tennis/tornei/wimbledon.png',
    };
    return map[campionatoId] || null;
  }

  // TrackBy functions per ottimizzare il rendering
  trackByGroupName(index: number, group: { name: string; des: { sportId: string; campionatoId: string }; edizioni: Lega[]; pubblica: boolean; numPartecipanti: number }): string {
    return group.name;
  }

  trackByLegaId(index: number, lega: Lega): number {
    return lega.id;
  }
}
