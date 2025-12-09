import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/lega.model';
import { SquadraService } from '../../core/services/squadra.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-lega-dettaglio',
  imports: [CommonModule, MatCardModule, MatTableModule, MatSelectModule, MatProgressSpinnerModule, MatFormFieldModule],
  templateUrl: './lega-dettaglio.component.html',
  styleUrl: './lega-dettaglio.component.scss'
})
export class LegaDettaglioComponent {

  id: string | null = null;
  lega: Lega | null = null;
  isLoading = true;
  error: string | null = null;
  squadre: any[] = [];
  displayedColumns: string[] = [];

  constructor(private route: ActivatedRoute, private legaService: LegaService, private squadraService: SquadraService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.isLoading = true;
        this.legaService.getLegaById(Number(this.id)).subscribe({
          next: (lega: Lega) => {
            this.lega = lega;
            // Calcolo le colonne della tabella
            this.displayedColumns = ['nome', 'stato'];
            if (lega.giocatori && lega.giocatori.length > 0 && lega.giocatori[0].giocate) {
              for (let i = 0; i < lega.giocatori[0].giocate.length; i++) {
                this.displayedColumns.push('giocata' + i);
              }
            }
            this.displayedColumns.push('squadra');
            
            if (lega.campionatoId) {
              this.squadraService.getSquadreByCampionato(lega.campionatoId).subscribe({
                next: (squadre: any[]) => {
                  this.squadre = squadre;
                },
                error: () => {
                  this.squadre = [];
                }
              });
            }
            this.isLoading = false;
          },
          error: (err: any) => {
            this.error = 'Errore nel caricamento della lega';
            this.isLoading = false;
          }
        });
      }
    });
  }

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    const giocateIds = (giocatore.giocate || []).map((g: any) => g.squadraId);
    return this.squadre.filter(s => !giocateIds.includes(s.id));
  }

  getSquadraNome(squadraId: string): string {
    if (!this.lega?.campionatoId) return squadraId;
    return this.squadraService.getSquadraNomeById(squadraId, this.lega.campionatoId);
  }

}
