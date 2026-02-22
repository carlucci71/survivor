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

  /**
   * 🧪 MOCK PER TESTING LOCALE
   *
   * Per testare il dialog con 10 giornate complete:
   * 1. Cambia ENABLE_MOCK da false a true
   * 2. Ricompila l'app (ng serve)
   * 3. Apri qualsiasi storico giocatore (clicca sull'icona history)
   * 4. Vedrai 10 giornate mock con squadre di Serie A
   *
   * IMPORTANTE: Rimetti a false prima di fare commit/push!
   */
  private ENABLE_MOCK = false; // ✅ MOCK DISATTIVATO

  constructor(
    public dialogRef: MatDialogRef<PlayerHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerHistoryDialogData
  ) {
    // Se il mock è abilitato, sovrascrivi i dati
    if (this.ENABLE_MOCK) {
      this.setupMockData();
    }
  }

  /**
   * Setup dati mock per testare con 10 giornate
   */
  private setupMockData(): void {
    // Crea 10 giornate mock
    this.data.giornataIndices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

    // Mock delle giocate (compatibile con interfaccia Giocata)
    const mockGiocate = [
      { giornata: 1, squadraSigla: 'INT', esito: 'OK', forzatura: undefined },
      { giornata: 2, squadraSigla: 'MIL', esito: 'OK', forzatura: undefined },
      { giornata: 3, squadraSigla: 'JUV', esito: 'KO', forzatura: undefined },
      { giornata: 4, squadraSigla: 'NAP', esito: 'OK', forzatura: undefined },
      { giornata: 5, squadraSigla: 'ROM', esito: 'OK', forzatura: 'admin' }, // Giocata forzata
      { giornata: 6, squadraSigla: 'ATA', esito: 'OK', forzatura: undefined },
      { giornata: 7, squadraSigla: 'LAZ', esito: 'KO', forzatura: undefined },
      { giornata: 8, squadraSigla: 'FIO', esito: 'OK', forzatura: undefined },
      { giornata: 9, squadraSigla: 'BOL', esito: undefined, forzatura: undefined }, // Giocata pending
      { giornata: 10, squadraSigla: 'TOR', esito: undefined, forzatura: undefined } // Giocata pending
    ];

    // Sovrascrivi il giocatore con i dati mock
    this.data.giocatore.giocate = mockGiocate;
  }

  /**
   * Restituisce le prime 5 giornate (prima riga)
   */
  getFirstRowRounds(): number[] {
    if (!this.data.giornataIndices) return [];
    return this.data.giornataIndices.slice(0, 5);
  }

  /**
   * Restituisce le giornate dalla 6 alla 10 (seconda riga)
   */
  getSecondRowRounds(): number[] {
    if (!this.data.giornataIndices || this.data.giornataIndices.length <= 5) return [];
    return this.data.giornataIndices.slice(5, 10);
  }

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
}

