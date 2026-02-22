import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { Giocatore, Lega } from '../../../core/models/interfaces.model';

export interface PlayerHistoryDialogData {
  giocatore: Giocatore;
  lega: Lega;
  giornataIndices: number[];
  getGiocataByGiornataAssoluta: (giocatore: Giocatore, giornata: number) => any;
  getTeamLogo: (sigla: string | null | undefined) => string | null;
  getSquadraNome: (sigla: string | null | undefined) => string | null;
}

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

  constructor(
    public dialogRef: MatDialogRef<PlayerHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerHistoryDialogData
  ) {}

  close(): void {
    this.dialogRef.close();
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

  getGiornataLabel(giornata: number): string {
    const giornataRelativa = giornata - (this.data.lega?.giornataIniziale || 1) + 1;
    return `${giornataRelativa}`;
  }

  /**
   * Versione abbreviata del titolo giornata per mobile
   * Es: "Giornata 26" → "Gio. 26"
   */
  getDesGiornataTitleMobile(giornata: number): string {
    const giornataRelativa = giornata - (this.data.lega?.giornataIniziale || 1) + 1;
    return `G.${giornataRelativa}`;
  }
}

