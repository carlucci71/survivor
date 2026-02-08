import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';

interface RemainingTeamsData {
  squadre: any[];
  sportId: string;
  campionatoNome: string;
  giocatoreNome: string;
}

@Component({
  selector: 'app-remaining-teams-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    TranslateModule
  ],
  templateUrl: './remaining-teams-dialog.component.html',
  styleUrls: ['./remaining-teams-dialog.component.scss']
})
export class RemainingTeamsDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<RemainingTeamsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: RemainingTeamsData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  // Conta squadre disponibili
  getAvailableCount(): number {
    return this.data.squadre.filter(s => s.disponibile !== false).length;
  }

  // Conta squadre già giocate
  getPlayedCount(): number {
    return this.data.squadre.filter(s => s.disponibile === false).length;
  }

  getTeamLogo(sigla: string): string {
    if (!sigla) return '';

    const sportId = this.data.sportId?.toLowerCase();

    // Mappa per i loghi
    if (sportId === 'calcio') {
      // Mappatura completa di tutte le squadre con estensioni corrette
      const teamLogos: { [key: string]: string } = {
        // Serie A
        'ATA': 'ATA',  // Atalanta - senza estensione
        'BOLO': 'BOLO.png',
        'CAGL': 'CAGL.png',
        'COMO': 'COMO.png',
        'EMP': 'EMP.png',
        'FIO': 'FIO.png',
        'GENOA': 'GENOA.png',
        'INT': 'INT.png',
        'JUV': 'JUV.png',
        'LAZIO': 'LAZIO.png',
        'LECCE': 'LECCE.webp',
        'MIL': 'MIL.png',
        'MON': 'MON.png',
        'NAP': 'NAP.png',
        'PARMA': 'PARMA.png',
        'ROMA': 'ROMA.webp',
        'TORO': 'TORO.png',
        'UDI': 'UDI.png',
        'VEN': 'VEN.png',
        'VER': 'VER.png',
        // Serie B
        'BARI': 'BARI.png',
        'CARRARESE': 'CARRARESE.png',
        'CATANZARO': 'CATANZARO.png',
        'CES': 'CES.png',
        'CREMON': 'CREMON.png',
        'FRO': 'FRO.png',
        'JUVE_STABIA': 'JUVE_STABIA.png',
        'MANT': 'MANT.png',
        'MOD': 'MOD.png',
        'PAL': 'PAL.png',
        'PISA': 'PISA.png',
        'REGGIANA': 'REGGIANA.png',
        'SAMP': 'SAMP.png',
        'SASS': 'SASS.png',
        'SPEZIA': 'SPEZIA.webp',
        'SUDTIROL': 'SUDTIROL.png',
        // Liga - Mappature corrette DB -> File
        'ALA': 'ALA.png',
        'ATH': 'ATH.png',
        'ATM': 'ATM.png',
        'BAR': 'BARC.png',  // Barcellona: DB usa BAR, file è BARC.png
        'BET': 'BET.png',
        'VIG': 'CEL.png',   // Celta Vigo: DB usa VIG, file è CEL.png
        'ELC': 'ELC.png',
        'ESP': 'ESP.png',
        'GET': 'GET.png',
        'GIR': 'GIR.png',
        'LEV': 'LEV.png',
        'MLL': 'MAI.png',   // Mallorca: DB usa MLL, file è MAI.png
        'OSA': 'OSA.png',
        'RAY': 'RAY.png',
        'RMA': 'RMA.png',
        'RSO': 'RSO.png',
        'SEV': 'SIV.png',   // Siviglia: DB usa SEV, file è SIV.png
        'VAL': 'VAL.png',
        'VIL': 'VIL.png',
        // Altre
        'AVE': 'AVE.png',
        'ENT': 'ENT.png',
        'OVI': 'OVI.png',
        'PADOVA': 'PADOVA.png',
        'PESC': 'PESC.png'
      };

      return `assets/logos/calcio/${teamLogos[sigla] || sigla + '.png'}`;
    } else if (sportId === 'basket') {
      return `assets/logos/basket/${sigla}.png`;
    } else if (sportId === 'tennis') {
      return `assets/logos/tennis/${sigla}.png`;
    }

    return '';
  }

  onImageError(event: any): void {
    event.target.style.display = 'none';
  }
}
