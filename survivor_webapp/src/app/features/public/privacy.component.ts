import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { Router } from '@angular/router';

@Component({
    selector: 'app-privacy',
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
        title="Privacy Policy"
        visHome="S"
        (back)="goBack()"
        [hideActions]="false"
      ></app-header>
      
      <main class="content">
        <mat-card class="policy-card">
          <mat-card-content>
            <div class="content-section">
              <!-- Content from PrivacyDialogComponent -->
              <h3>Privacy Policy</h3>
              <p class="subtitle">Survivor</p>

              <p class="intro-text">La presente Privacy Policy descrive le modalità di raccolta, utilizzo e protezione dei dati personali degli utenti che utilizzano la piattaforma Survivor (di seguito "Servizio"), in conformità al Regolamento UE 2016/679 (GDPR).</p>

              <div class="section">
                <h4>1. Titolare del trattamento</h4>
                <p>Il titolare del trattamento dei dati è il gestore della piattaforma Survivor.</p>
                <p>Per qualsiasi richiesta relativa alla presente Privacy Policy è possibile contattare il titolare all'indirizzo email: <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
              </div>

              <div class="section">
                <h4>2. Dati personali raccolti</h4>
                <p>I dati personali raccolti attraverso l'utilizzo del Servizio sono limitati a quanto strettamente necessario al suo funzionamento:</p>
                <ul>
                  <li>Indirizzo email (utilizzato per l'autenticazione tramite magic link)</li>
                  <li>Nickname scelto dall'utente</li>
                  <li>Preferenza sportiva (squadra del cuore)</li>
                  <li>Dati tecnici di utilizzo del Servizio (log, informazioni sul dispositivo e sull'accesso)</li>
                </ul>
              </div>

              <div class="section">
                <h4>3. Finalità del trattamento</h4>
                <p>I dati personali sono trattati per le seguenti finalità:</p>
                <ul>
                  <li>Consentire la registrazione e l'accesso al Servizio</li>
                  <li>Permettere la partecipazione ai giochi e ai tornei</li>
                  <li>Gestire le funzionalità della piattaforma e le classifiche</li>
                  <li>Garantire la sicurezza e il corretto funzionamento del Servizio</li>
                  <li>Adempiere a eventuali obblighi di legge</li>
                </ul>
              </div>

              <div class="section">
                <h4>4. Base giuridica del trattamento</h4>
                <p>Il trattamento dei dati personali è effettuato sulla base:</p>
                <ul>
                  <li>Dell'esecuzione del contratto di cui l'utente è parte (utilizzo del Servizio)</li>
                  <li>Del legittimo interesse del titolare alla sicurezza e al miglioramento della piattaforma</li>
                </ul>
              </div>

              <div class="section">
                <h4>5. Modalità del trattamento</h4>
                <p>Il trattamento dei dati è effettuato mediante strumenti informatici e telematici, nel rispetto dei principi di liceità, correttezza, trasparenza e minimizzazione dei dati.</p>
                <p>Sono adottate adeguate misure di sicurezza per proteggere i dati personali da accessi non autorizzati, perdita o utilizzo illecito.</p>
              </div>

              <div class="section">
                <h4>6. Conservazione dei dati</h4>
                <p>I dati personali sono conservati per il tempo necessario a fornire il Servizio.</p>
                <p>L'utente può in qualsiasi momento richiedere la cancellazione del proprio account e dei dati associati.</p>
              </div>

              <div class="section">
                <h4>7. Comunicazione e diffusione dei dati</h4>
                <p>I dati personali non sono venduti né ceduti a terzi.</p>
                <p>I dati possono essere trattati da fornitori di servizi tecnici (ad esempio hosting o servizi email) esclusivamente per finalità connesse al funzionamento del Servizio.</p>
              </div>

              <div class="section">
                <h4>8. Dati aggregati e anonimi</h4>
                <p>Il titolare può elaborare dati in forma aggregata e anonima per finalità statistiche e di analisi dell'utilizzo della piattaforma.</p>
                <p>Tali dati non consentono in alcun modo l'identificazione degli utenti.</p>
              </div>

              <div class="section">
                <h4>9. Diritti dell'utente</h4>
                <p>L'utente ha il diritto di:</p>
                <ul>
                  <li>Accedere ai propri dati personali</li>
                  <li>Richiederne la rettifica o la cancellazione</li>
                  <li>Opporsi o limitarne il trattamento, nei casi previsti dalla legge</li>
                </ul>
                <p>Le richieste possono essere inviate all'indirizzo email: <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a></p>
              </div>

              <div class="section">
                <h4>10. Minori</h4>
                <p>Il Servizio è riservato a utenti che abbiano compiuto almeno 14 anni.</p>
                <p>Registrandosi, l'utente dichiara di possedere i requisiti di età richiesti.</p>
              </div>

              <div class="section">
                <h4>11. Cookie</h4>
                <p>La web app può utilizzare cookie tecnici necessari al corretto funzionamento del Servizio.</p>
                <p>Non vengono utilizzati cookie di profilazione senza il consenso dell'utente.</p>
              </div>

              <div class="section">
                <h4>12. Modifiche alla Privacy Policy</h4>
                <p>La presente Privacy Policy può essere aggiornata in qualsiasi momento.</p>
                <p>Le modifiche saranno efficaci dalla loro pubblicazione sulla piattaforma.</p>
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
    :host ::ng-deep .header-logo {
      // Adjust header logo for this page if needed, but default is fine
    }
    
    // Copying styles from PrivacyDialogComponent but adjusting for page layout
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
      .intro-text {
        color: #6B7280;
        font-size: 1rem;
        line-height: 1.7;
        margin-bottom: 32px;
        text-align: center;
        padding: 0 20px;
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
      ul {
        color: #6B7280;
        font-size: 0.95rem;
        line-height: 1.8;
        margin: 10px 0;
        padding-left: 24px;
        li { margin-bottom: 6px; }
      }
    }

    @media (max-width: 600px) {
      .content { padding: 16px; }
      .policy-card { padding: 16px; border-radius: 12px; }
      .content-section h3 { font-size: 1.3rem; }
      .content-section .subtitle { font-size: 1rem; margin-bottom: 24px; }
      .section h4 { font-size: 1rem; }
      .section p, .section ul { font-size: 0.9rem; }
    }
  `]
})
export class PrivacyComponent {
    constructor(private router: Router) { }

    goBack() {
        this.router.navigate(['/auth/login']);
    }
}
