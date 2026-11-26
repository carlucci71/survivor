import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Giocatore, Lega, StatoGiocatore } from '../../../core/models/interfaces.model';

export interface PlayerHistoryDialogData {
  giocatore: Giocatore;
  lega: Lega;
  giornataIndices: number[];
  getGiocataByGiornataAssoluta: (giocatore: Giocatore, giornata: number) => any;
  getTeamLogo: (sigla: string | null | undefined) => string | null;
  getSquadraNome: (sigla: string | null | undefined) => string | null;
  /** Squadre del campionato (Campionato: servono per dividere lo storico in giri) */
  squadre?: { sigla: string; nome?: string }[];
}

/** Campionato: un giro = finche' non hai usato tutte le squadre una volta (poi si riparte) */
interface Giro {
  numero: number;
  giornate: number[];
  usate: string[];
  inCorso: boolean;
}

interface CasellaAlbum { sigla: string; nome: string; giornata: number | null; giocata: any; }

@Component({
  selector: 'app-player-history-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    TranslateModule
  ],
  templateUrl: './player-history-dialog.component.html',
  styleUrls: ['./player-history-dialog.component.scss']
})
export class PlayerHistoryDialogComponent {

  /**
   * 🧪 MOCK PER TESTING LOCALE - DISABILITATO ✅
   *
   * ⚠️ ATTENZIONE: Il mock è DISABILITATO per produzione!
   *
   * Per testare il dialog con 10 giornate complete SOLO IN LOCALE:
   * 1. Cambia temporaneamente ENABLE_MOCK da false a true
   * 2. Ricompila l'app (ng serve)
   * 3. Apri qualsiasi storico giocatore (clicca sull'icona history)
   * 4. Vedrai 10 giornate mock con squadre di Serie A
   * 5. ⚠️ IMPORTANTE: Rimetti a false prima di fare commit/push!
   *
   * 📌 STATO ATTUALE: MOCK DISATTIVATO → Pronto per produzione
   */
  private readonly ENABLE_MOCK = false; // 🧪 TEST - Ricordati di rimettere false prima del deploy!

  constructor(
    public dialogRef: MatDialogRef<PlayerHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerHistoryDialogData,
    private translate: TranslateService
  ) {
    // Se il mock è abilitato, sovrascrivi i dati
    if (this.ENABLE_MOCK) {
      this.setupMockData();
    } else {
      // ✅ SOLUZIONE: Calcola le giornate assolute dalle giocate del giocatore
      this.calculateGiornateIndices();
    }
    this.calcolaGiri();
  }

  /**
   * Calcola le giornate assolute dalle giocate del giocatore
   * IMPORTANTE: Mostra TUTTE le giornate dalla prima all'ultima giocata,
   * anche quelle saltate (vuote)!
   *
   * Es: Se giocatore ha giocato giornate [23, 25, 26]
   * → giornataIndices diventa [23, 24, 25, 26] (include anche la 24 vuota)
   */
  private calculateGiornateIndices(): void {
    const giornataIniziale = this.data.lega?.giornataIniziale || 1;
    const legaId = this.data.lega?.id;
    // Filtra per legaId: evita di mescolare giocate di leghe diverse (fix mondiali e multi-sport)
    const giocate = (this.data.giocatore.giocate || []).filter((g: any) => !legaId || g.legaId === legaId);

    if (giocate.length === 0) {
      this.data.giornataIndices = [];
      return;
    }

    // Trova la prima e l'ultima giornata assoluta giocata
    const giornateAssolute = giocate
      .map((giocata: any) => {
        const giornataRelativa = Number(giocata?.giornata);
        return giornataIniziale + giornataRelativa - 1;
      })
      .filter((g: number) => !isNaN(g))
      .sort((a: number, b: number) => a - b);

    if (giornateAssolute.length === 0) {
      this.data.giornataIndices = [];
      return;
    }

    const primaGiornata = giornateAssolute[0];
    const ultimaGiornata = giornateAssolute[giornateAssolute.length - 1];

    // Genera TUTTE le giornate dalla prima all'ultima (anche quelle non giocate)
    this.data.giornataIndices = Array.from(
      { length: ultimaGiornata - primaGiornata + 1 },
      (_, i) => primaGiornata + i
    );
  }

  /**
   * Setup dati mock per testare con 10 giornate
   */
  private setupMockData(): void {
    const giornataIniziale = this.data.lega?.giornataIniziale || 1;

    this.data.giornataIndices = Array.from(
      { length: 10 },
      (_, i) => giornataIniziale + i
    );

    const isMondiali = this.data.lega?.campionato?.id === 'MONDIALI_2026';
    const mockGiocate = isMondiali ? [
      { giornata: 1, squadraSigla: 'BRA', esito: 'OK', forzatura: undefined },
      { giornata: 2, squadraSigla: 'ARG', esito: 'OK', forzatura: undefined },
      { giornata: 3, squadraSigla: 'FRA', esito: 'KO', forzatura: undefined },
      { giornata: 4, squadraSigla: 'GER', esito: 'OK', forzatura: undefined },
      { giornata: 5, squadraSigla: 'SPA', esito: 'OK', forzatura: 'admin' },
      { giornata: 6, squadraSigla: 'POR', esito: 'OK', forzatura: undefined },
      { giornata: 7, squadraSigla: 'ING', esito: 'KO', forzatura: undefined },
      { giornata: 8, squadraSigla: 'OLA', esito: 'OK', forzatura: undefined },
      { giornata: 9, squadraSigla: 'URU', esito: undefined, forzatura: undefined },
      { giornata: 10, squadraSigla: 'BEL', esito: undefined, forzatura: undefined }
    ] : [
      { giornata: 1, squadraSigla: 'INT', esito: 'OK', forzatura: undefined },
      { giornata: 2, squadraSigla: 'MIL', esito: 'OK', forzatura: undefined },
      { giornata: 3, squadraSigla: 'JUV', esito: 'KO', forzatura: undefined },
      { giornata: 4, squadraSigla: 'NAP', esito: 'OK', forzatura: undefined },
      { giornata: 5, squadraSigla: 'ROM', esito: 'OK', forzatura: 'admin' },
      { giornata: 6, squadraSigla: 'ATA', esito: 'OK', forzatura: undefined },
      { giornata: 7, squadraSigla: 'LAZ', esito: 'KO', forzatura: undefined },
      { giornata: 8, squadraSigla: 'FIO', esito: 'OK', forzatura: undefined },
      { giornata: 9, squadraSigla: 'BOL', esito: undefined, forzatura: undefined },
      { giornata: 10, squadraSigla: 'TOR', esito: undefined, forzatura: undefined }
    ];

    this.data.giocatore.giocate = mockGiocate;
  }

  // ── Campionato: "album" del giro (tutte le squadre, segnate quelle gia' giocate) ─────
  giri: Giro[] = [];
  /** Giro in corso mostrato come album (sempre presente in Campionato, anche vuoto a inizio giro) */
  giroCorrente: Giro | null = null;
  /** Giri finiti: riquadri chiusi sotto l'album, si aprono al tocco */
  giriConclusi: Giro[] = [];
  giriAperti = new Set<number>();
  /** Caselle dell'album per giro (squadre in ordine alfabetico, sempre nello stesso posto) */
  album = new Map<number, CasellaAlbum[]>();

  get totaleSquadre(): number { return this.data.squadre?.length ?? 0; }
  get isAlbum(): boolean { return !!this.giroCorrente; }

  /**
   * Stessa regola della scelta della squadra (lega-dettaglio.giocaGiornata): le scelte in ordine di
   * giornata, un giro ogni N squadre. Finito un giro, l'album riparte con tutte le squadre libere.
   */
  private calcolaGiri(): void {
    const n = this.totaleSquadre;
    if (this.data.lega?.modalita !== 'CAMPIONATO' || !n) return;
    const giri: Giro[] = [];
    let scelte = 0;
    for (const g of this.data.giornataIndices ?? []) {
      const indice = Math.floor(scelte / n);
      if (!giri[indice]) giri[indice] = { numero: indice + 1, giornate: [], usate: [], inCorso: false };
      giri[indice].giornate.push(g);
      const sigla = this.getGiocataForRound(g)?.squadraSigla;
      if (sigla) { giri[indice].usate.push(sigla); scelte++; }
    }
    const ultimo = giri[giri.length - 1];
    if (ultimo && ultimo.usate.length < n) {
      ultimo.inCorso = true;
      this.giroCorrente = ultimo;
    } else {
      // nessuna scelta ancora, oppure ultimo giro appena completato: album nuovo, tutto libero
      this.giroCorrente = { numero: (ultimo?.numero ?? 0) + 1, giornate: [], usate: [], inCorso: true };
    }
    this.giri = giri.reverse();
    this.giriConclusi = this.giri.filter(g => !g.inCorso);
    const ordinate = [...(this.data.squadre ?? [])].sort((x, y) => (x.nome || x.sigla).localeCompare(y.nome || y.sigla));
    for (const giro of [this.giroCorrente, ...this.giriConclusi]) {
      this.album.set(giro.numero, ordinate.map(s => {
        const giornata = giro.giornate.find(g => this.getGiocataForRound(g)?.squadraSigla === s.sigla) ?? null;
        return { sigla: s.sigla, nome: s.nome || s.sigla, giornata, giocata: giornata != null ? this.getGiocataForRound(giornata) : null };
      }));
    }
  }

  toggleGiro(numero: number): void {
    if (this.giriAperti.has(numero)) this.giriAperti.delete(numero);
    else this.giriAperti.add(numero);
  }

  // ── Esito come etichetta/pallino (elenco e album) ─────────────────────────────────
  esitoDi(giocata: any): 'ok' | 'ko' | 'dr' | 'pd' | 'none' {
    if (!giocata?.squadraSigla) return 'none';
    if (!giocata.esito) return 'pd';
    if (this.isLossCard(giocata)) return 'ko';
    if (this.isDrawCard(giocata)) return 'dr';
    return giocata.esito === 'OK' ? 'ok' : 'pd';
  }

  etichettaEsito(giocata: any): string {
    switch (this.esitoDi(giocata)) {
      case 'ok': return 'LEAGUE.LEGEND_WON';
      case 'ko': return 'LEAGUE.LEGEND_LOST';
      case 'dr': return 'LEAGUE.LEGEND_DRAW';
      case 'pd': return 'LEAGUE.HISTORY_IN_PROGRESS';
      default: return 'LEAGUE.HISTORY_NO_PICK';
    }
  }

  /** Dettaglio al tocco su un logo dell'album: "Giornata 21 · Vinta" */
  dettaglioCasella(c: CasellaAlbum): string {
    if (c.giornata == null) return c.nome;
    return `${c.nome} · ${this.translate.instant('LEAGUE.ROUND')} ${c.giornata} · ${this.translate.instant(this.etichettaEsito(c.giocata))}`;
  }

  /** Survivor (e Campionato senza squadre caricate): elenco cronologico, dalla giornata piu' recente */
  get elenco(): number[] {
    return [...(this.data.giornataIndices ?? [])].reverse();
  }
  close(): void {
    this.dialogRef.close();
  }

  getPlayerInitial(): string {
    return (this.data.giocatore.nickname || '?').charAt(0).toUpperCase();
  }

  getWins(): number {
    return (this.data.giornataIndices || []).filter(g => this.getGiocataForRound(g)?.esito === 'OK').length;
  }

  /** Solo le scelte sbagliate: il pareggio non e' una sconfitta e ha un conteggio a parte. */
  getLosses(): number {
    return (this.data.giornataIndices || []).filter(g => this.getGiocataForRound(g)?.esito === 'KO').length;
  }

  getDraws(): number {
    return (this.data.giornataIndices || []).filter(g => this.getGiocataForRound(g)?.esito === 'PAREGGIO').length;
  }

  /**
   * Come in tabella: in Survivor un pareggio e' rosso solo se ha eliminato il giocatore (era ELIMINATO e quella e' la
   * sua ultima giocata con esito); se continua a giocare gli e' costato una vita ed e' giallo. In Campionato e' giallo.
   */
  private isPareggioEliminante(giocata: any): boolean {
    if (!giocata || giocata.esito !== 'PAREGGIO' || this.data.lega?.modalita === 'CAMPIONATO') return false;
    if (this.data.giocatore.statiPerLega?.[this.data.lega.id]?.value !== StatoGiocatore.ELIMINATO.value) return false;
    const ultimaGiornata = (this.data.giocatore.giocate ?? [])
      .filter(g => !!g.esito && (g.legaId == null || g.legaId === this.data.lega.id))
      .reduce((max, g) => Math.max(max, g.giornata ?? 0), 0);
    return (giocata.giornata ?? 0) === ultimaGiornata;
  }

  isDrawCard(giocata: any): boolean {
    return giocata?.esito === 'PAREGGIO' && !this.isPareggioEliminante(giocata);
  }

  isLossCard(giocata: any): boolean {
    return giocata?.esito === 'KO' || this.isPareggioEliminante(giocata);
  }

  getTotalWithResult(): number {
    return this.getWins() + this.getLosses() + this.getDraws();
  }

  getWinRate(): number {
    const total = this.getTotalWithResult();
    if (total === 0) return 0;
    return Math.round((this.getWins() / total) * 100);
  }

  getTeamLogo(sigla: string | null | undefined): string | null {
    return this.data.getTeamLogo(sigla);
  }

  getSquadraNome(sigla: string | null | undefined): string | null {
    return this.data.getSquadraNome(sigla);
  }

  getGiocataForRound(giornata: number): any {
    return this.data.getGiocataByGiornataAssoluta(this.data.giocatore, giornata);
  }

}

