import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { LegaService } from '../../core/services/lega.service';
import { User } from '../../core/models/auth.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { Giocatore, Lega, StatoLega } from '../../core/models/interfaces.model';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { MatIcon } from "@angular/material/icon";
import { MatTooltip } from "@angular/material/tooltip";
import { MatDialog } from '@angular/material/dialog';
import { InvitaUtentiDialogComponent } from '../../shared/components/invita-utenti-dialog/invita-utenti-dialog.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatToolbarModule, MatProgressSpinnerModule, MatChipsModule, MatIcon, MatTooltip],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User | null = null;
  leghe: Lega[] = [];
  groupedLeghe: { name: string; edizioni: Lega[] }[] = [];
  me: Giocatore | null = null;
  environmentName = environment.ambiente;
  isProd = environment.production;

  constructor(
    private authService: AuthService,
    private legaService: LegaService,
    private giocatoreService: GiocatoreService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.giocatoreService.me().subscribe(
      { next: (giocatore)=> {
        this.me=giocatore;
      }}
    );
    this.loadLeghe();
  }

  visualizzaInvito(lega: Lega): boolean {
    return lega.stato.value === StatoLega.DA_AVVIARE.value;
  }

  isTerminata(lega: Lega): boolean {
    return lega!.stato.value === StatoLega.TERMINATA.value;
  }

  notExistsNuovaEdizione(lega: Lega): boolean {
    if (!lega) {
      return true;
    }
    // Ensure groups are available
    if (!this.groupedLeghe || this.groupedLeghe.length === 0) {
      return true;
    }
    const group = this.groupedLeghe.find(g => g.name === lega.name);
    if (!group || !group.edizioni || group.edizioni.length === 0) {
      return true;
    }
    const currentEd = Number(lega.edizione ?? 0);
    // If any edition in the same group has a greater 'edizione' value, then a next edition exists
    const hasLater = group.edizioni.some(e => Number(e.edizione ?? 0) > currentEd);
    return !hasLater;
  }

  nuovaEdizione(lega: Lega): void {
    this.legaService.nuovaEdizione(lega.id).subscribe({ 
      next: (leghe) => {
        this.loadLeghe();
      },
      error: (error) => {
        console.error('Errore in nuova edizione:' + lega.id, error);
      }
    });
  }

  loadLeghe(): void {
    this.legaService.mieLeghe().subscribe({ 
      next: (leghe) => {
        this.leghe = leghe;
        this.groupLegheByName(leghe);
      },
      error: (error) => {
        console.error('Errore nel caricamento delle leghe:', error);
      }
    });
  }

  private groupLegheByName(leghe: Lega[]): void {
    const map = new Map<string, Lega[]>();
    (leghe || []).forEach(l => {
      const key = l.name || '';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(l);
    });
    this.groupedLeghe = Array.from(map.entries()).map(([name, edizioni]) => ({
      name,
      edizioni: edizioni.sort((a, b) => (a.edizione || '').toString().localeCompare((b.edizione || '').toString()))
    }));
  }


  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  logout(): void {
    this.authService.logout();
    // Naviga solo se non già su login
    if (this.router.url !== '/auth/login') {
      this.router.navigate(['/auth/login']);
    }
  }

  goToAdmin(): void {
    this.router.navigate(['/admin']);
  }

  goToMe(): void {
    this.router.navigate(['/me']);
  }

  goToLega(id: number): void {
    this.router.navigate(['/lega', id]);
  }

  goToCreaLega(): void {
    this.router.navigate(['/creaLega']);
  }

  goToUniscitiLega(): void {
    this.router.navigate(['/joinLega']);
  }

  openInvitaDialog(lega: Lega): void {
    this.dialog.open(InvitaUtentiDialogComponent, {
      data: {
        legaId: lega.id,
        legaNome: lega.name
      },
      width: '600px'
    });
  }

}
