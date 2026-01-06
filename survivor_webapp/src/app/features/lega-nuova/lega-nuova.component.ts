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
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { SportService } from '../../core/services/sport.service';
import { Campionato, Sport } from '../../core/models/interfaces.model';
import { CampionatoService } from '../../core/services/campionato.service';
import { LegaService } from '../../core/services/lega.service';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from '../../shared/components/error-dialog/error-dialog.component';
import { environment } from '../../../environments/environment';

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
    MatButtonModule,
    FormsModule,
    MatChipsModule,
    MatIconModule,
  ],
  templateUrl: './lega-nuova.component.html',
  styleUrls: ['./lega-nuova.component.scss'],
})
export class LegaNuovaComponent implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService,
    private sportService: SportService,
    private legaService: LegaService,
    private campionatoService: CampionatoService,
    private dialog: MatDialog
  ) {}
  sportSel: string | null = null;
  campionatoSel: Campionato | null = null;
  name!: string;
  giornataIniziale: number | null = null;
  pwd: string | null = null;
  sportDisponibili: Sport[] = [];
  campionatiDisponibili: Campionato[] = [];
  // validation touch states
  nameTouched = false;
  sportTouched = false;
  campionatoTouched = false;
  giornataTouched = false;
  confirmationMessage: boolean = false;
  legaCreataId: number | null = null;
  emailInput: string = '';
  emailsList: string[] = [];
  ngOnInit(): void {
    this.caricaSport();
  }
  goBack(): void {
    this.router.navigate(['/home']);
  }
  caricaSport(): void {
    this.sportService.getSport().subscribe({
      next: (sport) => {
        this.sportDisponibili = sport;
      },
      error: (error) => {
        console.error('Errore nel caricamento degli sport:', error);
      },
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  baseUrl() {
    return environment.baseUrl;
  }

  selezionaSport() {
    if (this.sportSel) {
      this.campionatoService.getCampionatoBySport(this.sportSel).subscribe({
        next: (campionati) => {
          this.campionatiDisponibili = campionati;
          this.campionatoSel=null;
        },
        error: (error) => {
          console.error(
            'Errore nel caricamento del campionato: ' + this.sportSel,
            error
          );
        },
      });
    }
  }

  isGiornataValid(): boolean {
    if (this.giornataIniziale === null || this.giornataIniziale === undefined)
      return false;
    if (!this.campionatoSel) return false;
    const min = this.campionatoSel.giornataDaGiocare ?? -Infinity;
    const max = this.campionatoSel.numGiornate ?? Infinity;
    return this.giornataIniziale >= min && this.giornataIniziale <= max;
  }

  isFormValid(): boolean {
    return (
      !!this.name &&
      !!this.sportSel &&
      !!this.campionatoSel &&
      this.isGiornataValid()
    );
  }

  resetForm(): void {
    this.name = '';
    this.sportSel = null;
    this.campionatoSel = null;
    this.giornataIniziale = null;
    this.pwd = null;
    this.nameTouched = false;
    this.sportTouched = false;
    this.campionatoTouched = false;
    this.giornataTouched = false;
    this.campionatiDisponibili = [];
  }

  onSubmit(): void {
    this.nameTouched = true;
    this.sportTouched = true;
    this.campionatoTouched = true;
    this.giornataTouched = true;

    if (!this.isFormValid()) {
      return;
    }
    this.legaService
      .inserisciLega(
        this.name!,
        this.sportSel!,
        this.campionatoSel!.id,
        this.giornataIniziale!,
        this.pwd
      )
      .subscribe({
        next: (lega) => {
          this.confirmationMessage = true;
          this.legaCreataId = lega.id;
        },
        error: (err) => {
          if (err && err.status === 499) {
            let messaggio = '';
            if (err?.error?.message) {
              messaggio = String(err.error.message);
            } else {
              messaggio = err.message;
            }
            this.dialog.open(ErrorDialogComponent, {
              data: { message: messaggio },
            });
          }

          console.error('Errore creazione lega', err);
        },
      });
  }

  addEmail(): void {
    if (this.emailInput && this.isValidEmail(this.emailInput)) {
      if (!this.emailsList.includes(this.emailInput)) {
        this.emailsList.push(this.emailInput);
        this.emailInput = '';
      }
    }
  }

  removeEmail(email: string): void {
    const index = this.emailsList.indexOf(email);
    if (index >= 0) {
      this.emailsList.splice(index, 1);
    }
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  invitaUtenti(): void {
    if (this.emailsList.length === 0 || !this.legaCreataId) {
      return;
    }


    this.legaService.invitaUtenti(this.legaCreataId, this.emailsList).subscribe({
      next: () => {
        this.emailsList = [];
      },
      error: (err) => {
        console.error('Errore invio inviti:', err);
      },
    });
  }
}
