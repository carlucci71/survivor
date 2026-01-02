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
import { CampionatoService } from '../../core/services/campionato.service';

@Component({
  selector: 'app-seleziona-giocata',
  templateUrl: './seleziona-giocata.component.html',
  styleUrls: ['./seleziona-giocata.component.scss'],
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
  ultimiRisultatiOpponent: Partita[] = [];
  prossimePartite: Partita[] = [];
  squadreDisponibili: any[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
    lega!: Lega;
  giornata: number = 0;
  giocatore: any;
  constructor(
    private legaService: LegaService,
    private campionatoService: CampionatoService,
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
    }
  }

  trackByGiornata(index: number, item: any) {
    return item && item.giornata ? item.giornata : index;
  }

  getDesGiornataTitle(index: number): string {
    if (!this.lega || !this.lega?.campionato || !this.lega?.campionato.sport|| !this.lega?.campionato.sport.id){
      return "";
    }
    return this.campionatoService.getDesGiornataNoAlias(this.lega?.campionato?.id,index);
  }


  getDesGiornata(partita: Partita, casa: boolean): string {
    const index= partita.giornata;
    const alias= casa?partita.aliasGiornataCasa:partita.aliasGiornataFuori;
    if (!this.lega || !this.lega?.campionato || !this.lega?.campionato.sport|| !this.lega?.campionato.sport.id){
      return "";
    }
    return this.campionatoService.getDesGiornata(this.lega?.campionato.id,index, alias);
  }

  mostraUltimiRisultati(sigla?: string) {
    const squadra = sigla || this.squadraSelezionata;
    if (
      squadra &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.campionatoService
        .calendario(
          this.lega.campionato?.id,
          squadra,
          this.lega.giornataCorrente -1,
          false
        )
        .subscribe({
          next: (ultimiRisultati) => {
            // Se è stata passata una sigla diversa dalla squadra selezionata,
            // considerala come risultati dell'avversario, altrimenti popola i risultati della squadra.
            if (sigla && sigla !== this.squadraSelezionata) {
              this.ultimiRisultatiOpponent = ultimiRisultati;
            } else {
              this.ultimiRisultati = ultimiRisultati;
            }
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
          },
        });
    }
  }

  mostraUltimiRisultatiOpponent() {
    const opp = this.getNextOpponentSigla(true);
    if (opp) {
      this.mostraUltimiRisultati(opp);
    }
  }

  mostraProssimePartite() {
    if (
      this.squadraSelezionata &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.campionatoService
        .calendario(
          this.lega.campionato?.id,
          this.squadraSelezionata,
          this.lega.giornataCorrente,
          true
        )
        .subscribe({
          next: (prossimePartite) => {
            this.prossimePartite = prossimePartite;
            this.mostraUltimiRisultatiOpponent();
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
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

  getNextOpponentSigla(sigla: boolean): string | null {
    if (!this.squadraSelezionata || !this.prossimePartite || this.prossimePartite.length === 0) {
      return null;
    }
    const next = this.prossimePartite[0];
    if (!next) return null;
    if (next.casaSigla === this.squadraSelezionata) {
      if (sigla){
      return next.fuoriSigla || null;
      } else {
      return next.fuoriNome || null;
      }
    }
    if (next.fuoriSigla === this.squadraSelezionata) {
      if (sigla){
      return next.casaSigla || null;
      } else {
      return next.casaNome || null;
      }
    }
    return null;
  }
}
