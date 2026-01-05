import { Component, Inject, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatSelect } from '@angular/material/select';
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
  Giocatore,
  Lega,
  Partita,
  Squadra,
  StatoPartita,
} from '../../core/models/interfaces.model';
import { LegaService } from '../../core/services/lega.service';
import { CampionatoService } from '../../core/services/campionato.service';
import { SquadraService } from '../../core/services/squadra.service';

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
  isMobile = false;
  private resizeHandler: any;
  private tabsReservedHeight = 0;
  public StatoPartita = StatoPartita;
  ultimiRisultati: Partita[] = [];
  ultimiRisultatiOpponent: Partita[] = [];
  prossimePartite: Partita[] = [];
  loadingUltimi = false;
  loadingProssime = false;
  squadreDisponibili: Squadra[] = [];
  squadraSelezionata: string | null = null;
  statoGiornataCorrente!: StatoPartita;
  lega!: Lega;
  giocatore: Giocatore;
  @ViewChild('risultatiRow') risultatiRow?: ElementRef<HTMLDivElement>;
  @ViewChild('teamSelect') teamSelect?: MatSelect;
  @ViewChild('selectField') selectField?: ElementRef<HTMLElement>;
  activeTab: 'ultimi' | 'prossime' | 'opponent' = 'ultimi';
  constructor(
    private squadraService: SquadraService,
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
    this.isMobile = window.matchMedia('(max-width: 700px)').matches;
    this.getSquadreByCampionatoAndGiornata(
      this.lega.campionato!.id,
      this.data.giornata + this.lega.giornataIniziale - 1
    );
    if (this.squadraSelezionata) {
      this.mostraUltimiRisultati();
      this.mostraProssimePartite();
      this.activeTab = 'ultimi';
    }
  }

  ngOnDestroy(): void {
    if (this.resizeHandler) {
      window.removeEventListener('resize', this.resizeHandler);
    }
  }

  setActiveTab(tab: 'ultimi' | 'prossime' | 'opponent') {
    // If the tab is already active, do nothing to avoid repeated tiny scrolls
    if (this.activeTab === tab) return;
    this.activeTab = tab;
  }

  trackByGiornata(index: number, item: any) {
    return item && item.giornata ? item.giornata : index;
  }

  getDesGiornataTitle(index: number): string {
    if (
      !this.lega ||
      !this.lega?.campionato ||
      !this.lega?.campionato.sport ||
      !this.lega?.campionato.sport.id
    ) {
      return '';
    }
    return this.campionatoService.getDesGiornataNoAlias(
      this.lega?.campionato?.id,
      index
    );
  }

  getSquadreByCampionatoAndGiornata(
    idCampionato: string,
    giornata: number
  ): void {
    this.squadraService
      .getSquadreByCampionatoAndGiornata(idCampionato, giornata)
      .subscribe({
        next: (squadre) => {
          const returnedSigle = new Set<string>();
          squadre.forEach((squadra: string) => {
            if (!squadra) return;
            const v = squadra.trim();
            if (v) returnedSigle.add(v);
            return;
          });
          this.squadreDisponibili = this.squadreDisponibili.filter((sd) => {
            const sdSigla = sd.sigla;
            return sdSigla ? returnedSigle.has(sdSigla) : false;
          });
        },
        error: (error) => {
          console.error(
            'Errore nel caricamento delle squadre del campionato:',
            error
          );
        },
      });
  }

  getDesGiornata(partita: Partita, casa: boolean): string {
    const index = partita.giornata;
    const alias = casa ? partita.aliasGiornataCasa : partita.aliasGiornataFuori;
    if (
      !this.lega ||
      !this.lega?.campionato ||
      !this.lega?.campionato.sport ||
      !this.lega?.campionato.sport.id
    ) {
      return '';
    }
    return this.campionatoService.getDesGiornata(
      this.lega?.campionato.id,
      index,
      alias
    );
  }

  mostraUltimiRisultati(sigla?: string) {
    const squadra = sigla || this.squadraSelezionata;
    if (
      squadra &&
      this.lega.campionato?.id &&
      this.lega.campionato?.sport?.id
    ) {
      this.loadingUltimi = true;
      this.campionatoService
        .calendario(
          this.lega.campionato?.id,
          squadra,
          this.lega.giornataCorrente - 1,
          false
        )
        .subscribe({
          next: (ultimiRisultati) => {
            // Se è stata passata una sigla diversa dalla squadra selezionata,
            // considerala come risultati dell'avversario, altrimenti popola i risultati della squadra.
            if (sigla && sigla !== this.squadraSelezionata) {
              this.ultimiRisultatiOpponent = ultimiRisultati;
              this.loadingUltimi = false;
            } else {
              this.ultimiRisultati = ultimiRisultati;
              this.loadingUltimi = false;
            }
          },
          error: (error) => {
            console.error('mostraUltimiRisultati: errore', error);
            this.loadingUltimi = false;
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
      this.loadingProssime = true;
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
            this.loadingProssime = false;
          },
          error: (error) => {
            console.error('mostraProssimePartite: errore', error);
            this.loadingProssime = false;
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
    if (
      !this.squadraSelezionata ||
      !this.prossimePartite ||
      this.prossimePartite.length === 0
    ) {
      return null;
    }
    const next = this.prossimePartite[0];
    if (!next) return null;
    if (next.casaSigla === this.squadraSelezionata) {
      if (sigla) {
        return next.fuoriSigla || null;
      } else {
        return next.fuoriNome || null;
      }
    }
    if (next.fuoriSigla === this.squadraSelezionata) {
      if (sigla) {
        return next.casaSigla || null;
      } else {
        return next.casaNome || null;
      }
    }
    return null;
  }
}
