import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, forkJoin, interval, of } from 'rxjs';
import { catchError, startWith, switchMap } from 'rxjs/operators';
import { PartitaLive } from '../../../core/models/interfaces.model';
import { LiveScoreService } from '../../../core/services/live-score.service';
import { LiveScoreDialogComponent, LiveScoreGruppo } from '../live-score-dialog/live-score-dialog.component';

/** Campionati diversi da Serie A mostrati come tab aggiuntive nel dialog: stessa logica, stesso
 *  gate lato backend (mostrati solo se l'utente ha una lega attiva in quel campionato). */
const ALTRI_CAMPIONATI: { id: string; labelKey: string }[] = [
  { id: 'SERIE_B', labelKey: 'LIVE_SCORE.TAB_SERIE_B' },
  { id: 'LIGA', labelKey: 'LIVE_SCORE.TAB_LIGA' },
  { id: 'PREMIER_LEAGUE', labelKey: 'LIVE_SCORE.TAB_PREMIER_LEAGUE' },
];

/**
 * Bottone "Risultati Live": prima versione, solo Serie A. Il backend cachizza già la chiamata
 * per ~50s condivisa fra tutti gli utenti, quindi possiamo interrogarlo altrettanto spesso senza
 * aggiungere carico reale sul provider esterno. Estesa poi a Serie B/Liga/Premier League, mostrate
 * come tab nel dialog quando l'utente ha una lega attiva in quei campionati.
 */
@Component({
  selector: 'app-live-score-button',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  templateUrl: './live-score-button.component.html',
  styleUrls: ['./live-score-button.component.scss'],
})
export class LiveScoreButtonComponent implements OnInit, OnDestroy {
  /** Partite Serie A: usate anche per il puntino "live" del bottone, come prima. */
  partite: PartitaLive[] = [];
  private gruppiAltri: LiveScoreGruppo[] = [];
  private pollSub?: Subscription;
  private readonly POLL_MS = 50000;

  constructor(
    private liveScoreService: LiveScoreService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.pollSub = interval(this.POLL_MS)
      .pipe(
        startWith(0),
        switchMap(() =>
          forkJoin([
            this.liveScoreService.partiteGiornataSerieA().pipe(catchError(() => of([] as PartitaLive[]))),
            ...ALTRI_CAMPIONATI.map((c) =>
              this.liveScoreService.partiteGiornata(c.id).pipe(catchError(() => of([] as PartitaLive[])))
            ),
          ])
        )
      )
      .subscribe({
        next: ([serieA, ...altri]) => {
          this.partite = serieA || [];
          this.gruppiAltri = ALTRI_CAMPIONATI
            .map((c, i) => ({ id: c.id, labelKey: c.labelKey, partite: altri[i] || [] }))
            .filter((g) => g.partite.length > 0);
        },
        error: () => {
          this.partite = [];
          this.gruppiAltri = [];
        },
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  get haPartiteInCorso(): boolean {
    return this.partite.some((p) => p.stato === 'IN_CORSO')
      || this.gruppiAltri.some((g) => g.partite.some((p) => p.stato === 'IN_CORSO'));
  }

  get haQualcosaDaMostrare(): boolean {
    return this.partite.length > 0 || this.gruppiAltri.length > 0;
  }

  apriDialog(): void {
    const gruppi: LiveScoreGruppo[] = [
      { id: 'SERIE_A', labelKey: 'LIVE_SCORE.TAB_SERIE_A', partite: this.partite },
      ...this.gruppiAltri,
    ].filter((g) => g.partite.length > 0);

    const isDesktop = window.innerWidth >= 768;
    this.dialog.open(LiveScoreDialogComponent, {
      data: { gruppi },
      panelClass: 'custom-dialog-container',
      width: isDesktop ? '560px' : '95vw',
      maxWidth: isDesktop ? '560px' : '95vw',
      maxHeight: '85vh',
    });
  }
}
