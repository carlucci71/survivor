import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/lega.model';

@Component({
  selector: 'app-lega-dettaglio',
  imports: [CommonModule],
  templateUrl: './lega-dettaglio.component.html',
  styleUrl: './lega-dettaglio.component.scss'
})
export class LegaDettaglioComponent {

  id: string | null = null;
  lega: Lega | null = null;
  isLoading = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private legaService: LegaService) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.isLoading = true;
        this.legaService.getLegaById(Number(this.id)).subscribe({
          next: (lega: Lega) => {
            this.lega = lega;
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
}
