import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MockService } from '../../core/services/mock.service';
import { SportService } from '../../core/services/sport.service';
import { CampionatoService } from '../../core/services/campionato.service';
import { Campionato, Sport } from '../../core/models/interfaces.model';

@Component({
  selector: 'app-mock-reset-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatCardModule],
  templateUrl: './mock-reset-dialog.component.html',
  styleUrls: ['./mock-reset-dialog.component.scss']
})
export class MockResetDialogComponent {
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  anno: number | null = 2025;
  giornata: number | null = 1;
  implementazione: string = 'CALENDARIO_API2';
  loading = false;
  message: string | null = null;

  private preselectedCampionatoId: string | null = null;

  constructor(
    private dialogRef: MatDialogRef<MockResetDialogComponent>,
    private mockService: MockService,
    private sportService: SportService,
    private campionatoService: CampionatoService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.caricaSport();
    if (data) {
      if (data.sportSel) this.sportSel = data.sportSel;
      if (data.campionatoSel) {
        // support both object or id
        this.preselectedCampionatoId = data.campionatoSel.id ? data.campionatoSel.id : data.campionatoSel;
      }
      if (data.anno) this.anno = data.anno;
      if (data.giornata) this.giornata = data.giornata;
    }
  }

  caricaSport(): void {
    this.sportService.getSport().subscribe({
      next: (sport) => {
        this.sportDisponibili = sport;
        if (this.sportSel) {
          // if sport was provided via dialog data, load its campionati
          this.selezionaSport();
        }
      },
      error: (error) => console.error('Errore nel caricamento degli sport:', error),
    });
  }

  selezionaSport(): void {
    if (this.sportSel) {
      this.campionatoService.getCampionatoBySport(this.sportSel).subscribe({
        next: (campionati) => {
          this.campionatiDisponibili = campionati;
          // if caller provided a preselected campionato id, try to restore selection
          if (this.preselectedCampionatoId) {
            const found = campionati.find(c => c.id === this.preselectedCampionatoId);
            if (found) {
              this.campionatoSel = found;
            } else {
              this.campionatoSel = null;
            }
          } else {
            this.campionatoSel = null;
          }
        },
        error: (error) => console.error('Errore nel caricamento del campionato: ' + this.sportSel, error),
      });
    }
  }

  isFormValid(): boolean {
    return !!this.sportSel && !!this.campionatoSel && this.anno !== null && this.anno !== undefined && !!this.implementazione;
  }

  reset(): void {
    this.message = null;
    if (!this.isFormValid()) {
      this.message = 'Compila tutti i campi';
      return;
    }
    this.loading = true;
    const idCamp = this.campionatoSel!.id;
    this.mockService.reset(idCamp, Number(this.anno), this.implementazione).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close('OK');
      },
      error: (err) => {
        this.loading = false;
        this.message = 'Errore: ' + (err?.message || err?.statusText || JSON.stringify(err));
      },
    });
  }

  cancel(): void {
    this.dialogRef.close(null);
  }
}
