import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PartitaLive } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';
import { LiveMatchDetailDialogComponent } from '../live-match-detail-dialog/live-match-detail-dialog.component';

/** Elenco delle partite della giornata: click su una riga apre il dettaglio (gol/cartellini/sostituzioni). */
@Component({
  selector: 'app-live-score-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './live-score-dialog.component.html',
  styleUrls: ['./live-score-dialog.component.scss'],
})
export class LiveScoreDialogComponent {
  partite: PartitaLive[];

  constructor(
    public dialogRef: MatDialogRef<LiveScoreDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { partite: PartitaLive[] },
    private teamLogoService: TeamLogoService,
    private dialog: MatDialog
  ) {
    this.partite = data.partite || [];
  }

  getLogo(sigla: string): string | null {
    return this.teamLogoService.getLogoUrl('CALCIO', 'SERIE_A', sigla);
  }

  apriDettaglio(partita: PartitaLive): void {
    this.dialog.open(LiveMatchDetailDialogComponent, {
      data: { partita },
      panelClass: 'custom-dialog-container',
      maxWidth: '95vw',
    });
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
