import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-terms',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        HeaderComponent
    ],
    template: `
    <div class="page-container">
      <app-header
        title="Termini e Condizioni"
        visHome="S"
        (back)="goBack()"
        [hideActions]="false"
      ></app-header>
      
      <main class="content">
        <mat-card class="policy-card">
          <mat-card-content>
            <div class="content-section">
              <!-- Content from TerminiDialogComponent -->
              <h3>Termini e Condizioni di Utilizzo</h3>
              <p class="subtitle">Survivor</p>

              <div class="section">
                <h4>1. Oggetto del servizio</h4>
                <p>Survivor è una piattaforma digitale di intrattenimento che consente agli utenti di partecipare a giochi e tornei basati su scelte sportive e dinamiche competitive. Il servizio non costituisce gioco d'azzardo né attività di scommessa.</p>
              </div>

              <div class="section">
                <h4>2. Registrazione e account</h4>
                <p>Per utilizzare Survivor è necessario creare un account tramite indirizzo email. L'utente è responsabile della correttezza delle informazioni fornite e dell'utilizzo del proprio account.</p>
                <p>È consentito un solo account per ciascun utente. È vietata la creazione di account multipli o l'uso di sistemi automatizzati.</p>
              </div>

              <div class="section">
                <h4>3. Utilizzo del servizio</h4>
                <p>L'utente si impegna a utilizzare Survivor in modo corretto e conforme alle presenti condizioni. Sono vietati comportamenti che possano compromettere il corretto funzionamento della piattaforma, inclusi tentativi di manipolazione dei risultati o delle classifiche.</p>
              </div>

              <div class="section">
                <h4>4. Regole di gioco</h4>
                <p>Le regole dei giochi e dei tornei sono definite all'interno dell'app e possono essere modificate in qualsiasi momento. I risultati generati dalla piattaforma sono da considerarsi definitivi e non contestabili.</p>
              </div>

              <div class="section">
                <h4>5. Premi</h4>
                <p>Survivor non prevede premi in denaro reale. Eventuali premi, riconoscimenti o trofei hanno esclusivamente valore simbolico o promozionale.</p>
              </div>

              <div class="section">
                <h4>6. Sospensione e chiusura dell'account</h4>
                <p>Il gestore si riserva il diritto di sospendere o chiudere l'account di un utente, senza preavviso, in caso di violazione delle presenti condizioni o di utilizzo improprio del servizio.</p>
              </div>

              <div class="section">
                <h4>7. Limitazione di responsabilità</h4>
                <p>Il servizio è fornito "così com'è". Il gestore non garantisce l'assenza di errori, interruzioni o malfunzionamenti e non è responsabile per eventuali danni derivanti dall'utilizzo della piattaforma.</p>
                <p>Il gestore non è responsabile per eventuali inesattezze nei dati sportivi forniti da fonti esterne.</p>
              </div>

              <div class="section">
                <h4>8. Proprietà intellettuale</h4>
                <p>Tutti i contenuti presenti su Survivor, inclusi testi, grafica, logo e struttura della piattaforma, sono di proprietà del gestore e non possono essere utilizzati senza autorizzazione.</p>
              </div>

              <div class="section">
                <h4>9. Modifiche ai Termini</h4>
                <p>I presenti Termini e Condizioni possono essere aggiornati o modificati in qualsiasi momento. Le modifiche saranno efficaci dalla loro pubblicazione sulla piattaforma.</p>
              </div>

              <div class="section">
                <h4>10. Legge applicabile e foro competente</h4>
                <p>I presenti Termini e Condizioni sono regolati dalla legge italiana. Per ogni controversia è competente in via esclusiva il foro del luogo di residenza o sede del gestore.</p>
              </div>

              <div class="section">
                <h4>11. Contatti</h4>
                <p>Per informazioni o richieste è possibile contattare il gestore all'indirizzo email: <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
              </div>
            </div>
          </mat-card-content>
        </mat-card>
      </main>
    </div>
  `,
    styles: [`
    .page-container {
      min-height: 100vh;
      background: #F4F6F8;
      display: flex;
      flex-direction: column;
    }
    .content {
      flex: 1;
      padding: 20px;
      display: flex;
      justify-content: center;
    }
    .policy-card {
      max-width: 800px;
      width: 100%;
      border-radius: 16px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
      background: #FFFFFF;
      padding: 24px;
    }
    
    // Copying styles from PrivacyComponent for consistency
    .content-section {
      font-family: 'Poppins', sans-serif;
      
      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 8px;
        text-transform: uppercase;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        font-size: 1.1rem;
        margin-bottom: 32px;
        letter-spacing: 1px;
        text-transform: uppercase;
      }
    }
    .section {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin: 0 0 12px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.95rem;
        line-height: 1.7;
        margin: 0 0 10px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s;
          &:hover { text-decoration: underline; color: #0288D1; }
        }
      }
    }

    @media (max-width: 600px) {
      .content { padding: 16px; }
      .policy-card { padding: 16px; border-radius: 12px; }
      .content-section h3 { font-size: 1.3rem; }
      .content-section .subtitle { font-size: 1rem; margin-bottom: 24px; }
      .section h4 { font-size: 1rem; }
      .section p { font-size: 0.9rem; }
    }
  `]
})
export class TermsComponent {
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/auth/login']);
    }
}
