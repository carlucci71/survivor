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
    <div class="faq-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="faq-icon">help</mat-icon>
          <h2 class="dialog-title">FAQ - Domande Frequenti</h2>
        </div>
        <button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="faq-item">
          <h3>Cos'è Survivor?</h3>
          <p>Survivor è un gioco a eliminazione basato sulle partite di calcio. Ogni giornata scegli una squadra: se vince, resti in gioco; se perde o pareggia (secondo regolamento), sei eliminato.</p>
        </div>

        <div class="faq-item">
          <h3>Come si partecipa?</h3>
          <p>Per partecipare devi essere aggiunto a un gruppo, accettare il regolamento e inviare la tua scelta entro l'orario limite della giornata.</p>
        </div>

        <div class="faq-item">
          <h3>Come scelgo la squadra?</h3>
          <p>Puoi scegliere una squadra tra quelle che giocano nella giornata disponibile. La scelta va effettuata prima della scadenza indicata nell'app.</p>
        </div>

        <div class="faq-item">
          <h3>Posso scegliere la stessa squadra più volte?</h3>
          <p>No. Ogni squadra può essere scelta una sola volta durante tutta la competizione, salvo diversa indicazione nel regolamento specifico della lega.</p>
        </div>

        <div class="faq-item">
          <h3>Cosa succede se dimentico di scegliere?</h3>
          <p>Se non invii la scelta entro il termine stabilito, vieni eliminato automaticamente dalla competizione.</p>
        </div>

        <div class="faq-item">
          <h3>Quando viene considerata valida la scelta?</h3>
          <p>La scelta è valida solo se effettuata correttamente prima della scadenza e confermata dall'app.</p>
        </div>

        <div class="faq-item">
          <h3>Cosa succede in caso di rinvio o sospensione di una partita?</h3>
          <p>In caso di rinvio o sospensione, si applicano le regole indicate nel regolamento ufficiale della competizione (es. partita annullata, scelta da rifare o esito valido solo se completata).</p>
        </div>

        <div class="faq-item">
          <h3>Il pareggio elimina?</h3>
          <p>Dipende dal formato della competizione. In alcune modalità il pareggio equivale a eliminazione, in altre no. Fai sempre riferimento al regolamento attivo.</p>
        </div>

        <div class="faq-item">
          <h3>Come vengono comunicati i risultati?</h3>
          <p>I risultati vengono aggiornati automaticamente nell'app al termine delle partite ufficiali.</p>
        </div>

        <div class="faq-item">
          <h3>Posso cambiare scelta?</h3>
          <p>Sì, puoi cambiare la tua scelta fino alla scadenza della giornata. Dopo la chiusura non sarà più possibile modificarla.</p>
        </div>

        <div class="faq-item">
          <h3>Cosa succede se più giocatori vincono Survivor?</h3>
          <p>Se restano più giocatori senza eliminazioni fino alla fine del calendario, il vincitore (o i vincitori) viene determinato secondo le regole della lega (es. spareggio, premio condiviso, giornata extra).</p>
        </div>

        <div class="faq-item">
          <h3>Ci sono premi?</h3>
          <p>Eventuali premi dipendono dalla lega o dal gruppo di gioco. L'app gestisce il gioco, ma non è responsabile della gestione dei premi.</p>
        </div>

        <div class="faq-item">
          <h3>Survivor è un'app di scommesse?</h3>
          <p>No. Survivor è un gioco ludico basato su pronostici, senza finalità di gioco d'azzardo.</p>
        </div>

        <div class="faq-item">
          <h3>I miei dati sono al sicuro?</h3>
          <p>Sì. I dati personali vengono trattati nel rispetto della normativa vigente sulla privacy e utilizzati solo per il funzionamento dell'app.</p>
        </div>

        <div class="faq-item">
          <h3>Posso partecipare a più Survivor contemporaneamente?</h3>
          <p>Sì, puoi partecipare a più competizioni se abilitate dall'organizzatore.</p>
        </div>

        <div class="faq-item">
          <h3>Chi posso contattare per assistenza?</h3>
          <p>Per problemi tecnici o dubbi, utilizza la sezione Contatti presente nell'app o scrivi a fantasurvivorddl&#64;gmail.com.</p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    /* OVERRIDE COMPLETO ANGULAR MATERIAL DIALOG */
    :host {
      display: block;
      width: 100%;
      height: 100%;
      border-radius: 16px !important;
      overflow: hidden !important;
    }

    :host ::ng-deep .mat-mdc-dialog-container,
    :host ::ng-deep .mat-dialog-container {
      padding: 0 !important;
      margin: 0 !important;
      border-radius: 16px !important;
      overflow: hidden !important;
      background: transparent !important;
      box-shadow: none !important;
      border: none !important;
    }

    /* FAQ DIALOG STYLES - Coerente con gli altri dialog */
    .faq-dialog {
      background: white;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(10, 61, 145, 0.15);
      overflow: hidden;
      max-height: 90vh;
      display: flex;
      flex-direction: column;
      font-family: 'Poppins', sans-serif;
      position: relative;
      isolation: isolate;
      border: none;
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;

      /* Forza l'eliminazione di spazi bianchi */
      &::before,
      &::after {
        display: none !important;
      }

      * {
        box-sizing: border-box;
      }
    }

    /* Assicura che nessun elemento figlio crei spazi */
    .faq-dialog > * {
      margin: 0;
      border: none;
    }

    /* HEADER */
    .dialog-header {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: white;
      padding: 20px 28px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      min-height: 70px;
      position: relative;
      border-radius: 16px 16px 0 0;
      overflow: hidden;
      margin: 0;
      border: none;

      /* Assicura copertura completa degli angoli */
      &::before,
      &::after {
        display: none !important;
      }

      /* Forza il background a coprire completamente */
      background-clip: padding-box;
      background-origin: padding-box;
    }

    .header-content {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
    }

    .faq-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
      color: #FFD700;
      filter: drop-shadow(0 2px 4px rgba(0,0,0,0.2));
    }

    .dialog-title {
      font-size: 1.4rem;
      font-weight: 700;
      margin: 0;
      color: white;
      font-family: 'Poppins', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .close-btn {
      position: absolute;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      background: rgba(255, 255, 255, 0.15);
      color: #FFFFFF;
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      cursor: pointer;
      transition: all 0.3s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2;

      &:hover {
        background: rgba(255, 255, 255, 0.25);
        transform: translateY(-50%) scale(1.1);
      }

      mat-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
        line-height: 20px;
      }
    }

    /* CONTENT */
    .dialog-content {
      padding: 28px;
      max-height: 60vh;
      overflow-y: auto;
      overflow-x: hidden;
      background: white;
      margin: 0;
      border: none;

      /* Scrollbar personalizzata */
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

        &:hover {
          background: #4FC3F7;
        }
      }
    }

    .faq-item {
      margin-bottom: 24px;
      padding-bottom: 20px;
      border-bottom: 1px solid #E5E7EB;
      width: 100%;
      max-width: 100%;
      box-sizing: border-box;

      &:last-child {
        border-bottom: none;
        margin-bottom: 0;
      }

      h3 {
        color: #0A3D91;
        font-weight: 600;
        font-size: 1rem;
        margin: 0 0 12px 0;
        line-height: 1.4;
        text-align: left;
        word-break: break-word;
        overflow-wrap: anywhere;
        hyphens: auto;
      }

      p {
        color: #6B7280;
        font-size: 0.85rem;
        margin: 0 0 12px 0;
        line-height: 1.6;
        text-align: justify;
        word-break: break-word;
        overflow-wrap: anywhere;
        hyphens: auto;
        max-width: 100%;
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .dialog-header {
        padding: 16px 20px;
        min-height: 60px;
      }

      .faq-icon {
        font-size: 24px;
        width: 24px;
        height: 24px;
      }

      .dialog-title {
        font-size: 1.1rem;
      }

      .close-btn {
        right: 16px;
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 20px;
          width: 20px;
          height: 20px;
          line-height: 20px;
        }
      }

      .dialog-content {
        padding: 16px 20px;
        box-sizing: border-box;
        overflow-x: hidden;

        .faq-item {
          margin-bottom: 20px;
          padding-bottom: 16px;

          h3 {
            font-size: 0.95rem;
            margin-bottom: 10px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p {
            font-size: 0.8rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .dialog-header {
        padding: 12px 16px;
        min-height: 55px;
      }

      .faq-icon {
        font-size: 20px;
        width: 20px;
        height: 20px;
      }

      .dialog-title {
        font-size: 1rem;
      }

      .close-btn {
        right: 12px;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;

        mat-icon {
          font-size: 18px;
          width: 18px;
          height: 18px;
          line-height: 18px;
        }
      }

      .dialog-content {
        padding: 16px;
        max-height: 50vh;

        .faq-item {
          margin-bottom: 16px;
          padding-bottom: 12px;

          h3 {
            font-size: 0.9rem;
            margin-bottom: 8px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p {
            font-size: 0.75rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }
        }
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
