import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-guida',
  standalone: true,
  imports: [CommonModule, HeaderComponent],
  template: `
    <div class="guida-page">
      <app-header
        title="Guida"
        visHome="S"
        (back)="goBack()"
        [hideActions]="false"
      ></app-header>

      <div class="guida-layout">
        <!-- SIDEBAR desktop -->
        <nav class="guida-nav" [class.open]="sidebarOpen">
          <div class="nav-header">
            <div class="nav-logo">SURVIVOR</div>
            <div class="nav-tagline">Guida utente completa</div>
          </div>

          <div class="nav-section">Introduzione</div>
          <ul>
            <li><a (click)="scrollTo('intro')"><span class="nav-num">0</span> Cos'è Survivor</a></li>
          </ul>

          <div class="nav-section">First Steps</div>
          <ul>
            <li><a (click)="scrollTo('login')"><span class="nav-num">1</span> Registrazione e Login</a></li>
            <li><a (click)="scrollTo('home-section')"><span class="nav-num">2</span> La Home</a></li>
            <li><a (click)="scrollTo('join')"><span class="nav-num">3</span> Entrare in una lega</a></li>
          </ul>

          <div class="nav-section">Come si gioca</div>
          <ul>
            <li><a (click)="scrollTo('giocata')"><span class="nav-num">4</span> Fare la giocata</a></li>
            <li><a (click)="scrollTo('recap')"><span class="nav-num">5</span> Recap e risultati</a></li>
            <li><a (click)="scrollTo('classifica')"><span class="nav-num">6</span> Classifica e trofei</a></li>
          </ul>

          <div class="nav-section">Avanzato</div>
          <ul>
            <li><a (click)="scrollTo('crea')"><span class="nav-num">7</span> Creare una lega</a></li>
            <li><a (click)="scrollTo('tips')"><span class="nav-num">8</span> Consigli generali</a></li>
            <li><a (click)="scrollTo('faq')"><span class="nav-num">9</span> FAQ</a></li>
          </ul>
        </nav>

        <!-- Overlay mobile per chiudere sidebar -->
        <div class="nav-overlay" *ngIf="sidebarOpen" (click)="sidebarOpen = false"></div>

        <!-- MAIN CONTENT -->
        <main class="guida-main">

          <!-- FAB menu mobile -->
          <button class="menu-fab" (click)="sidebarOpen = !sidebarOpen" aria-label="Menu">
            <span class="material-icons">menu_book</span>
          </button>

          <!-- HERO -->
          <div class="hero">
            <div class="hero-badge">
              <span class="material-icons" style="font-size:13px">menu_book</span>
              Guida Ufficiale
            </div>
            <h1>SURVIVOR</h1>
            <p>Tutto quello che ti serve per iniziare a giocare, fare le tue previsioni e sfidare i tuoi amici nelle leghe sportive.</p>
          </div>

          <!-- 0 — Cos'è Survivor -->
          <section class="chapter" id="intro">
            <div class="chapter-header">
              <div class="chapter-num">0</div>
              <h2>Cos'è Survivor</h2>
            </div>
            <p><strong>Survivor</strong> è una piattaforma di leghe fantasy sportive. Ogni giornata scegli una squadra: se vince, sopravvivi. Se perde o non giochi, sei eliminato. Se pareggia, perdi una vita. Vince chi dura di più — o chi accumula più punti, secondo la modalità scelta.</p>
            <p>Puoi giocare con gli amici in leghe private o unirti a leghe pubbliche. I campionati disponibili includono <strong>Serie A, Serie B, Liga, NBA, Australian Open, Roland Garros, US Open e Wimbledon</strong>.</p>

            <div class="compare">
              <div class="mode-card">
                <h3><span class="material-icons" style="font-size:16px;vertical-align:middle">favorite</span> Survivor <span class="badge-mode">CLASSIC</span></h3>
                <ul>
                  <li>Scegli una squadra a giornata</li>
                  <li>Sconfitta o no-pick: sei eliminato</li>
                  <li>Pareggio: perdi una vita</li>
                  <li>Esaurite le vite sei eliminato</li>
                  <li>L'ultimo rimasto vince</li>
                </ul>
              </div>
              <div class="mode-card alt">
                <h3><span class="material-icons" style="font-size:16px;vertical-align:middle">emoji_events</span> Campionato <span class="badge-mode">PUNTI</span></h3>
                <ul>
                  <li>Scegli una squadra a giornata</li>
                  <li>Vittoria = 3 pt, Pareggio = 1 pt</li>
                  <li>Nessuna eliminazione</li>
                  <li>Vince chi ha più punti a fine torneo</li>
                </ul>
              </div>
            </div>

            <div class="tip">
              <span class="callout-icon">💡</span>
              Puoi partecipare a più leghe contemporaneamente, anche di sport diversi.
            </div>
          </section>

          <!-- 1 — Login -->
          <section class="chapter" id="login">
            <div class="chapter-header">
              <div class="chapter-num">1</div>
              <h2>Registrazione e Login</h2>
            </div>
            <p>Survivor usa il <strong>Magic Link</strong>: niente password da ricordare. Ti arriva un link via email, clicchi, e sei dentro. Al primo accesso l'account viene creato automaticamente.</p>
            <ul class="steps">
              <li><div class="step-icon">📧</div><div class="step-body"><strong>Inserisci la tua email</strong><span>Apri l'app e digita il tuo indirizzo email nella schermata di accesso.</span></div></li>
              <li><div class="step-icon">📨</div><div class="step-body"><strong>Controlla la casella di posta</strong><span>Riceverai un'email con un link di accesso. Controlla anche la cartella spam se non arriva entro un minuto.</span></div></li>
              <li><div class="step-icon">✅</div><div class="step-body"><strong>Clicca il link</strong><span>Il link ti autentica automaticamente. Nessuna password richiesta.</span></div></li>
              <li><div class="step-icon">🎨</div><div class="step-body"><strong>Completa il profilo</strong><span>Imposta un nickname e, se vuoi, scegli la tua squadra del cuore per ogni sport.</span></div></li>
            </ul>
            <div class="info">
              <span class="callout-icon">ℹ️</span>
              Il Magic Link ha una scadenza. Se scade prima di cliccarci, torna alla schermata di login e richiedine uno nuovo.
            </div>
          </section>

          <!-- 2 — Home -->
          <section class="chapter" id="home-section">
            <div class="chapter-header">
              <div class="chapter-num">2</div>
              <h2>La Home</h2>
            </div>
            <p>Dopo il login arrivi alla <strong>Home</strong>, il tuo pannello di controllo principale. Da qui gestisci tutto.</p>
            <div class="card-grid">
              <div class="card"><div class="card-icon">🔒</div><strong>Le mie leghe</strong><span>Tutte le leghe a cui stai partecipando, incluse quelle in attesa di approvazione.</span></div>
              <div class="card"><div class="card-icon">🌐</div><strong>Leghe pubbliche</strong><span>Sfoglia e unisciti alle leghe aperte create da altri utenti.</span></div>
              <div class="card"><div class="card-icon">➕</div><strong>Crea lega</strong><span>Avvia la tua lega personalizzata e invita gli amici.</span></div>
              <div class="card"><div class="card-icon">🔔</div><strong>Notifiche</strong><span>Risultati, richieste di accesso, scadenze giocate e molto altro.</span></div>
            </div>
            <p>Le leghe mostrano un <strong>badge di popolarità</strong> che va da <em>New</em> fino a <em>Hall of Fame</em> in base al numero di partecipanti e all'attività.</p>
            <div class="tip"><span class="callout-icon">💡</span>Usa i filtri in cima alla lista per trovare leghe per sport, campionato o stato (in corso, da avviare, terminate).</div>
          </section>

          <!-- 3 — Join -->
          <section class="chapter" id="join">
            <div class="chapter-header">
              <div class="chapter-num">3</div>
              <h2>Entrare in una lega</h2>
            </div>
            <p>Ci sono tre modi per entrare in una lega:</p>
            <ul class="steps">
              <li><div class="step-icon">🔗</div><div class="step-body"><strong>Link di invito</strong><span>Se un amico ti ha mandato un link, aprilo direttamente. Clicca "Unisciti" per entrare subito.</span></div></li>
              <li><div class="step-icon">🌐</div><div class="step-body"><strong>Leghe pubbliche</strong><span>Dalla Home vai su "Leghe pubbliche", cerca quella che ti interessa e premi "Entra".</span></div></li>
              <li><div class="step-icon">🔑</div><div class="step-body"><strong>Lega con password</strong><span>Alcune leghe private richiedono una password. Chiedila al creatore e inseriscila quando richiesto.</span></div></li>
            </ul>
            <p>Se la lega non è ad accesso libero, la tua richiesta andrà approvata dal <strong>Leader</strong>. Riceverai una notifica quando sarà accettata o rifiutata.</p>
            <div class="warn"><span class="callout-icon">⚠️</span>Non puoi fare giocate finché la tua iscrizione non è approvata e la lega non è iniziata.</div>
          </section>

          <!-- 4 — Giocata -->
          <section class="chapter" id="giocata">
            <div class="chapter-header">
              <div class="chapter-num">4</div>
              <h2>Fare la giocata</h2>
            </div>
            <p>La giocata è il cuore del gioco: ogni giornata scegli <strong>una squadra</strong> tra quelle che giocano nel turno corrente.</p>
            <ul class="steps">
              <li><div class="step-icon">1️⃣</div><div class="step-body"><strong>Apri la lega attiva</strong><span>Dalla Home, entra nella lega. Vedrai il pulsante "Fai la tua giocata" per la giornata corrente.</span></div></li>
              <li><div class="step-icon">📋</div><div class="step-body"><strong>Guarda le partite disponibili</strong><span>Vedrai tutte le partite con squadre, orari e quota. Espandi ogni partita per vedere gli ultimi 5 risultati.</span></div></li>
              <li><div class="step-icon">🤖</div><div class="step-body"><strong>Usa il Consiglio AI (opzionale)</strong><span>Il sistema suggerisce una squadra analizzando affidabilità, % vittorie stagionale, vantaggio casalingo e debolezza avversaria. Utile, non infallibile!</span></div></li>
              <li><div class="step-icon">✔️</div><div class="step-body"><strong>Seleziona e conferma</strong><span>Clicca sulla squadra scelta e conferma. Puoi renderla pubblica (visibile subito) o nascosta (rivelata solo a partita iniziata).</span></div></li>
            </ul>
            <div class="table-wrap">
              <table>
                <tr><th>Risultato partita</th><th>Modalità Survivor</th><th>Modalità Campionato</th></tr>
                <tr><td>La tua squadra vince</td><td class="ok">✓ Sopravvivi</td><td class="ok">+3 punti</td></tr>
                <tr><td>Pareggio</td><td class="ko">✗ Perdi una vita</td><td class="neu">+1 punto</td></tr>
                <tr><td>La tua squadra perde</td><td class="ko">✗ Sei eliminato</td><td class="neu">+0 punti</td></tr>
                <tr><td>Non hai giocato</td><td class="ko">✗ Sei eliminato</td><td class="neu">+0 punti</td></tr>
              </table>
            </div>
            <div class="warn"><span class="callout-icon">⚠️</span>Puoi modificare o cancellare la giocata fino all'inizio della prima partita della giornata. Dopo non è più possibile.</div>
            <div class="tip"><span class="callout-icon">💡</span>Attiva le notifiche push: l'app ti avvisa quando la scadenza si avvicina.</div>
          </section>

          <!-- 5 — Recap -->
          <section class="chapter" id="recap">
            <div class="chapter-header">
              <div class="chapter-num">5</div>
              <h2>Recap e risultati</h2>
            </div>
            <p>Al termine di ogni giornata il Leader calcola i risultati. Da quel momento puoi vedere il <strong>Recap</strong>: un riepilogo completo di tutte le giocate.</p>
            <div class="card-grid">
              <div class="card"><div class="card-icon">👁️</div><strong>Giocate di tutti</strong><span>Vedi cosa ha scelto ogni partecipante e se ha vinto o perso.</span></div>
              <div class="card"><div class="card-icon">🏅</div><strong>Scelta più popolare</strong><span>La squadra più selezionata della giornata.</span></div>
              <div class="card"><div class="card-icon">💬</div><strong>Reazioni</strong><span>Metti emoji alla giocata degli altri per festeggiare (o prendere in giro).</span></div>
              <div class="card"><div class="card-icon">☠️</div><strong>Eliminazioni</strong><span>Scopri chi ha esaurito le vite e chi è ancora in gara.</span></div>
            </div>
            <div class="info"><span class="callout-icon">ℹ️</span>Puoi consultare il recap di qualsiasi giornata passata dalla sezione "Giornate" all'interno della lega.</div>
          </section>

          <!-- 6 — Classifica -->
          <section class="chapter" id="classifica">
            <div class="chapter-header">
              <div class="chapter-num">6</div>
              <h2>Classifica e trofei</h2>
            </div>
            <p>Ogni lega ha una <strong>classifica in tempo reale</strong>. In modalità Survivor mostra le vite rimaste; in modalità Campionato mostra i punti accumulati.</p>
            <p>I <strong>Trofei</strong> sono il tuo palmares personale: tengono traccia di tutte le vittorie e i podi (top 3) ottenuti nel tempo, in tutte le leghe e campionati.</p>
            <div class="tip"><span class="callout-icon">💡</span>Accedi al tuo profilo per vedere i tuoi trofei e confrontare le statistiche con gli altri utenti.</div>
          </section>

          <!-- 7 — Crea -->
          <section class="chapter" id="crea">
            <div class="chapter-header">
              <div class="chapter-num">7</div>
              <h2>Creare una lega</h2>
            </div>
            <p>Dalla Home premi <strong>"Crea lega"</strong> e configura le regole a tuo piacimento.</p>
            <ul class="steps">
              <li><div class="step-icon">🏅</div><div class="step-body"><strong>Sport e campionato</strong><span>Scegli lo sport e il campionato specifico (es. Serie A, NBA, Roland Garros).</span></div></li>
              <li><div class="step-icon">📝</div><div class="step-body"><strong>Nome, edizione e modalità</strong><span>Dai un nome alla lega, imposta il numero di edizione e scegli tra Survivor e Campionato.</span></div></li>
              <li><div class="step-icon">🔢</div><div class="step-body"><strong>Giornata di inizio e fine</strong><span>Decidi da quale giornata parte la lega e quando termina.</span></div></li>
              <li><div class="step-icon">❤️</div><div class="step-body"><strong>Vite iniziali (solo Survivor)</strong><span>Quante vite ha ogni giocatore. 1 vita = eliminazione immediata al primo errore.</span></div></li>
              <li><div class="step-icon">🔒</div><div class="step-body"><strong>Accesso: pubblica o privata</strong><span>Pubblica = chiunque può unirsi. Privata = solo chi ha il link o la password. Puoi richiedere approvazione manuale per ogni iscrizione.</span></div></li>
              <li><div class="step-icon">📨</div><div class="step-body"><strong>Invita i giocatori</strong><span>Inserisci le email degli amici per invitarli, oppure condividi il link della lega.</span></div></li>
            </ul>
            <div class="info"><span class="callout-icon">ℹ️</span>Come <strong>Leader</strong> hai accesso a funzioni extra: approvare iscrizioni, calcolare i risultati a fine giornata, gestire le vite dei giocatori e correggere eventuali errori.</div>
          </section>

          <!-- 8 — Tips -->
          <section class="chapter" id="tips">
            <div class="chapter-header">
              <div class="chapter-num">8</div>
              <h2>Consigli generali</h2>
            </div>
            <ul class="steps">
              <li><div class="step-icon">📅</div><div class="step-body"><strong>Gioca il prima possibile</strong><span>Non aspettare l'ultimo momento: le partite possono iniziare e bloccare la selezione.</span></div></li>
              <li><div class="step-icon">🤫</div><div class="step-body"><strong>Usa la giocata nascosta</strong><span>Non vuoi far copiare la tua scelta? Imposta la giocata come nascosta: viene rivelata solo al fischio d'inizio.</span></div></li>
              <li><div class="step-icon">📉</div><div class="step-body"><strong>Non scegliere sempre il favorito</strong><span>In Survivor l'obiettivo è durare. Considera il fattore casalingo e la forma recente, non solo le quote.</span></div></li>
              <li><div class="step-icon">🤖</div><div class="step-body"><strong>Il Consiglio AI è un punto di partenza</strong><span>L'algoritmo è utile ma non infallibile. Usalo come spunto, poi decidi tu.</span></div></li>
              <li><div class="step-icon">🔔</div><div class="step-body"><strong>Attiva le notifiche push</strong><span>Riceverai avvisi prima della scadenza giocate e quando i risultati vengono calcolati.</span></div></li>
              <li><div class="step-icon">👀</div><div class="step-body"><strong>Studia le giocate degli altri</strong><span>Il recap giornaliero mostra le scelte di tutti: analizzare le tendenze degli avversari può diventare parte della strategia.</span></div></li>
            </ul>
          </section>

          <!-- 9 — FAQ -->
          <section class="chapter" id="faq">
            <div class="chapter-header">
              <div class="chapter-num">9</div>
              <h2>Domande frequenti</h2>
            </div>
            <div class="faq">
              <details *ngFor="let item of faqItems">
                <summary>{{ item.q }} <span class="faq-toggle">+</span></summary>
                <p>{{ item.a }}</p>
              </details>
            </div>
          </section>

          <footer class="guida-footer">
            <strong>SURVIVOR</strong> — Win or Go Home
          </footer>
        </main>
      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/icon?family=Material+Icons');

    :host { display: block; font-family: 'Poppins', sans-serif; }

    .guida-page {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background: #F4F6F8;
    }

    /* ── LAYOUT ─────────────────────────────────────── */
    .guida-layout {
      display: flex;
      flex: 1;
      position: relative;
    }

    /* ── SIDEBAR ────────────────────────────────────── */
    .guida-nav {
      width: 256px;
      min-width: 256px;
      background: #fff;
      border-right: 1px solid #E2E8F0;
      height: calc(100vh - 72px);
      position: sticky;
      top: 72px;
      overflow-y: auto;
      display: flex;
      flex-direction: column;
      box-shadow: 1px 0 4px rgba(0,0,0,.04);
      z-index: 100;
      flex-shrink: 0;
    }
    .nav-header {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      padding: 24px 20px 18px;
      color: #fff;
    }
    .nav-logo { font-size: 20px; font-weight: 800; letter-spacing: 3px; }
    .nav-tagline { font-size: 11px; opacity: .8; margin-top: 2px; font-weight: 500; }
    .nav-section {
      font-size: 10px;
      font-weight: 700;
      letter-spacing: 1.5px;
      color: #718096;
      padding: 14px 20px 4px;
      text-transform: uppercase;
    }
    .guida-nav ul { list-style: none; padding: 4px 10px; margin: 0; }
    .guida-nav ul li { margin-bottom: 2px; }
    .guida-nav ul li a {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 9px 12px;
      border-radius: 8px;
      color: #4A5568;
      text-decoration: none;
      font-size: 13px;
      font-weight: 500;
      cursor: pointer;
      transition: all .18s;
      &:hover { background: rgba(79,195,247,.1); color: #0A3D91; }
    }
    .nav-num {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 10px;
      font-weight: 700;
      width: 20px; height: 20px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }

    /* ── MAIN ───────────────────────────────────────── */
    .guida-main {
      flex: 1;
      padding: 36px 48px 48px;
      max-width: 820px;
      min-width: 0;
      position: relative;
    }

    /* FAB menu mobile */
    .menu-fab {
      display: none;
      position: fixed;
      bottom: 80px;
      right: 18px;
      z-index: 200;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      border: none;
      border-radius: 50%;
      width: 48px; height: 48px;
      box-shadow: 0 4px 16px rgba(10,61,145,.35);
      cursor: pointer;
      align-items: center; justify-content: center;
      .material-icons { font-size: 22px; }
    }

    /* ── HERO ───────────────────────────────────────── */
    .hero {
      background: linear-gradient(135deg, #0A3D91 0%, #1565C0 60%, #4FC3F7 100%);
      border-radius: 20px;
      padding: 40px 36px;
      margin-bottom: 40px;
      color: #fff;
      position: relative;
      overflow: hidden;
      box-shadow: 0 8px 32px rgba(10,61,145,.22);
      &::after {
        content: '';
        position: absolute;
        right: -40px; bottom: -40px;
        width: 200px; height: 200px;
        background: rgba(255,255,255,.05);
        border-radius: 50%;
      }
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(255,255,255,.2);
      border: 1px solid rgba(255,255,255,.3);
      color: #fff;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 1px;
      padding: 4px 14px;
      border-radius: 20px;
      margin-bottom: 14px;
      text-transform: uppercase;
    }
    .hero h1 {
      font-size: 38px;
      font-weight: 800;
      letter-spacing: 4px;
      margin-bottom: 10px;
      position: relative;
    }
    .hero p { font-size: 14px; opacity: .85; max-width: 500px; position: relative; }

    /* ── CHAPTERS ───────────────────────────────────── */
    .chapter {
      margin-bottom: 48px;
      scroll-margin-top: 84px;
    }
    .chapter-header {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      padding-bottom: 12px;
      border-bottom: 2px solid #E2E8F0;
    }
    .chapter-num {
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 13px;
      font-weight: 800;
      width: 34px; height: 34px;
      border-radius: 10px;
      display: flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    }
    .chapter h2 { font-size: 1.35rem; font-weight: 700; color: #1A202C; margin: 0; }
    .chapter p { color: #4A5568; margin-bottom: 14px; font-size: 0.92rem; line-height: 1.75; }
    .chapter strong { color: #1A202C; }

    /* ── CALLOUTS ───────────────────────────────────── */
    .tip, .info, .warn {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 16px;
      border-radius: 10px;
      font-size: 0.85rem;
      margin: 16px 0;
      line-height: 1.6;
    }
    .tip  { background: #FFF8E1; border-left: 4px solid #F59E0B; color: #78350F; }
    .info { background: #E3F2FD; border-left: 4px solid #2196F3; color: #1E3A5F; }
    .warn { background: #FFF3E0; border-left: 4px solid #FF6D00; color: #7C2D12; }
    .callout-icon { font-size: 1rem; flex-shrink: 0; margin-top: 1px; }

    /* ── STEPS ──────────────────────────────────────── */
    .steps {
      list-style: none;
      padding: 0;
      margin: 16px 0;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .steps li {
      display: flex;
      align-items: flex-start;
      gap: 14px;
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px 16px;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    .step-icon { font-size: 1.4rem; flex-shrink: 0; margin-top: 1px; }
    .step-body {
      display: flex;
      flex-direction: column;
      gap: 3px;
      strong { font-size: 0.88rem; color: #1A202C; }
      span   { font-size: 0.82rem; color: #64748B; line-height: 1.5; }
    }

    /* ── CARD GRID ──────────────────────────────────── */
    .card-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .card {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 6px;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
      .card-icon { font-size: 1.5rem; }
      strong { font-size: 0.88rem; color: #1A202C; }
      span   { font-size: 0.8rem; color: #64748B; line-height: 1.5; }
    }

    /* ── COMPARE ────────────────────────────────────── */
    .compare {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 14px;
      margin: 18px 0;
    }
    .mode-card {
      background: linear-gradient(135deg, #EFF6FF, #DBEAFE);
      border: 1.5px solid #BFDBFE;
      border-radius: 14px;
      padding: 18px 16px;
      h3 { font-size: 0.9rem; font-weight: 700; color: #0A3D91; margin-bottom: 10px; }
      ul { list-style: none; padding: 0; margin: 0; }
      ul li { font-size: 0.82rem; color: #1E3A5F; padding: 3px 0; padding-left: 16px; position: relative; }
      ul li::before { content: '•'; position: absolute; left: 0; color: #4FC3F7; font-weight: 700; }
      &.alt { background: linear-gradient(135deg, #F0FDF4, #DCFCE7); border-color: #BBF7D0; h3 { color: #14532D; } ul li { color: #14532D; } ul li::before { color: #16A34A; } }
    }
    .badge-mode {
      display: inline-block;
      background: linear-gradient(135deg, #0A3D91, #4FC3F7);
      color: #fff;
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.8px;
      padding: 2px 7px;
      border-radius: 20px;
      vertical-align: middle;
      margin-left: 6px;
    }
    .mode-card.alt .badge-mode { background: linear-gradient(135deg, #16A34A, #4ADE80); }

    /* ── TABLE ──────────────────────────────────────── */
    .table-wrap {
      overflow-x: auto;
      margin: 16px 0;
      border-radius: 12px;
      border: 1.5px solid #E2E8F0;
      box-shadow: 0 1px 4px rgba(0,0,0,.04);
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.82rem;
      background: #fff;
      border-radius: 12px;
      overflow: hidden;
    }
    th {
      background: linear-gradient(135deg, #0A3D91, #1565C0);
      color: #fff;
      font-weight: 700;
      padding: 10px 14px;
      text-align: left;
      font-size: 0.78rem;
      letter-spacing: 0.3px;
    }
    td { padding: 10px 14px; border-bottom: 1px solid #F1F5F9; color: #374151; }
    tr:last-child td { border-bottom: none; }
    tr:hover td { background: #F8FAFF; }
    .ok  { color: #16A34A; font-weight: 700; }
    .ko  { color: #DC2626; font-weight: 700; }
    .neu { color: #64748B; }

    /* ── FAQ ────────────────────────────────────────── */
    .faq {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    details {
      background: #fff;
      border: 1.5px solid #E2E8F0;
      border-radius: 12px;
      padding: 0;
      overflow: hidden;
      transition: box-shadow .18s;
      &[open] { box-shadow: 0 4px 16px rgba(10,61,145,.08); border-color: #BFDBFE; }
      summary {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 14px 16px;
        cursor: pointer;
        font-size: 0.88rem;
        font-weight: 600;
        color: #1A202C;
        list-style: none;
        &::-webkit-details-marker { display: none; }
      }
      p { padding: 0 16px 14px; font-size: 0.83rem; color: #4A5568; line-height: 1.65; margin: 0; }
    }
    .faq-toggle {
      font-size: 1.1rem;
      color: #0A3D91;
      font-weight: 700;
      flex-shrink: 0;
      margin-left: 8px;
    }
    details[open] .faq-toggle { transform: rotate(45deg); display: inline-block; }

    /* ── FOOTER ─────────────────────────────────────── */
    .guida-footer {
      margin-top: 48px;
      padding: 20px 0;
      border-top: 1px solid #E2E8F0;
      font-size: 12px;
      color: #718096;
      text-align: center;
      strong { color: #0A3D91; }
    }

    /* ── RESPONSIVE ─────────────────────────────────── */
    @media (max-width: 900px) {
      .guida-nav { display: none; position: fixed; top: 0; left: 0; height: 100vh; z-index: 300; transition: transform .25s; transform: translateX(-100%); }
      .guida-nav.open { display: flex; transform: translateX(0); }
      .nav-overlay { position: fixed; inset: 0; background: rgba(0,0,0,.35); z-index: 299; }
      .guida-main { padding: 20px 16px 80px; }
      .hero { padding: 26px 20px; }
      .hero h1 { font-size: 26px; }
      .compare, .card-grid { grid-template-columns: 1fr; }
      .menu-fab { display: flex; }
    }

    @media (max-width: 480px) {
      .guida-main { padding: 16px 12px 80px; }
      .chapter h2 { font-size: 1.1rem; }
    }
  `]
})
export class GuidaComponent {
  sidebarOpen = false;

  faqItems = [
    { q: 'Non ho ricevuto il Magic Link, cosa faccio?', a: 'Controlla la cartella spam o posta indesiderata. Se non è lì, attendi un minuto e poi riprova. Assicurati di usare l\'indirizzo email corretto.' },
    { q: 'Posso cambiare la giocata dopo averla confermata?', a: 'Sì, puoi modificarla o cancellarla finché non inizia la prima partita della giornata. Dopo è bloccata.' },
    { q: 'Cosa succede se dimentico di fare la giocata?', a: 'In Survivor sei eliminato immediatamente, come se avessi scelto una squadra perdente. In Campionato non guadagni punti per quella giornata.' },
    { q: 'Posso partecipare a più leghe contemporaneamente?', a: 'Sì, non c\'è limite. Puoi essere in leghe di sport diversi, campionati diversi e modalità diverse allo stesso tempo.' },
    { q: 'Chi calcola i risultati a fine giornata?', a: 'Il Leader della lega. Se i risultati tardano ad arrivare, contatta il Leader. Se sei tu il Leader, trovi il pulsante "Calcola risultati" nella schermata di gestione della lega.' },
    { q: 'La giocata "nascosta" serve a qualcosa strategicamente?', a: 'Sì: impedisce agli altri di copiare la tua scelta in tempo reale. La vedranno solo dopo il fischio d\'inizio della partita.' },
    { q: 'I trofei sono visibili solo a me?', a: 'No, i tuoi trofei e le statistiche sono visibili anche agli altri dalla tua scheda profilo pubblica.' },
    { q: 'Posso uscire da una lega?', a: 'Sì, puoi abbandonare una lega dal suo pannello. Se sei il Leader con partecipanti attivi, valuta di trasferire il ruolo prima di uscire.' },
  ];

  constructor(private router: Router) {}

  goBack(): void {
    this.router.navigate(['/home']);
  }

  scrollTo(id: string): void {
    this.sidebarOpen = false;
    setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  }
}
