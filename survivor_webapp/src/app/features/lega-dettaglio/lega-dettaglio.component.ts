import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import { Giocatore, Lega } from '../../core/models/interfaces.model';
import { SquadraService } from '../../core/services/squadra.service';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { MatChipsModule } from '@angular/material/chips';
import { GiocataService } from '../../core/services/giocata.service';
import { AdminService } from '../../core/services/admin.service';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-lega-dettaglio',
  imports: [
    CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
    MatChipsModule,
    MatTooltipModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './lega-dettaglio.component.html',
  styleUrl: './lega-dettaglio.component.scss',
})
export class LegaDettaglioComponent {
  id: number = -1;
  lega: Lega | null = null;
  isLoading = true;
  error: string | null = null;
  squadre: any[] = [];
  displayedColumns: string[] = [];

  giornataIndices: number[] = [];

  get maxGiornata(): number {
    if (!this.lega || !this.lega.giocatori) return 0;
    let max = 0;
    for (const g of this.lega.giocatori) {
      if (!g.giocate) continue;
      for (const gg of g.giocate) {
        const n = Number(gg?.giornata);
        if (!isNaN(n) && n > max) max = n;
      }
    }
    return max;
  }

  constructor(
    private route: ActivatedRoute,
    private legaService: LegaService,
    private adminService: AdminService,
    private authService: AuthService,
    private squadraService: SquadraService,
    private router: Router,
    private giocataService: GiocataService
  ) {
    this.route.paramMap.subscribe((params) => {
      this.id = Number(params.get('id'));
      if (this.id) {
        this.isLoading = true;

        this.legaService.getLegaById(this.id).subscribe({
          next: (lega) => {
            this.lega=lega;
            this.caricaTabella();
            this.isLoading = false;
          },
          error: (error) => {
            console.error('Errore nel caricamento delle leghe:', error);
            this.isLoading = false;
          },
        });
      }
    });
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }

  caricaTabella() {
    // Calcolo le colonne della tabella: uso il massimo valore di 'giornata' tra tutte le giocate
    this.displayedColumns = ['nome'];
    const maxGiornata = legeMaxGiornata(this.lega?.giocatori || []);
    for (let i = 0; i < maxGiornata; i++) {
      this.displayedColumns.push('giocata' + i);
    }
    // populate giornata indices 1..maxGiornata
    this.giornataIndices = Array.from({ length: maxGiornata }, (_, i) => i + 1);
    if (this.selezionaProssimaGiocata()) {
      this.displayedColumns.push('prossimaGiocata');
    }

    if (this.lega?.campionato) {
      this.squadraService
        .getSquadreByCampionato(this.lega?.campionato?.id ?? '')
        .subscribe({
          next: (squadre: any[]) => {
            this.squadre = squadre;
          },
          error: () => {
            this.squadre = [];
          },
        });
    }
    this.isLoading = false;
  }

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    const giocateIds = (giocatore.giocate || []).map((g: any) => g.squadraId);
    return this.squadre.filter((s) => !giocateIds.includes(s.id));
  }

  // Restituisce la giocata corrispondente alla giornata (1-based) se presente
  getGiocataByGiornata(giocatore: any, giornata: number): any | null {
    if (!giocatore || !giocatore.giocate) return null;
    return (
      giocatore.giocate.find((g: any) => Number(g?.giornata) === giornata) ||
      null
    );
  }

  getSquadraNome(squadraId: string): string {
    if (!this.lega?.campionato?.id) return squadraId;
    return this.squadraService.getSquadraNomeById(
      squadraId,
      this.lega?.campionato?.id
    );
  }

  selezionaProssimaGiocata(): boolean {
    return this.giornataDaGiocare();
  }

  giornataTerminata(): boolean {
    return this.lega?.statoGiornataCorrente == 'TERMINATA';
  }

  giornataDaGiocare(): boolean {
    if ((this.lega?.giornataCorrente || 0) <= 15) return true;//TODO PER TEST
    return this.lega?.statoGiornataCorrente == 'DA_GIOCARE';
  }

  selectGiocatoreVisible(giocatore: Giocatore): boolean {
    if (giocatore.stato === 'ELIMINATO') {
      return false;
    }
    if (!this.canEditUserRow(giocatore)) {
      return false;
    }

    let giocate = 0;
    if (giocatore.giocate) {
      giocate += giocatore.giocate.length;
    }
    const prossimaGiocata = (this.lega?.giornataIniziale || 0) + giocate;

    if (prossimaGiocata > (this.lega?.giornataCorrente || 0)) {
      return false;
    }

    return true;
  }

  canEditUserRow(giocatore: Giocatore): boolean {
    if (this.isAdmin()) {
      return true;
    }
    if (
      giocatore == null ||
      giocatore.user == null ||
      giocatore.user.id == null
    ) {
      return false;
    }
    const userId = giocatore.user.id;
    if (this.authService.isAdmin()) return true;
    const currentId = this.authService.getCurrentUser()?.id;
    return currentId !== null && currentId === userId;
  }

  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
  isAdmin(): boolean {
    return this.authService.isAdmin();
  }
  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
  calcolaGiornata() {
    this.isLoading = true;
    this.adminService
      .calcola(Number(this.id), (this.lega?.giornataCorrente || 0))
      .subscribe({
        next: (lega: Lega) => {
              this.lega = lega;
              this.caricaTabella();
              this.isLoading = false;
        },
        error: (err: any) => {
          this.error = 'Errore nel caricamento della lega';
          this.isLoading = false;
        },
      });
  }
  salvaSquadra(giocatore: any): void {
    if (!this.lega) {
      console.error('Nessuna lega caricata');
      return;
    }
    // Calcola la prossima giornata sequenziale (append in coda)
    const nextGiornata =
      (giocatore.giocate && giocatore.giocate.length
        ? giocatore.giocate.length
        : 0) + 1;
    const body = {
      giornata: nextGiornata,
      giocatoreId: giocatore.id || 0,
      squadraId: giocatore.squadraSelezionata,
    };
    this.giocataService.salvaGiocata(body).subscribe({
      next: (res: any) => {
        // Aggiorna la giocata localmente: aggiunge alla lista giocate del giocatore
        giocatore.giocate = giocatore.giocate || [];
        // se l'API restituisce l'oggetto creato, usalo; altrimenti crea un oggetto minimale
        const nuovaGiocata =
          res && (res.giornata || res.giornata === 0)
            ? res
            : {
                giornata: nextGiornata,
                squadraId: giocatore.squadraSelezionata,
              };
        // aggiungi in coda per mantenere l'ordine 1,2,3...
        giocatore.giocate.push(nuovaGiocata);
        // pulisci selezione
        delete giocatore.squadraSelezionata;
        // Aggiorna displayedColumns se necessario (uso il massimo valore di giornata tra tutti i giocatori)
        const maxGiornata = legeMaxGiornata(this.lega?.giocatori || []);
        const currentGiocateCols = this.displayedColumns.filter((c) =>
          c.startsWith('giocata')
        ).length;
        if (maxGiornata > currentGiocateCols) {
          this.displayedColumns = ['nome'];
          for (let i = 0; i < maxGiornata; i++)
            this.displayedColumns.push('giocata' + i);
          if (this.selezionaProssimaGiocata()) {
            this.displayedColumns.push('prossimaGiocata');
          }
          this.giornataIndices = Array.from(
            { length: maxGiornata },
            (_, i) => i + 1
          );
        }
      },
      error: (err: any) => {
        console.error('Errore nel salvataggio della giocata', err);
      },
    });
  }
}

function legeMaxGiornata(giocatori: any[]): number {
  if (!giocatori || giocatori.length === 0) return 0;
  let max = 0;
  for (const g of giocatori) {
    if (!g.giocate) continue;
    for (const gg of g.giocate) {
      const n = Number(gg?.giornata);
      if (!isNaN(n) && n > max) max = n;
    }
  }
  return max;
}
