import { AfterViewInit, Component, ElementRef, NgZone, OnDestroy, OnInit, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { VerificaCodiceErrore, VerificaCodiceResponse } from '../../core/models/auth.model';
import { environment } from '../../../environments/environment';

/** Chiave sessionStorage scritta dal login: email, tipo di richiesta e addInfo per il codice. */
export const LOGIN_PENDING_KEY = 'loginPendingSurvivor';

interface LoginPending {
  email: string;
  register: boolean;
  addInfo: string | null;
}

type Stato = 'input' | 'verifica' | 'errore' | 'ok';

const LUNGHEZZA = 6;
// 60s: il tempo di aprire la posta, cercare la mail (anche nello spam) e tornare, senza rinviare
// troppo presto (un nuovo codice annulla il precedente e quello appena letto risulterebbe errato)
const ATTESA_RINVIO_SEC = 60;

/**
 * Schermata dopo l'invio della mail: si scrive il codice di 6 cifre ricevuto, restando nell'app
 * (niente link da cliccare, niente Safari al posto dell'app). Il link nella mail resta come seconda
 * strada. Senza dati in sessionStorage (pagina aperta a mano) mostra il vecchio messaggio "controlla la mail".
 */
@Component({
  selector: 'app-magic-link-sent',
  standalone: true,
  imports: [MatIconModule, TranslateModule],
  templateUrl: './magic-link-sent.component.html',
  styleUrls: ['./login.component.scss', './magic-link-sent.component.scss']
})
export class MagicLinkSentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChildren('cifra') caselle!: QueryList<ElementRef<HTMLInputElement>>;

  readonly indici = Array.from({ length: LUNGHEZZA }, (_, i) => i);
  cifre: string[] = Array(LUNGHEZZA).fill('');
  pending: LoginPending | null = null;
  stato: Stato = 'input';
  /** Chiave i18n del messaggio sotto le caselle (errore o conferma rinvio) */
  messaggioKey = '';
  messaggioParams: Record<string, unknown> = {};
  messaggioOk = false;
  secondiRinvio = ATTESA_RINVIO_SEC;
  invioInCorso = false;
  /** Codice accettato: le caselle diventano verdi prima della schermata di conferma */
  riuscito = false;

  private timer: ReturnType<typeof setInterval> | null = null;

  constructor(private authService: AuthService, private router: Router, private zone: NgZone) {}

  ngOnInit(): void {
    try {
      const raw = sessionStorage.getItem(LOGIN_PENDING_KEY);
      this.pending = raw ? JSON.parse(raw) as LoginPending : null;
    } catch {
      this.pending = null;
    }
    if (this.pending) this.avviaContoRinvio();
  }

  ngAfterViewInit(): void {
    if (this.pending) setTimeout(() => this.focus(0), 350);
  }

  ngOnDestroy(): void {
    if (this.timer) clearInterval(this.timer);
  }

  get completo(): boolean {
    return this.cifre.every(c => c !== '');
  }

  // ── Inserimento cifre ────────────────────────────────────────────────────────────────

  onInput(i: number, event: Event): void {
    const input = event.target as HTMLInputElement;
    const cifre = input.value.replace(/\D/g, '');
    if (this.stato === 'errore') this.resetErrore();

    if (cifre.length > 1) {
      // Su una casella gia' piena si scrive una sola cifra in piu': vale l'ultima battuta.
      // Altrimenti e' incolla/suggerimento iPhone (codice intero): si distribuisce sulle caselle.
      if (cifre.length === 2 && this.cifre[i] !== '') {
        this.imposta(i, cifre.charAt(1));
        input.value = this.cifre[i];
        this.avanti(i);
      } else {
        input.value = this.cifre[i];
        this.riempi(cifre, i);
      }
      return;
    }
    this.imposta(i, cifre);
    input.value = cifre;
    if (cifre) this.avanti(i);
  }

  onKeydown(i: number, event: KeyboardEvent): void {
    if (event.key === 'Backspace' && !this.cifre[i] && i > 0) {
      event.preventDefault();
      this.imposta(i - 1, '');
      this.focus(i - 1);
    } else if (event.key === 'ArrowLeft' && i > 0) {
      event.preventDefault();
      this.focus(i - 1);
    } else if (event.key === 'ArrowRight' && i < LUNGHEZZA - 1) {
      event.preventDefault();
      this.focus(i + 1);
    }
  }

  onPaste(i: number, event: ClipboardEvent): void {
    const testo = (event.clipboardData?.getData('text') ?? '').replace(/\D/g, '');
    if (!testo) return;
    event.preventDefault();
    if (this.stato === 'errore') this.resetErrore();
    this.riempi(testo, testo.length >= LUNGHEZZA ? 0 : i);
  }

  onFocus(event: FocusEvent): void {
    (event.target as HTMLInputElement).select();
  }

  private imposta(i: number, valore: string): void {
    this.cifre = this.cifre.map((c, k) => (k === i ? valore : c));
  }

  private avanti(i: number): void {
    if (i < LUNGHEZZA - 1) this.focus(i + 1);
    else this.verificaSeCompleto();
  }

  /** Riempie a cascata (una cifra ogni 60ms) partendo da `da`, poi verifica. */
  private riempi(cifre: string, da: number): void {
    const daScrivere = cifre.slice(0, LUNGHEZZA - da).split('');
    daScrivere.forEach((c, k) => {
      setTimeout(() => {
        this.zone.run(() => {
          this.imposta(da + k, c);
          if (k === daScrivere.length - 1) {
            const prossima = da + daScrivere.length;
            if (prossima < LUNGHEZZA) this.focus(prossima);
            else this.verificaSeCompleto();
          }
        });
      }, k * 60);
    });
  }

  private focus(i: number): void {
    const el = this.caselle?.get(i)?.nativeElement;
    if (el) el.focus();
  }

  // ── Verifica ─────────────────────────────────────────────────────────────────────────

  private verificaSeCompleto(): void {
    if (!this.completo || !this.pending || this.stato === 'verifica' || this.stato === 'ok') return;
    this.stato = 'verifica';
    this.messaggioKey = '';
    (document.activeElement as HTMLElement | null)?.blur();

    this.authService.verifyCode(this.pending.email, this.cifre.join('')).subscribe({
      next: (res) => {
        // caselle verdi a cascata, poi la spunta, poi si entra
        this.riuscito = true;
        setTimeout(() => (this.stato = 'ok'), 700);
        setTimeout(() => this.entra(res), 1800);
      },
      error: (err: HttpErrorResponse) => this.gestisciErrore(err),
    });
  }

  private gestisciErrore(err: HttpErrorResponse): void {
    const body = err.error as VerificaCodiceErrore | null;
    this.messaggioOk = false;
    this.messaggioParams = {};
    this.messaggioKey = '';
    // Una scritta solo quando l'utente deve fare qualcosa di diverso dal riprovare: per il codice
    // sbagliato bastano scossa e rosso (salvo l'ultimo tentativo); un problema di rete invece non
    // scuote le caselle, perche' il codice non e' sbagliato.
    this.stato = body?.errore ? 'errore' : 'input';
    switch (body?.errore) {
      case 'CODICE_ERRATO':
        if (body.tentativiRimasti === 1) this.messaggioKey = 'AUTH.CODE.LAST_ATTEMPT';
        break;
      case 'CODICE_SCADUTO':
        this.messaggioKey = 'AUTH.CODE.EXPIRED';
        this.sbloccaRinvio();
        break;
      case 'TROPPI_TENTATIVI':
        this.messaggioKey = 'AUTH.CODE.TOO_MANY';
        this.sbloccaRinvio();
        break;
      default:
        this.messaggioKey = 'AUTH.CODE.ERROR_GENERIC';
    }
    // dopo la scossa (o subito, senza scossa) le caselle si svuotano e si riparte dalla prima
    setTimeout(() => {
      this.cifre = Array(LUNGHEZZA).fill('');
      this.caselle.forEach(c => (c.nativeElement.value = ''));
      this.focus(0);
    }, 650);
  }

  private resetErrore(): void {
    this.stato = 'input';
    this.messaggioKey = '';
  }

  /** Stessa destinazione del login col link (VerifyComponent): invito lega, percorso salvato o home. */
  private entra(res: VerificaCodiceResponse): void {
    try { sessionStorage.removeItem(LOGIN_PENDING_KEY); } catch { /* noop */ }
    const addInfo = res.addInfo || '';
    const join = addInfo.match(/^JOIN:(\d+)$/i);
    if (join) {
      if (res.magicToken) localStorage.setItem('magicTokenSurvivor', res.magicToken);
      this.router.navigate([`/join/${join[1]}`]);
    } else if (addInfo) {
      this.router.navigateByUrl('/' + addInfo);
    } else {
      this.router.navigate(['/home']);
    }
  }

  // ── Rinvio e cambio email ────────────────────────────────────────────────────────────

  private avviaContoRinvio(): void {
    if (this.timer) clearInterval(this.timer);
    this.secondiRinvio = ATTESA_RINVIO_SEC;
    this.timer = setInterval(() => {
      this.secondiRinvio--;
      if (this.secondiRinvio <= 0 && this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
    }, 1000);
  }

  private sbloccaRinvio(): void {
    if (this.timer) clearInterval(this.timer);
    this.timer = null;
    this.secondiRinvio = 0;
  }

  rinvia(): void {
    if (!this.pending || this.secondiRinvio > 0 || this.invioInCorso) return;
    this.invioInCorso = true;
    const addInfo = this.pending.addInfo ?? undefined;
    const richiesta = this.pending.register
      ? this.authService.requestMagicLink(this.pending.email, environment.mobile, addInfo)
      : this.authService.login(this.pending.email, environment.mobile, addInfo);
    richiesta.subscribe({
      next: () => {
        this.invioInCorso = false;
        this.stato = 'input';
        this.cifre = Array(LUNGHEZZA).fill('');
        this.caselle.forEach(c => (c.nativeElement.value = ''));
        this.messaggioKey = 'AUTH.CODE.RESENT';
        this.messaggioParams = {};
        this.messaggioOk = true;
        this.avviaContoRinvio();
        this.focus(0);
      },
      error: () => {
        this.invioInCorso = false;
        this.messaggioKey = 'AUTH.CODE.ERROR_GENERIC';
        this.messaggioOk = false;
      },
    });
  }

  /** Torna al login conservando l'eventuale invito alla lega (stesso returnUrl di partenza). */
  cambiaEmail(): void {
    const addInfo = this.pending?.addInfo ?? '';
    try { sessionStorage.removeItem(LOGIN_PENDING_KEY); } catch { /* noop */ }
    const join = addInfo.match(/^JOIN:(\d+)$/i);
    const returnUrl = join ? `/join/${join[1]}` : (addInfo ? '/' + addInfo : null);
    this.router.navigate(['/auth/login'], returnUrl ? { queryParams: { returnUrl } } : {});
  }
}
