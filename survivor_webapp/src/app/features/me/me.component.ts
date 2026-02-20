import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { MatCard, MatCardHeader } from "@angular/material/card";
import { MatFormField, MatLabel, MatFormFieldModule } from "@angular/material/form-field";
import { MatButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { GiocatoreService } from '../../core/services/giocatore.service';
import { Giocatore } from '../../core/models/interfaces.model';
import { finalize } from 'rxjs';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-me',
  imports: [HeaderComponent, MatCard, MatCardHeader, MatFormField, MatLabel, FormsModule, MatFormFieldModule, MatInputModule, MatButton, MatIcon],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent {
  me: Giocatore | null = null;
  nickname: string | null = null;
  isSaving = false;
  feedbackMessage: string | null = null;
  feedbackType: 'success' | 'error' | null = null;

  constructor(
    private giocatoreService: GiocatoreService,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.giocatoreService.me().subscribe({
      next: (giocatore) => {
        this.me = giocatore;
        this.nickname = giocatore.nickname;
      },
      error: (error) => {
        console.error('[MeComponent] Errore caricamento /me:', error);
        const status = error?.status;
        if (status === 401 || status === 403 || !status) {
          console.warn('[MeComponent] Token non valido, redirect a login');
          this.authService.logout();
          this.router.navigate(['/auth/login']);
        }
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }

  get nomeModificato(): boolean {
    if (!this.me) {
      return false;
    }
    const nomePulito = this.nickname?.trim() ?? '';
    return nomePulito !== '' && nomePulito !== this.me.nickname;
  }

  clearFeedback(): void {
    this.feedbackMessage = null;
    this.feedbackType = null;
  }

  confermaNome(): void {
    if (!this.me) {
      return;
    }

    const nomePulito = this.nickname?.trim() ?? '';

    if (!nomePulito) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Inserisci un nome valido';
      return;
    }

    if (nomePulito === this.me.nickname) {
      this.feedbackType = 'error';
      this.feedbackMessage = 'Il nome non è cambiato';
      return;
    }

    const aggiornato: Giocatore = { ...this.me, nickname: nomePulito };
    this.isSaving = true;
    this.feedbackMessage = null;
    this.feedbackType = null;

    this.giocatoreService
      .aggiornaMe(aggiornato)
      .pipe(finalize(() => (this.isSaving = false)))
      .subscribe({
        next: (giocatore) => {
          this.me = giocatore;
          this.nickname = giocatore.nickname;
          this.feedbackType = 'success';
          this.feedbackMessage = 'Nome aggiornato';
        },
        error: () => {
          this.feedbackType = 'error';
          this.feedbackMessage = 'Impossibile aggiornare il nome, riprova più tardi';
        }
      });
  }


}
