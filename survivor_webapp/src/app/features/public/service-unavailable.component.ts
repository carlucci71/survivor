import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-service-unavailable',
  standalone: true,
  imports: [CommonModule, MatButtonModule, TranslateModule],
  template: `
    <div class="su-page">

      <!-- Particelle fluttuanti -->
      <div class="su-particles" aria-hidden="true">
        <span class="su-p su-p1"></span><span class="su-p su-p2"></span>
        <span class="su-p su-p3"></span><span class="su-p su-p4"></span>
        <span class="su-p su-p5"></span><span class="su-p su-p6"></span>
        <span class="su-p su-p7"></span><span class="su-p su-p8"></span>
      </div>

      <div class="su-card">

        <!-- Logo + brand -->
        <div class="su-brand">
          <img src="assets/logo.png" alt="Survivor" class="su-logo" />
          <span class="su-tagline">WIN OR GO HOME</span>
        </div>

        <!-- Codice errore animato -->
        <div class="su-code-wrap" aria-hidden="true">
          <span class="su-digit">5</span>
          <span class="su-digit su-digit--spin">0</span>
          <span class="su-digit">3</span>
        </div>

        <!-- Testo -->
        <h1 class="su-title">Service temporarily unavailable</h1>
        <p class="su-msg">
          The server is temporarily unreachable.<br>
          We're already working to restore it — please try again in a few minutes.
        </p>

        <!-- Indicatore polling -->
        <div class="su-polling" [class.su-polling--active]="checking">
          <span class="su-dot"></span>
          <span class="su-dot"></span>
          <span class="su-dot"></span>
          <span class="su-polling-label">{{ checking ? 'Checking connection…' : 'Connection lost' }}</span>
        </div>

        <!-- Bottone -->
        <button class="su-btn" (click)="refresh()">
          <svg class="su-btn-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 4 23 10 17 10"></polyline>
            <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>
          </svg>
          Retry
        </button>

      </div>
    </div>
  `,
  styles: [`
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700;800;900&display=swap');

    :host { display: block; }

    /* ── Page ─────────────────────────────────────── */
    .su-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(160deg, #050f2c 0%, #0A3D91 55%, #0b2a5e 100%);
      font-family: 'Poppins', sans-serif;
      padding: 20px;
      position: relative;
      overflow: hidden;
    }

    /* ── Particelle ───────────────────────────────── */
    .su-particles { position: absolute; inset: 0; pointer-events: none; }
    .su-p {
      position: absolute;
      border-radius: 50%;
      background: rgba(79, 195, 247, 0.35);
      animation: su-float linear infinite;
    }
    .su-p1  { width:6px;  height:6px;  left:8%;   bottom:-10px; animation-duration:7s;   animation-delay:0s;   }
    .su-p2  { width:4px;  height:4px;  left:18%;  bottom:-10px; animation-duration:9s;   animation-delay:1.4s; background:rgba(255,255,255,.2); }
    .su-p3  { width:8px;  height:8px;  left:33%;  bottom:-10px; animation-duration:6s;   animation-delay:0.7s; }
    .su-p4  { width:4px;  height:4px;  left:50%;  bottom:-10px; animation-duration:11s;  animation-delay:2.1s; background:rgba(255,255,255,.15); }
    .su-p5  { width:6px;  height:6px;  left:65%;  bottom:-10px; animation-duration:8s;   animation-delay:0.3s; }
    .su-p6  { width:5px;  height:5px;  left:76%;  bottom:-10px; animation-duration:7.5s; animation-delay:3s;   background:rgba(79,195,247,.5); }
    .su-p7  { width:7px;  height:7px;  left:85%;  bottom:-10px; animation-duration:9.5s; animation-delay:1s;   }
    .su-p8  { width:4px;  height:4px;  left:93%;  bottom:-10px; animation-duration:6.5s; animation-delay:4s;   background:rgba(255,255,255,.2); }
    @keyframes su-float {
      0%   { transform: translateY(0)       scale(1);   opacity:0; }
      10%  { opacity:1; }
      90%  { opacity:.6; }
      100% { transform: translateY(-110vh)  scale(.4); opacity:0; }
    }

    /* ── Card ─────────────────────────────────────── */
    .su-card {
      position: relative;
      background: rgba(255,255,255,.04);
      backdrop-filter: blur(18px);
      border: 1px solid rgba(79,195,247,.18);
      border-radius: 28px;
      padding: 48px 40px 40px;
      max-width: 480px;
      width: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      text-align: center;
      box-shadow: 0 32px 80px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.06);
      animation: su-card-in .5s cubic-bezier(.34,1.56,.64,1) both;
    }
    @keyframes su-card-in {
      from { transform: translateY(40px) scale(.95); opacity:0; }
      to   { transform: translateY(0) scale(1);      opacity:1; }
    }

    @media (max-width: 480px) {
      .su-card { padding: 36px 24px 32px; border-radius: 20px; gap: 16px; }
    }

    /* ── Brand ────────────────────────────────────── */
    .su-brand {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
    }
    .su-logo {
      width: 110px;
      height: 110px;
      filter: drop-shadow(0 0 18px rgba(79,195,247,.7));
      animation: su-pulse 3s ease-in-out infinite;
    }
    @keyframes su-pulse {
      0%,100% { filter: drop-shadow(0 0 14px rgba(79,195,247,.6)); }
      50%      { filter: drop-shadow(0 0 28px rgba(79,195,247,1)); }
    }
    .su-tagline {
      font-size: .65rem;
      font-weight: 800;
      letter-spacing: 3px;
      color: rgba(79,195,247,.8);
      text-transform: uppercase;
    }

    /* ── Codice 503 ───────────────────────────────── */
    .su-code-wrap {
      display: flex;
      align-items: center;
      gap: 2px;
      line-height: 1;
      margin: 4px 0;
    }
    .su-digit {
      font-size: clamp(72px, 18vw, 120px);
      font-weight: 900;
      color: transparent;
      background: linear-gradient(135deg, #fff 30%, #4FC3F7 100%);
      -webkit-background-clip: text;
      background-clip: text;
      text-shadow: none;
      letter-spacing: -4px;
    }
    .su-digit--spin {
      animation: su-spin-digit 4s ease-in-out infinite;
      display: inline-block;
    }
    @keyframes su-spin-digit {
      0%,40%,100% { transform: rotateY(0deg);   }
      50%,90%     { transform: rotateY(360deg);  }
    }

    /* ── Testo ────────────────────────────────────── */
    .su-title {
      font-size: clamp(.95rem, 3vw, 1.2rem);
      font-weight: 700;
      color: #fff;
      margin: 0;
      line-height: 1.35;
    }
    .su-msg {
      font-size: .85rem;
      color: rgba(255,255,255,.55);
      line-height: 1.7;
      margin: 0;
      max-width: 340px;
    }

    /* ── Polling dots ─────────────────────────────── */
    .su-polling {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .su-dot {
      width: 7px; height: 7px;
      border-radius: 50%;
      background: rgba(255,255,255,.25);
    }
    .su-polling--active .su-dot:nth-child(1) { animation: su-bounce .9s ease infinite 0s;    background: #4FC3F7; }
    .su-polling--active .su-dot:nth-child(2) { animation: su-bounce .9s ease infinite .15s;  background: #4FC3F7; }
    .su-polling--active .su-dot:nth-child(3) { animation: su-bounce .9s ease infinite .30s;  background: #4FC3F7; }
    @keyframes su-bounce {
      0%,100% { transform: translateY(0);    opacity:.6; }
      50%      { transform: translateY(-6px); opacity:1;  }
    }
    .su-polling-label {
      font-size: .75rem;
      color: rgba(255,255,255,.45);
      margin-left: 4px;
    }

    /* ── Bottone ──────────────────────────────────── */
    .su-btn {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 13px 32px;
      background: linear-gradient(135deg, #4FC3F7, #0A3D91);
      color: #fff;
      font-family: 'Poppins', sans-serif;
      font-size: .9rem;
      font-weight: 700;
      border: none;
      border-radius: 14px;
      cursor: pointer;
      box-shadow: 0 6px 24px rgba(79,195,247,.35);
      transition: transform .18s, box-shadow .18s;
      margin-top: 4px;
    }
    .su-btn:hover  { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(79,195,247,.5); }
    .su-btn:active { transform: scale(.97); }
    .su-btn-icon {
      width: 18px; height: 18px;
      flex-shrink: 0;
    }
  `]
})
export class ServiceUnavailableComponent implements OnDestroy, OnInit {
  checking = false;
  private pollingInterval: any = null;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.startPolling();
  }

  refresh(): void {
    // original behaviour: reload the page
    window.location.reload();
  }

  private startPolling(): void {
    if (this.pollingInterval) return;
    this.checking = true;

    const tryProbe = () => {
      this.auth.probeMyData(true).subscribe({
        next: () => {
          this.clearPolling();
          this.checking = false;
          this.router.navigate(['/home']).catch(() => { window.location.href = '/home'; });
        },
        error: () => {
          // ignore; next interval will retry
        }
      });
    };

    this.pollingInterval = setInterval(tryProbe, 10000);
    tryProbe();
  }

  private clearPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.checking = false;
  }

  ngOnDestroy(): void {
    this.clearPolling();
  }

  goBack(): void {
    window.history.back();
  }
}
