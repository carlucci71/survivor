import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Router } from '@angular/router';
import { SportService } from '../../../core/services/sport.service';
import { CampionatoService } from '../../../core/services/campionato.service';
import { LegaService } from '../../../core/services/lega.service';
import { AuthService } from '../../../core/services/auth.service';
import { Campionato, Sport } from '../../../core/models/interfaces.model';
import { environment } from '../../../../environments/environment';

/**
 * Creazione rapida di una lega Survivor 1v1 ("sfida lampo"): sport/campionato pre-selezionati
 * in automatico (primo disponibile) così un solo tap su "Crea e invita" basta — la condivisione
 * parte da sola subito dopo la creazione, non serve un secondo tap. Accesso libero forzato a
 * true e max 2 partecipanti: l'amico invitato entra dal link senza bisogno di approvazione.
 */
@Component({
  selector: 'app-sfida-lampo-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatDialogModule, MatIconModule, TranslateModule],
  template: `
    <div class="sl-dialog">

      <!-- Bolle decorative di sfondo -->
      <span class="sl-bubble sl-b1"></span>
      <span class="sl-bubble sl-b2"></span>
      <span class="sl-bubble sl-b3"></span>
      <span class="sl-bubble sl-b4"></span>
      <span class="sl-bubble sl-b5"></span>
      <span class="sl-bubble sl-b6"></span>

      <button type="button" class="sl-close" (click)="close()" [attr.aria-label]="'DIALOGS.CLOSE' | translate">
        <mat-icon>close</mat-icon>
      </button>

      <div class="sl-hero">
        <div class="sl-icon-wrap">
          <span class="sl-emoji">⚔️</span>
        </div>
        <h2 class="sl-title">{{ 'DUEL.TITLE' | translate }}</h2>
        <p class="sl-subtitle">{{ 'DUEL.CARD_SUBTITLE' | translate }}</p>
      </div>

      <div class="sl-body" *ngIf="step === 'form'">
        <input type="text" class="sl-name-input" [(ngModel)]="name" [placeholder]="'DUEL.NAME_PLACEHOLDER' | translate" maxlength="60">

        <div class="sl-sport-row">
          <button type="button" class="sl-sport-chip" *ngFor="let sport of sportDisponibili"
                  [class.sl-sport-chip--active]="sportSel === sport.id"
                  (click)="selectSport(sport.id)">
            <mat-icon>{{ getSportIcon(sport.id) }}</mat-icon>
          </button>
        </div>

        <div class="sl-camp-row" *ngIf="sportSel">
          <ng-container *ngIf="campionatiDisponibili.length; else loadingCamp">
            <button type="button" class="sl-camp-chip" *ngFor="let c of campionatiDisponibili"
                    [class.sl-camp-chip--active]="campionatoSel?.id === c.id"
                    [class.sl-camp-chip--disabled]="!isDisponibile(c)"
                    [disabled]="!isDisponibile(c)"
                    (click)="selectCampionato(c)">
              {{ c.nome }}
            </button>
          </ng-container>
          <ng-template #loadingCamp>
            <span class="sl-camp-loading">…</span>
          </ng-template>
        </div>

        <div class="sl-error" *ngIf="errorMessage">{{ errorMessage }}</div>

        <button type="button" class="sl-submit" [disabled]="!canSubmit() || creating" (click)="creaEInvita()">
          <mat-icon *ngIf="!creating">bolt</mat-icon>
          <span>{{ creating ? ('COMMON.LOADING' | translate) : ('DUEL.CREATE_AND_INVITE' | translate) }}</span>
        </button>
      </div>

      <div class="sl-body sl-body--done" *ngIf="step === 'done'">
        <div class="sl-done-check"><mat-icon>check_circle</mat-icon></div>
        <p class="sl-done-text">{{ 'DUEL.CREATED_TEXT' | translate: { name: name } }}</p>
        <button type="button" class="sl-share-btn" (click)="shareLink()">
          <mat-icon>ios_share</mat-icon>
          {{ 'DUEL.SHARE_BUTTON' | translate }}
        </button>
        <button type="button" class="sl-copy-btn" (click)="copyLink()">
          <mat-icon>{{ copied ? 'check' : 'content_copy' }}</mat-icon>
          {{ (copied ? 'DUEL.LINK_COPIED' : 'DUEL.COPY_LINK') | translate }}
        </button>
        <button type="button" class="sl-goto-btn" (click)="goToLega()">
          <mat-icon>sports</mat-icon>
          {{ 'DUEL.GO_TO_LEAGUE' | translate }}
        </button>
      </div>

    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800&display=swap');

    .sl-dialog {
      position: relative;
      display: flex;
      flex-direction: column;
      background: var(--bg-card, #fff);
      border-radius: 24px;
      overflow: hidden;
      /* overflow:hidden a volte non arrotonda l'angolo in basso se un discendente animato
         (bolle, glow) viene promosso su un proprio layer GPU e "scappa" dal clip del genitore:
         clip-path è un clip geometrico vero, non soggetto a questo problema di compositing. */
      clip-path: inset(0 round 24px);
      box-sizing: border-box;
      width: 100%;
      font-family: 'Poppins', sans-serif;
      text-align: center;
    }

    /* ─── Bolle fluttuanti ─── */
    .sl-bubble { position: absolute; border-radius: 50%; pointer-events: none; z-index: 0; }
    .sl-b1, .sl-b2, .sl-b3 {
      background: radial-gradient(circle at 30% 30%, rgba(255,255,255,0.55), rgba(255,255,255,0.12));
      border: 1px solid rgba(255,255,255,0.35);
    }
    .sl-b1 { width: 54px; height: 54px; top: -10px; left: 8%;  animation: sl-float1 6.5s ease-in-out infinite; }
    .sl-b2 { width: 26px; height: 26px; top: 62px; left: 24%;  animation: sl-float2 5s ease-in-out infinite; }
    .sl-b3 { width: 38px; height: 38px; top: 18px; right: 16%; animation: sl-float1 7.5s ease-in-out infinite reverse; }
    .sl-b4, .sl-b5, .sl-b6 {
      background: radial-gradient(circle at 30% 30%, rgba(79, 195, 247,0.25), rgba(79, 195, 247,0.06));
      border: 1px solid rgba(79, 195, 247,0.25);
    }
    .sl-b4 { width: 34px; height: 34px; top: 200px; left: -10px;   animation: sl-float2 6s ease-in-out infinite; }
    .sl-b5 { width: 22px; height: 22px; top: 290px; right: 10px;   animation: sl-float1 5.5s ease-in-out infinite; }
    .sl-b6 { width: 46px; height: 46px; bottom: 40px; right: -14px; animation: sl-float2 8s ease-in-out infinite; }

    @keyframes sl-float1 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(6px,-12px) scale(1.08); } }
    @keyframes sl-float2 { 0%, 100% { transform: translate(0,0) scale(1); } 50% { transform: translate(-7px,10px) scale(0.94); } }

    .sl-close {
      position: absolute;
      top: 12px; right: 12px;
      z-index: 3;
      width: 32px; height: 32px;
      border: none;
      background: rgba(255,255,255,0.22);
      backdrop-filter: blur(4px);
      border-radius: 50%;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center;
      transition: background 0.15s;
      padding: 0;
    }
    .sl-close mat-icon { font-size: 17px; width: 17px; height: 17px; color: #fff; }
    .sl-close:hover { background: rgba(255,255,255,0.36); }

    .sl-hero {
      position: relative;
      z-index: 1;
      padding: 28px 24px 24px;
      background: linear-gradient(135deg, #4FC3F7, #0A3D91);
      color: #fff;
      overflow: hidden;
      border-radius: 24px 24px 0 0;
    }
    .sl-hero::after {
      content: '';
      position: absolute;
      left: 0; right: 0; bottom: -1px;
      height: 16px;
      background: var(--bg-card, #fff);
      border-radius: 18px 18px 0 0;
    }

    .sl-icon-wrap {
      position: relative;
      z-index: 1;
      width: 64px; height: 64px;
      margin: 0 auto 10px;
      border-radius: 50%;
      background: rgba(255,255,255,0.2);
      border: 1.5px solid rgba(255,255,255,0.45);
      box-shadow: 0 6px 20px rgba(0,0,0,0.15), inset 0 0 18px rgba(255,255,255,0.25);
      display: flex; align-items: center; justify-content: center;
      animation: sl-glow 3s ease-in-out infinite;
    }
    .sl-emoji { font-size: 1.9rem; line-height: 1; animation: sl-bob 3s ease-in-out infinite; }
    @keyframes sl-glow {
      0%, 100% { box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 0 0 0 rgba(255,255,255,0.35), inset 0 0 18px rgba(255,255,255,0.25); }
      50%      { box-shadow: 0 6px 20px rgba(0,0,0,0.15), 0 0 0 10px rgba(255,255,255,0), inset 0 0 18px rgba(255,255,255,0.25); }
    }
    @keyframes sl-bob { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-3px); } }

    .sl-title { position: relative; z-index: 1; font-size: 1.25rem; font-weight: 800; color: #fff; margin: 0 0 2px; letter-spacing: 0.2px; }
    .sl-subtitle { position: relative; z-index: 1; font-size: 0.82rem; color: rgba(255,255,255,0.88); margin: 0; }

    .sl-body {
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      padding: 20px 20px 22px;
      background: var(--bg-card, #fff);
      border-radius: 0 0 24px 24px;
    }

    .sl-name-input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px 16px;
      border-radius: 30px;
      border: 1.5px solid var(--border-color, #E5E7EB);
      background: var(--bg-tertiary, #F8F9FA);
      color: var(--text-primary, #1A202C);
      font-family: inherit;
      font-size: 0.92rem;
      font-weight: 600;
      text-align: center;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s, background 0.15s;
    }
    .sl-name-input:focus {
      border-color: #4FC3F7;
      background: var(--bg-card, #fff);
      box-shadow: 0 0 0 3px rgba(79, 195, 247,0.18);
    }

    .sl-sport-row { display: flex; justify-content: center; gap: 8px; }
    .sl-sport-chip {
      width: 46px; height: 46px;
      border-radius: 50%;
      border: 1.5px solid var(--border-color, #E2E8F0);
      background: var(--bg-card, #fff);
      color: var(--text-secondary, #6B7280);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .sl-sport-chip mat-icon { font-size: 22px; width: 22px; height: 22px; }
    .sl-sport-chip--active {
      border-color: #4FC3F7;
      background: linear-gradient(135deg, rgba(79, 195, 247,0.16), rgba(10, 61, 145,0.08));
      color: #0A3D91;
    }

    .sl-camp-row { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; }
    .sl-camp-chip {
      padding: 7px 14px;
      border-radius: 20px;
      border: 1.5px solid var(--border-color, #E2E8F0);
      background: var(--bg-card, #fff);
      color: var(--text-primary, #1A202C);
      font-family: inherit;
      font-size: 0.8rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.15s ease;
    }
    .sl-camp-chip--active {
      border-color: #4FC3F7;
      background: linear-gradient(135deg, rgba(79, 195, 247,0.16), rgba(10, 61, 145,0.08));
      color: #0A3D91;
    }
    .sl-camp-chip--disabled { opacity: 0.45; cursor: not-allowed; }
    .sl-camp-loading { color: var(--text-tertiary, #9CA3AF); font-size: 0.85rem; padding: 6px 0; }

    .sl-error { color: var(--error-color, #E53935); font-size: 0.8rem; }

    .sl-submit {
      margin-top: 8px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 14px 16px;
      border-radius: 30px;
      border: none;
      background: linear-gradient(135deg, #4FC3F7, #0A3D91);
      color: #fff;
      font-size: 0.92rem;
      font-weight: 700;
      font-family: inherit;
      cursor: pointer;
      box-shadow: 0 4px 14px rgba(10, 61, 145,0.35);
      transition: all 0.18s ease;
    }
    .sl-submit:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 18px rgba(10, 61, 145,0.45); }
    .sl-submit:active:not(:disabled) { transform: translateY(0) scale(0.98); }
    .sl-submit:disabled { opacity: 0.55; cursor: not-allowed; box-shadow: none; }

    .sl-body--done { align-items: center; padding: 26px 22px 24px; }
    .sl-done-check mat-icon { font-size: 46px; width: 46px; height: 46px; color: #43A047; }
    .sl-done-text { color: var(--text-secondary, #6B7280); font-size: 0.88rem; margin: 8px 0 16px; }
    .sl-share-btn {
      width: 100%;
      padding: 13px;
      border-radius: 30px;
      background: linear-gradient(135deg, #4FC3F7, #0A3D91);
      color: #fff;
      border: none;
      font-weight: 700;
      font-size: 0.88rem;
      font-family: inherit;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 10px;
      box-shadow: 0 4px 14px rgba(10, 61, 145,0.3);
    }
    .sl-copy-btn {
      width: 100%;
      padding: 12px;
      border-radius: 30px;
      background: var(--bg-tertiary, #F8F9FA);
      color: #0A3D91;
      border: 1.5px solid #4FC3F7;
      font-weight: 700;
      font-size: 0.85rem;
      font-family: inherit;
      cursor: pointer;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      margin-bottom: 12px;
    }
    .sl-goto-btn {
      width: 100%;
      padding: 11px;
      border-radius: 30px;
      background: transparent;
      color: var(--text-secondary, #6B7280);
      border: none;
      font-weight: 600;
      font-size: 0.85rem;
      font-family: inherit;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      transition: background 0.15s ease, color 0.15s ease;
    }
    .sl-goto-btn mat-icon { font-size: 17px; width: 17px; height: 17px; }
    .sl-goto-btn:hover {
      background: var(--bg-tertiary, #F8F9FA);
      color: #0A3D91;
    }

    @media (max-width: 400px) {
      .sl-hero { padding: 24px 18px 20px; }
      .sl-icon-wrap { width: 56px; height: 56px; }
      .sl-emoji { font-size: 1.7rem; }
      .sl-body { padding: 16px 14px 18px; }
    }

    @media (prefers-reduced-motion: reduce) {
      .sl-bubble, .sl-icon-wrap, .sl-emoji { animation: none; }
    }
  `]
})
export class SfidaLampoDialogComponent implements OnInit {
  step: 'form' | 'done' = 'form';
  name = '';
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  creating = false;
  errorMessage: string | null = null;
  legaCreataId: number | null = null;
  copied = false;

  constructor(
    private dialogRef: MatDialogRef<SfidaLampoDialogComponent>,
    private sportService: SportService,
    private campionatoService: CampionatoService,
    private legaService: LegaService,
    private authService: AuthService,
    private translate: TranslateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const nomeUtente = this.authService.getCurrentUser()?.name ?? '';
    this.name = this.translate.instant('DUEL.NAME_DEFAULT', { nome: nomeUtente });
    this.sportService.getSport().subscribe({
      next: (sport) => {
        this.sportDisponibili = sport;
        if (sport.length) this.selectSport(sport[0].id);
      },
      error: () => {},
    });
  }

  getSportIcon(id: string): string {
    const icons: Record<string, string> = { CALCIO: 'sports_soccer', BASKET: 'sports_basketball', TENNIS: 'sports_tennis' };
    return icons[id] ?? 'sports';
  }

  selectSport(id: string): void {
    this.sportSel = id;
    this.campionatoSel = null;
    this.campionatiDisponibili = [];
    this.campionatoService.getCampionatoBySport(id).subscribe({
      next: (campionati) => {
        this.campionatiDisponibili = campionati;
        // Pre-seleziona il primo disponibile: zero tap richiesti per procedere
        const primoDisponibile = campionati.find((c) => this.isDisponibile(c));
        if (primoDisponibile) this.campionatoSel = primoDisponibile;
      },
      error: () => {},
    });
  }

  isDisponibile(c: Campionato): boolean {
    return this.campionatoService.isCampionatoDisponibile(c);
  }

  selectCampionato(c: Campionato): void {
    if (!this.isDisponibile(c)) return;
    this.campionatoSel = c;
  }

  canSubmit(): boolean {
    return !!this.name?.trim() && !!this.sportSel && !!this.campionatoSel;
  }

  creaEInvita(): void {
    if (!this.canSubmit() || !this.campionatoSel) return;
    this.creating = true;
    this.errorMessage = null;
    const giornataIniziale = this.campionatoSel.giornataDaGiocare ?? 1;
    this.legaService.inserisciLega(
      this.name.trim(),
      this.sportSel!,
      this.campionatoSel.id,
      giornataIniziale,
      null,
      null,
      false,
      true,
      2,
      'SURVIVOR',
      1
    ).subscribe({
      next: (lega) => {
        this.creating = false;
        this.legaCreataId = lega.id;
        this.step = 'done';
        // Un solo tap per creare E invitare: lo share parte da solo, non serve un secondo click
        this.shareLink();
      },
      error: (err) => {
        this.creating = false;
        this.errorMessage = err?.error?.message || this.translate.instant('DUEL.CREATE_ERROR');
      },
    });
  }

  getShareUrl(): string {
    return environment.baseUrl + '/apriLega?legaId=' + this.legaCreataId;
  }

  shareLink(): void {
    const url = this.getShareUrl();
    const nomeUtente = this.authService.getCurrentUser()?.name ?? 'Un amico';
    // Il link sta SOLO nel testo, senza campo `url`: alcune app (WhatsApp) ignorano `url`, altre
    // lo accodano al testo e lo stampano due volte.
    const text = this.translate.instant('DUEL.SHARE_MESSAGE', { nome: nomeUtente, name: this.name }) + '\n' + url;
    const shareData = { title: this.translate.instant('DUEL.SHARE_TITLE'), text };
    import('@capacitor/share').then(({ Share }) => {
      Share.share({ ...shareData, dialogTitle: this.translate.instant('DUEL.SHARE_TITLE') }).catch(() => {});
    }).catch(() => {
      if (navigator.share) {
        navigator.share(shareData).catch(() => {});
      }
    });
  }

  copyLink(): void {
    const url = this.getShareUrl();
    if (!navigator.clipboard) {
      const textarea = document.createElement('textarea');
      textarea.value = url;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      try {
        document.execCommand('copy');
        this.showCopiedFeedback();
      } catch { /* ignora */ }
      document.body.removeChild(textarea);
      return;
    }
    navigator.clipboard.writeText(url).then(() => this.showCopiedFeedback()).catch(() => {});
  }

  private showCopiedFeedback(): void {
    this.copied = true;
    setTimeout(() => (this.copied = false), 2000);
  }

  goToLega(): void {
    if (this.legaCreataId) {
      this.router.navigate(['/lega', this.legaCreataId]);
      this.dialogRef.close();
    }
  }

  close(): void {
    this.dialogRef.close(this.legaCreataId);
  }
}
