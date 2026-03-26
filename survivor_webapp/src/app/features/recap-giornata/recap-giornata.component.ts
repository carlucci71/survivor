import {
  Component, OnInit, OnDestroy, HostListener, ChangeDetectorRef, inject
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Capacitor } from '@capacitor/core';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { RecapService } from '../../core/services/recap.service';
import { RecapGiornata, RecapPickEntry } from '../../core/models/interfaces.model';

export type SlideId = 'cover' | 'scelte' | 'sopravvissuti' | 'eliminati' | 'stats' | 'fine';

interface Slide {
  id: SlideId;
  label: string;
}

const SLIDES: Slide[] = [
  { id: 'cover',         label: 'Intro' },
  { id: 'scelte',        label: 'Scelte' },
  { id: 'sopravvissuti', label: 'Vivi' },
  { id: 'eliminati',     label: 'Fuori' },
  { id: 'stats',         label: 'Stats' },
  { id: 'fine',          label: 'Fine' },
];

@Component({
  selector: 'app-recap-giornata',
  standalone: true,
  imports: [CommonModule, TranslateModule, MatIconModule],
  templateUrl: './recap-giornata.component.html',
  styleUrls: ['./recap-giornata.component.scss'],
  animations: [
    trigger('staggerCards', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(24px)' }),
          stagger(80, [
            animate('350ms cubic-bezier(0.34, 1.56, 0.64, 1)',
              style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class RecapGiornataComponent implements OnInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private recapService = inject(RecapService);
  private cdr = inject(ChangeDetectorRef);

  recap: RecapGiornata | null = null;
  loading = true;
  error = false;
  errorDetail: string | null = null;

  slides = SLIDES;
  currentIdx = 0;

  // swipe tracking
  private touchStartX = 0;
  private touchStartY = 0;
  private dragging = false;

  // slide direction for animation class
  direction: 'left' | 'right' = 'left';

  // animated counter for sopravvissuti slide
  animatedSopravvissuti = 0;
  private counterInterval: any = null;

  get currentSlide(): SlideId {
    return this.slides[this.currentIdx].id;
  }

  get sopravvissuti(): RecapPickEntry[] {
    return this.recap?.picks.filter(p => p.statoDopoGiornata === 'ATTIVO') ?? [];
  }

  get eliminatiQuesta(): RecapPickEntry[] {
    return this.recap?.picks.filter(p => p.eliminatoQuestaGiornata) ?? [];
  }

  get tuttiEliminati(): RecapPickEntry[] {
    return this.recap?.picks.filter(p => p.statoDopoGiornata === 'ELIMINATO' && !p.eliminatoQuestaGiornata) ?? [];
  }

  get okCount(): number {
    return this.recap?.picks.filter(p => p.esito === 'OK').length ?? 0;
  }

  get koCount(): number {
    return this.recap?.picks.filter(p => p.esito === 'KO').length ?? 0;
  }

  get progressPct(): number {
    if (!this.recap) return 0;
    return Math.round((this.recap.sopravvissuti / this.recap.totaleMembri) * 100);
  }

  ngOnInit(): void {
    const legaId = Number(this.route.snapshot.paramMap.get('legaId'));
    const giornata = Number(this.route.snapshot.paramMap.get('giornata'));

    console.log('[RecapGiornata] ngOnInit → legaId:', legaId, 'giornata:', giornata);

    if (!legaId || !giornata || isNaN(legaId) || isNaN(giornata)) {
      console.error('[RecapGiornata] Parametri rotta non validi', { legaId, giornata });
      this.errorDetail = `Parametri non validi: legaId=${legaId}, giornata=${giornata}`;
      this.error = true;
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    this.recapService.getRecap(legaId, giornata).subscribe({
      next: (data) => {
        this.recap = data;
        this.loading = false;
        this.recapService.markAsSeen(legaId, giornata);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        const status = err?.status ?? 'N/A';
        const message = err?.error?.message ?? err?.message ?? 'Unknown error';
        console.error('[RecapGiornata] Errore caricamento recap', { status, message, legaId, giornata, err });
        this.errorDetail = `HTTP ${status}: ${message}`;
        this.error = true;
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  ngOnDestroy(): void {
    this.clearCounter();
  }

  // ─── Navigation ───────────────────────────────────────────────────────────

  goTo(idx: number): void {
    if (idx < 0 || idx >= this.slides.length) return;
    this.direction = idx > this.currentIdx ? 'left' : 'right';
    this.currentIdx = idx;
    if (this.currentSlide === 'sopravvissuti') {
      this.startCounter();
    } else {
      this.clearCounter();
    }
    this.cdr.detectChanges();
  }

  next(): void { this.goTo(this.currentIdx + 1); }
  prev(): void { this.goTo(this.currentIdx - 1); }

  close(): void {
    const legaId = this.recap?.legaId;
    if (legaId) {
      this.router.navigate(['/lega', legaId]);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // ─── Touch / Swipe ─────────────────────────────────────────────────────────

  onTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
    this.dragging = true;
  }

  onTouchEnd(event: TouchEvent): void {
    if (!this.dragging) return;
    this.dragging = false;
    const dx = event.changedTouches[0].clientX - this.touchStartX;
    const dy = event.changedTouches[0].clientY - this.touchStartY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 50) {
      dx < 0 ? this.next() : this.prev();
    }
  }

  onTouchCancel(): void {
    // Android can cancel touches (e.g. system back gesture); reset dragging state cleanly
    this.dragging = false;
  }

  // ─── Keyboard ──────────────────────────────────────────────────────────────

  @HostListener('document:keydown', ['$event'])
  onKey(event: KeyboardEvent): void {
    if (event.key === 'ArrowRight') this.next();
    if (event.key === 'ArrowLeft')  this.prev();
    if (event.key === 'Escape')     this.close();
  }

  // ─── Counter animation ─────────────────────────────────────────────────────

  private startCounter(): void {
    this.clearCounter();
    if (!this.recap) return;
    const target = this.recap.sopravvissuti;
    this.animatedSopravvissuti = 0;
    const step = Math.max(1, Math.ceil(target / 20));
    this.counterInterval = setInterval(() => {
      this.animatedSopravvissuti = Math.min(this.animatedSopravvissuti + step, target);
      this.cdr.detectChanges();
      if (this.animatedSopravvissuti >= target) this.clearCounter();
    }, 50);
  }

  private clearCounter(): void {
    if (this.counterInterval) {
      clearInterval(this.counterInterval);
      this.counterInterval = null;
    }
  }

  // ─── Share ─────────────────────────────────────────────────────────────────

  async share(): Promise<void> {
    if (!this.recap) return;
    const text = this.buildShareText();
    const url = window.location.href;

    // Capacitor Share (nativo iOS/Android)
    if (Capacitor.isNativePlatform()) {
      try {
        const { Share } = await import('@capacitor/share');
        await Share.share({ title: text.split('\n')[0], text, url, dialogTitle: 'Condividi recap' });
        return;
      } catch { /* fallback */ }
    }

    // Web Share API
    if (navigator.share) {
      try {
        await navigator.share({ title: text.split('\n')[0], text, url });
        return;
      } catch { /* fallback */ }
    }

    // Clipboard fallback
    try {
      await navigator.clipboard.writeText(`${text}\n${url}`);
      alert('Testo copiato negli appunti!');
    } catch { /* noop */ }
  }

  private buildShareText(): string {
    if (!this.recap) return '';
    const r = this.recap;
    return [
      `🏆 ${r.legaNome} — Giornata ${r.giornataRelativa}`,
      `✅ ${r.sopravvissuti} sopravvissuti su ${r.totaleMembri}`,
      r.eliminatiQuestaGiornata > 0
        ? `💀 ${r.eliminatiQuestaGiornata} eliminat${r.eliminatiQuestaGiornata === 1 ? 'o' : 'i'} questa giornata`
        : '',
      r.stats.squadraPiuScelta
        ? `🔥 Più scelta: ${r.stats.squadraPiuScelta} (${r.stats.quanti} giocatori)`
        : '',
      '',
      '🎮 Survivo — il fantasy dell\'eliminazione'
    ].filter(Boolean).join('\n');
  }

  // ─── Helpers ───────────────────────────────────────────────────────────────

  trackByNickname(_: number, p: RecapPickEntry): string { return p.nickname; }

  sportEmoji(sport: string | null): string {
    switch (sport?.toUpperCase()) {
      case 'CALCIO':  return '⚽';
      case 'BASKET':  return '🏀';
      case 'TENNIS':  return '🎾';
      default:        return '🏆';
    }
  }
}
