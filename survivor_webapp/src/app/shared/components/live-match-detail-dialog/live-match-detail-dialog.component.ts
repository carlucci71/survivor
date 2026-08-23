import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TranslateModule } from '@ngx-translate/core';
import { PartitaLive, EventoPartita } from '../../../core/models/interfaces.model';
import { TeamLogoService } from '../../../core/services/team-logo.service';

@Component({
  selector: 'app-live-match-detail-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatIconModule, TranslateModule],
  templateUrl: './live-match-detail-dialog.component.html',
  styleUrls: ['./live-match-detail-dialog.component.scss'],
})
export class LiveMatchDetailDialogComponent {
  partita: PartitaLive;

  constructor(
    public dialogRef: MatDialogRef<LiveMatchDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) data: { partita: PartitaLive },
    private teamLogoService: TeamLogoService
  ) {
    this.partita = data.partita;
  }

  getLogo(sigla: string): string | null {
    return this.teamLogoService.getLogoUrl('CALCIO', 'SERIE_A', sigla);
  }

  /** Eventi ordinati per minuto crescente (il minuto può essere "45+2": ordiniamo sulla parte numerica principale). */
  get eventiOrdinati(): EventoPartita[] {
    return [...(this.partita.eventi || [])].sort((a, b) => this.minutoNumerico(a.minuto) - this.minutoNumerico(b.minuto));
  }

  private minutoNumerico(minuto: string): number {
    const n = parseInt((minuto || '0').split('+')[0], 10);
    return isNaN(n) ? 0 : n;
  }

  iconaEvento(tipo: EventoPartita['tipo']): string {
    switch (tipo) {
      case 'GOL': return '⚽';
      case 'GIALLO': return '🟨';
      case 'ROSSO': return '🟥';
      case 'SOSTITUZIONE': return '🔄';
      default: return '•';
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
