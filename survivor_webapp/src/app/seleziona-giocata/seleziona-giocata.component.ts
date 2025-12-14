import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ConfermaAssegnazioneDialogComponent } from '../shared/components/conferma-assegnazione-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Giocata, StatoGiocatore, StatoPartita } from '../core/models/interfaces.model';

@Component({
  selector: 'app-seleziona-giocata',
  templateUrl: './seleziona-giocata.component.html',
  styleUrl: './seleziona-giocata.component.scss',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule, MatIconModule, FormsModule]
})
export class SelezionaGiocataComponent {
  squadreDisponibili: any[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  giocatore: any;
  constructor(
    public dialogRef: MatDialogRef<SelezionaGiocataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { giocatore: any, 
      giornata: number, 
      statoGiornataCorrente: StatoPartita, 
      squadreDisponibili: any[], 
      squadraCorrenteId?: string 
    },
    private dialog: MatDialog
  ) {
    this.giocatore = data.giocatore;
    this.squadreDisponibili = data.squadreDisponibili || [];
    // Se c'è una squadra già selezionata per questa giornata, selezionala
    this.squadraSelezionata = data.squadraCorrenteId || null;
    this.statoGiornataCorrente = data.statoGiornataCorrente;
  }

  salvaSquadra() {
    if (this.statoGiornataCorrente.value !== StatoPartita.DA_GIOCARE.value) {
      this.dialog.open(ConfermaAssegnazioneDialogComponent, {
        width: '400px',
        disableClose: true
      }).afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close({ squadraSelezionata: this.squadraSelezionata });
        }
        // Se annulla, non fa nulla e la modale rimane aperta
      });
    } else {
      this.dialogRef.close({ squadraSelezionata: this.squadraSelezionata });
    }
  }
}
