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

/** Elenco delle partite della giornata: click su una riga apre il dettaglio (gol/cartellini/sostituzioni). */
@Component({
  selector: 'app-live-score-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './live-score-dialog.component.html',
  styleUrls: ['./live-score-dialog.component.scss'],
})
export class LiveScoreDialogComponent {
  /** In corso prima, poi da giocare, poi finite (ordine stabile all'interno di ogni gruppo). */
  partite: PartitaLive[];

  constructor(
    public dialogRef: MatDialogRef<LiveScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { partite: PartitaLive[] },
    private teamLogoService: TeamLogoService,
    private dialog: MatDialog
  ) {
    this.partite = [...(data.partite || [])].sort(
      (a, b) => PRIORITA_STATO[a.stato] - PRIORITA_STATO[b.stato]
    );
  }

  getLogo(sigla: string): string | null {
    return this.teamLogoService.getLogoUrl('CALCIO', 'SERIE_A', sigla);
  }

  apriDettaglio(partita: PartitaLive): void {
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
