import { Component, OnInit } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../core/services/auth.service';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { SportService } from '../../core/services/sport.service';
import { Campionato, Sport } from '../../core/models/interfaces.model';
import { CampionatoService } from '../../core/services/campionato.service';

@Component({
  selector: 'app-lega-nuova',
  standalone: true,
  imports: [
    CommonModule,
    HeaderComponent,
    MatProgressSpinnerModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    FormsModule,
  ],
  templateUrl: './lega-nuova.component.html',
  styleUrls: ['./lega-nuova.component.scss'],
})
export class LegaNuovaComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private sportService: SportService,
    private campionatoService: CampionatoService
  ) {}
  isLoading = true;
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  nome: string | null = null;
  giornataIniziale: number | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  ngOnInit(): void {
    this.caricaSport();
    this.isLoading = false;
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
  caricaSport(): void {
    this.isLoading = true;
    this.sportService.getSport().subscribe({
      next: (sport) => {
        this.sportDisponibili = sport;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli sport:', error);
        this.isLoading = false;
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  mostraUltimiRisultati(sigla?: string) {}

  selezionaSport() {
    if (this.sportSel) {
      this.isLoading=true;
      this.campionatoService.getCampionatoBySport(this.sportSel).subscribe({
        next: (campionati) => {
          this.campionatiDisponibili = campionati;
          this.isLoading = false;
        },
        error: (error) => {
          console.error(
            'Errore nel caricamento del campionato: ' + this.sportSel,
            error
          );
          this.isLoading = false;
        },
      });
    }
  }
}
