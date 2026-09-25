import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AirHockeyComponent } from '../air-hockey/air-hockey.component';

@Component({
  selector: 'app-hero-three',
  standalone: true,
  imports: [CommonModule, AirHockeyComponent],
  template: `
    <div class="hero" [attr.data-sport]="active">

      <!-- Aurora layers -->
      <div class="aurora">
        <div class="aurora__band a1"></div>
        <div class="aurora__band a2"></div>
        <div class="aurora__band a3"></div>
        <div class="aurora__band a4"></div>
      </div>

      <!-- Field SVG (cycles automatically) -->
      <div class="fields">
        <svg class="field" [class.on]="active===0"
             viewBox="60 20 680 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" pathLength="1" x="60" y="20" width="680" height="220" rx="4"/>
          <line class="fl" pathLength="1" x1="400" y1="20" x2="400" y2="240"/>
          <circle class="fl" pathLength="1" cx="400" cy="130" r="52" fill="none"/>
          <circle class="fl" pathLength="1" cx="400" cy="130" r="4" fill="rgba(255,255,255,0.3)"/>
          <rect class="fl" pathLength="1" x="60" y="68" width="110" height="124"/>
          <rect class="fl" pathLength="1" x="60" y="95" width="52" height="70"/>
          <path class="fl" pathLength="1" d="M170,105 A28,28 0 0,1 170,155" fill="none"/>
          <rect class="fl" pathLength="1" x="630" y="68" width="110" height="124"/>
          <rect class="fl" pathLength="1" x="688" y="95" width="52" height="70"/>
          <path class="fl" pathLength="1" d="M630,105 A28,28 0 0,0 630,155" fill="none"/>
          <path class="fl" pathLength="1" d="M74,20 A14,14 0 0,1 60,34"/>
          <path class="fl" pathLength="1" d="M726,20 A14,14 0 0,0 740,34"/>
          <path class="fl" pathLength="1" d="M60,226 A14,14 0 0,1 74,240"/>
          <path class="fl" pathLength="1" d="M740,226 A14,14 0 0,0 726,240"/>
        </svg>

        <svg class="field" [class.on]="active===1"
             viewBox="40 15 720 230" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" pathLength="1" x="40" y="15" width="720" height="230" rx="4"/>
          <line class="fl" pathLength="1" x1="400" y1="15" x2="400" y2="245"/>
          <circle class="fl" pathLength="1" cx="400" cy="130" r="55" fill="none"/>
          <circle class="fl" pathLength="1" cx="400" cy="130" r="4" fill="rgba(255,255,255,0.3)"/>
          <rect class="fl" pathLength="1" x="40" y="55" width="180" height="150"/>
          <path class="fl" pathLength="1" d="M220,55 A75,75 0 0,1 220,205" fill="none"/>
          <circle class="fl" pathLength="1" cx="150" cy="130" r="20" fill="none"/>
          <rect class="fl" pathLength="1" x="580" y="55" width="180" height="150"/>
          <path class="fl" pathLength="1" d="M580,55 A75,75 0 0,0 580,205" fill="none"/>
          <circle class="fl" pathLength="1" cx="650" cy="130" r="20" fill="none"/>
          <path class="fl" pathLength="1" d="M40,48 A140,140 0 0,1 40,212" fill="none"/>
          <path class="fl" pathLength="1" d="M760,48 A140,140 0 0,0 760,212" fill="none"/>
        </svg>

        <svg class="field" [class.on]="active===2"
             viewBox="50 20 700 220" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
          <rect class="fl" pathLength="1" x="50" y="20" width="700" height="220" rx="2"/>
          <rect class="fl" pathLength="1" x="50" y="20" width="60" height="220" fill="none"/>
          <rect class="fl" pathLength="1" x="690" y="20" width="60" height="220" fill="none"/>
          <line class="fl" pathLength="1" x1="110" y1="20" x2="110" y2="240"/>
          <line class="fl" pathLength="1" x1="690" y1="20" x2="690" y2="240"/>
          <line class="fl" pathLength="1" x1="400" y1="20" x2="400" y2="240" stroke-dasharray="5 5"/>
          <line class="fl" pathLength="1" x1="110" y1="130" x2="690" y2="130"/>
          <line class="fl" pathLength="1" x1="255" y1="55" x2="255" y2="205"/>
          <line class="fl" pathLength="1" x1="545" y1="55" x2="545" y2="205"/>
          <rect class="fl" pathLength="1" x="110" y="55" width="290" height="150" fill="none"/>
          <rect class="fl" pathLength="1" x="400" y="55" width="290" height="150" fill="none"/>
        </svg>
      </div>

      <!-- Floating particles -->
      <span class="pt pt1" aria-hidden="true"></span>
      <span class="pt pt2" aria-hidden="true"></span>
      <span class="pt pt3" aria-hidden="true"></span>
      <span class="pt pt4" aria-hidden="true"></span>

      <!-- Top shine line -->
      <div class="shine"></div>

      <!-- Periodic light sweep -->
      <div class="sweep" aria-hidden="true"></div>

      <!-- Text content -->
      <div class="content">
        <span class="eyebrow">Win or Go Home</span>

        <h1 class="title" (click)="onTitleTap()">
          <span class="tw">SUR</span><span class="tc">VI</span><span class="tw tl">VOR</span>
        </h1>
      </div>

      <!-- Easter egg: Air Hockey (7 tap sul titolo) -->
      <app-air-hockey *ngIf="showGame" (close)="showGame = false"></app-air-hockey>

      <!-- Sport indicator dots (bottom right) -->
      <div class="sport-dots" aria-hidden="true">
        <span class="sdot" [class.sdot--on]="active===0"></span>
        <span class="sdot" [class.sdot--on]="active===1"></span>
        <span class="sdot" [class.sdot--on]="active===2"></span>
      </div>

      <!-- Edge fades -->
      <div class="fade-l"></div>
      <div class="fade-r"></div>

      <!-- Riflesso di luce che attraversa il banner + bordo luminoso a gradiente -->
      <div class="hero-sweep" aria-hidden="true"></div>
      <div class="hero-rim" aria-hidden="true"></div>
    </div>
  `,
  styles: [`

    /* =====================================================
       ROOT
    ===================================================== */

    .hero {
      position: relative;
      width: 100%;
      height: 280px;
      overflow: hidden;
      border-radius: 20px;
      margin-bottom: 20px;
      background:
        radial-gradient(ellipse 120% 80% at 60% 50%, #0c2d78 0%, transparent 65%),
        linear-gradient(155deg, #020b1e 0%, #041230 30%, #08266e 62%, #0a3d91 100%);
      box-shadow:
        0 10px 50px rgba(10, 61, 145, 0.55),
        0 28px 60px -24px rgba(79, 195, 247, 0.35),
        0 2px 8px  rgba(0,   0,   0,   0.36),
        inset 0 1px 0 rgba(255,255,255,0.08);
    }

    /* =====================================================
       AURORA
    ===================================================== */

    .aurora {
      position: absolute;
      inset: 0;
      z-index: 1;
      overflow: hidden;
      pointer-events: none;
    }

    .aurora__band {
      position: absolute;
      left: -20%;
      width: 140%;
      border-radius: 50%;
      filter: blur(38px);
      transform-origin: center center;
    }

    /* Band 1 - deep cyan */
    .a1 {
      height: 140px;
      top: -50px;
      background: linear-gradient(180deg,
        rgba(10, 61, 145, 0)   0%,
        rgba(15, 90, 200, 0.38) 45%,
        rgba(79, 195, 247, 0.18) 70%,
        rgba(10, 61, 145, 0)   100%
      );
      animation: auroraFlow1 9s ease-in-out infinite;
    }

    /* Band 2 - bright cyan */
    .a2 {
      height: 90px;
      top: 30px;
      background: linear-gradient(180deg,
        rgba(79, 195, 247, 0)    0%,
        rgba(79, 195, 247, 0.22) 50%,
        rgba(129, 212, 250, 0.10) 80%,
        rgba(79, 195, 247, 0)    100%
      );
      animation: auroraFlow2 11s ease-in-out 1s infinite;
    }

    /* Band 3 - indigo-blue mid */
    .a3 {
      height: 160px;
      top: 60px;
      background: linear-gradient(180deg,
        rgba(10, 61, 145, 0)    0%,
        rgba(26, 107, 190, 0.28) 40%,
        rgba(79, 195, 247, 0.12) 65%,
        rgba(10, 61, 145, 0)    100%
      );
      animation: auroraFlow3 14s ease-in-out 2.5s infinite;
    }

    /* Band 4 - subtle bottom glow */
    .a4 {
      height: 80px;
      bottom: -20px;
      top: auto;
      background: linear-gradient(0deg,
        rgba(79, 195, 247, 0.12) 0%,
        rgba(79, 195, 247, 0)    100%
      );
      animation: auroraFlow4 7s ease-in-out infinite;
    }

    @keyframes auroraFlow1 {
      0%   { transform: translateX(0%)    scaleY(1)    skewX(0deg);  opacity: 0.85; }
      25%  { transform: translateX(8%)    scaleY(1.15) skewX(3deg);  opacity: 1;    }
      50%  { transform: translateX(15%)   scaleY(0.9)  skewX(-2deg); opacity: 0.75; }
      75%  { transform: translateX(6%)    scaleY(1.1)  skewX(2deg);  opacity: 0.95; }
      100% { transform: translateX(0%)    scaleY(1)    skewX(0deg);  opacity: 0.85; }
    }
    @keyframes auroraFlow2 {
      0%   { transform: translateX(0%)   scaleY(1)    skewX(0deg);  opacity: 0.7; }
      30%  { transform: translateX(-10%) scaleY(1.2)  skewX(-4deg); opacity: 1;   }
      60%  { transform: translateX(12%)  scaleY(0.85) skewX(3deg);  opacity: 0.6; }
      100% { transform: translateX(0%)   scaleY(1)    skewX(0deg);  opacity: 0.7; }
    }
    @keyframes auroraFlow3 {
      0%   { transform: translateX(5%)    scaleY(1)   skewX(1deg);  opacity: 0.8; }
      40%  { transform: translateX(-8%)   scaleY(1.1) skewX(-3deg); opacity: 0.6; }
      70%  { transform: translateX(10%)   scaleY(0.9) skewX(2deg);  opacity: 1;   }
      100% { transform: translateX(5%)    scaleY(1)   skewX(1deg);  opacity: 0.8; }
    }
    @keyframes auroraFlow4 {
      0%,100% { transform: scaleX(1);   opacity: 0.6; }
      50%      { transform: scaleX(1.1); opacity: 1;   }
    }

    /* =====================================================
       GRID TEXTURE
    ===================================================== */

    .hero::before {
      content: '';
      position: absolute;
      inset: 0; z-index: 0;
      background-image:
        linear-gradient(rgba(255,255,255,0.013) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255,255,255,0.013) 1px, transparent 1px);
      background-size: 42px 42px;
      mask-image: radial-gradient(ellipse 100% 100% at 50% 50%, black 0%, transparent 100%);
      pointer-events: none;
    }

    /* =====================================================
       FIELD SVGS
    ===================================================== */

    .fields {
      position: absolute;
      inset: 0; z-index: 2;
    }

    /* Le linee del campo vengono "disegnate" una dopo l'altra, sport per sport (ciclo 27s = 3 x 9s) */
    .field {
      position: absolute; inset: 0;
      width: 100%; height: 100%;
      opacity: 0;
      --fo: 0.34;
      filter: drop-shadow(0 0 4px rgba(79, 195, 247, 0.85));
      animation: fieldCycle 27s linear infinite;
      animation-delay: var(--fd, 0s);
    }
    .field:nth-of-type(1) { --fd: 0s; }
    .field:nth-of-type(2) { --fd: 9s; }
    .field:nth-of-type(3) { --fd: 18s; }
    @keyframes fieldCycle {
      0%   { opacity: 0; }
      2%   { opacity: var(--fo); }
      29%  { opacity: var(--fo); }
      33.3%  { opacity: 0; }
      100% { opacity: 0; }
    }

    .fl {
      fill: none;
      stroke: rgba(255,255,255,0.85);
      stroke-width: 1.4;
      stroke-linecap: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: drawLine1 27s linear infinite;
      animation-delay: var(--fd, 0s);
    }
    .field .fl:nth-child(1) { animation-name: drawLine1; }
    .field .fl:nth-child(2) { animation-name: drawLine2; }
    .field .fl:nth-child(3) { animation-name: drawLine3; }
    .field .fl:nth-child(4) { animation-name: drawLine4; }
    .field .fl:nth-child(5) { animation-name: drawLine5; }
    .field .fl:nth-child(6) { animation-name: drawLine6; }
    .field .fl:nth-child(7) { animation-name: drawLine7; }
    .field .fl:nth-child(8) { animation-name: drawLine8; }
    .field .fl:nth-child(9) { animation-name: drawLine9; }
    .field .fl:nth-child(10) { animation-name: drawLine10; }
    .field .fl:nth-child(11) { animation-name: drawLine11; }
    .field .fl:nth-child(12) { animation-name: drawLine12; }
    .field .fl:nth-child(13) { animation-name: drawLine13; }
    .field .fl:nth-child(14) { animation-name: drawLine14; }
    .field .fl:nth-child(15) { animation-name: drawLine15; }
    .field .fl:nth-child(16) { animation-name: drawLine16; }
    @keyframes drawLine1 { 0%, 1.0% { stroke-dashoffset: 1; } 8.0%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine2 { 0%, 1.6% { stroke-dashoffset: 1; } 8.6%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine3 { 0%, 2.2% { stroke-dashoffset: 1; } 9.2%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine4 { 0%, 2.8% { stroke-dashoffset: 1; } 9.8%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine5 { 0%, 3.4% { stroke-dashoffset: 1; } 10.4%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine6 { 0%, 4.0% { stroke-dashoffset: 1; } 11.0%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine7 { 0%, 4.6% { stroke-dashoffset: 1; } 11.6%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine8 { 0%, 5.2% { stroke-dashoffset: 1; } 12.2%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine9 { 0%, 5.8% { stroke-dashoffset: 1; } 12.8%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine10 { 0%, 6.4% { stroke-dashoffset: 1; } 13.4%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine11 { 0%, 7.0% { stroke-dashoffset: 1; } 14.0%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine12 { 0%, 7.6% { stroke-dashoffset: 1; } 14.6%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine13 { 0%, 8.2% { stroke-dashoffset: 1; } 15.2%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine14 { 0%, 8.8% { stroke-dashoffset: 1; } 15.8%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine15 { 0%, 9.4% { stroke-dashoffset: 1; } 16.4%, 100% { stroke-dashoffset: 0; } }
    @keyframes drawLine16 { 0%, 10.0% { stroke-dashoffset: 1; } 17.0%, 100% { stroke-dashoffset: 0; } }

    @media (max-width: 520px) {
      .field { --fo: 0.42; }
      .fl        { stroke-width: 1.8; }
    }
    @media (max-width: 380px) {
      .field { --fo: 0.48; }
      .fl        { stroke-width: 2.1; }
    }

    /* =====================================================
       PARTICLES
    ===================================================== */

    .pt {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      z-index: 3;
      animation: ptRise linear infinite;
    }
    .pt1 { width: 2px; height: 2px; left: 12%;  bottom: -4px; background: rgba(79,195,247,0.55); animation-duration: 10s; animation-delay: 0s;   }
    .pt2 { width: 3px; height: 3px; left: 38%;  bottom: -4px; background: rgba(255,255,255,0.30); animation-duration: 14s; animation-delay: 2s;   }
    .pt3 { width: 2px; height: 2px; left: 63%;  bottom: -4px; background: rgba(79,195,247,0.45); animation-duration: 11s; animation-delay: 4.5s; }
    .pt4 { width: 2px; height: 2px; left: 86%;  bottom: -4px; background: rgba(255,255,255,0.25); animation-duration: 9s;  animation-delay: 1.5s; }
    @keyframes ptRise {
      0%   { transform: translateY(0);       opacity: 0; }
      5%   { opacity: 1; }
      90%  { opacity: 0.2; }
      100% { transform: translateY(-300px);  opacity: 0; }
    }

    /* =====================================================
       TOP SHINE
    ===================================================== */

    .shine {
      position: absolute;
      top: 0; left: 5%; right: 5%;
      height: 1px; z-index: 5;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(79, 195, 247, 0.40) 22%,
        rgba(255,255,255,0.70)   50%,
        rgba(79, 195, 247, 0.40) 78%,
        transparent 100%
      );
    }

    /* =====================================================
       LIGHT SWEEP
    ===================================================== */

    .sweep {
      position: absolute;
      top: 0; left: 0;
      width: 60px;
      height: 100%;
      z-index: 5;
      pointer-events: none;
      background: linear-gradient(
        105deg,
        transparent       0%,
        rgba(255,255,255,0.00) 30%,
        rgba(255,255,255,0.07) 48%,
        rgba(255,255,255,0.11) 50%,
        rgba(255,255,255,0.07) 52%,
        rgba(255,255,255,0.00) 70%,
        transparent       100%
      );
      animation: sweepMove 7s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }

    @keyframes sweepMove {
      0%   { transform: translateX(-80px);  opacity: 0; }
      5%   { opacity: 1; }
      40%  { transform: translateX(calc(100vw + 80px)); opacity: 1; }
      41%  { opacity: 0; }
      100% { transform: translateX(calc(100vw + 80px)); opacity: 0; }
    }

    /* =====================================================
       EDGE FADES
    ===================================================== */

    .fade-l, .fade-r {
      position: absolute; top: 0; bottom: 0;
      z-index: 4; pointer-events: none;
      width: 52px;
    }
    .fade-l { left:  0; background: linear-gradient(to right, rgba(2,10,28,0.90), transparent); }
    .fade-r { right: 0; background: linear-gradient(to left,  rgba(2,10,28,0.90), transparent); }

    /* =====================================================
       CONTENT
    ===================================================== */

    .content {
      position: relative;
      z-index: 6;
      height: 100%;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 0 32px;
      animation: contentIn 0.8s cubic-bezier(0.22,1,0.36,1) 0.15s both;
    }
    @keyframes contentIn {
      from { opacity: 0; transform: translateY(12px); }
      to   { opacity: 1; transform: translateY(0); }
    }

    .eyebrow {
      display: block;
      font-size: 0.6rem;
      font-weight: 700;
      letter-spacing: 0.26em;
      text-transform: uppercase;
      color: rgba(79, 195, 247, 0.70);
      margin-bottom: 10px;
    }

    .title {
      font-size: clamp(2.8rem, 8vw, 5.2rem);
      font-weight: 900;
      line-height: 0.88;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin: 0 0 16px;
      display: flex;
    }
    /* Titolo "metallico": sfumatura argento-azzurro con luce che scorre sulle lettere */
    .title {
      filter: drop-shadow(0 2px 0 rgba(4, 18, 48, 0.55)) drop-shadow(0 8px 16px rgba(0, 0, 0, 0.4));
    }
    .tw {
      background:
        linear-gradient(105deg, transparent 38%, rgba(255, 255, 255, 0.95) 50%, transparent 62%) 0 0 / 260% 100% no-repeat,
        linear-gradient(180deg, #ffffff 0%, #eef6ff 32%, #9ccbf7 62%, #4f8fd6 100%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      animation: titleShine 6s ease-in-out infinite;
    }
    .tl   { font-weight: 300; }
    @keyframes titleShine {
      0%, 30%  { background-position: 100% 0, 0 0; }
      70%, 100% { background-position: 0% 0, 0 0; }
    }


    /* Riflesso diagonale ogni pochi secondi */
    .hero-sweep {
      position: absolute;
      top: -20%;
      bottom: -20%;
      left: 0;
      width: 40%;
      z-index: 7;
      pointer-events: none;
      background: linear-gradient(100deg, transparent 0%, rgba(255, 255, 255, 0.08) 35%, rgba(190, 230, 255, 0.42) 50%, rgba(255, 255, 255, 0.08) 65%, transparent 100%);
      transform: translateX(-140%) skewX(-18deg);
      animation: heroSweep 7s ease-in-out infinite;
    }
    @keyframes heroSweep {
      0%, 38%  { transform: translateX(-140%) skewX(-18deg); }
      72%, 100% { transform: translateX(380%) skewX(-18deg); }
    }

    /* Bordo sottile a gradiente (luce che cade da in alto a sinistra) */
    .hero-rim {
      position: absolute;
      inset: 0;
      border-radius: inherit;
      padding: 1.5px;
      z-index: 8;
      pointer-events: none;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(79, 195, 247, 0.45) 30%, rgba(255, 255, 255, 0.08) 60%, rgba(79, 195, 247, 0.75));
      -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
      -webkit-mask-composite: xor;
      mask: linear-gradient(#000 0 0) content-box exclude, linear-gradient(#000 0 0);
    }
    @media (prefers-reduced-motion: reduce) {
      .field, .fl { animation: none; }
      .field:nth-of-type(1) { opacity: 0.2; }
      .fl { stroke-dashoffset: 0; }
      .tw, .hero-sweep { animation: none; }
      .hero-sweep { display: none; }
    }

    .tc {
      color: #4fc3f7;
      text-shadow:
        0 0 14px rgba(79,195,247,1),
        0 0 32px rgba(79,195,247,0.60),
        0 0 54px rgba(79,195,247,0.22);
      animation: viPulse 3.6s ease-in-out infinite;
    }

    @keyframes viPulse {
      0%   {
        text-shadow:
          0 0 14px rgba(79,195,247,1),
          0 0 32px rgba(79,195,247,0.60),
          0 0 54px rgba(79,195,247,0.22);
        color: #4fc3f7;
      }
      50%  {
        text-shadow:
          0 0 18px rgba(129,222,255,1),
          0 0 48px rgba(79,195,247,0.85),
          0 0 80px rgba(79,195,247,0.45),
          0 0 120px rgba(79,195,247,0.18);
        color: #a8eaff;
      }
      100% {
        text-shadow:
          0 0 14px rgba(79,195,247,1),
          0 0 32px rgba(79,195,247,0.60),
          0 0 54px rgba(79,195,247,0.22);
        color: #4fc3f7;
      }
    }


    /* =====================================================
       SPORT INDICATOR DOTS
    ===================================================== */

    .sport-dots {
      position: absolute;
      right: 20px;
      bottom: 16px;
      z-index: 6;
      display: flex;
      gap: 6px;
      align-items: center;
    }

    .sdot {
      width: 6px; height: 6px;
      border-radius: 50%;
      background: rgba(255,255,255,0.22);
      transition: background 0.4s, box-shadow 0.4s, transform 0.4s;
    }
    .sdot--on {
      background: #4fc3f7;
      box-shadow: 0 0 8px rgba(79,195,247,0.85);
      transform: scale(1.35);
    }

    /* =====================================================
       RESPONSIVE
    ===================================================== */

    @media (max-width: 768px) {
      .hero     { height: 255px; border-radius: 16px; }
    }

    @media (max-width: 520px) {
      .hero     { height: 220px; border-radius: 14px; margin-bottom: 16px; }
      .content  { padding: 0 22px; }
      .tagline  { font-size: 0.65rem; letter-spacing: 0.14em; }
      .fade-l, .fade-r { width: 32px; }
    }

    @media (max-width: 380px) {
      .hero     { height: 198px; border-radius: 12px; }
      .content  { padding: 0 18px; }
      .tagline  { font-size: 0.60rem; letter-spacing: 0.11em; }
    }

  `]
})
export class HeroThreeComponent implements OnInit, OnDestroy {
  active = 0;
  showGame = false;
  private timer: any;
  private tapCount = 0;
  private tapTimer: any;

  ngOnInit(): void {
    this.timer = setInterval(() => {
      this.active = (this.active + 1) % 3;
    }, 9000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
    clearTimeout(this.tapTimer);
  }

  onTitleTap(): void {
    this.tapCount++;
    clearTimeout(this.tapTimer);
    if (this.tapCount >= 7) {
      this.tapCount = 0;
      this.showGame = true;
    } else {
      this.tapTimer = setTimeout(() => { this.tapCount = 0; }, 800);
    }
  }
}