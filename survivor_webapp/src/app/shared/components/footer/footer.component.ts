import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FaqDialogComponent } from '../faq-dialog/faq-dialog.component';

// DIALOG CONTATTI
@Component({
  selector: 'app-contatti-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">email</mat-icon>
        <span class="value">Contatti</span>
      </h2>
      <div class="content-section">
        <p class="intro-text">Per informazioni, suggerimenti o segnalazioni, contattaci via email:</p>
        <a href="mailto:fantasurvivorddl@gmail.com" class="email-link">
          <mat-icon>mail_outline</mat-icon>
          <span>fantasurvivorddl&#64;gmail.com</span>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 85vw;
      max-width: 500px;
      font-family: 'Poppins', sans-serif;
    }
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 24px 0;
    }
    .intro-text {
      color: #6B7280;
      font-size: 0.95rem;
      margin-bottom: 24px;
      max-width: 300px;
    }
    .email-link {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 16px 32px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      text-decoration: none;
      border-radius: 12px;
      font-weight: 600;
      font-size: 1rem;
      transition: all 0.3s ease;
      mat-icon { font-size: 20px; width: 20px; height: 20px; }
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 8px 24px rgba(10, 61, 145, 0.3);
      }
    }
  `]
})
export class ContattiDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG TERMINI E CONDIZIONI
@Component({
  selector: 'app-termini-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">gavel</mat-icon>
        <span class="value">Termini e Condizioni</span>
      </h2>
      <div class="content-section">
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
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
    }
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        margin-bottom: 24px;
      }
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;
          &:hover { text-decoration: underline; }
        }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .section h4 { font-size: 0.9rem; }
      .section p { font-size: 0.85rem; }
    }
  `]
})
export class TerminiDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG PRIVACY POLICY
@Component({
  selector: 'app-privacy-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">security</mat-icon>
        <span class="value">Privacy Policy</span>
      </h2>
      <div class="content-section">
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
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
    }
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      h3 {
        text-align: center;
        color: #0A3D91;
        font-size: 1.1rem;
        font-weight: 700;
        margin-bottom: 4px;
      }
      .subtitle {
        text-align: center;
        color: #4FC3F7;
        font-weight: 600;
        margin-bottom: 16px;
      }
      .intro-text {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 24px;
        text-align: center;
        padding: 0 16px;
      }
    }
    .section {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);
      &:last-child { border-bottom: none; }
      h4 {
        color: #0A3D91;
        font-size: 0.95rem;
        font-weight: 600;
        margin: 0 0 8px 0;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0 0 8px 0;
        &:last-child { margin-bottom: 0; }
        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;
          &:hover { text-decoration: underline; }
        }
      }
      ul {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.8;
        margin: 8px 0;
        padding-left: 20px;
        li { margin-bottom: 4px; }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .content-section .intro-text { font-size: 0.85rem; padding: 0 8px; }
      .section h4 { font-size: 0.9rem; }
      .section p, .section ul { font-size: 0.85rem; }
    }
  `]
})
export class PrivacyDialogComponent {
  constructor(private dialog: MatDialog) {}
  closeDialog() { this.dialog.closeAll(); }
}

// DIALOG CHI SIAMO
@Component({
  selector: 'app-chi-siamo-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">groups</mat-icon>
        <span class="value">Chi Siamo</span>
      </h2>
      <div class="content-section">
        <div class="intro-block">
          <p class="main-text">
            <strong>Survivor</strong> è un'app di intrattenimento dedicata agli appassionati di <strong>Serie A</strong>, <strong>Tennis</strong> e <strong>Basket</strong>.
          </p>
          <p class="main-text">
            La nostra missione è offrire giochi e tornei divertenti, semplici e accessibili a tutti.
          </p>
          <p class="main-text">
            Siamo un piccolo team appassionato di sport e tecnologia, e crediamo nel gioco pulito e nella competizione leale.
          </p>
        </div>

        <div class="notice-block">
          <mat-icon class="notice-icon">info</mat-icon>
          <p>
            Survivor è un gioco di intrattenimento senza premi in denaro. Per informazioni su come trattiamo i dati e sulle regole del gioco, consulta i nostri
            <a href="#" (click)="openTermini($event)">Termini e Condizioni</a> e la
            <a href="#" (click)="openPrivacy($event)">Privacy Policy</a>.
          </p>
        </div>

        <div class="contact-block">
          <p>Per domande o supporto, scrivici a:</p>
          <a href="mailto:fantasurvivorddl@gmail.com" class="email-link">
            <mat-icon>email</mat-icon>
            <span>fantasurvivorddl&#64;gmail.com</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 24px;
      width: 90vw;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      font-family: 'Poppins', sans-serif;
      &::-webkit-scrollbar { width: 6px; }
      &::-webkit-scrollbar-track { background: #F4F6F8; border-radius: 3px; }
      &::-webkit-scrollbar-thumb { background: #0A3D91; border-radius: 3px; }
    }
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s ease;
      mat-icon { color: #0A3D91; font-size: 16px; width: 16px; height: 16px; }
      &:hover { background: rgba(10, 61, 145, 0.15); transform: scale(1.1); }
    }
    h2 {
      margin: 0 0 24px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 12px;
      padding-right: 40px;
      .title-icon { font-size: 1.5rem; color: #4FC3F7; }
      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
    .content-section {
      text-align: center;
    }
    .intro-block {
      margin-bottom: 24px;
      .main-text {
        color: #6B7280;
        font-size: 1rem;
        line-height: 1.7;
        margin: 0 0 12px 0;
        &:last-child { margin-bottom: 0; }
        strong {
          color: #0A3D91;
          font-weight: 600;
        }
      }
    }
    .notice-block {
      background: linear-gradient(135deg, rgba(10, 61, 145, 0.05), rgba(79, 195, 247, 0.08));
      border-radius: 12px;
      padding: 16px 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: flex-start;
      gap: 12px;
      text-align: left;
      .notice-icon {
        color: #4FC3F7;
        font-size: 24px;
        width: 24px;
        height: 24px;
        flex-shrink: 0;
        margin-top: 2px;
      }
      p {
        color: #6B7280;
        font-size: 0.9rem;
        line-height: 1.6;
        margin: 0;
        a {
          color: #0A3D91;
          text-decoration: none;
          font-weight: 600;
          transition: all 0.2s ease;
          &:hover {
            color: #4FC3F7;
            text-decoration: underline;
          }
        }
      }
    }
    .contact-block {
      p {
        color: #6B7280;
        font-size: 0.9rem;
        margin: 0 0 12px 0;
      }
      .email-link {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 12px 24px;
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        color: #FFFFFF;
        text-decoration: none;
        border-radius: 12px;
        font-weight: 600;
        font-size: 0.95rem;
        transition: all 0.3s ease;
        mat-icon { font-size: 20px; width: 20px; height: 20px; }
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(10, 61, 145, 0.3);
        }
      }
    }
    @media (max-width: 480px) {
      .modal-container { padding: 16px; }
      h2 { font-size: 1.1rem; }
      .intro-block .main-text { font-size: 0.9rem; }
      .notice-block { padding: 12px 16px; }
      .notice-block p { font-size: 0.85rem; }
      .contact-block .email-link { padding: 10px 20px; font-size: 0.9rem; }
    }
  `]
})
export class ChiSiamoDialogComponent {
  constructor(private dialog: MatDialog) {}

  closeDialog() { this.dialog.closeAll(); }

  openTermini(event: Event) {
    event.preventDefault();
    this.dialog.open(TerminiDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openPrivacy(event: Event) {
    event.preventDefault();
    this.dialog.open(PrivacyDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openChiSiamo(event: Event) {
    event.preventDefault();
    this.dialog.open(ChiSiamoDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }
}

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  template: `
    <footer class="survivor-footer">
      <div class="footer-container">
        <div class="footer-content">
          <!-- LOGO SURVIVOR -->
          <div class="footer-brand">
            <div class="footer-logo">
              <span class="logo-text">SURVIVOR</span>
              <span class="subtitle">WIN OR GO HOME</span>
            </div>
          </div>

          <!-- LINK NAVIGAZIONE -->
          <nav class="footer-nav">
            <a href="#" class="footer-link" (click)="openTermini($event)">Termini e Condizioni</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openPrivacy($event)">Privacy Policy</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openFaq($event)">FAQ</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openChiSiamo($event)">Chi siamo</a>
            <span class="separator">|</span>
            <a href="#" class="footer-link" (click)="openContatti($event)">Contatti</a>
          </nav>


          <!-- COPYRIGHT -->
          <div class="footer-copyright">
            <span>© 2026 Survivor DDL</span>
          </div>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    /* FOOTER COMPATTO ORIZZONTALE */
    .survivor-footer {
      background: linear-gradient(135deg, #0A3D91 0%, #4FC3F7 100%);
      color: #FFFFFF;
      margin-top: auto;
      font-family: 'Poppins', sans-serif;
      box-shadow: 0 -2px 8px rgba(10, 61, 145, 0.1);
      position: relative;
      overflow: hidden;
    }

    .footer-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 16px 24px;
    }

    .footer-content {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    /* LOGO COMPATTO */
    .footer-brand {
      .footer-logo {
        .logo-text {
          font-size: 1.2rem;
          font-weight: 800;
          color: #FFFFFF;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .subtitle {
          font-size: 0.7rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.8);
          text-transform: uppercase;
          letter-spacing: 1px;
          margin-left: 8px;
        }
      }
    }

    /* NAVIGAZIONE ORIZZONTALE */
    .footer-nav {
      display: flex;
      gap: 24px;
      align-items: center;
    }

    .footer-link {
      color: rgba(255, 255, 255, 0.85);
      text-decoration: none;
      font-size: 0.9rem;
      font-weight: 500;
      transition: all 0.3s ease;
      padding: 8px 12px;
      border-radius: 6px;
      cursor: pointer;

      &:hover {
        color: #FFFFFF;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }
    }

    .separator {
      color: rgba(255, 255, 255, 0.4);
      font-weight: 300;
    }

    /* COPYRIGHT */
    .footer-copyright {
      font-size: 0.8rem;
      color: rgba(255, 255, 255, 0.7);
      font-weight: 400;
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .footer-container {
        padding: 14px 20px;
      }

      .footer-content {
        flex-direction: column;
        gap: 16px;
        text-align: center;
      }

      .footer-nav {
        flex-wrap: wrap;
        justify-content: center;
        gap: 16px;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1.1rem;
        }

        .subtitle {
          font-size: 0.65rem;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .footer-container {
        padding: 12px 16px;
      }

      .footer-content {
        gap: 12px;
      }

      .footer-nav {
        gap: 12px;

        .footer-link {
          font-size: 0.8rem;
          padding: 6px 10px;
        }

        .separator {
          display: none;
        }
      }

      .footer-copyright {
        font-size: 0.75rem;
      }

      .footer-brand .footer-logo {
        .logo-text {
          font-size: 1rem;
        }

        .subtitle {
          font-size: 0.6rem;
        }
      }
    }
  `]
})
export class FooterComponent {
  constructor(private dialog: MatDialog) {}

  openFaq(event: Event) {
    event.preventDefault();
    this.dialog.open(FaqDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openContatti(event: Event) {
    event.preventDefault();
    this.dialog.open(ContattiDialogComponent, {
      width: '90vw',
      maxWidth: '500px',
      panelClass: 'custom-dialog-container'
    });
  }

  openTermini(event: Event) {
    event.preventDefault();
    this.dialog.open(TerminiDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openPrivacy(event: Event) {
    event.preventDefault();
    this.dialog.open(PrivacyDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }

  openChiSiamo(event: Event) {
    event.preventDefault();
    this.dialog.open(ChiSiamoDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '90vh',
      panelClass: 'custom-dialog-container'
    });
  }
}

