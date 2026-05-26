import { Component, OnInit, AfterViewInit, ChangeDetectorRef, NgZone } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SportService } from '../../core/services/sport.service';
import { Campionato, Sport } from '../../core/models/interfaces.model';
import { CampionatoService } from '../../core/services/campionato.service';
import { LegaService } from '../../core/services/lega.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { environment } from '../../../environments/environment';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-lega-nuova',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule,
  ],
  templateUrl: './lega-nuova.component.html',
  styleUrls: ['./lega-nuova.component.scss'],
})
export class LegaNuovaComponent implements OnInit, AfterViewInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private sportService: SportService,
    private legaService: LegaService,
    private campionatoService: CampionatoService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private translate: TranslateService
  ) {}
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  name!: string;
  giornataIniziale: number | null = null;
  giornataFinale: number | null = null;
  pwd: string | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  // validation touch states
  nameTouched = false;
  sportTouched = false;
  campionatoTouched = false;
  giornataTouched = false;
  giornataFinaleTouched = false;
  confirmationMessage: boolean = false;
  legaCreataId: number | null = null;
  emailInput: string = '';
  emailsList: string[] = [];
  copied = false;
  showPasswordSection = false;
  pubblica = false;
  accessoLibero = false;
  maxPartecipanti: number | null = null;
  modalita: 'SURVIVOR' | 'CAMPIONATO' = 'SURVIVOR';
  viteIniziali: number = 1;
  viteWarn: { emoji: string; text: string } | null = null;

  private readonly viteWarnCounts: Record<number, number> = { 6: 4, 7: 4, 8: 4, 9: 4 };

  get isViteMax(): boolean {
    return this.viteIniziali >= 10;
  }

  private updateViteWarn(): void {
    const level = this.viteIniziali;
    if (level <= 5) { this.viteWarn = null; return; }
    if (level >= 10) {
      this.viteWarn = {
        emoji: this.translate.instant('CREATE_LEAGUE.LIVES_WARN.MAX.EMOJI'),
        text: this.translate.instant('CREATE_LEAGUE.LIVES_WARN.MAX.TEXT'),
      };
      return;
    }
    const count = this.viteWarnCounts[level];
    const idx = Math.floor(Math.random() * count);
    this.viteWarn = {
      emoji: this.translate.instant(`CREATE_LEAGUE.LIVES_WARN.${level}.${idx}.EMOJI`),
      text: this.translate.instant(`CREATE_LEAGUE.LIVES_WARN.${level}.${idx}.TEXT`),
    };
  }

  incViteIniziali(): void {
    if (this.viteIniziali >= 10) return;
    this.viteIniziali++;
    this.updateViteWarn();
  }

  decViteIniziali(): void {
    if (this.viteIniziali > 0) {
      this.viteIniziali--;
      this.updateViteWarn();
    }
  }

  setModalita(m: 'SURVIVOR' | 'CAMPIONATO'): void {
    this.modalita = m;
    // In modalità CAMPIONATO la giornata finale è obbligatoria:
    // se è ancora null, inizializzala all'ultima giornata disponibile
    if (m === 'CAMPIONATO' && this.giornataFinale === null && this.campionatoSel) {
      this.giornataFinale = this.campionatoSel.numGiornate ?? null;
      this.giornataFinaleTouched = true;
    }
  }

  decMaxPartecipanti(): void {
    if (!this.maxPartecipanti) return;
    const next = this.maxPartecipanti - 1;
    this.maxPartecipanti = next < 2 ? null : next;
  }

  incMaxPartecipanti(): void {
    this.maxPartecipanti = this.maxPartecipanti ? this.maxPartecipanti + 1 : 2;
  }

  onMaxPartecipantiInput(event: Event): void {
    const val = parseInt((event.target as HTMLInputElement).value, 10);
    if (!val || val < 2) {
      this.maxPartecipanti = null;
      (event.target as HTMLInputElement).value = '';
    } else {
      this.maxPartecipanti = val;
    }
  }
  ngOnInit(): void {
    this.caricaSport();
  }

  ngAfterViewInit(): void {
    // Scrolla in alto all'apertura — setTimeout garantisce che avvenga dopo
    // il rendering completo e dopo qualsiasi auto-focus/keyboard resize su mobile
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    }, 0);
  }

  /**
   * Reset del viewport per iOS - previene lo zoom dopo la creazione della lega
   */
  private resetViewportForIOS(): void {
    // Forza un reflow del layout per iOS
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      const content = viewportMeta.getAttribute('content');
      // Rimuovi temporaneamente e reinserisci per forzare il reset
      viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0');
      setTimeout(() => {
        viewportMeta.setAttribute('content', content || 'width=device-width, initial-scale=1.0');
        // Scrolla in alto dopo il reset
        window.scrollTo({ top: 0, behavior: 'auto' });
      }, 10);
    }
  }

  goBack(): void {
    if (this.legaCreataId && this.pubblica) {
      this.router.navigate(['/home'], { state: { activeTab: 'public' } });
    } else {
      this.router.navigate(['/home']);
    }
  }
  caricaSport(): void {
    this.sportService.getSport().subscribe({
      next: (sport) => {
        this.sportDisponibili = sport;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli sport:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  baseUrl() {
    return environment.baseUrl;
  }

  getShareUrl(): string {
    // Pubblica ad accesso libero → lista pubblica
    // Privata o con approvazione → link diretto alla sezione join con la lega preselezionata
    if (this.pubblica && this.accessoLibero) {
      return this.baseUrl() + '/joinLega';
    }
    return this.baseUrl() + '/joinLega?legaId=' + this.legaCreataId;
  }

  selezionaSport() {
    if (this.sportSel) {
      this.campionatoService.getCampionatoBySport(this.sportSel).subscribe({
        next: (campionati) => {
          this.campionatiDisponibili = campionati;
          this.campionatoSel=null;
        },
        error: (error) => {
          console.error(
            'Errore nel caricamento del campionato: ' + this.sportSel,
            error
          );
        },
      });
    }
  }

  getSportIcon(id: string): string {
    const icons: Record<string, string> = {
      CALCIO: 'sports_soccer',
      BASKET: 'sports_basketball',
      TENNIS: 'sports_tennis'
    };
    return icons[id] ?? 'sports';
  }

  getSportTranslateKey(id: string): string {
    const keys: Record<string, string> = {
      CALCIO: 'COMMON.SOCCER',
      BASKET: 'COMMON.BASKETBALL',
      TENNIS: 'COMMON.TENNIS'
    };
    return keys[id] ?? 'COMMON.SOCCER';
  }

  selectSport(id: string): void {
    this.sportSel = id;
    this.sportTouched = true;
    this.campionatoSel = null;
    this.giornataIniziale = null;
    this.giornataFinale = null;
    this.selezionaSport();
  }

  onCampionatoChange(): void {
    this.giornataIniziale = this.campionatoSel?.giornataDaGiocare ?? null;
    this.giornataFinale = null;
    this.giornataTouched = false;
    this.giornataFinaleTouched = false;
  }

  onGiornataChange(): void {
    if (this.giornataFinale !== null && this.giornataIniziale !== null
        && this.giornataFinale <= this.giornataIniziale) {
      this.giornataFinale = null;
    }
  }

  togglePassword(): void {
    this.showPasswordSection = !this.showPasswordSection;
    if (!this.showPasswordSection) this.pwd = null;
  }

  setPubblica(value: boolean): void {
    this.ngZone.run(() => {
      this.pubblica = value;
      if (!value) this.accessoLibero = false;
      this.cdr.detectChanges();
    });
  }

  setAccessoLibero(value: boolean): void {
    this.ngZone.run(() => {
      this.accessoLibero = value;
      this.cdr.detectChanges();
    });
  }

  isCampionatoTerminato(c: Campionato): boolean {
    if (!c.giornataDaGiocare || !c.numGiornate) return false;
    if (c.giornataDaGiocare > c.numGiornate) return true;
    // giornataDaGiocare === numGiornate: può essere l'ultima da giocare (futuro) o terminato (passato)
    // usiamo iniziGiornate per capire se l'ultima giornata è già iniziata
    if (c.giornataDaGiocare === c.numGiornate && c.iniziGiornate?.length) {
      const lastIdx = c.numGiornate - 1;
      // Se l'indice esatto non esiste (alcuni campionati hanno meno entry di numGiornate),
      // usiamo l'ultima entry disponibile come proxy
      const idx = Math.min(lastIdx, c.iniziGiornate.length - 1);
      return new Date(c.iniziGiornate[idx]) < new Date();
    }
    return false;
  }

  selectCampionato(c: Campionato): void {
    if (this.isCampionatoTerminato(c)) return;
    this.campionatoSel = c;
    this.campionatoTouched = true;
    this.onCampionatoChange();
  }

  incGiornataIniziale(): void {
    const max = this.campionatoSel?.numGiornate ?? 99;
    const min = this.campionatoSel?.giornataDaGiocare ?? 1;
    const cur = this.giornataIniziale ?? (min - 1);
    if (cur < max) {
      this.giornataIniziale = cur + 1;
      this.giornataTouched = true;
      this.onGiornataChange();
    }
  }

  decGiornataIniziale(): void {
    const min = this.campionatoSel?.giornataDaGiocare ?? 1;
    if (this.giornataIniziale !== null && this.giornataIniziale > min) {
      this.giornataIniziale--;
      this.giornataTouched = true;
      this.onGiornataChange();
    }
  }

  incGiornataFinale(): void {
    const max = this.campionatoSel?.numGiornate ?? 99;
    if (this.giornataFinale === null) {
      // In CAMPIONATO: inizia dall'ultima giornata disponibile
      this.giornataFinale = max;
      return;
    }
    if (this.giornataFinale < max - 1) {
      this.giornataFinale++;
    } else {
      this.giornataFinale = null; // torna a "fine stagione" (solo SURVIVOR)
      if (this.modalita === 'CAMPIONATO') {
        this.giornataFinale = max; // CAMPIONATO: non tornare a null
      }
    }
  }

  decGiornataFinale(): void {
    const max = this.campionatoSel?.numGiornate ?? 99;
    const min = (this.giornataIniziale ?? 1) + 1;
    const cur = this.giornataFinale ?? max;
    if (cur > min) {
      this.giornataFinale = cur - 1;
    }
  }

  getEffectiveFinalRound(): number {
    if (this.giornataFinale !== null && this.giornataFinale !== undefined) return this.giornataFinale;
    return this.campionatoSel?.numGiornate ?? (this.giornataIniziale ?? 1);
  }

  getLeagueDurationRounds(): number {
    if (!this.giornataIniziale) return 0;
    return Math.max(1, this.getEffectiveFinalRound() - this.giornataIniziale + 1);
  }

  getLeagueDurationBarPercent(): number {
    if (!this.campionatoSel?.numGiornate || !this.giornataIniziale) return 0;
    return Math.min(100, (this.getLeagueDurationRounds() / this.campionatoSel.numGiornate) * 100);
  }

  getDesGiornataLabel(campionato: Campionato | null, round: number | null): string {
    if (!campionato?.id || round === null || round === undefined) return '-';
    return this.campionatoService.getDesGiornataNoAlias(campionato.id, round);
  }

  isGiornataValid(): boolean {
    if (this.giornataIniziale === null || this.giornataIniziale === undefined)
      return false;
    if (!this.campionatoSel) return false;
    const min = this.campionatoSel.giornataDaGiocare ?? -Infinity;
    const max = this.campionatoSel.numGiornate ?? Infinity;
    return this.giornataIniziale >= min && this.giornataIniziale <= max;
  }

  isGiornataFinaleValid(): boolean {
    // In modalità CAMPIONATO la giornata finale è obbligatoria
    if (this.modalita === 'CAMPIONATO') {
      if (this.giornataFinale === null || this.giornataFinale === undefined) return false;
    } else {
      // SURVIVOR: campo opzionale; se vuoto è valido
      if (this.giornataFinale === null || this.giornataFinale === undefined) return true;
    }
    if (!this.campionatoSel || this.giornataIniziale === null) return false;
    const min = this.giornataIniziale + 1;
    const max = this.campionatoSel.numGiornate ?? Infinity;
    return this.giornataFinale >= min && this.giornataFinale <= max;
  }

  isFormValid(): boolean {
    return (
      !!this.name &&
      !!this.sportSel &&
      !!this.campionatoSel &&
      this.isGiornataValid() &&
      this.isGiornataFinaleValid()
    );
  }

  resetForm(): void {
    this.name = '';
    this.sportSel = null;
    this.campionatoSel = null;
    this.giornataIniziale = null;
    this.giornataFinale = null;
    this.pwd = null;
    this.nameTouched = false;
    this.sportTouched = false;
    this.campionatoTouched = false;
    this.giornataTouched = false;
    this.giornataFinaleTouched = false;
    this.campionatiDisponibili = [];
    this.pubblica = false;
    this.accessoLibero = false;
    this.maxPartecipanti = null;
    this.viteIniziali = 1;
    this.viteWarn = null;
  }

  onSubmit(): void {
    this.nameTouched = true;
    this.sportTouched = true;
    this.campionatoTouched = true;
    this.giornataTouched = true;
    this.giornataFinaleTouched = true;

    if (!this.isFormValid()) {
      return;
    }
    this.legaService
      .inserisciLega(
        this.name!,
        this.sportSel!,
        this.campionatoSel!.id,
        this.giornataIniziale!,
        this.giornataFinale,
        this.pwd,
        this.pubblica,
        this.accessoLibero,
        this.maxPartecipanti,
        this.modalita,
        this.viteIniziali
      )
      .subscribe({
        next: (lega) => {
          this.confirmationMessage = true;
          this.legaCreataId = lega.id;

          // Scroll to top immediato alla schermata di conferma
          window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
          document.documentElement.scrollTop = 0;
          document.body.scrollTop = 0;

          // Reset del viewport per iOS - previene lo zoom
          setTimeout(() => {
            this.resetViewportForIOS();
          }, 100);
        },
        error: (err) => {
          if (err && err.status === 499) {
            let messaggio = '';
            if (err?.error?.message) {
              messaggio = String(err.error.message);
            } else {
              messaggio = err.message;
            }
            this.dialog.open(ErrorDialogComponent, {
              data: { message: messaggio }
              // CENTRATO
            });
          }

          console.error('Errore creazione lega', err);
        },
      });
  }

  addEmail(): void {
    if (this.emailInput && this.isValidEmail(this.emailInput)) {
      if (!this.emailsList.includes(this.emailInput)) {
        this.emailsList.push(this.emailInput);
        this.emailInput = '';
      }
    }
  }

  removeEmail(email: string): void {
    const index = this.emailsList.indexOf(email);
    if (index >= 0) {
      this.emailsList.splice(index, 1);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  invitaUtenti(): void {
    if (this.emailsList.length === 0 || !this.legaCreataId) {
      return;
    }


    this.legaService.invitaUtenti(this.legaCreataId, this.emailsList).subscribe({
      next: () => {
        this.emailsList = [];
      },
      error: (err) => {
        console.error('Errore invio inviti:', err);
      },
    });
  }

  shareLink(): void {
    const url = this.getShareUrl();
    const nomeUtente = this.authService.getCurrentUser()?.name ?? 'Un amico';
    const messaggi = [
      `🏆 ${nomeUtente} ti sfida su Survivor! Unisciti alla mia lega "${this.name}" e dimostra chi è il vero campione! 💪`,
      `👋 Ciao! Sono ${nomeUtente} e ti invito nella lega "${this.name}" su Survivor. Chi sopravvive di più? 😈`,
      `⚽ ${nomeUtente} ti aspetta nella lega "${this.name}" su Survivor. Ti unisci alla sfida? 🔥`,
    ];
    const text = messaggi[Math.floor(Math.random() * messaggi.length)];
    const shareData = {
      title: 'Unisciti alla mia lega!',
      text,
      url
    };
    import('@capacitor/share').then(({ Share }) => {
      Share.share({ ...shareData, dialogTitle: 'Condividi la lega' }).catch(() => {});
    }).catch(() => {
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      }
    });
  }

  copyLink(): void {
    const url = this.getShareUrl();
    if (!navigator.clipboard) {
      // fallback
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showCopiedFeedback();
      } catch (e) {
        console.error('Copia fallita', e);
      }
      document.body.removeChild(textarea);
      return;
    }

    navigator.clipboard
      .writeText(url)
      .then(() => this.showCopiedFeedback())
      .catch((err) => console.error('Copia fallita', err));
  }

  goToLega(): void {
    if (this.legaCreataId) {
      this.router.navigate(['/lega', this.legaCreataId]);
    }
  }

  private showCopiedFeedback(): void {
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }
}
