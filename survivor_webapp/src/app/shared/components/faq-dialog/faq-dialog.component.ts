import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

// FAQ DIALOG COMPONENT
@Component({
  selector: 'app-faq-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatDialogModule],
  template: `
    <div class="modal-container">
      <button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>
      <h2>
        <mat-icon class="title-icon">help</mat-icon>
        <span class="value">FAQ - Domande Frequenti</span>
      </h2>
      <div class="content-section">
        <div class="faq-item">
          <h4>Cos'è Survivor?</h4>
          <p>Survivor è un gioco a eliminazione basato sulle partite di calcio. Ogni giornata scegli una squadra: se vince, resti in gioco; se perde o pareggia (secondo regolamento), sei eliminato.</p>
        </div>

        <div class="faq-item">
          <h4>Come si partecipa?</h4>
          <p>Per partecipare devi essere aggiunto a un gruppo, accettare il regolamento e inviare la tua scelta entro l'orario limite della giornata.</p>
        </div>

        <div class="faq-item">
          <h4>Come scelgo la squadra?</h4>
          <p>Puoi scegliere una squadra tra quelle che giocano nella giornata disponibile. La scelta va effettuata prima della scadenza indicata nell'app.</p>
        </div>

        <div class="faq-item">
          <h4>Posso scegliere la stessa squadra più volte?</h4>
          <p>No. Ogni squadra può essere scelta una sola volta durante tutta la competizione, salvo diversa indicazione nel regolamento specifico della lega.</p>
        </div>

        <div class="faq-item">
          <h4>Cosa succede se dimentico di scegliere?</h4>
          <p>Se non invii la scelta entro il termine stabilito, vieni eliminato automaticamente dalla competizione.</p>
        </div>

        <div class="faq-item">
          <h4>Quando viene considerata valida la scelta?</h4>
          <p>La scelta è valida solo se effettuata correttamente prima della scadenza e confermata dall'app.</p>
        </div>

        <div class="faq-item">
          <h4>Cosa succede in caso di rinvio o sospensione di una partita?</h4>
          <p>In caso di rinvio o sospensione, si applicano le regole indicate nel regolamento ufficiale della competizione (es. partita annullata, scelta da rifare o esito valido solo se completata).</p>
        </div>

        <div class="faq-item">
          <h4>Il pareggio elimina?</h4>
          <p>Dipende dal formato della competizione. In alcune modalità il pareggio equivale a eliminazione, in altre no. Fai sempre riferimento al regolamento attivo.</p>
        </div>

        <div class="faq-item">
          <h4>Come vengono comunicati i risultati?</h4>
          <p>I risultati vengono aggiornati automaticamente nell'app al termine delle partite ufficiali.</p>
        </div>

        <div class="faq-item">
          <h4>Posso cambiare scelta?</h4>
          <p>Sì, puoi cambiare la tua scelta fino alla scadenza della giornata. Dopo la chiusura non sarà più possibile modificarla.</p>
        </div>

        <div class="faq-item">
          <h4>Cosa succede se più giocatori vincono Survivor?</h4>
          <p>Se restano più giocatori senza eliminazioni fino alla fine del calendario, il vincitore (o i vincitori) viene determinato secondo le regole della lega (es. spareggio, premio condiviso, giornata extra).</p>
        </div>

        <div class="faq-item">
          <h4>Ci sono premi?</h4>
          <p>Eventuali premi dipendono dalla lega o dal gruppo di gioco. L'app gestisce il gioco, ma non è responsabile della gestione dei premi.</p>
        </div>

        <div class="faq-item">
          <h4>Survivor è un'app di scommesse?</h4>
          <p>No. Survivor è un gioco ludico basato su pronostici, senza finalità di gioco d'azzardo.</p>
        </div>

        <div class="faq-item">
          <h4>I miei dati sono al sicuro?</h4>
          <p>Sì. I dati personali vengono trattati nel rispetto della normativa vigente sulla privacy e utilizzati solo per il funzionamento dell'app.</p>
        </div>

        <div class="faq-item">
          <h4>Posso partecipare a più Survivor contemporaneamente?</h4>
          <p>Sì, puoi partecipare a più competizioni se abilitate dall'organizzatore.</p>
        </div>

        <div class="faq-item">
          <h4>Chi posso contattare per assistenza?</h4>
          <p>Per problemi tecnici o dubbi, utilizza la sezione Contatti presente nell'app o scrivi a <a href="mailto:fantasurvivorddl@gmail.com">fantasurvivorddl&#64;gmail.com</a>.</p>
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

      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F4F6F8;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #0A3D91;
        border-radius: 3px;
      }
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

      mat-icon {
        color: #0A3D91;
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      &:hover {
        background: rgba(10, 61, 145, 0.15);
        transform: scale(1.1);
      }
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

      .title-icon {
        font-size: 1.5rem;
        color: #4FC3F7;
      }

      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    .content-section {
      padding-top: 8px;
    }

    .faq-item {
      margin-bottom: 20px;
      padding-bottom: 16px;
      border-bottom: 1px solid rgba(10, 61, 145, 0.08);

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

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
        margin: 0;

        a {
          color: #4FC3F7;
          text-decoration: none;
          font-weight: 500;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }

    @media (max-width: 480px) {
      .modal-container {
        padding: 16px;
      }

      h2 {
        font-size: 1.1rem;
      }

      .faq-item h4 {
        font-size: 0.9rem;
      }

      .faq-item p {
        font-size: 0.85rem;
      }
    }
  `]
})
export class FaqDialogComponent {
  constructor(private dialog: MatDialog) {}

  closeDialog() {
    this.dialog.closeAll();
  }
}
