import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription, interval } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { PartitaLive } from '../../../core/models/interfaces.model';
import { LiveScoreService } from '../../../core/services/live-score.service';
import { LiveScoreDialogComponent } from '../live-score-dialog/live-score-dialog.component';

/**
 * Bottone "Risultati Live" (prima versione: solo Serie A). Il backend cachizza già la chiamata
 * per ~50s condivisa fra tutti gli utenti, quindi possiamo interrogarlo altrettanto spesso senza
 * aggiungere carico reale sul provider esterno.
 */
@Component({
  selector: 'app-live-score-button',
  standalone: true,
  imports: [CommonModule, MatDialogModule, TranslateModule],
  templateUrl: './live-score-button.component.html',
  styleUrls: ['./live-score-button.component.scss'],
})
export class LiveScoreButtonComponent implements OnInit, OnDestroy {
  partite: PartitaLive[] = [];
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
        switchMap(() => this.liveScoreService.partiteGiornataSerieA())
      )
      .subscribe({
        next: (partite) => (this.partite = partite || []),
        error: () => (this.partite = []),
      });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  apriDialog(): void {
    this.dialog.open(LiveScoreDialogComponent, {
      data: { partite: this.partite },
      panelClass: 'custom-dialog-container',
      maxWidth: '95vw',
    });
  }
}
