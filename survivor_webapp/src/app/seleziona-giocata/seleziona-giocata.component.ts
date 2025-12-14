import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Giocata } from '../core/models/interfaces.model';

@Component({
  selector: 'app-seleziona-giocata',
  templateUrl: './seleziona-giocata.component.html',
  styleUrl: './seleziona-giocata.component.scss',
  imports: [CommonModule, MatFormFieldModule, MatSelectModule, MatButtonModule, FormsModule]
})
export class SelezionaGiocataComponent {
  squadreDisponibili: any[] = [];
  squadraSelezionata: string | null = null;
  giocatore: any;
  constructor(
    public dialogRef: MatDialogRef<SelezionaGiocataComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { giocatore: any, giornata: number, squadreDisponibili: any[], squadraCorrenteId?: string }
  ) {
    this.giocatore = data.giocatore;
    this.squadreDisponibili = data.squadreDisponibili || [];
    // Se c'è una squadra già selezionata per questa giornata, selezionala
    this.squadraSelezionata = data.squadraCorrenteId || null;
  }

  salvaSquadra() {
    /*
    // Aggiorna la giocata corrente del giocatore (se esiste), altrimenti la aggiunge
    if (this.giocatore && this.data.giornata) {
      let giocata: Giocata = (this.giocatore.giocate || []).find((g: any) => Number(g?.giornata) === this.data.giornata);
      if (giocata) {
        giocata.squadraId = this.squadraSelezionata || '';
      } else {
        if (!this.giocatore.giocate){
          this.giocatore.giocate=[];
        }
        giocata = { giornata: this.data.giornata, squadraId: this.squadraSelezionata || '' } as Giocata;
        this.giocatore.giocate.push(giocata);
        this.giocatore.squadraSelezionata = this.squadraSelezionata;
      }
    }
      */
    this.dialogRef.close({ squadraSelezionata: this.squadraSelezionata });
  }
}
