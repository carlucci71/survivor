import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-three',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="hero-container">

      <!-- Grid / scanlines overlay -->
      <div class="hero-grid"></div>

      <!-- Sfondo campo sportivo SVG ciclante -->
      <div class="hero-fields">

        <!-- Campo calcio -->
        <svg class="field-svg field-football" [class.field-active]="activeSport === 0"
             viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" x="60" y="20" width="680" height="220" rx="4"/>
          <line class="fl" x1="400" y1="20" x2="400" y2="240"/>
          <circle class="fl" cx="400" cy="130" r="52" fill="none"/>
          <circle class="fl" cx="400" cy="130" r="5" fill="rgba(255,255,255,0.3)"/>
          <rect class="fl" x="60" y="68" width="110" height="124"/>
          <rect class="fl" x="60" y="95" width="52" height="70"/>
          <!-- Lunetta area sinistra: solo la mezzaluna che sporge fuori dall'area grande -->
          <path class="fl" d="M170,105 A28,28 0 0,1 170,155" fill="none"/>
          <rect class="fl" x="630" y="68" width="110" height="124"/>
          <rect class="fl" x="688" y="95" width="52" height="70"/>
          <!-- Lunetta area destra: solo la mezzaluna che sporge fuori dall'area grande -->
          <path class="fl" d="M630,105 A28,28 0 0,0 630,155" fill="none"/>
          <path class="fl" d="M60,20 Q76,20 76,36"/>
          <path class="fl" d="M740,20 Q724,20 724,36"/>
          <path class="fl" d="M60,240 Q76,240 76,224"/>
          <path class="fl" d="M740,240 Q724,240 724,224"/>
        </svg>

        <!-- Campo basket -->
        <svg class="field-svg field-basketball" [class.field-active]="activeSport === 1"
             viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" x="40" y="15" width="720" height="230" rx="4"/>
          <line class="fl" x1="400" y1="15" x2="400" y2="245"/>
          <circle class="fl" cx="400" cy="130" r="55" fill="none"/>
          <circle class="fl" cx="400" cy="130" r="5" fill="rgba(255,255,255,0.3)"/>
          <!-- Area sinistra basket -->
          <rect class="fl" x="40" y="55" width="180" height="150"/>
          <path class="fl" d="M220,55 A75,75 0 0,1 220,205" fill="none"/>
          <circle class="fl" cx="150" cy="130" r="20" fill="none"/>
          <!-- Area destra basket -->
          <rect class="fl" x="580" y="55" width="180" height="150"/>
          <path class="fl" d="M580,55 A75,75 0 0,0 580,205" fill="none"/>
          <circle class="fl" cx="650" cy="130" r="20" fill="none"/>
          <!-- Linea tre punti sinistra -->
          <path class="fl" d="M40,48 A140,140 0 0,1 40,212" fill="none"/>
          <!-- Linea tre punti destra -->
          <path class="fl" d="M760,48 A140,140 0 0,0 760,212" fill="none"/>
        </svg>

        <!-- Campo tennis -->
        <svg class="field-svg field-tennis" [class.field-active]="activeSport === 2"
             viewBox="0 0 800 260" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" x="50" y="20" width="700" height="220" rx="2"/>
          <!-- corsie laterali -->
          <rect class="fl" x="50" y="20" width="60" height="220" fill="none"/>
          <rect class="fl" x="690" y="20" width="60" height="220" fill="none"/>
          <!-- linea di servizio sx -->
          <line class="fl" x1="110" y1="20" x2="110" y2="240"/>
          <!-- linea di servizio dx -->
          <line class="fl" x1="690" y1="20" x2="690" y2="240"/>
          <!-- rete -->
          <line class="fl" x1="400" y1="20" x2="400" y2="240" stroke-dasharray="4 4"/>
          <!-- linee servizio -->
          <line class="fl" x1="110" y1="130" x2="690" y2="130"/>
          <!-- linea T sx -->
          <line class="fl" x1="255" y1="55" x2="255" y2="205"/>
          <!-- linea T dx -->
          <line class="fl" x1="545" y1="55" x2="545" y2="205"/>
          <!-- rettangolo servizio sx -->
          <rect class="fl" x="110" y="55" width="290" height="150" fill="none"/>
          <!-- rettangolo servizio dx -->
          <rect class="fl" x="400" y="55" width="290" height="150" fill="none"/>
        </svg>

      </div>

      <!-- Orbs / bolle luminose di sfondo -->
      <div class="orb orb1"></div>
      <div class="orb orb2"></div>
      <div class="orb orb3"></div>

      <!-- Particelle flottanti sottili -->
      <div class="particles" aria-hidden="true">
        <span class="particle p1"></span>
        <span class="particle p2"></span>
        <span class="particle p3"></span>
        <span class="particle p4"></span>
        <span class="particle p5"></span>
        <span class="particle p6"></span>
      </div>

      <!-- Contenuto principale -->
      <div class="hero-content">

        <!-- Riga sport attivo (pill indicatori) -->
        <div class="sport-pills">
          <button class="sport-pill" [class.pill-active]="activeSport === 0" (click)="setSport(0)" aria-label="Calcio">
            <span class="pill-icon">⚽</span>
          </button>
          <button class="sport-pill" [class.pill-active]="activeSport === 1" (click)="setSport(1)" aria-label="Basket">
            <span class="pill-icon">🏀</span>
          </button>
          <button class="sport-pill" [class.pill-active]="activeSport === 2" (click)="setSport(2)" aria-label="Tennis">
            <span class="pill-icon">🎾</span>
          </button>
        </div>

        <!-- Titolo -->
        <h1 class="hero-title">
          <span class="title-sur">SUR</span><span class="title-vi">VI</span><span class="title-vor">VOR</span>
        </h1>

        <!-- Divisore con trofeo -->
        <div class="hero-divider">
          <span class="divider-line"></span>
          <span class="divider-trophy">🏆</span>
          <span class="divider-line"></span>
        </div>

        <!-- Sottotitolo -->
        <p class="hero-subtitle">WIN OR GO HOME</p>

      </div>

      <!-- Bordi sfumati laterali -->
      <div class="hero-edge-left"></div>
      <div class="hero-edge-right"></div>

    </div>
  `,
  styles: [`
    /* =============================================
       CONTAINER
    ============================================= */
    .hero-container {
      position: relative;
      width: 100%;
      height: 270px;
      background: linear-gradient(135deg,
        #040f2e 0%,
        #071e4f 25%,
        #0A3D91 55%,
        #1565C0 80%,
        #1a6bbf 100%
      );
      overflow: hidden;
      border-radius: 20px;
      margin-bottom: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 8px 40px rgba(10, 61, 145, 0.5),
        0 2px 8px rgba(0,0,0,0.3),
        inset 0 1px 0 rgba(255,255,255,0.07);
    }

    /* =============================================
       GRID / SCANLINES
    ============================================= */
    .hero-grid {
      position: absolute;
      inset: 0;
      z-index: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
      background-size: 40px 40px;
      mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%);
    }

    /* =============================================
       CAMPI SVG
    ============================================= */
    .hero-fields {
      position: absolute;
      inset: 0;
      z-index: 1;
    }
    .field-svg {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      transition: opacity 0.9s ease;
    }
    .field-svg.field-active {
      opacity: 0.14;
    }
    .fl {
      fill: none;
      stroke: #ffffff;
      stroke-width: 1.6;
      stroke-linecap: round;
    }

    /* =============================================
       ORB / GLOW BLOBS
    ============================================= */
    .orb {
      position: absolute;
      border-radius: 50%;
      filter: blur(50px);
      z-index: 1;
      animation: orbFloat ease-in-out infinite;
      pointer-events: none;
    }
    .orb1 {
      width: 300px; height: 300px;
      top: -80px; left: -60px;
      background: radial-gradient(circle, rgba(21,101,192,0.4) 0%, transparent 70%);
      animation-duration: 8s; animation-delay: 0s;
    }
    .orb2 {
      width: 250px; height: 250px;
      top: -40px; right: -40px;
      background: radial-gradient(circle, rgba(79,195,247,0.25) 0%, transparent 70%);
      animation-duration: 11s; animation-delay: 2s;
    }
    .orb3 {
      width: 200px; height: 200px;
      bottom: -60px; left: 40%;
      background: radial-gradient(circle, rgba(30,125,181,0.3) 0%, transparent 70%);
      animation-duration: 9s; animation-delay: 4s;
    }
    @keyframes orbFloat {
      0%, 100% { transform: translateY(0) scale(1); }
      50%       { transform: translateY(-18px) scale(1.08); }
    }

    /* =============================================
       PARTICELLE
    ============================================= */
    .particles {
      position: absolute;
      inset: 0;
      z-index: 2;
      pointer-events: none;
    }
    .particle {
      position: absolute;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.22);
      animation: floatUp linear infinite;
    }
    .p1 { width: 4px;  height: 4px;  left: 10%;  bottom: -8px;  animation-duration: 8s;  animation-delay: 0s;   }
    .p2 { width: 3px;  height: 3px;  left: 25%;  bottom: -8px;  animation-duration: 11s; animation-delay: 2s;   }
    .p3 { width: 5px;  height: 5px;  left: 45%;  bottom: -8px;  animation-duration: 9s;  animation-delay: 1s;   }
    .p4 { width: 3px;  height: 3px;  left: 60%;  bottom: -8px;  animation-duration: 13s; animation-delay: 3s;   }
    .p5 { width: 4px;  height: 4px;  left: 78%;  bottom: -8px;  animation-duration: 10s; animation-delay: 0.5s; }
    .p6 { width: 3px;  height: 3px;  left: 90%;  bottom: -8px;  animation-duration: 7s;  animation-delay: 4s;   }
    @keyframes floatUp {
      0%   { transform: translateY(0) scale(1);    opacity: 0; }
      8%   { opacity: 0.8; }
      85%  { opacity: 0.4; }
      100% { transform: translateY(-290px) scale(0.4); opacity: 0; }
    }

    /* =============================================
       CONTENUTO
    ============================================= */
    .hero-content {
      position: relative;
      z-index: 4;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      animation: contentIn 0.9s cubic-bezier(0.22,1,0.36,1) 0.3s both;
    }
    @keyframes contentIn {
      from { opacity: 0; transform: translateY(20px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    /* =============================================
       SPORT PILLS
    ============================================= */
    .sport-pills {
      display: flex;
      gap: 10px;
      margin-bottom: 2px;
    }
    .sport-pill {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      background: rgba(255,255,255,0.07);
      border: 1.5px solid rgba(255,255,255,0.15);
      cursor: pointer;
      transition: all 0.35s cubic-bezier(0.34,1.56,0.64,1);
      backdrop-filter: blur(8px);
      outline: none;
      animation: pillPop 0.5s cubic-bezier(0.34,1.56,0.64,1) both;
    }
    .sport-pill:nth-child(1) { animation-delay: 0.6s; }
    .sport-pill:nth-child(2) { animation-delay: 0.75s; }
    .sport-pill:nth-child(3) { animation-delay: 0.9s; }
    .sport-pill.pill-active {
      background: rgba(79,195,247,0.2);
      border-color: rgba(79,195,247,0.7);
      box-shadow: 0 0 18px rgba(79,195,247,0.4), 0 0 6px rgba(79,195,247,0.2);
      transform: scale(1.12);
    }
    .sport-pill:hover:not(.pill-active) {
      background: rgba(255,255,255,0.13);
      border-color: rgba(255,255,255,0.3);
      transform: scale(1.06);
    }
    .pill-icon { font-size: 1.25rem; line-height: 1; }
    @keyframes pillPop {
      from { opacity: 0; transform: scale(0.3); }
      to   { opacity: 1; transform: scale(1); }
    }

    /* =============================================
       TITOLO
    ============================================= */
    .hero-title {
      font-size: 4.4rem;
      font-weight: 900;
      margin: 0;
      line-height: 1;
      text-transform: uppercase;
      display: flex;
      gap: 0.01em;
      letter-spacing: 0.08em;
      filter: drop-shadow(0 3px 22px rgba(79,195,247,0.5));
    }
    .title-sur {
      color: #ffffff;
      font-weight: 900;
      animation: letterIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.8s both;
    }
    .title-vi {
      color: #4FC3F7;
      font-weight: 600;
      animation: letterIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 0.95s both;
      text-shadow:
        0 0 28px rgba(79,195,247,0.8),
        0 0 56px rgba(79,195,247,0.35),
        0 0 90px rgba(79,195,247,0.15);
    }
    .title-vor {
      color: #ffffff;
      font-weight: 300;
      animation: letterIn 0.6s cubic-bezier(0.34,1.56,0.64,1) 1.1s both;
    }
    @keyframes letterIn {
      from { opacity: 0; transform: translateY(-22px) scale(0.8); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }

    /* =============================================
       DIVISORE
    ============================================= */
    .hero-divider {
      display: flex;
      align-items: center;
      gap: 14px;
      width: 100%;
      max-width: 300px;
      animation: contentIn 0.7s ease-out 1.3s both;
    }
    .divider-line {
      flex: 1;
      height: 1px;
      background: linear-gradient(to right, transparent, rgba(79,195,247,0.55), transparent);
    }
    .divider-trophy {
      font-size: 1rem;
      filter: drop-shadow(0 0 6px rgba(79,195,247,0.5));
      animation: trophyPulse 3s ease-in-out 1.5s infinite;
    }
    @keyframes trophyPulse {
      0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 6px rgba(79,195,247,0.4)); }
      50%       { transform: scale(1.18); filter: drop-shadow(0 0 14px rgba(79,195,247,0.8)); }
    }

    /* =============================================
       SOTTOTITOLO
    ============================================= */
    .hero-subtitle {
      font-size: 0.88rem;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.38em;
      text-transform: uppercase;
      color: rgba(255, 255, 255, 0.58);
      animation: contentIn 0.7s ease-out 1.5s both;
    }

    /* =============================================
       BORDI LATERALI
    ============================================= */
    .hero-edge-left, .hero-edge-right {
      position: absolute;
      top: 0; bottom: 0;
      width: 90px;
      z-index: 3;
      pointer-events: none;
    }
    .hero-edge-left  { left: 0;  background: linear-gradient(to right, rgba(4,15,46,0.75), transparent); }
    .hero-edge-right { right: 0; background: linear-gradient(to left,  rgba(4,15,46,0.75), transparent); }

    /* =============================================
       RESPONSIVE
    ============================================= */
    @media (max-width: 768px) {
      .hero-container  { height: 230px; border-radius: 16px; margin-bottom: 20px; }
      .hero-title      { font-size: 3.4rem; }
      .hero-subtitle   { font-size: 0.76rem; letter-spacing: 0.3em; }
      .sport-pill      { width: 36px; height: 36px; }
      .pill-icon       { font-size: 1.1rem; }
    }
    @media (max-width: 480px) {
      .hero-container  { height: 200px; border-radius: 14px; margin-bottom: 16px; }
      .hero-title      { font-size: 2.7rem; letter-spacing: 0.06em; }
      .hero-subtitle   { font-size: 0.68rem; letter-spacing: 0.25em; }
      .sport-pill      { width: 32px; height: 32px; }
      .pill-icon       { font-size: 1rem; }
      .hero-edge-left, .hero-edge-right { width: 55px; }
      .orb1            { width: 200px; height: 200px; }
      .orb2            { width: 160px; height: 160px; }
    }
    @media (max-width: 360px) {
      .hero-container  { height: 182px; }
      .hero-title      { font-size: 2.3rem; }
      .hero-subtitle   { font-size: 0.62rem; letter-spacing: 0.2em; }
      .sport-pill      { width: 30px; height: 30px; }
      .pill-icon       { font-size: 0.9rem; }
    }
  `]
})
export class HeroThreeComponent implements OnInit, OnDestroy {
  activeSport = 0;
  private cycleInterval: any;

  ngOnInit(): void {
    // Cicla automaticamente tra i sport ogni 4 secondi
    this.cycleInterval = setInterval(() => {
      this.activeSport = (this.activeSport + 1) % 3;
    }, 4000);
  }

  ngOnDestroy(): void {
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
    }
  }

  setSport(index: number): void {
    this.activeSport = index;
    // Resetta il timer automatico quando l'utente clicca
    if (this.cycleInterval) {
      clearInterval(this.cycleInterval);
    }
    this.cycleInterval = setInterval(() => {
      this.activeSport = (this.activeSport + 1) % 3;
    }, 4000);
  }
}
