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
  private ENABLE_MOCK = false; // ✅ MOCK DISATTIVATO - Pronto per produzione

  constructor(
    public dialogRef: MatDialogRef<PlayerHistoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: PlayerHistoryDialogData
  ) {
    // Se il mock è abilitato, sovrascrivi i dati
    if (this.ENABLE_MOCK) {
      this.setupMockData();
    } else {
      // ✅ SOLUZIONE: Calcola le giornate assolute dalle giocate del giocatore
      this.calculateGiornateIndices();
    }
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
    const giocate = this.data.giocatore.giocate || [];

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

    const mockGiocate = [
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

  /**
   * Restituisce tutte le giornate raggruppate in righe di 5
   * Es: [1,2,3,4,5,6,7,8,9,10] → [[1,2,3,4,5], [6,7,8,9,10]]
   */
  getAllRowsRounds(): number[][] {
    if (!this.data.giornataIndices || this.data.giornataIndices.length === 0) {
      return [];
    }

    const rows: number[][] = [];
    const itemsPerRow = 5;

    for (let i = 0; i < this.data.giornataIndices.length; i += itemsPerRow) {
      const row = this.data.giornataIndices.slice(i, i + itemsPerRow);
      rows.push(row);
    }

    return rows;
  }

  /**
   * Restituisce le prime 5 giornate (prima riga) - DEPRECATO, usa getAllRowsRounds()
   */
  getFirstRowRounds(): number[] {
    if (!this.data.giornataIndices) return [];
    return this.data.giornataIndices.slice(0, 5);
  }

  /**
   * Restituisce le giornate dalla 6 alla 10 (seconda riga) - DEPRECATO, usa getAllRowsRounds()
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
    // Restituisco semplicemente il numero di giornata assoluto
    return `${giornata}`;
  }
}

