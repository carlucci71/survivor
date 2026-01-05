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
              // Ensure results area is visible above the fixed footer
              setTimeout(() => this.scrollResultsIntoView(), 50);
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
            setTimeout(() => this.scrollResultsIntoView(), 200);
          },
          error: (error) => {
            console.error('mostraProssimePartite: errore', error);
            this.loadingProssime = false;
          },
        });
    }
  }

  private scrollResultsIntoView() {
    try {
      const el = this.risultatiRow?.nativeElement;
      if (!el) return;
      // Try scrolling the nearest scrollable ancestor (the modal container)
      // so the risultati block becomes visible above the fixed footer.
      // Use scrollIntoView which respects the nearest scrollable ancestor.
      setTimeout(() => {
        try {
          if (this.isMobile) {
            // On mobile, ensure the tabs/buttons remain visible above the results
            const modal = document.querySelector('.modal-container') as HTMLElement | null;
            const tabs = document.querySelector('.result-tabs') as HTMLElement | null;
            const extraMargin = 8; // small breathing room
            if (modal) {
                const modalRect = modal.getBoundingClientRect();
                const elRect = el.getBoundingClientRect();
                const tabsRect = tabs ? tabs.getBoundingClientRect() : null;
              // offset of risultatiRow relative to modal's scrollTop
              const offset = elRect.top - modalRect.top + modal.scrollTop;
              // desired top position inside modal: just below tabs
              const desiredTop = tabsRect
                ? Math.ceil(tabsRect.bottom - modalRect.top + extraMargin)
                : extraMargin;
              // compute scroll target so that risultatiRow sits at desiredTop
              let target = Math.max(0, offset - desiredTop);
              // clamp to scrollable range
              const maxScroll = modal.scrollHeight - modal.clientHeight;
              if (target > maxScroll) target = maxScroll;
              // avoid tiny incremental shifts: skip if already close
              // Round values to integer pixels to avoid fractional reflows
              const current = Math.round(modal.scrollTop || 0);
              target = Math.round(target);
              const delta = Math.abs(target - current);
              const MIN_DELTA = 48; // pixels, larger threshold to prevent slow cumulative shifts
              if (delta < MIN_DELTA) {
                return;
              }
              // Use instant scroll to avoid perceivable slow drift from repeated small smooth scrolls
              modal.scrollTo({ top: target, behavior: 'auto' });
            } else {
              el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          } else {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        } catch (e) {
          // fallback: find modal container and adjust its scrollTop
          let parent: any = el.parentElement;
          while (parent && parent !== document.body) {
            const overflowY = window.getComputedStyle(parent).overflowY;
            if (overflowY === 'auto' || overflowY === 'scroll') {
              parent.scrollTop = el.offsetTop - 40;
              break;
            }
            parent = parent.parentElement;
          }
        }
      }, 200);
    } catch (e) {
      // ignore
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
