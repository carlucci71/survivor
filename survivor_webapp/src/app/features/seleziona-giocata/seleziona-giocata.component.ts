import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogRef,
  MatDialog,
} from '@angular/material/dialog';
import { ConfermaAssegnazioneDialogComponent } from '../../shared/components/conferma-assegnazione-dialog.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  Lega,
  Partita,
  StatoPartita,
} from '../../core/models/interfaces.model';
import { LegaService } from '../../core/services/lega.service';

@Component({
  selector: 'app-seleziona-giocata',
  templateUrl: './seleziona-giocata.component.html',
  styleUrl: './seleziona-giocata.component.scss',
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    FormsModule,
  ],
})
export class SelezionaGiocataComponent implements OnInit {
  public StatoPartita = StatoPartita;
  ultimiRisultati: Partita[] = [];
  prossimePartite: Partita[] = [];
  squadreDisponibili: any[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  isLoading = true;
  lega!: Lega;
  giornata: number = 0;
  giocatore: any;
  constructor(
    private legaService: LegaService,
    public dialogRef: MatDialogRef<SelezionaGiocataComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      giocatore: any;
      giornata: number;
      statoGiornataCorrente: StatoPartita;
      squadreDisponibili: any[];
      squadraCorrenteId?: string;
      lega: Lega;
    },
    private dialog: MatDialog
  ) {
    this.giocatore = data.giocatore;
    this.squadreDisponibili = data.squadreDisponibili || [];
    // Se c'è una squadra già selezionata per questa giornata, selezionala
    this.squadraSelezionata = data.squadraCorrenteId || null;
    this.statoGiornataCorrente = data.statoGiornataCorrente;
    this.lega = data.lega;
  }

  ngOnInit(): void {
    if (this.squadraSelezionata) {
      this.mostraUltimiRisultati();
      this.mostraProssimePartite();
    } else{
      this.isLoading=false;
    }
  }

  trackByGiornata(index: number, item: any) {
    return item && item.giornata ? item.giornata : index;
  }

  mostraUltimiRisultati() {
    if (
      this.squadraSelezionata &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.isLoading = true;
      this.legaService
        .calendario(
          this.lega.campionato?.sport?.id,
          this.lega.campionato?.id,
          this.squadraSelezionata,
          this.lega.giornataCorrente -1,
          false
        )
        .subscribe({
          next: (ultimiRisultati) => {
            this.ultimiRisultati = ultimiRisultati;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
            this.isLoading = false;
          },
        });
    }
  }

  mostraProssimePartite() {
    if (
      this.squadraSelezionata &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.isLoading = true;
      this.legaService
        .calendario(
          this.lega.campionato?.sport?.id,
          this.lega.campionato?.id,
          this.squadraSelezionata,
          this.lega.giornataCorrente,
          true
        )
        .subscribe({
          next: (prossimePartite) => {
            this.prossimePartite = prossimePartite;
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
            this.isLoading = false;
          },
        });
    }
  }

  salvaSquadra() {
    if (this.statoGiornataCorrente.value !== StatoPartita.DA_GIOCARE.value) {
      this.dialog
        .open(ConfermaAssegnazioneDialogComponent, {
          width: '400px',
          disableClose: true,
        })
        .afterClosed()
        .subscribe((result) => {
          if (result) {
            this.dialogRef.close({
              squadraSelezionata: this.squadraSelezionata,
            });
          }
          // Se annulla, non fa nulla e la modale rimane aperta
        });
    } else {
      this.dialogRef.close({ squadraSelezionata: this.squadraSelezionata });
    }
  }
}
