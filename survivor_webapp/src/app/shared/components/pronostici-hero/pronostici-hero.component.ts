import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Giocata, Lega } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';
import {
  durataAllInizio, giornataIniziata, inizioGiornata, perUrgenza, statoPronostico,
} from '../../../core/utils/stato-pronostico';

/** Riga del riepilogo: una lega, con la squadra scelta (o da scegliere) e quando inizia */
interface RigaRecap { lega: Lega; todo: boolean; logo: string | null; squadra: string; }
interface Esito { tipo: 'win' | 'loss' | 'draw'; squadra: string; lega: string; }

const ESITI_VISTI_KEY = 'survivor_esiti_visti';
const MAX_RIGHE = 3;

/**
 * Hero della home: "Le tue scelte". Risponde a una domanda sola, ho votato dappertutto?
 * In alto una frase ("Ti mancano 2 scelte" / "Tutto fatto"); sotto una card
 * per lega: quelle da votare (ambra) per prime, ognuna con il suo pulsante "Scegli" (l'unica parte
 * cliccabile della card) che apre la
 * scelta di QUELLA lega (lega-dettaglio ?vota=1); niente pulsante unico, che non diceva dove
 * portava. Le scelte fatte mostrano logo, squadra e quanto resta per cambiarla. Oltre 3 leghe l'elenco si apre sul
 * posto ("Vedi tutte le leghe"). Conta solo la scelta del
 * turno corrente: la vecchia card mostrava la scelta del turno prima e faceva credere di aver votato.
 * Senza leghe in corso diventa un benvenuto con "Crea" / "Leghe aperte".
 */
@Component({
  selector: 'app-pronostici-hero',
  standalone: true,
  imports: [CommonModule, MatIconModule, TranslateModule],
  templateUrl: './pronostici-hero.component.html',
  styleUrls: ['./pronostici-hero.component.scss'],
})
export class PronosticiHeroComponent implements OnInit, OnChanges, OnDestroy {
  /** Ultima edizione delle leghe in cui sei ancora in gioco (senza filtro di ricerca) */
  @Input() leghe: Lega[] = [];
  /** Tutte le mie leghe: servono per annunciare i nuovi esiti (anche di leghe dove sono appena uscito) */
  @Input() tutteLeghe: Lega[] = [];
  @Input() caricamento = false;
  /** Ricarica le leghe quando una scelta aspetta ancora l'esito */
  @Output() refreshRequired = new EventEmitter<void>();

  adesso = Date.now();
  daVotare: Lega[] = [];
  fatte: Lega[] = [];
  /** Tutte le righe (da votare prima); in vista le prime MAX_RIGHE, tutte se espanso */
  righe: RigaRecap[] = [];
  readonly maxRighe = MAX_RIGHE;
  espanso = false;
  /** Leghe il cui logo non si e' caricato: al suo posto la sigla della squadra */
  logoRotti = new Set<number>();
  esito: Esito | null = null;

  private tick: ReturnType<typeof setInterval> | null = null;
  private refresh: ReturnType<typeof setInterval> | null = null;
  private esitoTimer: ReturnType<typeof setTimeout> | null = null;

  constructor(
    private router: Router,
    private logoService: TeamLogoService,
    private translate: TranslateService,
  ) {}

  ngOnInit(): void {
    // countdown aggiornato ogni 30 secondi
    this.tick = setInterval(() => (this.adesso = Date.now()), 30000);
    // come la vecchia card: se una scelta aspetta l'esito, ricarica ogni minuto
    this.refresh = setInterval(() => {
      const inAttesa = this.leghe.some(l => !!l.miaGiocataCorrente && l.miaGiocataCorrente.esito !== 'OK' && l.miaGiocataCorrente.esito !== 'KO');
      if (inAttesa) this.refreshRequired.emit();
    }, 60000);
  }

  ngOnChanges(): void {
    this.daVotare = this.leghe.filter(l => statoPronostico(l) === 'da-votare').sort(perUrgenza);
    this.fatte = this.leghe.filter(l => statoPronostico(l) === 'fatto');
    // Riepilogo: prima le leghe da votare (chi inizia prima), poi le scelte fatte (chi gioca prima)
    const tutte: RigaRecap[] = [
      ...this.daVotare.map(l => ({ lega: l, todo: true, logo: null, squadra: '' })),
      ...[...this.fatte].sort(perUrgenza).map(l => this.rigaFatta(l)),
    ];
    this.righe = tutte;
    this.cercaNuoviEsiti();
  }

  ngOnDestroy(): void {
    if (this.tick) clearInterval(this.tick);
    if (this.refresh) clearInterval(this.refresh);
    if (this.esitoTimer) clearTimeout(this.esitoTimer);
  }

  // ── Stato ──────────────────────────────────────────────────────────────────

  get totale(): number { return this.daVotare.length + this.fatte.length; }
  get tuttoFatto(): boolean { return this.totale > 0 && this.daVotare.length === 0; }
  get righeVisibili(): RigaRecap[] { return this.espanso ? this.righe : this.righe.slice(0, MAX_RIGHE); }
  get senzaLeghe(): boolean { return !this.caricamento && this.leghe.length === 0; }
  get nuovoUtente(): boolean { return this.senzaLeghe && this.tutteLeghe.length === 0; }

  durata(l: Lega) { return durataAllInizio(l, this.adesso); }
  iniziata(l: Lega): boolean { return giornataIniziata(l, this.adesso); }

  /** Prossimo inizio di giornata (quando e' tutto fatto): la data piu' vicina nel futuro */
  get prossimoInizio(): string | null {
    const futuri = this.leghe.map(l => inizioGiornata(l)).filter((t): t is number => t != null && t > this.adesso);
    if (!futuri.length) return null;
    const lang = this.translate.currentLang || 'it';
    return new Intl.DateTimeFormat(lang, { weekday: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
      .format(new Date(Math.min(...futuri)));
  }

  private rigaFatta(l: Lega): RigaRecap {
    const g = l.miaGiocataCorrente;
    const sigla = g?.squadraSigla ?? '';
    return {
      lega: l,
      todo: false,
      logo: this.logoService.getLogoUrl(l.campionato?.sport?.id, l.campionato?.id, sigla),
      squadra: g?.squadraNome || sigla,
    };
  }

  /** Pulsante "Scegli": apre subito la finestra di scelta di quella lega */
  scegli(l: Lega): void {
    this.router.navigate(['/lega', l.id], { queryParams: { vota: 1 } });
  }

  // ── Azioni ─────────────────────────────────────────────────────────────────

  creaLega(): void { this.router.navigate(['/creaLega']); }
  legheAperte(): void { this.router.navigate(['/joinLega']); }

  onLogoError(event: Event): void {
    (event.target as HTMLImageElement).style.display = 'none';
  }

  // ── Nuovi esiti (animazione di vittoria/sconfitta) ─────────────────────────

  /**
   * Annuncia una volta sola il risultato piu' recente non ancora visto. Al primissimo avvio segna
   * tutti gli esiti gia' presenti come visti, altrimenti partirebbe un vecchio risultato.
   */
  private cercaNuoviEsiti(): void {
    if (!this.tutteLeghe.length || this.esito) return;
    let visti: string[] | null = null;
    try {
      const raw = localStorage.getItem(ESITI_VISTI_KEY);
      visti = raw ? JSON.parse(raw) : null;
    } catch { visti = null; }
    const primaVolta = visti === null;
    const giaVisti = new Set(visti ?? []);

    const nuovi: { chiave: string; lega: Lega; g: Giocata }[] = [];
    for (const l of this.tutteLeghe) {
      const g = l.miaGiocataCorrente?.esito ? l.miaGiocataCorrente : l.miaUltimaGiocataConEsito;
      if (!g?.esito || !['OK', 'KO', 'PAREGGIO'].includes(g.esito as string)) continue;
      const chiave = `${l.id}:${g.giornata}`;
      if (!giaVisti.has(chiave)) nuovi.push({ chiave, lega: l, g });
    }
    if (!nuovi.length) {
      if (primaVolta) this.salvaVisti([]);
      return;
    }
    this.salvaVisti([...giaVisti, ...nuovi.map(n => n.chiave)]);
    if (primaVolta) return;

    const ultimo = nuovi.sort((a, b) => (b.lega.id ?? 0) - (a.lega.id ?? 0))[0];
    const e = ultimo.g.esito as string;
    this.esito = {
      tipo: e === 'OK' ? 'win' : e === 'KO' ? 'loss' : 'draw',
      squadra: ultimo.g.squadraNome || ultimo.g.squadraSigla || '',
      lega: ultimo.lega.name,
    };
    this.esitoTimer = setTimeout(() => (this.esito = null), 7000);
  }

  chiudiEsito(): void {
    this.esito = null;
    if (this.esitoTimer) clearTimeout(this.esitoTimer);
  }

  private salvaVisti(chiavi: string[]): void {
    try { localStorage.setItem(ESITI_VISTI_KEY, JSON.stringify(chiavi.slice(-300))); } catch { /* storage pieno o bloccato */ }
  }
}
