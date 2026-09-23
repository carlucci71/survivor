import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PartitaLive } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';
import { LiveMatchDetailDialogComponent } from '../live-match-detail-dialog/live-match-detail-dialog.component';

const PRIORITA_STATO: Record<PartitaLive['stato'], number> = {
  IN_CORSO: 0,
  DA_GIOCARE: 1,
  TERMINATA: 2,
};

/** Un campionato con le sue partite della giornata, mostrato come tab nel dialog (solo i
 *  campionati in cui l'utente ha una lega attiva arrivano fino a qui, vedi LiveScoreButtonComponent). */
export interface LiveScoreGruppo {
  id: string;
  labelKey: string;
  partite: PartitaLive[];
}

/** Codice campionato interno -> chiave TeamLogoService (stesso sport CALCIO per tutti tranne NBA,
 *  che qui non arriva mai perché il bottone live è solo calcio). */
const CAMPIONATO_LOGO: Record<string, string> = {
  SERIE_A: 'SERIE_A',
  SERIE_B: 'SERIE_B',
  LIGA: 'LIGA',
  PREMIER_LEAGUE: 'PREMIER_LEAGUE',
  CHAMPIONS_LEAGUE: 'CHAMPIONS_LEAGUE',
};

/** Elenco delle partite della giornata, con tab in alto se l'utente segue più di un campionato:
 *  click su una riga apre il dettaglio (gol/cartellini/sostituzioni). */
@Component({
  selector: 'app-live-score-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './live-score-dialog.component.html',
  styleUrls: ['./live-score-dialog.component.scss'],
})
export class LiveScoreDialogComponent {
  /** In corso prima, poi da giocare, poi finite (ordine stabile all'interno di ogni gruppo). */
  gruppi: { id: string; labelKey: string; partite: PartitaLive[] }[];
  tabAttivo: string;

  constructor(
    public dialogRef: MatDialogRef<LiveScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { gruppi: LiveScoreGruppo[] },
    private teamLogoService: TeamLogoService,
    private dialog: MatDialog
  ) {
    this.gruppi = (data.gruppi || []).map((g) => ({
      ...g,
      partite: [...g.partite].sort((a, b) => PRIORITA_STATO[a.stato] - PRIORITA_STATO[b.stato]),
    }));
    this.tabAttivo = this.gruppi[0]?.id ?? '';
  }

  get mostraTab(): boolean {
    return this.gruppi.length > 1;
  }

  get partiteAttive(): PartitaLive[] {
    return this.gruppi.find((g) => g.id === this.tabAttivo)?.partite ?? [];
  }

  selezionaTab(id: string): void {
    this.tabAttivo = id;
  }

  /** La Champions League non ha marcatori/eventi (vedi LiveScoreGazzettaClient): niente dettaglio
   *  cliccabile per quella tab, a differenza degli altri campionati. */
  get dettaglioDisponibile(): boolean {
    return this.tabAttivo !== 'CHAMPIONS_LEAGUE';
  }

  getLogo(sigla: string): string | null {
    const idCampionato = CAMPIONATO_LOGO[this.tabAttivo] ?? 'SERIE_A';
    return this.teamLogoService.getLogoUrl('CALCIO', idCampionato, sigla);
  }

  apriDettaglio(partita: PartitaLive): void {
    if (!this.dettaglioDisponibile) return;
    const isDesktop = window.innerWidth >= 768;
    this.dialog.open(LiveMatchDetailDialogComponent, {
      data: { partita },
      panelClass: 'custom-dialog-container',
      width: isDesktop ? '480px' : '95vw',
      maxWidth: isDesktop ? '480px' : '95vw',
      maxHeight: '85vh',
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
