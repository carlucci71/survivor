import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { LegaService } from '../../core/services/lega.service';
import { Lega } from '../../core/models/lega.model';
import { SquadraService } from '../../core/services/squadra.service';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-lega-dettaglio',
  imports: [CommonModule, MatCardModule, MatTableModule, MatSelectModule, MatProgressSpinnerModule, MatFormFieldModule, MatIconModule, FormsModule, ReactiveFormsModule],
  templateUrl: './lega-dettaglio.component.html',
  styleUrl: './lega-dettaglio.component.scss'
})
export class LegaDettaglioComponent {

  id: string | null = null;
  lega: Lega | null = null;
  isLoading = true;
  error: string | null = null;
  squadre: any[] = [];
  displayedColumns: string[] = [];
  giornataIndices: number[] = [];

  constructor(private route: ActivatedRoute,
     private legaService: LegaService,
     private authService: AuthService,
     private squadraService: SquadraService,
     private http: HttpClient
    ) {
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.isLoading = true;
        this.legaService.getLegaById(Number(this.id)).subscribe({
          next: (lega: Lega) => {
            this.lega = lega;
            // Calcolo le colonne della tabella: uso il massimo valore di 'giornata' tra tutte le giocate
            this.displayedColumns = ['nome', 'stato'];
            const maxGiornata = legeMaxGiornata(lega.giocatori || []);
            for (let i = 0; i < maxGiornata; i++) {
              this.displayedColumns.push('giocata' + i);
            }
            // populate giornata indices 1..maxGiornata
            this.giornataIndices = Array.from({ length: maxGiornata }, (_, i) => i + 1);
            this.displayedColumns.push('squadra');
            
            if (lega.campionatoId) {
              this.squadraService.getSquadreByCampionato(lega.campionatoId).subscribe({
                next: (squadre: any[]) => {
                  this.squadre = squadre;
                },
                error: () => {
                  this.squadre = [];
                }
              });
            }
            this.isLoading = false;
          },
          error: (err: any) => {
            this.error = 'Errore nel caricamento della lega';
            this.isLoading = false;
          }
        });
      }
    });
  }

  getSquadreDisponibili(giocatore: any): any[] {
    if (!this.squadre) return [];
    const giocateIds = (giocatore.giocate || []).map((g: any) => g.squadraId);
    return this.squadre.filter(s => !giocateIds.includes(s.id));
  }

  // Restituisce la giocata corrispondente alla giornata (1-based) se presente
  getGiocataByGiornata(giocatore: any, giornata: number): any | null {
    if (!giocatore || !giocatore.giocate) return null;
    return giocatore.giocate.find((g: any) => Number(g?.giornata) === giornata) || null;
  }

  getSquadraNome(squadraId: string): string {
    if (!this.lega?.campionatoId) return squadraId;
    return this.squadraService.getSquadraNomeById(squadraId, this.lega.campionatoId);
  }

  canEditUserRow(userId: number): boolean {
    if (this.authService.isAdmin()) return true;
    const currentId = this.authService.getCurrentUser()?.id;
    return currentId !== null && currentId === userId;
  }


  salvaSquadra(giocatore: any): void {
    if (!this.lega) {
      console.error('Nessuna lega caricata');
      return;
    }
    // Calcola la prossima giornata sequenziale (append in coda)
    const nextGiornata = ((giocatore.giocate && giocatore.giocate.length) ? giocatore.giocate.length : 0) + 1;
    const body = {
      giornata: nextGiornata,
      giocatoreId: giocatore.id || 0,
      squadraId: giocatore.squadraSelezionata
    };
    const url = `${environment.apiUrl}/api/survivorBe/giocate`;
    this.http.post(url, body).subscribe({
      next: (res: any) => {
        // Aggiorna la giocata localmente: aggiunge alla lista giocate del giocatore
        giocatore.giocate = giocatore.giocate || [];
        // se l'API restituisce l'oggetto creato, usalo; altrimenti crea un oggetto minimale
        const nuovaGiocata = res && (res.giornata || res.giornata === 0) ? res : { giornata: nextGiornata, squadraId: giocatore.squadraSelezionata };
        // aggiungi in coda per mantenere l'ordine 1,2,3...
        giocatore.giocate.push(nuovaGiocata);
        // pulisci selezione
        delete giocatore.squadraSelezionata;
        // Aggiorna displayedColumns se necessario (uso il massimo valore di giornata tra tutti i giocatori)
        const maxGiornata = legeMaxGiornata(this.lega?.giocatori || []);
        const currentGiocateCols = this.displayedColumns.filter(c => c.startsWith('giocata')).length;
        if (maxGiornata > currentGiocateCols) {
          this.displayedColumns = ['nome', 'stato'];
          for (let i = 0; i < maxGiornata; i++) this.displayedColumns.push('giocata' + i);
          this.displayedColumns.push('squadra');
          this.giornataIndices = Array.from({ length: maxGiornata }, (_, i) => i + 1);
        }
        console.log('Giocata salvata', res);
      },
      error: (err: any) => {
        console.error('Errore nel salvataggio della giocata', err);
      }
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

  