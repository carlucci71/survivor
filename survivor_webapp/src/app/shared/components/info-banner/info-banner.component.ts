import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

// MODAL REGOLAMENTO (stesso del footer)
@Component({
  selector: 'app-regolamento-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="regolamento-dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Regolamento Survivor</h2>
        <button mat-icon-button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <div class="regola">
          <h3>1. Scelta settimanale</h3>
          <p>Ogni giocatore può scegliere una sola squadra per ogni giornata di gioco. La possibilità di rendere la scelta pubblica o privata sarà disponibile esclusivamente tramite app. Nella versione attuale del gioco tutte le scelte sono pubbliche e visibili agli altri partecipanti fin dal momento della conferma.</p>
        </div>

        <div class="regola">
          <h3>2. Squadre non ripetibili</h3>
          <p>Nel corso dello stesso torneo non è possibile scegliere due volte la stessa squadra, anche in giornate diverse.</p>
        </div>

        <div class="regola">
          <h3>3. Eliminazione</h3>
          <p>Se la squadra scelta perde o pareggia la propria partita, il giocatore viene eliminato dal torneo.</p>
        </div>

        <div class="regola">
          <h3>4. Durata del torneo</h3>
          <p>Il torneo termina quando:</p>
          <ul>
            <li>resta un solo giocatore attivo, che viene dichiarato vincitore;</li>
            <li>vengono completate 10 giornate di gioco valide.</li>
          </ul>
          <p>In caso di termine per limite di giornate, il montepremi viene diviso in parti uguali tra i giocatori rimasti attivi.</p>
        </div>

        <div class="regola">
          <h3>5. Tempistiche di scelta</h3>
          <p>Le scelte devono essere effettuate entro 15 minuti prima dell'inizio della giornata di Serie A. Dopo l'inizio della prima partita della giornata, nessuna scelta può essere modificata.</p>
        </div>

        <div class="regola">
          <h3>6. Calendario</h3>
          <p>Le giornate di gioco fanno riferimento esclusivamente al calendario ufficiale della Serie A.</p>
        </div>

        <div class="regola">
          <h3>7. Eliminazione totale ed equità del montepremi</h3>
          <p>Se, al termine di una giornata valida, tutti i giocatori rimasti perdono o pareggiano, il torneo termina immediatamente. In questo caso, il montepremi viene diviso in parti uguali tra i giocatori rimasti in gioco in quella giornata.</p>
          <p>Il montepremi è generato esclusivamente dai partecipanti del torneo e non può essere assegnato a giocatori esterni o subentranti, al fine di garantire la parità di condizioni.</p>
        </div>

        <div class="regola">
          <h3>8. Divisione anticipata del montepremi</h3>
          <p>Quando il numero di giocatori rimasti è pari o inferiore al 10% dei partecipanti iniziali, i giocatori attivi possono decidere di dividere anticipatamente l'intero montepremi in parti uguali. La decisione avviene tramite votazione a maggioranza.</p>
          <p><strong>Esempio:</strong> Torneo con 72 iscritti → 10% = 7 giocatori. Se restano 7 o meno giocatori, è possibile votare la divisione del montepremi.</p>
          <p>Se i giocatori rimasti (≤10%) rimangono gli stessi per tre giornate consecutive senza alcuna eliminazione, il montepremi viene automaticamente diviso tra di loro.</p>
        </div>

        <div class="regola">
          <h3>9. Giornate con partite rinviate o sospese</h3>
          <h4>9.1 Rinvio prima dell'inizio della giornata</h4>
          <p>Se una o più partite di Serie A vengono rinviate prima dell'inizio della giornata:</p>
          <ul>
            <li>la giornata viene considerata neutra ai fini del Survivor;</li>
            <li>nessun giocatore è tenuto a effettuare una scelta;</li>
            <li>nessun giocatore viene eliminato;</li>
            <li>la giornata non viene conteggiata nel totale delle giornate del torneo.</li>
          </ul>

          <h4>9.2 Rinvio o sospensione dopo l'inizio della giornata</h4>
          <p>Se una o più partite vengono rinviate o sospese a giornata iniziata:</p>
          <ul>
            <li>i giocatori che hanno scelto una squadra coinvolta nel rinvio restano attivi;</li>
            <li>la loro scelta viene considerata come vincente;</li>
            <li>la squadra scelta viene comunque considerata utilizzata.</li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .regolamento-dialog {
      width: 90vw;
      max-width: 100vw;
      max-height: 90vh;
      background: #FFFFFF;
      border-radius: 0;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0;
      position: relative;
      overflow: hidden;
      box-sizing: border-box;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      flex-shrink: 0;
      position: relative;
      box-sizing: border-box;

      .dialog-title {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 700;
        text-transform: uppercase;
        letter-spacing: 0.3px;
        text-align: center;
        flex: 1;
        line-height: 1.2;
      }

      .close-btn {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.05);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .dialog-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      line-height: 1.6;
      box-sizing: border-box;
      width: 100%;
      max-width: 100%;
      margin: 0 auto;
      text-align: left;
      word-wrap: break-word;
      overflow-wrap: break-word;
      hyphens: auto;

      /* Scrollbar */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F8F9FA;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #C1C9D2;
        border-radius: 3px;

        &:hover {
          background: #4FC3F7;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #C1C9D2 #F8F9FA;

      .regola {
        margin: 0 0 24px 0;
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

        h4 {
          color: #4FC3F7;
          font-weight: 600;
          font-size: 0.9rem;
          margin: 16px 0 10px 0;
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

        ul {
          margin: 10px 0 12px 0;
          padding-left: 20px;
          padding-right: 0;
          color: #6B7280;
          width: 100%;
          max-width: 100%;
          box-sizing: border-box;

          li {
            font-size: 0.85rem;
            margin-bottom: 8px;
            line-height: 1.6;
            text-align: justify;
            word-break: break-word;
            overflow-wrap: anywhere;
            hyphens: auto;
            max-width: 100%;
          }
        }

        strong {
          color: #0A3D91;
          font-weight: 600;
          word-break: break-word;
          overflow-wrap: anywhere;
        }
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 100vw;
        border-radius: 0;
        margin: 0;
        box-sizing: border-box;
      }

      .dialog-header {
        padding: 16px 20px;
        box-sizing: border-box;

        .dialog-title {
          font-size: 1rem;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .close-btn {
          width: 28px;
          height: 28px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .dialog-content {
        padding: 16px 20px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 20px;
          padding-bottom: 16px;

          h3 {
            font-size: 0.95rem;
            margin-bottom: 10px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          h4 {
            font-size: 0.85rem;
            margin: 12px 0 8px 0;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p, li {
            font-size: 0.8rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          ul {
            padding-left: 18px;
            margin: 8px 0 10px 0;

            li {
              margin-bottom: 6px;
            }
          }
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .regolamento-dialog {
        width: 90vw;
        max-width: 100vw;
        max-height: 100vh;
        margin: 0;
        border-radius: 0;
        box-sizing: border-box;
      }

      .dialog-header {
        padding: 12px 16px;
        box-sizing: border-box;

        .dialog-title {
          font-size: 0.95rem;
          letter-spacing: 0.1px;
          word-break: break-word;
          overflow-wrap: anywhere;
        }

        .close-btn {
          right: 12px;
          width: 26px;
          height: 26px;

          mat-icon {
            font-size: 12px;
            width: 12px;
            height: 12px;
          }
        }
      }

      .dialog-content {
        padding: 12px 16px;
        box-sizing: border-box;
        overflow-x: hidden;

        .regola {
          margin-bottom: 16px;
          padding-bottom: 12px;

          h3 {
            font-size: 0.9rem;
            margin-bottom: 8px;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          h4 {
            font-size: 0.8rem;
            margin: 10px 0 6px 0;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          p, li {
            font-size: 0.75rem;
            line-height: 1.5;
            word-break: break-word;
            overflow-wrap: anywhere;
          }

          ul {
            padding-left: 16px;
            margin: 6px 0 8px 0;

            li {
              margin-bottom: 5px;
            }
          }
        }
      }
    }
  `]
})
export class RegolamentoBannerDialogComponent {
  constructor(private dialog: MatDialog) {}

  closeDialog() {
    this.dialog.closeAll();
  }
}

// MODAL ALBO D'ORO
@Component({
  selector: 'app-albo-oro-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="albo-oro-dialog">
      <div class="dialog-header">
        <div class="header-content">
          <mat-icon class="trophy-icon">emoji_events</mat-icon>
          <h2 class="dialog-title">I MIEI TROFEI</h2>
        </div>
        <button mat-icon-button class="close-btn" (click)="closeDialog()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <div class="dialog-content">
        <!-- Messaggio simpatico se non ci sono trofei -->
        <div class="empty-state" *ngIf="!hasTrofei">
          <div class="empty-emoji">{{ currentEmoji }}</div>
          <p class="empty-message">{{ currentMessage }}</p>
          <p class="empty-subtitle">{{ currentSubtitle }}</p>
        </div>

        <!-- Lista trofei personali -->
        <div class="winner-card" *ngIf="hasTrofei">
          <div class="season">
            <h3>🏆 Stagione 2024-2025</h3>
            <div class="winner-info">
              <div class="winner-name">1° Classificato</div>
              <div class="winner-details">
                <span class="detail">Giornate Sopravvissute: 8</span>
                <span class="detail">Squadra Finale: Napoli</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Statistiche personali - solo se ci sono dati -->
        <div class="stats-section" *ngIf="hasTrofei">
          <h3>📊 LE TUE STATISTICHE</h3>
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-number">5</span>
              <span class="stat-label">Tornei Giocati</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">2</span>
              <span class="stat-label">Vittorie</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">35</span>
              <span class="stat-label">Giornate Totali</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">78%</span>
              <span class="stat-label">% Successo</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .albo-oro-dialog {
      width: 90vw;
      max-width: 700px;
      max-height: 85vh;
      background: #FFFFFF;
      border-radius: 16px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      font-family: 'Poppins', sans-serif;
      display: flex;
      flex-direction: column;
      margin: 0 auto;
      overflow: hidden;
    }

    .dialog-header {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: #FFFFFF;
      position: relative;
      flex-shrink: 0;

      .header-content {
        display: flex;
        align-items: center;
        gap: 15px;
        justify-content: center;
        flex: 1;

        .trophy-icon {
          font-size: 2rem;
          width: 2rem;
          height: 2rem;
          color: #FFFFFF;
        }

        .dialog-title {
          margin: 0;
          font-size: 1.4rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          text-align: center;
        }
      }

      .close-btn {
        position: absolute;
        right: 16px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(255, 255, 255, 0.15);
        color: #FFFFFF;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: none;
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.25);
          transform: translateY(-50%) scale(1.05);
        }

        mat-icon {
          font-size: 16px;
          width: 16px;
          height: 16px;
        }
      }
    }

    .dialog-content {
      flex: 1;
      padding: 20px;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
      width: 100%;

      /* Scrollbar personalizzata */
      &::-webkit-scrollbar {
        width: 6px;
      }

      &::-webkit-scrollbar-track {
        background: #F8F9FA;
        border-radius: 3px;
      }

      &::-webkit-scrollbar-thumb {
        background: #C1C9D2;
        border-radius: 3px;

        &:hover {
          background: #FFD700;
        }
      }

      scrollbar-width: thin;
      scrollbar-color: #C1C9D2 #F8F9FA;

      /* Stato vuoto - nessun trofeo con messaggi simpatici */
      .empty-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 40px 20px;
        text-align: center;

        .empty-emoji {
          font-size: 4rem;
          margin-bottom: 16px;
          animation: bounce 2s ease-in-out infinite;
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .empty-message {
          font-size: 1.15rem;
          font-weight: 700;
          color: #0A3D91;
          margin: 0 0 12px 0;
          line-height: 1.4;
        }

        .empty-subtitle {
          font-size: 0.95rem;
          color: #6B7280;
          margin: 0;
          font-style: italic;
        }
      }

      .winner-card {
        background: #F8F9FA;
        border-radius: 12px;
        padding: 16px;
        margin: 0 auto 16px auto;
        border-left: 4px solid #FFD700;
        max-width: 100%;
        box-sizing: border-box;

        .season {
          width: 100%;

          h3 {
            color: #0A3D91;
            font-weight: 600;
            font-size: 1rem;
            margin: 0 0 12px 0;
            text-align: center;
            word-break: break-word;
          }

          .winner-info {
            text-align: center;

            .winner-name {
              font-size: 0.95rem;
              font-weight: 700;
              color: #0A3D91;
              margin-bottom: 10px;
              word-break: break-word;
            }

            .winner-details {
              display: flex;
              flex-direction: column;
              gap: 4px;
              align-items: center;

              .detail {
                color: #6B7280;
                font-size: 0.8rem;
                font-weight: 500;
                word-break: break-word;
              }
            }
          }
        }
      }

      .stats-section {
        margin: 20px auto 0 auto;
        padding: 16px;
        background: linear-gradient(135deg, #F8F9FA, #FFFFFF);
        border-radius: 12px;
        border: 1px solid #E0E0E0;
        max-width: 100%;
        box-sizing: border-box;

        h3 {
          color: #0A3D91;
          font-weight: 600;
          font-size: 0.95rem;
          margin: 0 0 16px 0;
          text-align: center;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
          gap: 12px;
          max-width: 100%;

          .stat-item {
            text-align: center;
            padding: 12px 8px;
            background: #FFFFFF;
            border-radius: 8px;
            border: 1px solid #E0E0E0;
            box-sizing: border-box;

            .stat-number {
              display: block;
              font-size: 1.3rem;
              font-weight: 700;
              color: #FFD700;
              margin-bottom: 4px;
              word-break: break-word;
            }

            .stat-label {
              color: #6B7280;
              font-size: 0.7rem;
              font-weight: 500;
              word-break: break-word;
              line-height: 1.2;
            }
          }
        }
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .albo-oro-dialog {
        width: 90vw;
        max-width: 95vw;
      }

      .dialog-header {
        padding: 18px;

        .header-content {
          .trophy-icon {
            font-size: 1.7rem;
            width: 1.7rem;
            height: 1.7rem;
          }

          .dialog-title {
            font-size: 1.2rem;
          }
        }

        .close-btn {
          right: 16px;
          width: 30px;
          height: 30px;

          mat-icon {
            font-size: 16px;
            width: 16px;
            height: 16px;
          }
        }
      }

      .dialog-content {
        padding: 16px;

        .winner-card {
          padding: 14px;
          margin-bottom: 14px;

          .season h3 {
            font-size: 0.9rem;
            margin-bottom: 10px;
          }

          .winner-info {
            .winner-name {
              font-size: 0.85rem;
            }

            .winner-details .detail {
              font-size: 0.75rem;
            }
          }
        }

        .stats-section {
          margin-top: 16px;
          padding: 14px;

          h3 {
            font-size: 0.85rem;
            margin-bottom: 12px;
          }

          .stats-grid {
            gap: 10px;

            .stat-item {
              padding: 10px 6px;

              .stat-number {
                font-size: 1.1rem;
              }

              .stat-label {
                font-size: 0.65rem;
              }
            }
          }
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .albo-oro-dialog {
        width: 90vw;
        max-width: 98vw;
        max-height: 95vh;
      }

      .dialog-header {
        padding: 16px;

        .header-content {
          .trophy-icon {
            font-size: 1.5rem;
            width: 1.5rem;
            height: 1.5rem;
          }

          .dialog-title {
            font-size: 1.1rem;
            letter-spacing: 0.3px;
          }
        }

        .close-btn {
          right: 14px;
          width: 28px;
          height: 28px;

          mat-icon {
            font-size: 14px;
            width: 14px;
            height: 14px;
          }
        }
      }

      .dialog-content {
        padding: 12px;

        .winner-card {
          padding: 12px;
          margin-bottom: 12px;

          .season h3 {
            font-size: 0.8rem;
            margin-bottom: 8px;
          }

          .winner-info {
            .winner-name {
              font-size: 0.75rem;
              margin-bottom: 8px;
            }

            .winner-details .detail {
              font-size: 0.7rem;
            }
          }
        }

        .stats-section {
          margin-top: 12px;
          padding: 12px;

          h3 {
            font-size: 0.75rem;
            margin-bottom: 10px;
          }

          .stats-grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;

            .stat-item {
              padding: 8px 4px;

              .stat-number {
                font-size: 1rem;
              }

              .stat-label {
                font-size: 0.6rem;
              }
            }
          }
        }
      }
    }
  `]
})
export class AlboOroDialogComponent {
  // TODO: Collegare ai dati reali dell'utente dal backend
  hasTrofei = false; // Imposta a true quando ci sono dati dal DB

  // Messaggi simpatici per quando non ci sono trofei
  private funnyMessages = [
    {
      emoji: '😅',
      message: 'Sei proprio scarso! Non sei sopravvissuto neanche una volta!',
      subtitle: 'Ma tranquillo, anche i campioni hanno iniziato così... o forse no.'
    },
    {
      emoji: '🤦',
      message: 'Houston, abbiamo un problema: zero vittorie!',
      subtitle: 'Il tuo palmares è più vuoto del frigorifero di uno studente.'
    },
    {
      emoji: '😭',
      message: 'La bacheca dei trofei piange dalla solitudine!',
      subtitle: 'Polvere e ragnatele sono gli unici inquilini qui.'
    },
    {
      emoji: '🦗',
      message: 'Cri cri cri... senti i grilli?',
      subtitle: 'È il suono della tua bacheca trofei completamente vuota.'
    },
    {
      emoji: '🎰',
      message: 'Forse dovresti provare a giocare al lotto!',
      subtitle: 'Con la fortuna che hai nel Survivor, magari lì va meglio.'
    },
    {
      emoji: '🐢',
      message: 'Piano piano si arriva... ma tu sei ancora fermo!',
      subtitle: 'Anche la tartaruga ti sta battendo in questo momento.'
    },
    {
      emoji: '📭',
      message: 'La tua casella trofei dice: "Destinatario sconosciuto"',
      subtitle: 'Nessuna vittoria è mai arrivata a questo indirizzo.'
    },
    {
      emoji: '🌵',
      message: 'Qui è più secco del deserto del Sahara!',
      subtitle: 'Neanche una goccia di vittoria in vista.'
    },
    {
      emoji: '👻',
      message: 'I tuoi trofei sono come i fantasmi: nessuno li ha mai visti!',
      subtitle: 'Leggenda narra che un giorno arriveranno... leggenda.'
    },
    {
      emoji: '🥶',
      message: 'Qui fa più freddo che in Siberia!',
      subtitle: 'La tua bacheca è congelata dal gelo delle zero vittorie.'
    },
    {
      emoji: '🔍',
      message: 'Cercasi trofei disperatamente!',
      subtitle: 'Ricompensa: la tua dignità di giocatore.'
    },
    {
      emoji: '🪦',
      message: 'R.I.P. alle tue speranze di vittoria!',
      subtitle: 'Qui giace chi pensava di vincere almeno una volta.'
    },
    {
      emoji: '🤡',
      message: 'Il pagliaccio del torneo sei tu!',
      subtitle: 'Ma almeno fai ridere gli altri partecipanti.'
    },
    {
      emoji: '🧹',
      message: 'Hai fatto piazza pulita... di te stesso!',
      subtitle: 'Eliminato sempre, vincitore mai. Che record!'
    },
    {
      emoji: '🐌',
      message: 'Anche una lumaca sarebbe arrivata prima di te!',
      subtitle: 'E probabilmente avrebbe anche vinto qualcosa.'
    },
    {
      emoji: '🎪',
      message: 'Benvenuto al circo delle eliminazioni!',
      subtitle: 'Tu sei l\'attrazione principale: sempre fuori al primo colpo!'
    },
    {
      emoji: '🧊',
      message: 'Le tue vittorie sono in freezer... dal 1800!',
      subtitle: 'Surgelate così bene che non le troverà mai nessuno.'
    },
    {
      emoji: '🦴',
      message: 'Neanche un osso di vittoria da rosicchiare!',
      subtitle: 'Il tuo cane avrebbe più fortuna di te.'
    }
  ];

  currentEmoji = '';
  currentMessage = '';
  currentSubtitle = '';

  constructor(private dialog: MatDialog) {
    this.pickRandomMessage();
  }

  private pickRandomMessage() {
    const randomIndex = Math.floor(Math.random() * this.funnyMessages.length);
    const selected = this.funnyMessages[randomIndex];
    this.currentEmoji = selected.emoji;
    this.currentMessage = selected.message;
    this.currentSubtitle = selected.subtitle;
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}

// MODAL PROFILO UTENTE
@Component({
  selector: 'app-profilo-dialog',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, FormsModule],
  template: `
    <div class="modal-container">
      <!-- CLOSE BUTTON -->
      <button mat-icon-button class="close-btn" (click)="closeDialog()">
        <mat-icon>close</mat-icon>
      </button>

      <!-- TITLE -->
      <h2>
        <mat-icon class="title-icon">account_circle</mat-icon>
        <span class="value">Il Tuo Profilo</span>
      </h2>


      <!-- FORM FIELDS -->
      <div class="form-section">
        <div class="info-row">
          <div class="label">Nickname:</div>
          <div class="value">
            <input type="text"
              placeholder="Il tuo nickname"
              [(ngModel)]="userProfile.nickname"
              name="nickname"
              class="custom-input"
              required>
          </div>
        </div>

        <div class="info-row">
          <div class="label">Età:</div>
          <div class="value">
            <input type="number"
              placeholder="La tua età"
              [(ngModel)]="userProfile.eta"
              name="eta"
              class="custom-input"
              min="16"
              max="100">
          </div>
        </div>

        <div class="info-row">
          <div class="label">Città:</div>
          <div class="value">
            <input type="text"
              placeholder="La tua città"
              [(ngModel)]="userProfile.citta"
              name="citta"
              class="custom-input">
          </div>
        </div>

        <div class="info-row">
          <div class="label">Squadra del cuore:</div>
          <div class="value">
            <select [(ngModel)]="userProfile.squadraPreferita"
              name="squadra"
              class="custom-select">
              <option value="">Seleziona squadra</option>
              <option *ngFor="let squadra of squadreSerieA" [value]="squadra">
                {{ squadra }}
              </option>
            </select>
          </div>
        </div>
      </div>

      <!-- BUTTONS -->
      <div class="actions-section">
        <button type="button"
          class="btn-secondary"
          (click)="closeDialog()">
          Annulla
        </button>
        <button type="submit"
          class="btn-primary"
          [disabled]="!isFormValid()"
          (click)="onSubmit()">
          Salva Profilo
        </button>
      </div>
    </div>
  `,
  styles: [`
    /* CONTAINER PRINCIPALE - STESSO STILE DEL MODAL GIOCA ORA */
    .modal-container {
      position: relative;
      background: #FFFFFF;
      border-radius: 20px;
      box-shadow: 0 16px 64px rgba(10, 61, 145, 0.25);
      padding: 20px 24px;
      width: 85vw;
      max-width: 600px;
      max-height: 85vh;
      overflow-y: auto;
      overflow-x: hidden;
      z-index: 10000;
      font-family: 'Poppins', sans-serif;
      margin: 0 auto;

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

    /* CLOSE BUTTON - X CENTRATA */
    .close-btn {
      position: absolute;
      top: 12px;
      right: 12px;
      z-index: 10;
      width: 32px;
      height: 32px;
      background: rgba(10, 61, 145, 0.08);
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      border: none;
      cursor: pointer;

      mat-icon {
        color: #0A3D91;
        font-size: 16px;
        width: 16px;
        height: 16px;
        line-height: 16px;
      }

      &:hover {
        background: rgba(10, 61, 145, 0.15);
        transform: scale(1.1);
      }
    }

    /* TITOLO H2 */
    h2 {
      margin: 0 0 20px 0;
      font-size: 1.3rem;
      font-weight: 700;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      padding-right: 40px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      display: flex;
      align-items: center;
      gap: 12px;

      .title-icon {
        font-size: 1.5rem;
        width: 1.5rem;
        height: 1.5rem;
        color: #4FC3F7;
      }

      .value {
        background: linear-gradient(135deg, #0A3D91, #4FC3F7);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }

    /* INFO ROWS - OTTIMIZZATE PER LAYOUT VERTICALE SENZA SCROLL ORIZZONTALE */
    .info-row {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-bottom: 16px;
      padding: 16px;
      background: transparent;
      border-radius: 12px;
      border: 1px solid rgba(10, 61, 145, 0.08);
      font-size: 0.95rem;
      width: 100%;
      box-sizing: border-box;

      .label {
        font-weight: 600;
        color: #0A3D91;
        font-size: 0.9rem;
        margin-bottom: 4px;
      }

      .value {
        font-weight: 500;
        color: #6B7280;
        width: 100%;
        box-sizing: border-box;
      }
    }

    /* INPUT E SELECT PERSONALIZZATI */
    .custom-input,
    .custom-select {
      width: 100%;
      padding: 10px 12px;
      border-radius: 12px;
      background: #F4F6F8;
      border: 2px solid #E0E0E0;
      transition: all 0.3s ease;
      font-weight: 500;
      color: #0A3D91;
      font-family: 'Poppins', sans-serif;
      font-size: 0.9rem;
      box-sizing: border-box;

      &:focus {
        border-color: #0A3D91;
        background: #FFFFFF;
        box-shadow: 0 0 0 3px rgba(10, 61, 145, 0.08);
        outline: none;
      }

      &::placeholder {
        color: #9CA3AF;
        font-weight: 400;
      }
    }

    .custom-select {
      cursor: pointer;
      appearance: none;
      background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230A3D91' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
      background-repeat: no-repeat;
      background-position: right 12px center;
      background-size: 16px;
      padding-right: 40px;
    }

    /* ACTIONS SECTION */
    .actions-section {
      display: flex;
      gap: 12px;
      margin-top: 24px;
      padding-top: 20px;
      border-top: 1px solid rgba(10, 61, 145, 0.08);
      justify-content: flex-end;
      width: 100%;
      box-sizing: border-box;
    }

    .btn-primary,
    .btn-secondary {
      font-family: 'Poppins', sans-serif;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 12px 20px;
      border-radius: 12px;
      transition: all 0.3s ease;
      border: 2px solid;
      cursor: pointer;
      font-size: 0.9rem;
      min-width: 100px;
    }

    .btn-secondary {
      background: transparent;
      color: #6B7280;
      border-color: #E0E0E0;

      &:hover {
        background: #F8F9FA;
        border-color: #4FC3F7;
        color: #4FC3F7;
        transform: translateY(-1px);
      }
    }

    .btn-primary {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #FFFFFF;
      border-color: transparent;

      &:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 6px 20px rgba(10, 61, 145, 0.25);
      }

      &:disabled {
        opacity: 0.5;
        background: #E0E0E0;
        color: #9CA3AF;
        cursor: not-allowed;
        transform: none;
      }
    }

    /* RESPONSIVE TABLET */
    @media (max-width: 768px) {
      .modal-container {
        width: 95vw;
        max-width: 95vw;
        padding: 16px;
        box-sizing: border-box;
      }

      h2 {
        font-size: 1.2rem;

        .title-icon {
          font-size: 1.3rem;
          width: 1.3rem;
          height: 1.3rem;
        }
      }

      .info-row {
        padding: 12px;
        margin-bottom: 14px;

        .label {
          font-size: 0.85rem;
        }

        .value {
          width: 100%;
        }
      }

      .custom-input,
      .custom-select {
        padding: 10px;
        font-size: 0.85rem;
      }

      .custom-select {
        background-size: 14px;
        padding-right: 35px;
      }

      .actions-section {
        flex-direction: column;

        .btn-primary,
        .btn-secondary {
          width: 100%;
          min-width: auto;
        }
      }
    }

    /* RESPONSIVE MOBILE */
    @media (max-width: 480px) {
      .modal-container {
        width: 90vw;
        max-width: 100vw;
        padding: 16px;
        margin: 0;
        border-radius: 0;
        box-sizing: border-box;
      }

      h2 {
        font-size: 1.1rem;
        padding-right: 35px;

        .title-icon {
          font-size: 1.2rem;
          width: 1.2rem;
          height: 1.2rem;
        }
      }

      .close-btn {
        width: 28px;
        height: 28px;
        top: 10px;
        right: 10px;

        mat-icon {
          font-size: 14px;
          width: 14px;
          height: 14px;
        }
      }

      .info-row {
        padding: 10px;
        margin-bottom: 12px;

        .label {
          font-size: 0.8rem;
        }
      }

      .custom-input,
      .custom-select {
        padding: 10px;
        font-size: 0.8rem;
      }

      .custom-select {
        background-size: 14px;
        padding-right: 35px;
      }

      .actions-section {
        margin-top: 20px;
        padding-top: 16px;

        .btn-primary,
        .btn-secondary {
          padding: 10px 16px;
          font-size: 0.85rem;
        }
      }
    }

    @media (max-width: 360px) {
      .modal-container {
        padding: 12px;
      }

      h2 {
        font-size: 1rem;
      }

      .info-row {
        padding: 8px;
        margin-bottom: 10px;

        .label {
          font-size: 0.75rem;
        }
      }

      .custom-input,
      .custom-select {
        padding: 8px;
        font-size: 0.75rem;
      }

      .actions-section {
        gap: 8px;

        .btn-primary,
        .btn-secondary {
          padding: 8px 12px;
          font-size: 0.8rem;
        }
      }
    }
  `]
})
export class ProfiloDialogComponent {
  userProfile = {
    nickname: '',
    eta: null as number | null,
    citta: '',
    squadraPreferita: ''
  };

  squadreSerieA = [
    'Atalanta', 'Bologna', 'Cagliari', 'Como', 'Empoli', 'Fiorentina',
    'Genoa', 'Hellas Verona', 'Inter', 'Juventus', 'Lazio', 'Lecce',
    'Milan', 'Monza', 'Napoli', 'Parma', 'Roma', 'Torino', 'Udinese', 'Venezia'
  ];

  constructor(private dialog: MatDialog) {}


  isFormValid(): boolean {
    return !!(this.userProfile.nickname && this.userProfile.nickname.trim().length > 0);
  }

  onSubmit() {
    if (this.isFormValid()) {
      console.log('Profilo da salvare:', this.userProfile);
      // TODO: Implementare il salvataggio del profilo
      this.closeDialog();
    }
  }

  closeDialog() {
    this.dialog.closeAll();
  }
}

// COMPONENTE BANNER PRINCIPALE
@Component({
  selector: 'app-info-banner',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, MatDialogModule],
  template: `
    <div class="info-banner">
      <div class="banner-container">
        <button class="banner-item" (click)="openRegolamento()">
          <mat-icon class="banner-icon">article</mat-icon>
          <span class="banner-text">REGOLE</span>
        </button>

        <button class="banner-item" (click)="openAlboOro()">
          <mat-icon class="banner-icon trophy">emoji_events</mat-icon>
          <span class="banner-text">TROFEI</span>
        </button>

        <button class="banner-item" (click)="openProfilo()">
          <mat-icon class="banner-icon">person</mat-icon>
          <span class="banner-text">PROFILO</span>
        </button>
      </div>
    </div>
  `,
  styles: [`
    .info-banner {
      background: #FFFFFF;
      border-bottom: 1px solid #E0E0E0;
      padding: 12px 20px;
      font-family: 'Poppins', sans-serif;
    }

    .banner-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 20px;
      flex-wrap: nowrap;
      width: 100%;
    }

    .banner-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 10px 20px;
      background: #FFFFFF;
      border-radius: 12px;
      box-shadow: 0 2px 6px rgba(10, 61, 145, 0.08);
      border: 1px solid #E0E0E0;
      cursor: pointer;
      transition: all 0.3s ease;
      height: 44px;
      flex: 1;
      justify-content: center;
      min-width: 0;
      font: inherit;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 4px 12px rgba(10, 61, 145, 0.15);
        border-color: #4FC3F7;

        .banner-icon {
          transform: scale(1.1);
          color: #0A3D91;

          &.trophy {
            color: #FFD700;
          }
        }

        .banner-text {
          color: #0A3D91;
        }
      }

      .banner-icon {
        font-size: 1.3rem;
        width: 1.3rem;
        height: 1.3rem;
        color: #4FC3F7;
        transition: all 0.3s ease;
        flex-shrink: 0;

        &.trophy {
          color: #FFA500;
        }
      }

      .banner-text {
        color: #6B7280;
        font-weight: 500;
        font-size: 0.8rem;
        text-transform: uppercase;
        letter-spacing: 0.4px;
        transition: all 0.3s ease;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        max-width: 100%;
      }
    }

    @media (max-width: 768px) {
      .info-banner {
        padding: 10px 16px;
      }

      .banner-container {
        gap: 16px;
        justify-content: space-between;
      }

      .banner-item {
        padding: 8px 10px;
        height: 38px;

        .banner-icon {
          font-size: 1.1rem;
          width: 1.1rem;
          height: 1.1rem;
        }

        .banner-text {
          font-size: 0.7rem;
          letter-spacing: 0.2px;
        }
      }
    }

    @media (max-width: 480px) {
      .banner-container {
        gap: 12px;
        padding: 0 8px;
      }

      .banner-item {
        padding: 6px 8px;
        flex: 1;
        justify-content: center;

        .banner-text {
          font-size: 0.6rem;
          letter-spacing: 0.2px;
        }

        .banner-icon {
          font-size: 1rem;
          width: 1rem;
          height: 1rem;
        }
      }
    }

    @media (max-width: 360px) {
      .info-banner {
        padding: 8px 12px;
      }

      .banner-container {
        gap: 8px;
      }

      .banner-item {
        padding: 5px 6px;
        gap: 4px;

        .banner-text {
          font-size: 0.55rem;
          letter-spacing: 0.1px;
        }

        .banner-icon {
          font-size: 0.9rem;
          width: 0.9rem;
          height: 0.9rem;
        }
      }
    }
  `]
})
export class InfoBannerComponent {
  constructor(private dialog: MatDialog) {}

  openRegolamento() {
    this.dialog.open(RegolamentoBannerDialogComponent, {
      width: '90vw',
      maxWidth: '800px',
      maxHeight: '85vh',
      panelClass: 'regolamento-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }

  openAlboOro() {
    this.dialog.open(AlboOroDialogComponent, {
      width: '90vw',
      maxWidth: '700px',
      maxHeight: '85vh',
      panelClass: 'albo-oro-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }

  openProfilo() {
    this.dialog.open(ProfiloDialogComponent, {
      width: '90vw',
      maxWidth: '600px',
      maxHeight: '85vh',
      panelClass: 'profilo-dialog-container',
      autoFocus: false,
      restoreFocus: false
    });
  }
}
